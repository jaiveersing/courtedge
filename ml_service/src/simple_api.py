"""
Simple FastAPI server for NBA predictions
Provides mock prediction endpoints until full ML models are trained
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
from datetime import datetime, timedelta

app = FastAPI(title="CourtEdge Prediction API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PredictionRequest(BaseModel):
    player_name: str
    stat_type: str  # points, rebounds, assists, etc.
    opponent: Optional[str] = None

class PredictionResponse(BaseModel):
    player_name: str
    stat_type: str
    prediction: float
    confidence: float
    confidence_interval_low: float
    confidence_interval_high: float
    factors: List[str]
    last_5_games_avg: float
    season_avg: float

class GamePrediction(BaseModel):
    game_id: str
    home_team: str
    away_team: str
    game_date: str
    home_score_prediction: float
    away_score_prediction: float
    win_probability: float
    confidence_score: float
    spread_prediction: float
    total_prediction: float

# Mock data
NBA_TEAMS = [
    'ATL', 'BOS', 'BKN', 'CHA', 'CHI', 'CLE', 'DAL', 'DEN', 'DET', 'GSW',
    'HOU', 'IND', 'LAC', 'LAL', 'MEM', 'MIA', 'MIL', 'MIN', 'NOP', 'NYK',
    'OKC', 'ORL', 'PHI', 'PHX', 'POR', 'SAC', 'SAS', 'TOR', 'UTA', 'WAS'
]

@app.get("/")
async def root():
    return {
        "service": "CourtEdge Prediction API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": [
            "/predict/player",
            "/predict/game",
            "/predictions/today"
        ]
    }

@app.post("/predict/player", response_model=PredictionResponse)
async def predict_player_prop(request: PredictionRequest):
    """Generate player prop prediction with confidence intervals"""
    
    # Mock prediction logic
    base_value = random.uniform(15, 35)
    uncertainty = random.uniform(3, 8)
    confidence = random.uniform(65, 92)
    
    # Calculate confidence interval
    ci_low = base_value - uncertainty
    ci_high = base_value + uncertainty
    
    factors = [
        f"Recent form: {'Strong' if random.random() > 0.5 else 'Moderate'}",
        f"Matchup: {'Favorable' if random.random() > 0.5 else 'Challenging'}",
        f"Home/Away: {'Home advantage' if random.random() > 0.5 else 'Away game'}",
        f"Rest days: {random.randint(0, 3)}",
    ]
    
    return PredictionResponse(
        player_name=request.player_name,
        stat_type=request.stat_type,
        prediction=round(base_value, 1),
        confidence=round(confidence, 1),
        confidence_interval_low=round(ci_low, 1),
        confidence_interval_high=round(ci_high, 1),
        factors=factors,
        last_5_games_avg=round(base_value + random.uniform(-5, 5), 1),
        season_avg=round(base_value + random.uniform(-3, 3), 1)
    )

@app.get("/predict/game/{game_id}", response_model=GamePrediction)
async def predict_game(game_id: str):
    """Generate game prediction"""
    
    home_team = random.choice(NBA_TEAMS)
    away_team = random.choice([t for t in NBA_TEAMS if t != home_team])
    
    home_score = random.uniform(100, 125)
    away_score = random.uniform(95, 120)
    total = home_score + away_score
    spread = home_score - away_score
    win_prob = 0.5 + (spread / 40)  # Normalize to 0-1
    
    return GamePrediction(
        game_id=game_id,
        home_team=home_team,
        away_team=away_team,
        game_date=(datetime.now() + timedelta(hours=random.randint(1, 48))).isoformat(),
        home_score_prediction=round(home_score, 1),
        away_score_prediction=round(away_score, 1),
        win_probability=round(max(0.1, min(0.9, win_prob)), 3),
        confidence_score=round(random.uniform(70, 90), 1),
        spread_prediction=round(spread, 1),
        total_prediction=round(total, 1)
    )

@app.get("/predictions/today", response_model=List[GamePrediction])
async def get_todays_predictions():
    """Get all predictions for today's games"""
    
    num_games = random.randint(8, 12)
    predictions = []
    used_teams = set()
    
    for i in range(num_games):
        available_teams = [t for t in NBA_TEAMS if t not in used_teams]
        if len(available_teams) < 2:
            break
            
        home_team = random.choice(available_teams)
        away_team = random.choice([t for t in available_teams if t != home_team])
        
        used_teams.add(home_team)
        used_teams.add(away_team)
        
        home_score = random.uniform(100, 125)
        away_score = random.uniform(95, 120)
        total = home_score + away_score
        spread = home_score - away_score
        win_prob = 0.5 + (spread / 40)
        
        predictions.append(GamePrediction(
            game_id=f"game_{i+1}",
            home_team=home_team,
            away_team=away_team,
            game_date=datetime.now().isoformat(),
            home_score_prediction=round(home_score, 1),
            away_score_prediction=round(away_score, 1),
            win_probability=round(max(0.1, min(0.9, win_prob)), 3),
            confidence_score=round(random.uniform(70, 90), 1),
            spread_prediction=round(spread, 1),
            total_prediction=round(total, 1)
        ))
    
    return predictions

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
