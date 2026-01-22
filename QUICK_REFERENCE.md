# CourtEdge - Quick Reference Card

## 🚀 Essential Commands

### Development
```bash
# Start all services
npm run dev                          # Frontend (port 5173)
cd server && node index.js           # Backend (port 3000)
cd ml_service && python src/api.py   # ML Service (port 8000)

# Or use Docker
docker-compose up
```

### Testing
```bash
# Run all tests
cd ml_service
pytest tests/ -v

# With coverage
pytest tests/ --cov=src --cov-report=html

# Specific test file
pytest tests/test_ml_service.py -v
```

### Data Pipeline
```bash
cd ml_service

# Manual operations
python src/data_refresh.py --collect   # Collect yesterday's data
python src/data_refresh.py --update    # Update models incrementally
python src/data_refresh.py --retrain   # Full model retrain
python src/data_refresh.py --health    # Health check

# Start scheduler (background)
python src/data_refresh.py --schedule &
```

### API Key Management
```bash
cd ml_service

# Create API key
python src/rate_limiting.py create "User Name" --tier premium --expires 30

# List all keys
python src/rate_limiting.py list

# Deactivate key
python src/rate_limiting.py deactivate <api_key>
```

### Health Checks
```bash
# ML Service health
curl http://localhost:8000/health

# Performance metrics
curl http://localhost:8000/metrics

# Model performance
curl http://localhost:8000/models/performance
```

## 📊 API Endpoints

### ML Predictions
```bash
# Player prop prediction
POST http://localhost:3000/api/ml/predict/player_prop
{
  "player_id": "2544",
  "player_name": "LeBron James",
  "stat_type": "points",
  "line": 25.5,
  "opponent": "GSW",
  "is_home": true,
  "game_date": "2026-01-20"
}

# Game outcome
POST http://localhost:3000/api/ml/predict/game_outcome
{
  "home_team": "LAL",
  "away_team": "GSW",
  "spread": -5.5,
  "game_date": "2026-01-20"
}

# Live game prediction
POST http://localhost:3000/api/ml/predict/live_game
{
  "game_id": "401468123",
  "home_team": "LAL",
  "away_team": "GSW",
  "home_score": 95,
  "away_score": 92,
  "time_remaining": 180,
  "quarter": 4
}

# Sharp money alerts
GET http://localhost:3000/api/ml/sharp_money?sport=nba

# Bankroll optimization
POST http://localhost:3000/api/ml/optimize/bankroll
{
  "current_bankroll": 10000,
  "available_bets": [...],
  "risk_tolerance": "medium"
}
```

### Monitoring
```bash
# Get metrics
GET http://localhost:8000/metrics

# Model performance
GET http://localhost:8000/models/performance

# Health check
GET http://localhost:8000/health
```

## 🔑 Environment Variables

```env
# Required
SERVER_BASE44_APP_ID=your_app_id
SERVER_BASE44_API_KEY=your_api_key

# Optional
ML_SERVICE_URL=http://localhost:8000
REDIS_HOST=localhost
REDIS_PORT=6379

# Rate Limiting
RATE_LIMIT_ENABLED=true
DEFAULT_RATE_LIMIT=100
PREMIUM_RATE_LIMIT=1000

# Monitoring
ENABLE_PREDICTION_TRACKING=true
ENABLE_PERFORMANCE_MONITORING=true

# Data Pipeline
AUTO_DATA_REFRESH=true
REFRESH_SCHEDULE=daily_6am
```

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f ml_service
docker-compose logs -f backend

# Stop all
docker-compose down

# Rebuild
docker-compose up --build

# Remove volumes
docker-compose down -v
```

## 🧪 Test Commands

```bash
# All tests
pytest

# Specific module
pytest tests/test_ml_service.py::TestFeatureEngineering

# With output
pytest -v -s

# Stop on first failure
pytest -x

# Coverage report
pytest --cov=src --cov-report=term-missing
```

## 📝 Logging

```bash
# View ML service logs
tail -f ml_service/ml_service.log

# Filter errors only
tail -f ml_service/ml_service.log | grep ERROR

# Watch predictions
tail -f ml_service/ml_service.log | grep "prediction"
```

## 🔧 Troubleshooting

### Port Issues
```bash
# Check what's using port 8000
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Redis Issues
```bash
# Start Redis
redis-server

# Test Redis connection
redis-cli ping

# Check Redis keys
redis-cli keys "*"
```

### Model Issues
```bash
# Retrain models
cd ml_service
python src/train.py

# Check models exist
dir models\player_props\
```

### Python Environment
```bash
# Reinstall dependencies
cd ml_service
pip install -r requirements.txt --force-reinstall

# Check Python version
python --version  # Need 3.11+
```

## 📊 Performance Monitoring

### Key Metrics
- **Response Time:** Should be <200ms
- **Cache Hit Rate:** Target 85%+
- **Error Rate:** Should be <1%
- **Prediction Accuracy:** Target 65%+

### Monitor Commands
```bash
# Watch performance
watch -n 5 'curl -s http://localhost:8000/metrics | jq'

# Check cache stats (if Redis installed)
redis-cli info stats
```

## 🎯 Rate Limits

| Tier | Requests/Hour | Predictions/Min |
|------|--------------|-----------------|
| Free | 100 | 10 |
| Premium | 1,000 | 50 |
| Enterprise | Unlimited | Unlimited |

## 📱 Access Points

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **ML Service:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **WebSocket:** ws://localhost:8080

## 💾 Data Locations

```
ml_service/
├── models/
│   ├── player_props/      # Trained models
│   ├── game_outcomes/
│   └── line_movement/
├── data/
│   ├── historical/        # Game data
│   ├── features/          # Feature cache
│   ├── predictions/       # Prediction logs
│   └── cache/            # Temp cache
└── ml_service.log        # Service logs
```

## 🚨 Emergency Commands

```bash
# Stop everything
pkill -f "python src/api.py"
pkill -f "node index.js"
pkill -f "npm run dev"

# Or with Docker
docker-compose down --remove-orphans

# Clear Redis cache
redis-cli FLUSHALL

# Reset models (retrain)
cd ml_service
rm -rf models/player_props/*.pkl
python src/train.py
```

## 📚 Documentation Links

- **Main README:** [README.md](README.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Improvements:** [IMPROVEMENTS.md](IMPROVEMENTS.md)
- **Session Summary:** [SESSION_SUMMARY.md](SESSION_SUMMARY.md)
- **ML Service:** [ml_service/README.md](ml_service/README.md)

## 🎓 Common Workflows

### Deploy New Model
```bash
1. cd ml_service
2. python src/train.py              # Train
3. pytest tests/ -v                 # Test
4. docker-compose restart ml_service # Deploy
```

### Debug Prediction Issue
```bash
1. tail -f ml_service/ml_service.log     # Check logs
2. curl http://localhost:8000/health     # Check health
3. pytest tests/test_ml_service.py -v    # Run tests
4. Check feature engineering in logs
```

### Update Data
```bash
1. python src/data_refresh.py --collect  # Get new data
2. python src/data_refresh.py --update   # Update models
3. curl http://localhost:8000/health     # Verify
```

---

**Keep this card handy for quick reference!** 📌
