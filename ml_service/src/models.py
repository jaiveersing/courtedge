"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class StatType(str, Enum):
    """Valid stat types for predictions"""
    POINTS = "points"
    REBOUNDS = "rebounds"
    ASSISTS = "assists"
    THREES = "threes"
    STEALS = "steals"
    BLOCKS = "blocks"
    PTS_REB_AST = "pts_reb_ast"


class RiskTolerance(str, Enum):
    """Risk tolerance levels"""
    CONSERVATIVE = "conservative"
    MEDIUM = "medium"
    AGGRESSIVE = "aggressive"


class BetType(str, Enum):
    """Types of bets"""
    PLAYER_PROP = "player_prop"
    GAME_OUTCOME = "game_outcome"
    SPREAD = "spread"
    TOTAL = "total"


class PlayerPropRequest(BaseModel):
    """Request model for player prop predictions"""
    player_id: str = Field(..., description="NBA player ID")
    player_name: str = Field(..., min_length=2, max_length=100)
    stat_type: StatType
    line: float = Field(..., gt=0, description="Betting line value")
    opponent: str = Field(..., min_length=2, max_length=3, description="Opponent team code")
    is_home: bool
    game_date: str = Field(..., description="Game date in YYYY-MM-DD format")
    
    @validator('game_date')
    def validate_date(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('game_date must be in YYYY-MM-DD format')
    
    @validator('opponent')
    def validate_opponent(cls, v):
        return v.upper()


class PlayerPropResponse(BaseModel):
    """Response model for player prop predictions"""
    prediction: float
    confidence: float = Field(..., ge=0, le=1)
    recommendation: str = Field(..., description="over/under/pass")
    edge_percentage: float
    expected_value: float
    kelly_fraction: float = Field(..., ge=0, le=1)
    confidence_interval: Dict[str, float]
    feature_importance: Dict[str, float]
    model_metadata: Dict[str, Any]


class GameOutcomeRequest(BaseModel):
    """Request model for game outcome predictions"""
    home_team: str = Field(..., min_length=2, max_length=3)
    away_team: str = Field(..., min_length=2, max_length=3)
    spread: float
    game_date: str
    
    @validator('game_date')
    def validate_date(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('game_date must be in YYYY-MM-DD format')
    
    @validator('home_team', 'away_team')
    def validate_team(cls, v):
        return v.upper()


class GameOutcomeResponse(BaseModel):
    """Response model for game outcome predictions"""
    home_win_probability: float = Field(..., ge=0, le=1)
    predicted_spread: float
    confidence: float = Field(..., ge=0, le=1)
    total_prediction: Optional[float] = None
    key_factors: List[str]
    model_metadata: Dict[str, Any]


class LiveGameRequest(BaseModel):
    """Request model for live game predictions"""
    game_id: str
    home_team: str = Field(..., min_length=2, max_length=3)
    away_team: str = Field(..., min_length=2, max_length=3)
    home_score: int = Field(..., ge=0)
    away_score: int = Field(..., ge=0)
    time_remaining: int = Field(..., ge=0, description="Seconds remaining")
    quarter: int = Field(..., ge=1, le=4)
    
    @validator('home_team', 'away_team')
    def validate_team(cls, v):
        return v.upper()


class LiveGameResponse(BaseModel):
    """Response model for live game predictions"""
    home_win_probability: float = Field(..., ge=0, le=1)
    momentum: str = Field(..., description="home/away/neutral")
    key_stats: Dict[str, Any]
    prediction_update_time: str


class SharpMoneyAlert(BaseModel):
    """Model for sharp money detection alerts"""
    game_id: str
    bet_type: BetType
    current_line: float
    opening_line: float
    line_movement: float
    sharp_percentage: float = Field(..., ge=0, le=100)
    public_percentage: float = Field(..., ge=0, le=100)
    is_reverse_line_movement: bool
    is_steam_move: bool
    confidence: float = Field(..., ge=0, le=1)
    recommendation: str
    detected_at: str


class SharpMoneyResponse(BaseModel):
    """Response model for sharp money detection"""
    alerts: List[SharpMoneyAlert]
    total_alerts: int
    sharp_games: List[str]


class BetOption(BaseModel):
    """Individual bet option for bankroll optimization"""
    bet_id: str
    description: str
    bet_type: BetType
    odds: float = Field(..., gt=-1000, description="American odds")
    prediction_edge: float = Field(..., description="Your predicted edge %")
    confidence: float = Field(..., ge=0, le=1)
    
    @validator('odds')
    def validate_odds(cls, v):
        if v >= -100 and v <= 100 and v != 0:
            raise ValueError('Odds cannot be between -100 and 100 (excluding 0)')
        return v


class BankrollOptimizationRequest(BaseModel):
    """Request model for bankroll optimization"""
    current_bankroll: float = Field(..., gt=0)
    available_bets: List[BetOption] = Field(..., min_items=1, max_items=50)
    risk_tolerance: RiskTolerance = RiskTolerance.MEDIUM
    max_single_bet_percentage: float = Field(default=5.0, ge=0.1, le=25.0)
    max_total_exposure: float = Field(default=30.0, ge=1.0, le=100.0)
    min_edge_threshold: float = Field(default=2.0, ge=0, le=50.0)


class BetAllocation(BaseModel):
    """Allocation for a single bet"""
    bet_id: str
    description: str
    recommended_stake: float
    stake_percentage: float
    kelly_criterion: float
    expected_value: float
    risk_adjusted_stake: float


class BankrollOptimizationResponse(BaseModel):
    """Response model for bankroll optimization"""
    allocations: List[BetAllocation]
    total_stake: float
    total_stake_percentage: float
    expected_roi: float
    portfolio_sharpe_ratio: float
    risk_metrics: Dict[str, float]
    diversification_score: float
    warnings: List[str]


class ModelPerformanceMetrics(BaseModel):
    """Model performance tracking"""
    model_name: str
    stat_type: Optional[StatType] = None
    total_predictions: int
    accuracy: float = Field(..., ge=0, le=1)
    precision: float = Field(..., ge=0, le=1)
    recall: float = Field(..., ge=0, le=1)
    f1_score: float = Field(..., ge=0, le=1)
    mae: float = Field(..., ge=0)
    rmse: float = Field(..., ge=0)
    roi: Optional[float] = None
    last_updated: str
    
    
class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    models_loaded: Dict[str, bool]
    redis_connected: bool
    version: str
    uptime_seconds: float
