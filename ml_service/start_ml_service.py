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
    logger.info("Starting CourtEdge ML Service...")
    logger.info("Server will be available at http://localhost:8000")
    logger.info("API documentation at http://localhost:8000/docs")
    
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
