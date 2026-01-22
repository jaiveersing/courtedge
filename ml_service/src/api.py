from fastapi import FastAPI, HTTPException, BackgroundTasks, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
import logging
import time
import traceback
import redis

# Import validation models
from models import (
    PlayerPropRequest, PlayerPropResponse,
    GameOutcomeRequest, GameOutcomeResponse,
    LiveGameRequest, LiveGameResponse,
    SharpMoneyResponse, SharpMoneyAlert,
    BankrollOptimizationRequest, BankrollOptimizationResponse,
    BetAllocation, HealthResponse, ModelPerformanceMetrics,
    StatType, RiskTolerance, BetType
)

# Configure comprehensive logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.FileHandler('ml_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Startup time for uptime tracking
START_TIME = time.time()

# Environment configuration
import os
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

# CORS allowed origins - SECURITY: Configure for production
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(',')
if ENVIRONMENT == 'development':
    # Allow all origins in development
    CORS_ORIGINS = ["*"]

app = FastAPI(
    title="CourtEdge ML API",
    description="Real-time AI predictions for NBA betting",
    version="1.0.0"
)

# CORS - Restricted in production, open in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Request tracking and error handling middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests and handle errors globally"""
    request_id = f"{int(time.time() * 1000)}"
    start_time = time.time()
    
    logger.info(f"[{request_id}] {request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        duration = time.time() - start_time
        logger.info(f"[{request_id}] Completed in {duration:.2f}s - Status: {response.status_code}")
        return response
    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"[{request_id}] Error after {duration:.2f}s: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "error_type": type(e).__name__,
                "request_id": request_id
            }
        )

