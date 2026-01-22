"""
Comprehensive test suite for ML service
"""
import pytest
import numpy as np
import pandas as pd
from datetime import datetime
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))


class TestFeatureEngineering:
    """Test feature engineering functions"""
    
    def test_basic_stats_features(self):
        from advanced_features import AdvancedFeatureEngineer
        
        engineer = AdvancedFeatureEngineer()
        stats = {
            'season_avg': 25.0,
            'l5_avg': 28.0,
            'l10_avg': 26.5,
            'home_avg': 26.0,
            'away_avg': 24.0,
            'games_played': 50
        }
        
        features = engineer._basic_stats_features(stats)
        
        assert features['season_avg'] == 25.0
        assert features['l5_avg'] == 28.0
        assert features['games_played'] == 50
    
    def test_trend_features(self):
        from advanced_features import AdvancedFeatureEngineer
        
        engineer = AdvancedFeatureEngineer()
        stats = {
            'season_avg': 25.0,
            'l5_avg': 28.0,
            'l10_avg': 26.5,
            'std_dev': 5.0
        }
        
        features = engineer._trend_features(stats)
        
        assert features['l5_vs_season'] == 3.0
        assert features['l10_vs_season'] == 1.5
        assert features['recent_momentum'] == 1.5
    
    def test_pace_features(self):
        from advanced_features import AdvancedFeatureEngineer
        
        engineer = AdvancedFeatureEngineer()
        opponent_stats = {'pace': 105, 'team_code': 'LAL'}
        game_context = {}
        
        features = engineer._pace_features(opponent_stats, game_context)
        
        assert features['pace'] == 105
        assert features['pace_vs_league'] > 0
        assert features['pace_category'] == 1


class TestEnsembleModel:
    """Test ensemble modeling"""
    
    def test_model_creation(self):
        from ensemble import EnsembleModel
        
        ensemble = EnsembleModel()
        models = ensemble.create_models(n_features=20)
        
        assert 'xgboost' in models
        assert 'lightgbm' in models
        assert 'random_forest' in models
    
    def test_ensemble_training(self):
        from ensemble import EnsembleModel
        
        # Generate synthetic data
        X = np.random.rand(100, 10)
        y = X[:, 0] * 2 + X[:, 1] * 3 + np.random.randn(100) * 0.1
        
        ensemble = EnsembleModel()
        ensemble.fit(X, y)
        
        assert ensemble.fitted
        assert len(ensemble.models) == 3
        assert len(ensemble.weights) == 3
    
    def test_ensemble_prediction(self):
        from ensemble import EnsembleModel
        
        # Generate synthetic data
        X_train = np.random.rand(100, 10)
        y_train = X_train[:, 0] * 2 + X_train[:, 1] * 3
        
        ensemble = EnsembleModel()
        ensemble.fit(X_train, y_train)
        
        X_test = np.random.rand(10, 10)
        predictions = ensemble.predict(X_test)
        
        assert predictions.shape == (10,)
        assert not np.any(np.isnan(predictions))


class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limiter_basic(self):
        from rate_limiting import RateLimiter
        
        limiter = RateLimiter()
        
        # Should allow first request
        allowed, info = limiter.check_rate_limit('test_key', 'default')
        assert allowed
        assert info['remaining'] < info['limit']
    
    def test_rate_limiter_exceed(self):
        from rate_limiting import RateLimiter
        
        limiter = RateLimiter()
        limiter.limits['test'] = {'requests': 5, 'window': 3600}
        
        # Make 5 requests
        for i in range(5):
            allowed, _ = limiter.check_rate_limit('test_key', endpoint_type='test')
            assert allowed
        
        # 6th request should be denied
        allowed, info = limiter.check_rate_limit('test_key', endpoint_type='test')
        assert not allowed
    
    def test_api_key_creation(self):
        from rate_limiting import APIKeyManager
        
        manager = APIKeyManager()
        key_data = manager.create_key('test_user', 'premium', 30)
        
        assert key_data['name'] == 'test_user'
        assert key_data['tier'] == 'premium'
        assert key_data['active']
        assert len(key_data['key']) == 64  # SHA256 hex
    
    def test_api_key_validation(self):
        from rate_limiting import APIKeyManager
        
        manager = APIKeyManager()
        key_data = manager.create_key('test_user')
        api_key = key_data['key']
        
        # Valid key
        valid, data = manager.validate_key(api_key)
        assert valid
        assert data['name'] == 'test_user'
        
        # Invalid key
        valid, data = manager.validate_key('invalid_key')
        assert not valid
        assert data is None


