# CourtEdge ML Service Integration Guide

## 🚀 Quick Start

### 1. Install Python Dependencies

**Windows:**
```powershell
cd ml_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Linux/Mac:**
```bash
cd ml_service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Start ML Service

**Windows:**
```powershell
cd ml_service
.\start.bat
```

**Linux/Mac:**
```bash
cd ml_service
chmod +x start.sh
./start.sh
```

**Or manually:**
```bash
python start_ml_service.py
```

The ML service will start on `http://localhost:8000`

### 3. Verify Service is Running

Visit `http://localhost:8000/docs` to see the interactive API documentation.

### 4. Start Frontend

```bash
npm run dev
```

The dashboard will show ML Service status in real-time.

## 📊 ML Service Features

### Available Models

1. **Player Props Predictor** (`player_props_model.py`)
   - LSTM neural network for player performance
   - Predicts points, rebounds, assists, etc.
   - Confidence intervals included

2. **Game Outcome Predictor** (`nba_game_model.py`)
   - Win probability calculations
   - Spread predictions
   - Total (over/under) predictions

3. **Live Game Analyzer** (`live_betting_algorithm.py`)
   - Real-time win probability
   - Dynamic line adjustments
   - Momentum indicators

4. **Sharp Money Detector** (`clv_tracker.py`)
   - Line movement analysis
   - Sharp vs public money identification
   - Closing line value tracking

5. **Bankroll Optimizer** (`portfolio_optimizer.py`)
   - Kelly Criterion implementation
   - Risk-adjusted bet sizing
   - Portfolio diversification

## 🔌 API Endpoints

### Health Check
```javascript
GET http://localhost:8000/health
```

### Predict Player Prop
```javascript
POST http://localhost:8000/predict/player-prop
{
  "player_name": "LeBron James",
  "stat_type": "points",
  "line": 25.5,
  "opponent": "GSW",
  "home_away": "away"
}
```

### Predict Game Outcome
```javascript
POST http://localhost:8000/predict/game-outcome
{
  "home_team": "LAL",
  "away_team": "GSW",
  "spread": -3.5,
  "total": 225.5
}
```

### Get Sharp Money Alerts
```javascript
GET http://localhost:8000/sharp-money/alerts?date=2026-01-20
```

### Optimize Bankroll
```javascript
POST http://localhost:8000/bankroll/optimize
{
  "bets": [
    { "id": 1, "edge": 5.2, "odds": -110, "confidence": 0.65 },
    { "id": 2, "edge": 3.8, "odds": 120, "confidence": 0.58 }
  ],
  "total_bankroll": 1000,
  "risk_tolerance": "MEDIUM"
}
```

## 💻 Frontend Integration

### Import ML Service Client
```javascript
import mlService from '@/api/mlService';
```

### Check Service Health
```javascript
const health = await mlService.healthCheck();
console.log(health); // { success: true, status: "healthy", ... }
```

### Get Predictions
```javascript
// Player prop prediction
const propPrediction = await mlService.predictPlayerProp({
  playerId: '2544',
  playerName: 'LeBron James',
  stat: 'points',
  line: 25.5,
  opponent: 'GSW',
  homeAway: 'away'
});

// Game outcome prediction
const gameProbs = await mlService.predictGameOutcome({
  homeTeam: 'LAL',
  awayTeam: 'GSW',
  spread: -3.5,
  total: 225.5
});

// Live game prediction
const livePred = await mlService.predictLiveGame({
  gameId: 'game123',
  homeTeam: 'LAL',
  awayTeam: 'GSW',
  homeScore: 85,
  awayScore: 82,
  quarter: 3,
  timeRemaining: '8:45'
});
```

### Get Sharp Money Alerts
```javascript
const alerts = await mlService.getSharpMoneyAlerts({
  date: '2026-01-20',
  minThreshold: 0.7
});
```

### Optimize Bets
```javascript
const allocation = await mlService.optimizeBankroll({
  bets: [
    { id: 1, edge: 5.2, odds: -110, confidence: 0.65 },
    { id: 2, edge: 3.8, odds: 120, confidence: 0.58 }
  ],
  totalBankroll: 1000,
  riskTolerance: 'MEDIUM'
});
```

## 🎯 Dashboard Integration

The ML Service Status widget is already integrated into the Dashboard:

```jsx
import MLServiceStatus from '@/Components/ml/MLServiceStatus';

<MLServiceStatus />
```

Features:
- Real-time connection monitoring
- Service health metrics
- Model loading status
- Uptime tracking
- Auto-refresh every 30 seconds
- Manual refresh button
- Error messages with troubleshooting

## 📁 Project Structure

