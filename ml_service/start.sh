#!/bin/bash
# Linux/Mac script to start the ML service

echo "Starting CourtEdge ML Service..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
echo "Installing dependencies..."
pip install -r requirements.txt --quiet

if [ $? -ne 0 ]; then
    echo "Warning: Some dependencies may not have installed correctly"
    echo "Continuing anyway..."
fi

# Create necessary directories
mkdir -p data/cache data/features data/historical
mkdir -p models/game_outcomes models/player_props models/line_movement

echo ""
echo "========================================"
echo "  CourtEdge ML Service"
echo "========================================"
echo "  Server: http://localhost:8000"
echo "  Docs:   http://localhost:8000/docs"
echo "========================================"
echo ""

# Start the service
python3 start_ml_service.py
