import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class FeatureEngineer:
    def __init__(self):
        self.feature_cache = {}
    
    def create_player_features(
        self,
        player_id: str,
        game_date: str,
        stat_type: str,
        opponent: str,
        is_home: bool
    ) -> Dict:
        features = {}
        
        # Season Averages
        features['season_ppg'] = 25.3
        features['season_rpg'] = 8.2
        features['season_apg'] = 6.5
        features['season_fg_pct'] = 48.5
        features['season_minutes'] = 35.2
        features['season_usage'] = 29.5
        
        # Recent Form
        features['l3_avg'] = 26.7
        features['l5_avg'] = 25.8
        features['l10_avg'] = 24.9
        features['l15_avg'] = 25.1
        
        # Home/Away Splits
        if is_home:
            features['home_avg'] = 27.1
            features['home_efficiency'] = 1.08
        else:
            features['away_avg'] = 23.5
            features['away_efficiency'] = 0.95
        
        # Opponent-Specific
        features['vs_opp_avg'] = 28.3
        features['vs_opp_games'] = 3
        features['opp_def_rating'] = 112.5
        features['opp_pace'] = 101.2
        features['opp_position_defense'] = 15
        
        # Rest & Fatigue
        features['days_rest'] = 1
        features['back_to_back'] = 0
        features['games_in_7_days'] = 3
        features['minutes_last_game'] = 38
        
        # Team Context
        features['team_pace'] = 102.5
        features['team_offensive_rating'] = 118.3
        features['team_win_streak'] = 2
        
        # Matchup Factors
        features['predicted_minutes'] = 36.0
        features['predicted_usage'] = 30.5
        features['teammate_out'] = 0
        
        # Advanced Metrics
        features['true_shooting_pct'] = 58.5
        features['assist_ratio'] = 25.3
        features['rebound_rate'] = 12.8
        features['per'] = 24.5
        
        # Trend Indicators
        features['form_trend'] = 1.05
        features['consistency_score'] = 0.82
        features['ceiling_30_games'] = 42
        features['floor_30_games'] = 15
        
        # External Factors
        features['altitude'] = 0
        features['travel_distance'] = 1200
        features['rivalry_game'] = 0
        
        return features
    
    def create_game_features(
        self,
        home_team: str,
        away_team: str,
        game_date: str
    ) -> Dict:
        features = {}
        
        features['home_elo'] = 1650
        features['away_elo'] = 1580
        features['elo_diff'] = 70
        
        features['home_ortg'] = 118.5
        features['home_drtg'] = 112.3
        features['home_net_rating'] = 6.2
        
        features['away_ortg'] = 115.2
        features['away_drtg'] = 114.8
        features['away_net_rating'] = 0.4
        
        features['home_l10_record'] = 7
        features['away_l10_record'] = 5
        
        features['home_rest_days'] = 2
        features['away_rest_days'] = 1
        
        features['h2h_home_wins'] = 8
        features['h2h_total_games'] = 15
        
        return features
    
    def calculate_rolling_average(self, values: List[float], window: int) -> float:
        if len(values) < window:
            return np.mean(values) if values else 0
        return np.mean(values[-window:])
    
    def calculate_trend(self, recent: List[float], older: List[float]) -> float:
        if not recent or not older:
            return 1.0
        return np.mean(recent) / np.mean(older) if np.mean(older) > 0 else 1.0

feature_engineer = FeatureEngineer()