```
ml_service/
├── src/
│   ├── api.py                      # Main FastAPI server (612 lines)
│   ├── models.py                   # Pydantic validation models (220 lines)
│   ├── nba_data.py                 # NBA API data collection (202 lines)
│   ├── player_props_model.py       # LSTM player predictor (420 lines)
│   ├── nba_game_model.py           # Game outcome model (345 lines)
│   ├── ensemble.py                 # Model ensemble (289 lines)
│   ├── training_pipeline.py        # Training automation (428 lines)
│   ├── parlay_optimizer.py         # Parlay builder (320 lines)
│   ├── prop_correlation.py         # Correlation analysis (375 lines)
│   ├── historical_simulator.py     # Backtesting (410 lines)
│   ├── portfolio_optimizer.py      # Bankroll optimization (369 lines)
│   ├── live_odds_aggregator.py     # Multi-book odds (414 lines)
│   ├── bet_automation.py           # Auto bet placement (273 lines)
│   ├── poisson_model.py            # Score distributions (243 lines)
│   ├── power_ratings.py            # Team ratings (283 lines)
│   ├── clv_tracker.py              # Line value tracking (320 lines)
│   ├── elo_system.py               # ELO ratings (310 lines)
│   ├── matchup_analyzer.py         # Head-to-head (373 lines)
│   ├── rest_travel_analyzer.py     # Fatigue analysis (390 lines)
│   ├── referee_analytics.py        # Ref tendencies (336 lines)
│   ├── live_betting_algorithm.py   # Live betting (334 lines)
│   ├── middle_finder.py            # Middle opportunities (401 lines)
│   ├── sentiment_analysis.py       # Social sentiment (436 lines)
│   ├── monitoring.py               # Performance monitoring (229 lines)
│   ├── rate_limiting.py            # API security (345 lines)
│   ├── advanced_features.py        # Feature engineering (274 lines)
│   └── simple_api.py               # Simplified API (177 lines)
├── data/
│   ├── cache/                      # API response cache
│   ├── features/                   # Engineered features
│   └── historical/                 # Historical data
├── models/
│   ├── game_outcomes/              # Trained models
│   ├── player_props/               # Player models
│   └── line_movement/              # Line models
├── start_ml_service.py             # Startup script
├── start.bat                       # Windows launcher
├── start.sh                        # Linux/Mac launcher
└── requirements.txt                # Python dependencies
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:

```env
VITE_ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_PORT=8000
NBA_API_RATE_LIMIT=60
LOG_LEVEL=INFO
```

### Frontend API Base URL

The ML service client automatically uses:
- Development: `http://localhost:8000`
- Production: Set via `VITE_ML_SERVICE_URL` env variable

## 🧪 Testing

### Test ML Service
```bash
cd ml_service
pytest tests/test_ml_service.py -v
```

### Manual API Testing
```bash
# Health check
curl http://localhost:8000/health

# Get docs
open http://localhost:8000/docs
```

## 📈 Model Training

Train models manually:

```bash
cd ml_service
python src/train.py --model player_props --data data/historical/
```

Or use the training pipeline:

```python
from training_pipeline import MLTrainingPipeline

pipeline = MLTrainingPipeline()
pipeline.train_all_models()
```

## 🚨 Troubleshooting

### ML Service Won't Start

1. **Check Python version:**
   ```bash
   python --version  # Should be 3.8+
   ```

2. **Install dependencies:**
   ```bash
   pip install -r ml_service/requirements.txt
   ```

3. **Check port 8000:**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   
   # Linux/Mac
   lsof -i :8000
   ```

### Connection Errors in Frontend

1. **Verify ML service is running:**
   - Visit `http://localhost:8000/health`
   - Should return JSON with status "healthy"

2. **Check CORS settings:**
   - ML service allows all origins in development
   - Check `api.py` CORS middleware

3. **Browser console errors:**
   - Open DevTools → Network tab
   - Look for failed requests to port 8000

### Predictions Not Working

1. **Check model files:**
   ```bash
   ls ml_service/models/player_props/
   ls ml_service/models/game_outcomes/
   ```

2. **Retrain models:**
   ```bash
   python ml_service/src/train.py
   ```

3. **Check logs:**
   - ML service logs appear in terminal
   - Look for "Model loaded successfully" messages

## 📚 Additional Resources

- **FastAPI Docs:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **NBA API Docs:** https://github.com/swar/nba_api
- **ML Service Code:** `ml_service/src/`

## 🎓 Advanced Usage

### Custom Model Training
```python
from player_props_model import PlayerPropsPredictor

model = PlayerPropsPredictor()
model.train(X_train, y_train)
model.save('models/player_props/custom_model.pkl')
```

### Batch Predictions
```javascript
const predictions = await mlService.batchPredictProps([
  { player: 'LeBron James', stat: 'points', line: 25.5 },
  { player: 'Stephen Curry', stat: 'points', line: 27.5 },
  { player: 'Giannis Antetokounmpo', stat: 'rebounds', line: 11.5 }
]);
```

### Real-time Monitoring
```javascript
// Set up WebSocket for live updates
const ws = new WebSocket('ws://localhost:8000/ws/predictions');
ws.onmessage = (event) => {
  const prediction = JSON.parse(event.data);
  console.log('New prediction:', prediction);
};
```

## ✅ Integration Checklist

- [x] Python 3.8+ installed
- [x] Dependencies installed (`pip install -r requirements.txt`)
- [x] ML service starts without errors
- [x] Can access http://localhost:8000/health
- [x] Frontend connects to ML service
- [x] MLServiceStatus widget shows "Online"
- [x] Can make prediction requests
- [x] Error handling works correctly

## 🎉 Success Indicators

When everything is working:

1. **Dashboard shows:** "ML Service: Online" (green badge)
2. **Health endpoint returns:** `{ "success": true, "status": "healthy" }`
3. **Predictions work:** Returns confidence scores and recommendations
4. **No CORS errors:** In browser DevTools console
5. **Models load:** Terminal shows "Models loaded successfully"

---

**Need Help?** Check the logs in the ML service terminal for detailed error messages.
