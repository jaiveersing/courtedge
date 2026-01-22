# CourtEdge Quick Start Script
# Starts both frontend and ML service

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CourtEdge Platform Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found! Please install Python 3.8+" -ForegroundColor Red
    Write-Host "  Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js" -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Install frontend dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}

# Setup ML service if needed
if (-not (Test-Path "ml_service\venv")) {
    Write-Host ""
    Write-Host "Setting up ML service..." -ForegroundColor Yellow
    Push-Location ml_service
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt --quiet
    Pop-Location
    Write-Host "✓ ML service setup complete" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start ML service in a new window
Write-Host "Starting ML Service on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\ml_service'; .\start.bat"
Start-Sleep -Seconds 3
Write-Host "✓ ML Service started in new window" -ForegroundColor Green

# Start frontend dev server
Write-Host ""
Write-Host "Starting Frontend on port 5173..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Services Running:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Green
Write-Host "  ML API:    http://localhost:8000" -ForegroundColor Green
Write-Host "  ML Docs:   http://localhost:8000/docs" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the frontend server" -ForegroundColor Yellow
Write-Host ""

npm run dev