class TestMonitoring:
    """Test monitoring and metrics"""
    
    def test_prediction_tracker(self):
        from monitoring import PredictionTracker
        
        tracker = PredictionTracker(storage_path='ml_service/data/test_predictions')
        
        prediction_data = {
            'model_name': 'test_model',
            'prediction': 25.5,
            'line': 24.5,
            'player_name': 'Test Player'
        }
        
        tracker.log_prediction(prediction_data)
        
        # Check that prediction was stored
        assert len(tracker.predictions) > 0
        assert tracker.predictions[-1]['model_name'] == 'test_model'
    
    def test_performance_monitor(self):
        from monitoring import PerformanceMonitor
        
        monitor = PerformanceMonitor()
        
        # Log some requests
        monitor.log_request('/predict', 0.15, True)
        monitor.log_request('/predict', 0.20, True)
        monitor.log_request('/predict', 0.18, False)
        
        stats = monitor.get_stats()
        
        assert stats['total_requests'] == 3
        assert stats['total_errors'] == 1
        assert '/predict' in stats['endpoints']


class TestDataValidation:
    """Test Pydantic models and validation"""
    
    def test_player_prop_request_validation(self):
        from models import PlayerPropRequest, StatType
        
        # Valid request
        valid_data = {
            'player_id': '2544',
            'player_name': 'LeBron James',
            'stat_type': StatType.POINTS,
            'line': 25.5,
            'opponent': 'gsw',
            'is_home': True,
            'game_date': '2026-01-20'
        }
        
        request = PlayerPropRequest(**valid_data)
        assert request.player_name == 'LeBron James'
        assert request.opponent == 'GSW'  # Should be uppercase
    
    def test_invalid_date_format(self):
        from models import PlayerPropRequest, StatType
        
        invalid_data = {
            'player_id': '2544',
            'player_name': 'LeBron James',
            'stat_type': StatType.POINTS,
            'line': 25.5,
            'opponent': 'GSW',
            'is_home': True,
            'game_date': '01-20-2026'  # Wrong format
        }
        
        with pytest.raises(Exception):  # ValidationError
            PlayerPropRequest(**invalid_data)
    
    def test_bankroll_optimization_validation(self):
        from models import BankrollOptimizationRequest, BetOption, BetType
        
        bet = BetOption(
            bet_id='bet1',
            description='Lakers ML',
            bet_type=BetType.GAME_OUTCOME,
            odds=-110,
            prediction_edge=5.5,
            confidence=0.65
        )
        
        request = BankrollOptimizationRequest(
            current_bankroll=10000,
            available_bets=[bet],
            risk_tolerance='medium',
            max_single_bet_percentage=5.0
        )
        
        assert request.current_bankroll == 10000
        assert len(request.available_bets) == 1


class TestIntegration:
    """Integration tests"""
    
    @pytest.mark.asyncio
    async def test_api_health_endpoint(self):
        """Test health endpoint integration"""
        # This would require running the FastAPI app
        # In a real scenario, use TestClient from fastapi.testclient
        pass
    
    def test_end_to_end_prediction(self):
        """Test complete prediction pipeline"""
        from advanced_features import AdvancedFeatureEngineer
        
        engineer = AdvancedFeatureEngineer()
        
        player_stats = {
            'season_avg': 25.0,
            'l5_avg': 28.0,
            'l10_avg': 26.5,
            'l15_avg': 26.0,
            'home_avg': 26.0,
            'away_avg': 24.0,
            'games_played': 50,
            'std_dev': 5.0,
            'usage_rate': 30.0,
            'minutes_projection': 35.0,
            'ts_pct': 0.58,
            'per': 25.0,
            'off_rating': 115,
            'net_rating': 5
        }
        
        opponent_stats = {
            'team_code': 'GSW',
            'def_rating': 112,
            'pace': 102,
            'def_rank': 15
        }
        
        game_context = {
            'days_rest': 1,
            'opponent_days_rest': 2,
            'player_injury_status': 'healthy',
            'key_teammate_out': False
        }
        
        features = engineer.engineer_player_features(
            player_stats,
            opponent_stats,
            game_context
        )
        
        # Verify key features are present
        assert 'season_avg' in features
        assert 'pace' in features
        assert 'vs_opponent_avg' in features
        assert 'days_rest' in features
        assert 'injury_factor' in features
        
        # Verify feature values are reasonable
        assert features['injury_factor'] == 1.0
        assert features['pace'] == 102
        assert features['days_rest'] == 1


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
