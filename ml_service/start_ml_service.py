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

from api import app

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
