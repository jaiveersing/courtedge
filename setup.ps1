# CourtEdge Setup Script

Write-Host "🚀 CourtEdge Setup Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check Node.js installation
Write-Host "`nChecking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend installation failed" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
cd server
npm install
cd ..
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Backend installation failed" -ForegroundColor Red
    exit 1
}

# Install ML service dependencies
Write-Host "`nInstalling ML service dependencies..." -ForegroundColor Yellow
cd ml_service
pip install -r requirements.txt
cd ..
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ML service dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ ML service installation failed" -ForegroundColor Red
    exit 1
}

# Check for .env file
Write-Host "`nChecking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env from .env.example" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env with your API keys" -ForegroundColor Yellow
    }
}

# Train ML models
Write-Host "`nTraining ML models..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan
cd ml_service
python src/train.py
cd ..
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ML models trained successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Model training failed" -ForegroundColor Red
    exit 1
}

# Check Redis (optional)
Write-Host "`nChecking Redis installation (optional)..." -ForegroundColor Yellow
try {
    redis-cli ping > $null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Redis is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Redis not running (optional - caching disabled)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Redis not installed (optional - caching disabled)" -ForegroundColor Yellow
    Write-Host "   Install with: choco install redis-64" -ForegroundColor Cyan
}

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env with your API keys" -ForegroundColor White
Write-Host "2. Start services:`n" -ForegroundColor White
Write-Host "   Terminal 1: cd ml_service && python src/api.py" -ForegroundColor Cyan
Write-Host "   Terminal 2: cd server && node index.js" -ForegroundColor Cyan
Write-Host "   Terminal 3: npm run dev`n" -ForegroundColor Cyan
Write-Host "3. Open http://localhost:5173`n" -ForegroundColor White

Write-Host "Or use Docker:" -ForegroundColor Yellow
Write-Host "   docker-compose up`n" -ForegroundColor Cyan

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "   ML API: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   README: ./README.md" -ForegroundColor Cyan
Write-Host "   ML Service: ./ml_service/README.md`n" -ForegroundColor Cyan
