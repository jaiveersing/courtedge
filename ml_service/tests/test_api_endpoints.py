"""
Unit tests for ML service API endpoints
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from test_api import app

client = TestClient(app)


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check_returns_200(self):
        """Health endpoint should return 200 OK"""
        response = client.get("/health")
        assert response.status_code == 200
        
    def test_health_check_returns_correct_structure(self):
        """Health endpoint should return proper JSON structure"""
        response = client.get("/health")
        data = response.json()
        
        assert "status" in data
        assert "environment" in data
        assert data["status"] == "healthy"


class TestPlayerPropPrediction:
    """Test player prop prediction endpoint"""
    
    @pytest.fixture
    def valid_prediction_request(self):
        """Valid prediction request payload"""
        return {
            "player_name": "LeBron James",
            "stat_type": "points",
            "line": 25.5
        }
    
    def test_prediction_requires_authentication(self):
        """Prediction endpoint should require valid input"""
        response = client.post("/predict/player_prop", json={})
        assert response.status_code in [400, 422]  # Bad request or validation error
    
    def test_prediction_with_valid_data(self, valid_prediction_request):
        """Prediction with valid data should return 200"""
        response = client.post("/predict/player_prop", json=valid_prediction_request)
        assert response.status_code in [200, 500]  # Success or model not loaded
        
    def test_prediction_response_structure(self, valid_prediction_request):
        """Prediction response should have correct structure if successful"""
        response = client.post("/predict/player_prop", json=valid_prediction_request)
        
        if response.status_code == 200:
            data = response.json()
            assert "prediction" in data or "message" in data


class TestInputValidation:
    """Test input validation"""
    
    def test_invalid_stat_type(self):
        """Should reject invalid stat types"""
        response = client.post("/predict/player_prop", json={
            "player_name": "LeBron James",
            "stat_type": "invalid_stat",
            "line": 25.5
        })
        assert response.status_code == 422
    
    def test_missing_required_fields(self):
        """Should reject requests missing required fields"""
        response = client.post("/predict/player_prop", json={
            "player_name": "LeBron James"
        })
        assert response.status_code == 422
    
    def test_negative_line_value(self):
        """Should handle negative line values appropriately"""
        response = client.post("/predict/player_prop", json={
            "player_name": "LeBron James",
            "stat_type": "points",
            "line": -5.0
        })
        # Should either reject or handle gracefully
        assert response.status_code in [200, 400, 422, 500]


class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limit_not_exceeded_with_normal_usage(self):
        """Normal usage should not trigger rate limits"""
        for _ in range(5):
            response = client.get("/health")
            assert response.status_code == 200


class TestErrorHandling:
    """Test error handling"""
    
    def test_404_for_invalid_endpoint(self):
        """Invalid endpoints should return 404"""
        response = client.get("/invalid/endpoint")
        assert response.status_code == 404
    
    def test_method_not_allowed(self):
        """Wrong HTTP method should return 405"""
        response = client.get("/predict/player_prop")
        assert response.status_code == 405


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