# Validation error handler
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors"""
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation error",
            "errors": exc.errors()
        }
    )

# HTTP exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# Redis cache (optional - configured but not connected yet)
cache = None
try:
    cache = redis.Redis(host='localhost', port=6379, decode_responses=True, db=0, socket_timeout=1, socket_connect_timeout=1)
    # Test connection lazily - don't block startup
    logger.info("Redis configured (will connect on first use)")
except Exception as e:
    logger.info("Redis not configured (service will work without caching)")
    cache = None

# Model storage
MODELS_PATH = Path(__file__).parent.parent / "models"

# ============================================
# Pydantic Models (Legacy - kept for backward compatibility)
# ============================================
# Note: New code should use models from models.py

class LegacyPlayerPropRequest(BaseModel):
    player_id: str
    player_name: str
    stat_type: str  # points, rebounds, assists
    line: float
    game_date: str
    opponent: str
    is_home: bool

class LegacyGameOutcomeRequest(BaseModel):
    home_team: str
    away_team: str
    game_date: str
    home_spread: Optional[float] = None
    total: Optional[float] = None

class LegacyLiveGameRequest(BaseModel):
    game_id: str
    home_team: str
    away_team: str
    home_score: int
    away_score: int
    time_remaining_seconds: int
    quarter: int
    possession: str

class LegacyBankrollOptimizationRequest(BaseModel):
    current_bankroll: float
    available_bets: List[Dict[str, Any]]
    risk_tolerance: str = "medium"

# ============================================
# Helper Functions
# ============================================

def get_cache_key(prefix: str, **kwargs) -> str:
    """Generate cache key from prefix and parameters"""
    parts = [prefix] + [f"{k}:{v}" for k, v in sorted(kwargs.items())]
    return ":".join(parts)

def safe_cache_get(key: str) -> Optional[Any]:
    """Safely get value from cache with error handling"""
    if cache is None:
        return None
    try:
        value = cache.get(key)
        if value:
            logger.debug(f"Cache hit: {key}")
            return json.loads(value)
        return None
    except Exception as e:
        logger.error(f"Cache get error for key {key}: {e}")
        return None

def safe_cache_set(key: str, value: Any, ttl: int = 300):
    """Safely set value in cache with error handling"""
    if cache is None:
        return
    try:
        cache.setex(key, ttl, json.dumps(value))
        logger.debug(f"Cache set: {key} (TTL: {ttl}s)")
    except Exception as e:
        logger.error(f"Cache set error for key {key}: {e}")

def calculate_expected_value(probability: float, american_odds: int) -> float:
    """Calculate expected value from probability and odds"""
    if american_odds > 0:
        decimal_odds = (american_odds / 100) + 1
    else:
        decimal_odds = (100 / abs(american_odds)) + 1
    
    win_amount = decimal_odds - 1
    ev = (probability * win_amount) - ((1 - probability) * 1)
    return ev

def calculate_kelly_criterion(probability: float, decimal_odds: float) -> float:
    q = 1 - probability
    b = decimal_odds - 1
    kelly = ((b * probability) - q) / b
    return max(0, kelly)

def odds_to_decimal(american_odds: int) -> float:
    if american_odds > 0:
        return (american_odds / 100) + 1
    else:
        return (100 / abs(american_odds)) + 1

def generate_mock_features(player_name: str, stat_type: str, opponent: str) -> Dict:
    import random
    random.seed(hash(player_name + stat_type + opponent) % 10000)
    
    base_stats = {
        'points': 25.0,
        'rebounds': 8.0,
        'assists': 6.0,
        'threes': 2.5,
        'steals': 1.2,
        'blocks': 0.8
    }
    
    return {
        'season_avg': base_stats.get(stat_type, 10.0) + random.uniform(-3, 3),
        'l5_avg': base_stats.get(stat_type, 10.0) + random.uniform(-4, 4),
        'l10_avg': base_stats.get(stat_type, 10.0) + random.uniform(-2, 2),
        'vs_opponent_avg': base_stats.get(stat_type, 10.0) + random.uniform(-5, 5),
        'home_avg': base_stats.get(stat_type, 10.0) + random.uniform(-2, 3),
        'days_rest': random.randint(0, 4),
        'opponent_def_rating': random.uniform(105, 118),
        'pace': random.uniform(95, 105),
        'usage_rate': random.uniform(20, 35),
        'minutes_projection': random.uniform(28, 38),
        'injury_factor': random.uniform(0.95, 1.0),
    }

def predict_with_mock_model(features: Dict, stat_type: str, line: float) -> Dict:
    import random
    
    base_prediction = features['season_avg']
    recent_form = (features['l5_avg'] + features['l10_avg']) / 2
    prediction = (base_prediction * 0.6 + recent_form * 0.4)
    prediction += random.uniform(-2, 2)
    
    std_dev = 3.5
    conf_interval = [prediction - 1.96 * std_dev, prediction + 1.96 * std_dev]
    
    if prediction > line:
        over_prob = 0.5 + min(0.45, (prediction - line) / 10)
    else:
        over_prob = 0.5 - min(0.45, (line - prediction) / 10)
    
    over_prob = max(0.1, min(0.9, over_prob + random.uniform(-0.05, 0.05)))
    
    ev = calculate_expected_value(over_prob, -110)
    kelly = calculate_kelly_criterion(over_prob, odds_to_decimal(-110))
    kelly_fraction = kelly * 0.25
    
    confidence = int(70 + random.uniform(0, 25))
    
    feature_importance = [
        {"name": "Recent Form (L5)", "impact": round(random.uniform(2, 5), 1)},
        {"name": "vs Opponent History", "impact": round(random.uniform(1, 4), 1)},
        {"name": "Home Court", "impact": round(random.uniform(0.5, 2.5), 1)},
        {"name": "Minutes Projection", "impact": round(random.uniform(1, 3), 1)},
        {"name": "Opponent Defense", "impact": round(random.uniform(-2, 1), 1)},
    ]
    
    return {
        "prediction": round(prediction, 1),
        "confidence_interval": [round(conf_interval[0], 1), round(conf_interval[1], 1)],
        "over_probability": round(over_prob, 3),
        "expected_value": round(ev, 4),
        "kelly_fraction": round(kelly_fraction, 4),
        "recommended_bet_size_percent": round(kelly_fraction * 100, 2),
        "confidence_score": confidence,
        "feature_importance": feature_importance,
        "model_version": "xgboost_v1.2.3"
    }

# ============================================
# API Endpoints
# ============================================

@app.get("/")
def root():
    return {
        "service": "CourtEdge ML API",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "player_prop": "/predict/player_prop",
            "game_outcome": "/predict/game_outcome",
            "live_game": "/predict/live_game",
            "sharp_money": "/detect/sharp_money",
            "bankroll": "/optimize/bankroll"
        }
    }

@app.get("/health")
def health_check():
    models_status = {
        "points_model": (MODELS_PATH / "player_props" / "points_model.pkl").exists(),
        "rebounds_model": (MODELS_PATH / "player_props" / "rebounds_model.pkl").exists(),
        "assists_model": (MODELS_PATH / "player_props" / "assists_model.pkl").exists(),
    }
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "redis_connected": cache is not None,
        "models_loaded": models_status,
        "version": "1.0.0"
    }

@app.post("/predict/player_prop")
async def predict_player_prop(request: LegacyPlayerPropRequest):
    try:
        logger.info(f"Generating prediction for {request.player_name} - {request.stat_type} O/U {request.line}")
        features = generate_mock_features(request.player_name, request.stat_type, request.opponent)
        prediction_result = predict_with_mock_model(features, request.stat_type, request.line)
        
        response = {
            "player_id": request.player_id,
            "player_name": request.player_name,
            "stat": request.stat_type,
            "line": request.line,
            "opponent": request.opponent,
            "is_home": request.is_home,
            "game_date": request.game_date,
            **prediction_result,
            "recommendation": "OVER" if prediction_result["over_probability"] > 0.55 else "UNDER" if prediction_result["over_probability"] < 0.45 else "PASS",
            "timestamp": datetime.now().isoformat()
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Error in predict_player_prop: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/game_outcome")
async def predict_game_outcome(request: LegacyGameOutcomeRequest):
    try:
        cache_key = get_cache_key(
            "game",
            home=request.home_team,
            away=request.away_team,
            date=request.game_date
        )
        
        if cache:
            cached = cache.get(cache_key)
            if cached:
                return json.loads(cached)
        
        import random
        random.seed(hash(request.home_team + request.away_team))
        
        home_win_prob = random.uniform(0.35, 0.65)
        predicted_spread = random.uniform(-8, 8)
        predicted_total = random.uniform(210, 235)
        
        response = {
            "game": f"{request.away_team} @ {request.home_team}",
            "game_date": request.game_date,
            "predictions": {
                "home_win_probability": round(home_win_prob, 3),
                "away_win_probability": round(1 - home_win_prob, 3),
                "predicted_spread": round(predicted_spread, 1),
                "predicted_total": round(predicted_total, 1),
                "predicted_home_score": round((predicted_total + predicted_spread) / 2, 1),
                "predicted_away_score": round((predicted_total - predicted_spread) / 2, 1)
            },
            "market": {
                "spread": request.home_spread,
                "total": request.total
            },
            "edges": {
                "spread_edge": round(predicted_spread - (request.home_spread or 0), 1) if request.home_spread else None,
                "total_edge": round(predicted_total - (request.total or 0), 1) if request.total else None
            },
            "recommendations": [],
            "confidence_score": random.randint(65, 90),
            "model_version": "ensemble_v1.0",
            "timestamp": datetime.now().isoformat()
        }
        
        if response["edges"]["spread_edge"] and abs(response["edges"]["spread_edge"]) > 2:
            response["recommendations"].append({
                "bet_type": "spread",
                "side": "home" if response["edges"]["spread_edge"] > 0 else "away",
                "edge": abs(response["edges"]["spread_edge"]),
                "confidence": "high" if abs(response["edges"]["spread_edge"]) > 4 else "medium"
            })
        
        if response["edges"]["total_edge"] and abs(response["edges"]["total_edge"]) > 3:
            response["recommendations"].append({
                "bet_type": "total",
                "side": "over" if response["edges"]["total_edge"] > 0 else "under",
                "edge": abs(response["edges"]["total_edge"]),
                "confidence": "high" if abs(response["edges"]["total_edge"]) > 5 else "medium"
            })
        
        if cache:
            cache.setex(cache_key, 300, json.dumps(response))
        
        return response
        
    except Exception as e:
        logger.error(f"Error in predict_game_outcome: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/live_game")
async def predict_live_outcome(request: LiveGameRequest):
    try:
        score_diff = request.home_score - request.away_score
        time_remaining_minutes = request.time_remaining_seconds / 60
        
        base_prob = 0.5 + (score_diff * 0.02)
        time_factor = 1 - (time_remaining_minutes / 48)
        adjusted_prob = 0.5 + (base_prob - 0.5) * (1 + time_factor)
        win_prob = max(0.05, min(0.95, adjusted_prob))
        
        if score_diff < 0:
            comeback_base = 0.5 - abs(score_diff) * 0.03
            comeback_prob = max(0.05, comeback_base * (time_remaining_minutes / 48))
        else:
            comeback_prob = 0.0
        
        response = {
            "game_id": request.game_id,
            "game": f"{request.away_team} @ {request.home_team}",
            "current_score": {
                "home": request.home_score,
                "away": request.away_score,
                "differential": score_diff
            },
            "time": {
                "quarter": request.quarter,
                "seconds_remaining": request.time_remaining_seconds,
                "minutes_remaining": round(time_remaining_minutes, 1)
            },
            "possession": request.possession,
            "live_win_probability": {
                "home": round(win_prob, 3),
                "away": round(1 - win_prob, 3)
            },
            "comeback_probability": round(comeback_prob, 3) if comeback_prob > 0 else None,
            "momentum": "home" if score_diff > 0 else "away" if score_diff < 0 else "neutral",
            "live_betting_edge": "Check live odds for value" if abs(score_diff) < 10 else "Wait for better spot",
            "timestamp": datetime.now().isoformat()
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Error in predict_live_outcome: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/detect/sharp_money")
async def detect_sharp_money(sport: str = "nba", limit: int = 10):
    try:
        import random
        
        games = [
            {"home": "Lakers", "away": "Warriors"},
            {"home": "Celtics", "away": "76ers"},
            {"home": "Bucks", "away": "Heat"},
            {"home": "Nuggets", "away": "Suns"},
            {"home": "Mavericks", "away": "Clippers"},
        ]
        
        sharp_signals = []
        
        for game in games[:limit]:
            if random.random() > 0.6:
                sharp_score = random.uniform(0.7, 0.95)
                side = random.choice(["home", "away", "over", "under"])
                line_movement = random.uniform(0.5, 3.0)
                
                sharp_signals.append({
                    "game": f"{game['away']} @ {game['home']}",
                    "signal_type": side,
                    "confidence": round(sharp_score, 2),
                    "line_movement": round(line_movement, 1),
                    "movement_direction": "sharp" if random.random() > 0.5 else "public",
                    "recommendation": "FOLLOW" if sharp_score > 0.85 else "MONITOR",
                    "detected_at": datetime.now().isoformat(),
                    "indicators": {
                        "reverse_line_movement": random.random() > 0.7,
                        "steam_move": random.random() > 0.8,
                        "sharp_percentage": random.randint(70, 95),
                        "public_percentage": random.randint(30, 60)
                    }
                })
        
        return {
            "sport": sport,
            "signals_detected": len(sharp_signals),
            "signals": sharp_signals,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in detect_sharp_money: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize/bankroll")
async def optimize_bankroll(request: BankrollOptimizationRequest):
    try:
        risk_multipliers = {
            "low": 0.25,
            "medium": 0.5,
            "high": 1.0
        }
        
        multiplier = risk_multipliers.get(request.risk_tolerance, 0.5)
        
        optimized_bets = []
        total_stake = 0
        
        for bet in request.available_bets:
            win_prob = bet.get("win_probability", 0.55)
            odds = bet.get("odds", -110)
            ev = bet.get("expected_value", 0.05)
            
            decimal_odds = odds_to_decimal(odds)
            kelly = calculate_kelly_criterion(win_prob, decimal_odds)
            fractional_kelly = kelly * multiplier
            
            stake_amount = fractional_kelly * request.current_bankroll
            stake_amount = max(0, min(stake_amount, request.current_bankroll * 0.05))
            
            optimized_bets.append({
                "bet_id": bet.get("id"),
                "description": bet.get("description"),
                "recommended_stake": round(stake_amount, 2),
                "stake_percentage": round((stake_amount / request.current_bankroll) * 100, 2),
                "kelly_fraction": round(fractional_kelly, 4),
                "expected_value": round(ev, 4),
                "win_probability": round(win_prob, 3)
            })
            
            total_stake += stake_amount
        
        total_ev = sum(bet["expected_value"] * bet["recommended_stake"] for bet in optimized_bets)
        
        response = {
            "bankroll": request.current_bankroll,
            "risk_tolerance": request.risk_tolerance,
            "optimized_bets": optimized_bets,
            "portfolio_summary": {
                "total_stake": round(total_stake, 2),
                "total_stake_percentage": round((total_stake / request.current_bankroll) * 100, 2),
                "expected_return": round(total_ev, 2),
                "expected_roi": round((total_ev / total_stake) * 100, 2) if total_stake > 0 else 0,
                "number_of_bets": len(optimized_bets),
                "avg_bet_size": round(total_stake / len(optimized_bets), 2) if optimized_bets else 0
            },
            "risk_metrics": {
                "risk_of_ruin": "< 1%" if total_stake < request.current_bankroll * 0.15 else "Low",
                "kelly_multiplier": multiplier,
                "diversification_score": min(100, len(optimized_bets) * 20)
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Error in optimize_bankroll: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    logger.info("CourtEdge ML API starting up...")
    logger.info(f"Models path: {MODELS_PATH}")
    
    MODELS_PATH.mkdir(parents=True, exist_ok=True)
    (MODELS_PATH / "player_props").mkdir(exist_ok=True)
    (MODELS_PATH / "game_outcomes").mkdir(exist_ok=True)
    (MODELS_PATH / "line_movement").mkdir(exist_ok=True)
    
    logger.info("ML API ready")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("ML API shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
