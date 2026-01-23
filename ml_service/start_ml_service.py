#!/usr/bin/env python3
"""
ML Service Startup Script
Runs the FastAPI server with all ML models loaded
"""
import sys
import os
import uvicorn
import logging
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

# Use test_api for production (lightweight, guaranteed to work)
# or api for full features (requires all dependencies)
PRODUCTION = os.environ.get("ENVIRONMENT", "development") == "production"

if PRODUCTION:
    from test_api import app
    print("🚀 Starting CourtEdge ML Service (Production Mode - Lightweight API)")
else:
    try:
        from api import app
        print("🚀 Starting CourtEdge ML Service (Full API)")
    except Exception as e:
        print(f"⚠️ Full API failed to load: {e}")
        print("🔄 Falling back to lightweight API...")
        from test_api import app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    # Get port from environment variable (for Render/Railway deployment)
    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0"  # Allow external connections
    
    logger.info("Starting CourtEdge ML Service...")
    logger.info(f"Server will be available at http://localhost:{port}")
    logger.info(f"API documentation at http://localhost:{port}/docs")
    
    uvicorn.run(
        "api:app",
        host=host,
        port=port,
        reload=False,  # Disable reload in production
        log_level="info"
    )
