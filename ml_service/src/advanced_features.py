"""
Advanced feature engineering for NBA predictions
Includes matchup history, pace factors, and injury adjustments
"""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class AdvancedFeatureEngineer:
    """Advanced NBA feature engineering"""
    
    def __init__(self):
        self.team_pace_cache = {}
        self.matchup_cache = {}
        
    def engineer_player_features(
        self,
        player_stats: Dict,
        opponent_stats: Dict,
        game_context: Dict,
        historical_data: Optional[pd.DataFrame] = None,
        referee_data: Optional[Dict] = None,
        lineup_data: Optional[Dict] = None
    ) -> Dict:
        """
        Engineer comprehensive features for player prop predictions
        
        Args:
            player_stats: Player's recent statistics
            opponent_stats: Opponent team statistics
            game_context: Game-specific context (home/away, rest days, etc.)
            historical_data: Historical game logs
            referee_data: Referee tendencies and statistics
            lineup_data: Expected lineup and teammate information
            
        Returns:
            Dictionary of engineered features
        """
        features = {}
        
        # Basic stats
        features.update(self._basic_stats_features(player_stats))
        
        # Trend features
        features.update(self._trend_features(player_stats))
        
        # Matchup features
        features.update(self._matchup_features(player_stats, opponent_stats))
        
        # NEW: Positional matchup features
        features.update(self._positional_matchup_features(player_stats, opponent_stats))
        
        # Pace and tempo features
        features.update(self._pace_features(opponent_stats, game_context))
        
        # Rest and fatigue features
        features.update(self._rest_features(game_context))
        
        # NEW: Travel and altitude features
        features.update(self._travel_altitude_features(game_context))
        
        # Advanced metrics
        features.update(self._advanced_metrics(player_stats, opponent_stats))
        
        # NEW: Game script prediction
        features.update(self._game_script_features(player_stats, opponent_stats))
        
        # Hot/cold streaks
        if historical_data is not None:
            features.update(self._streak_features(historical_data))
        
        # Injury impact
        features.update(self._injury_impact_features(game_context))
        
        # NEW: Referee tendencies
        if referee_data is not None:
            features.update(self._referee_features(referee_data, player_stats))
        
        # NEW: Teammate synergy
        if lineup_data is not None:
            features.update(self._lineup_synergy_features(lineup_data, player_stats))
        
        return features
    
    def _basic_stats_features(self, stats: Dict) -> Dict:
        """Basic statistical features"""
        return {
            'season_avg': stats.get('season_avg', 0),
            'l5_avg': stats.get('l5_avg', 0),
            'l10_avg': stats.get('l10_avg', 0),
            'l15_avg': stats.get('l15_avg', 0),
            'home_avg': stats.get('home_avg', 0),
            'away_avg': stats.get('away_avg', 0),
            'games_played': stats.get('games_played', 0),
        }
    
    def _trend_features(self, stats: Dict) -> Dict:
        """Trending features"""
        season_avg = stats.get('season_avg', 0)
        l5_avg = stats.get('l5_avg', 0)
        l10_avg = stats.get('l10_avg', 0)
        
        return {
            'l5_vs_season': l5_avg - season_avg if season_avg > 0 else 0,
            'l10_vs_season': l10_avg - season_avg if season_avg > 0 else 0,
            'recent_momentum': (l5_avg - l10_avg) if l10_avg > 0 else 0,
            'consistency_score': 1.0 - (stats.get('std_dev', 0) / season_avg if season_avg > 0 else 0),
        }
    
    def _matchup_features(self, player_stats: Dict, opponent_stats: Dict) -> Dict:
        """Matchup-specific features"""
        opponent = opponent_stats.get('team_code', 'UNK')
        vs_opponent_avg = player_stats.get(f'vs_{opponent}_avg', player_stats.get('season_avg', 0))
        
        return {
            'vs_opponent_avg': vs_opponent_avg,
            'vs_opponent_games': player_stats.get(f'vs_{opponent}_games', 0),
            'opponent_def_rating': opponent_stats.get('def_rating', 110),
            'opponent_pace': opponent_stats.get('pace', 100),
            'opponent_rank_defense': opponent_stats.get('def_rank', 15),
            'matchup_advantage': vs_opponent_avg - player_stats.get('season_avg', 0),
        }
    
    def _pace_features(self, opponent_stats: Dict, game_context: Dict) -> Dict:
        """Pace and tempo features"""
        opponent_pace = opponent_stats.get('pace', 100)
        league_avg_pace = 99.5
        
        # Expected possessions based on pace
        expected_possessions = opponent_pace * 48 / 48  # Normalize to game length
        
        return {
            'pace': opponent_pace,
            'pace_vs_league': opponent_pace - league_avg_pace,
            'expected_possessions': expected_possessions,
            'pace_category': 1 if opponent_pace > 102 else (-1 if opponent_pace < 97 else 0),
        }
    
    def _rest_features(self, game_context: Dict) -> Dict:
        """Rest and fatigue features"""
        days_rest = game_context.get('days_rest', 1)
        is_b2b = 1 if days_rest == 0 else 0
        
        # Rest advantage
        opponent_days_rest = game_context.get('opponent_days_rest', 1)
        rest_advantage = days_rest - opponent_days_rest
        
        return {
            'days_rest': days_rest,
            'is_b2b': is_b2b,
            'rest_advantage': rest_advantage,
            'fatigue_factor': 0.95 if is_b2b else (1.02 if days_rest >= 3 else 1.0),
        }
    
    def _advanced_metrics(self, player_stats: Dict, opponent_stats: Dict) -> Dict:
        """Advanced NBA metrics"""
        usage_rate = player_stats.get('usage_rate', 25)
        minutes_projection = player_stats.get('minutes_projection', 30)
        
        # True shooting percentage impact
        ts_pct = player_stats.get('ts_pct', 0.55)
        
        # Defensive rating faced
        opp_def_rating = opponent_stats.get('def_rating', 110)
        league_avg_def = 112
        def_difficulty = opp_def_rating - league_avg_def
        
        return {
            'usage_rate': usage_rate,
            'minutes_projection': minutes_projection,
            'ts_pct': ts_pct,
            'per': player_stats.get('per', 15),
            'off_rating': player_stats.get('off_rating', 110),
            'net_rating': player_stats.get('net_rating', 0),
            'def_difficulty': def_difficulty,
            'usage_minutes_product': usage_rate * minutes_projection / 100,
        }
    
    def _streak_features(self, historical_data: pd.DataFrame) -> Dict:
        """Hot/cold streak features"""
        if historical_data is None or len(historical_data) < 3:
            return {
                'hot_streak': 0,
                'cold_streak': 0,
                'streak_direction': 0,
            }
        
        # Sort by date descending
        df = historical_data.sort_values('date', ascending=False).head(10)
        
        # Calculate consecutive over/under performances
        if 'line' in df.columns and 'actual' in df.columns:
            df['over'] = (df['actual'] > df['line']).astype(int)
            
            # Count current streak
            current_streak = 0
            last_result = df.iloc[0]['over']
            
            for idx, row in df.iterrows():
                if row['over'] == last_result:
                    current_streak += 1
                else:
                    break
            
            return {
                'hot_streak': current_streak if last_result == 1 else 0,
                'cold_streak': current_streak if last_result == 0 else 0,
                'streak_direction': 1 if last_result == 1 else -1,
                'hit_rate_l10': df['over'].mean(),
            }
        
        return {
            'hot_streak': 0,
            'cold_streak': 0,
            'streak_direction': 0,
            'hit_rate_l10': 0.5,
        }
    
    def _injury_impact_features(self, game_context: Dict) -> Dict:
        """Injury and lineup impact features"""
        player_injury_status = game_context.get('player_injury_status', 'healthy')
        key_teammate_out = game_context.get('key_teammate_out', False)
        
        # Injury factor (0.0 to 1.0, where 1.0 is fully healthy)
        injury_factors = {
            'healthy': 1.0,
            'probable': 0.95,
            'questionable': 0.85,
            'doubtful': 0.60,
            'out': 0.0
        }
        
        injury_factor = injury_factors.get(player_injury_status, 1.0)
        
        # Usage boost if key teammate is out
        usage_boost = 1.1 if key_teammate_out else 1.0
        
        return {
            'injury_factor': injury_factor,
            'injury_status_numeric': list(injury_factors.keys()).index(player_injury_status) if player_injury_status in injury_factors else 0,
            'key_teammate_out': 1 if key_teammate_out else 0,
            'usage_boost': usage_boost,
            'expected_usage_adjusted': game_context.get('usage_rate', 25) * usage_boost,
        }
    
    def engineer_game_features(
        self,
        home_team_stats: Dict,
        away_team_stats: Dict,
        game_context: Dict
    ) -> Dict:
        """Engineer features for game outcome predictions"""
        features = {}
        
        # Team strength features
        features['home_net_rating'] = home_team_stats.get('net_rating', 0)
        features['away_net_rating'] = away_team_stats.get('net_rating', 0)
        features['rating_differential'] = features['home_net_rating'] - features['away_net_rating']
        
        # Pace and style matchup
        home_pace = home_team_stats.get('pace', 100)
        away_pace = away_team_stats.get('pace', 100)
        features['pace_differential'] = home_pace - away_pace
        features['expected_pace'] = (home_pace + away_pace) / 2
        
        # Offensive/Defensive matchups
        features['off_def_matchup'] = home_team_stats.get('off_rating', 110) - away_team_stats.get('def_rating', 110)
        features['def_off_matchup'] = home_team_stats.get('def_rating', 110) - away_team_stats.get('off_rating', 110)
        
        # Recent form
        features['home_l10_win_pct'] = home_team_stats.get('l10_wins', 5) / 10
        features['away_l10_win_pct'] = away_team_stats.get('l10_wins', 5) / 10
        features['form_differential'] = features['home_l10_win_pct'] - features['away_l10_win_pct']
        
        # Home court advantage
        features['home_advantage'] = 3.5  # NBA average HCA in points
        features['home_record'] = home_team_stats.get('home_win_pct', 0.6)
        features['away_record'] = away_team_stats.get('away_win_pct', 0.4)
        
        # Rest factors
        features['home_days_rest'] = game_context.get('home_days_rest', 1)
        features['away_days_rest'] = game_context.get('away_days_rest', 1)
        features['rest_advantage'] = features['home_days_rest'] - features['away_days_rest']
        
        return features
    
    def _positional_matchup_features(self, player_stats: Dict, opponent_stats: Dict) -> Dict:
        """Position-specific defensive matchup features"""
        position = player_stats.get('position', 'SG')
        
        return {
            f'{position}_def_rating': opponent_stats.get(f'{position}_def_rating', 110),
            f'{position}_allowed_avg': opponent_stats.get(f'{position}_ppg_allowed', 20),
            'position_matchup_rank': opponent_stats.get(f'{position}_def_rank', 15),
            'position_strength': 1.0 - (opponent_stats.get(f'{position}_def_rank', 15) / 30.0)
        }
    
    def _travel_altitude_features(self, game_context: Dict) -> Dict:
        """Travel distance and altitude impact"""
        altitude_map = {
            'DEN': 5280, 'UTA': 4226, 'PHX': 1117, 'SAS': 650,
            'DAL': 430, 'MEM': 337, 'OKC': 1201
        }
        
        venue = game_context.get('venue', 'UNK')
        prev_venue = game_context.get('previous_venue', venue)
        
        current_alt = altitude_map.get(venue, 0)
        prev_alt = altitude_map.get(prev_venue, 0)
        
        return {
            'altitude': current_alt,
            'altitude_change': current_alt - prev_alt,
            'high_altitude_game': 1 if current_alt > 3000 else 0,
            'miles_traveled': game_context.get('travel_distance', 0),
            'time_zones_crossed': game_context.get('time_zone_diff', 0),
            'travel_fatigue_score': min(game_context.get('travel_distance', 0) / 3000, 1.0)
        }
    
    def _game_script_features(self, player_stats: Dict, opponent_stats: Dict) -> Dict:
        """Predict game flow and garbage time probability"""
        team_off = player_stats.get('team_off_rating', 110)
        team_def = player_stats.get('team_def_rating', 110)
        opp_off = opponent_stats.get('off_rating', 110)
        opp_def = opponent_stats.get('def_rating', 110)
        
        expected_margin = ((team_off - opp_def) - (opp_off - team_def)) * 0.1
        
        return {
            'expected_point_diff': expected_margin,
            'blowout_probability': 1 / (1 + np.exp(-expected_margin / 5)),
            'close_game_probability': 1 - abs(expected_margin) / 20,
            'garbage_time_risk': 1 if abs(expected_margin) > 12 else 0,
            'competitive_factor': max(0, 1 - abs(expected_margin) / 15)
        }
    
    def _referee_features(self, referee_data: Dict, player_stats: Dict) -> Dict:
        """Referee tendency impact on player performance"""
        return {
            'ref_fouls_per_game': referee_data.get('avg_fouls', 22),
            'ref_foul_rate_vs_league': referee_data.get('avg_fouls', 22) - 22.0,
            'ref_tight_whistle': 1 if referee_data.get('avg_fouls', 22) > 24 else 0,
            'ref_home_bias': referee_data.get('home_foul_diff', 0),
            'player_fouls_with_ref': referee_data.get(f'player_{player_stats.get("id")}_fouls', 3),
            'ref_tech_rate': referee_data.get('technical_fouls', 0.5),
            'ref_pace_impact': referee_data.get('games_pace', 100) - 99.5
        }
    
    def _lineup_synergy_features(self, lineup_data: Dict, player_stats: Dict) -> Dict:
        """Teammate synergy and lineup composition impact"""
        teammates = lineup_data.get('teammates', [])
        
        # Calculate spacing score (number of 3pt shooters)
        three_pt_shooters = sum(1 for t in teammates if t.get('3pt_pct', 0) > 0.36)
        
        # Primary ball handler present
        has_playmaker = any(t.get('position') == 'PG' for t in teammates)
        
        # Usage rate projection
        total_usage = sum(t.get('usage_rate', 20) for t in teammates)
        available_usage = 100 - total_usage
        usage_boost = available_usage / 100
        
        return {
            'spacing_score': three_pt_shooters / 5.0,
            'primary_playmaker_active': 1 if has_playmaker else 0,
            'usage_share_projected': player_stats.get('usage_rate', 25) * (1 + usage_boost),
            'lineup_net_rating': lineup_data.get('net_rating', 0),
            'lineup_pace': lineup_data.get('pace', 100),
            'teammate_quality': np.mean([t.get('per', 15) for t in teammates if t.get('per')])
        }


# Global instance
advanced_feature_engineer = AdvancedFeatureEngineer()
