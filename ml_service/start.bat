@echo off
REM Windows batch script to start the ML service

echo Starting CourtEdge ML Service...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Error: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo Installing dependencies...
pip install -r requirements.txt --quiet

if errorlevel 1 (
    echo Warning: Some dependencies may not have installed correctly
    echo Continuing anyway...
)

REM Create necessary directories
if not exist "data\cache\" mkdir data\cache
if not exist "data\features\" mkdir data\features
if not exist "data\historical\" mkdir data\historical
if not exist "models\game_outcomes\" mkdir models\game_outcomes
if not exist "models\player_props\" mkdir models\player_props
if not exist "models\line_movement\" mkdir models\line_movement

echo.
echo ========================================
echo  CourtEdge ML Service
echo ========================================
echo  Server: http://localhost:8000
echo  Docs:   http://localhost:8000/docs
echo ========================================
echo.

REM Start the service
python start_ml_service.py

pause
