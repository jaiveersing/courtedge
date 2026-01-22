"""
Advanced Feature Engineering Service
Calculates advanced statistics and betting-relevant features
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats

class FeatureEngineeringService:
    def __init__(self):
        self.feature_cache = {}
        
    def calculate_four_factors(self, team_stats):
        """
        Calculate Dean Oliver's Four Factors
        Most important metrics for winning basketball games
        """
        # 1. Shooting Efficiency (eFG%)
        efg = (team_stats['fg'] + 0.5 * team_stats['fg3']) / team_stats['fga']
        
        # 2. Turnover Rate
        tov_rate = team_stats['to'] / team_stats['possessions']
        
        # 3. Offensive Rebounding Rate
        oreb_rate = team_stats['oreb'] / (team_stats['oreb'] + team_stats['opponent_dreb'])
        
        # 4. Free Throw Rate
        ft_rate = team_stats['fta'] / team_stats['fga']
        
        return {
            'efg_pct': efg,
            'tov_rate': tov_rate,
            'oreb_rate': oreb_rate,
            'ft_rate': ft_rate,
            'four_factors_score': efg * 0.4 - tov_rate * 0.25 + oreb_rate * 0.2 + ft_rate * 0.15
        }
    
    def calculate_advanced_metrics(self, player_stats, team_stats):
        """
        Calculate advanced player metrics
        """
        metrics = {}
        
        # Usage Rate - % of team plays used by player
        metrics['usage_rate'] = 100 * (
            (player_stats['fga'] + 0.44 * player_stats['fta'] + player_stats['to']) * 
            (team_stats['minutes'] / 5)
        ) / (player_stats['minutes'] * (team_stats['fga'] + 0.44 * team_stats['fta'] + team_stats['to']))
        
        # True Shooting % - Shooting efficiency accounting for 3s and FTs
        metrics['ts_pct'] = 100 * player_stats['points'] / (
            2 * (player_stats['fga'] + 0.44 * player_stats['fta'])
        )
        
        # Effective Field Goal %
        metrics['efg_pct'] = 100 * (
            player_stats['fg'] + 0.5 * player_stats['fg3']
        ) / player_stats['fga']
        
        # Player Efficiency Rating (PER)
        metrics['per'] = self.calculate_per(player_stats, team_stats)
        
        # Box Plus/Minus estimation
        metrics['bpm'] = self.estimate_bpm(player_stats, team_stats)
        
        # Value Over Replacement Player
        metrics['vorp'] = (metrics['bpm'] - (-2.0)) * (player_stats['minutes'] / (team_stats['games'] * 48)) * team_stats['games'] / 82
        
        # Assist Rate
        metrics['ast_rate'] = 100 * player_stats['assists'] / (
            (player_stats['minutes'] / (team_stats['minutes'] / 5)) * team_stats['fg'] - player_stats['fg']
        )
        
        # Rebound Rates
        metrics['oreb_rate'] = 100 * (player_stats['oreb'] * team_stats['minutes']) / (
            player_stats['minutes'] * (team_stats['oreb'] + team_stats['opponent_dreb'])
        )
        
        metrics['dreb_rate'] = 100 * (player_stats['dreb'] * team_stats['minutes']) / (
            player_stats['minutes'] * (team_stats['dreb'] + team_stats['opponent_oreb'])
        )
        
        metrics['treb_rate'] = 100 * (player_stats['reb'] * team_stats['minutes']) / (
            player_stats['minutes'] * (team_stats['reb'] + team_stats['opponent_reb'])
        )
        
        return metrics
    
    def calculate_per(self, player_stats, team_stats):
        """
        Calculate Player Efficiency Rating
        """
        # Simplified PER calculation
        per = (
            player_stats['points'] +
            player_stats['reb'] * 0.7 +
            player_stats['assists'] +
            player_stats['steals'] +
            player_stats['blocks'] -
            (player_stats['fga'] - player_stats['fg']) * 0.4 -
            (player_stats['fta'] - player_stats['ft']) * 0.7 -
            player_stats['to']
        ) / player_stats['games']
        
        # Pace adjustment
        pace_adj = team_stats['pace'] / 100
        
        return per * pace_adj
    
    def estimate_bpm(self, player_stats, team_stats):
        """
        Estimate Box Plus/Minus
        Simplified version of the actual BPM formula
        """
        # Raw box score metrics
        scoring = player_stats['points'] / player_stats['minutes']
        rebounding = player_stats['reb'] / player_stats['minutes']
        playmaking = player_stats['assists'] / player_stats['minutes']
        defense = (player_stats['steals'] + player_stats['blocks']) / player_stats['minutes']
        
        # Shooting efficiency
        ts_pct = player_stats['points'] / (2 * (player_stats['fga'] + 0.44 * player_stats['fta']))
        
        # Combine factors with weights (simplified)
        bpm = (
            scoring * 0.7 +
            rebounding * 1.4 +
            playmaking * 1.5 +
            defense * 2.0 +
            (ts_pct - 0.5) * 3.0
        ) * 15  # Scale factor
        
        return bpm
    
    def calculate_momentum_features(self, game_log):
        """
        Calculate team momentum and trend features
        """
        features = {}
        
        # Recent form (last 10 games)
        recent = game_log.tail(10)
        features['win_pct_l10'] = recent['win'].mean()
        features['pts_trend_l10'] = self.calculate_trend(recent['points'])
        features['margin_l10'] = recent['margin'].mean()
        
        # Hot/cold streaks
        features['current_streak'] = self.calculate_streak(game_log['win'])
        features['home_streak'] = self.calculate_streak(game_log[game_log['is_home']]['win'])
        features['away_streak'] = self.calculate_streak(game_log[~game_log['is_home']]['win'])
        
        # Consistency metrics
        features['pts_std_l10'] = recent['points'].std()
        features['margin_std_l10'] = recent['margin'].std()
        
        # Clutch performance (games decided by 5 or less)
        close_games = game_log[abs(game_log['margin']) <= 5]
        if len(close_games) > 0:
            features['clutch_win_pct'] = close_games['win'].mean()
        else:
            features['clutch_win_pct'] = 0.5
        
        return features
    
    def calculate_matchup_features(self, team_a_stats, team_b_stats):
        """
        Calculate head-to-head matchup features
        """
        features = {}
        
        # Pace differential
        features['pace_diff'] = team_a_stats['pace'] - team_b_stats['pace']
        features['expected_pace'] = (team_a_stats['pace'] + team_b_stats['pace']) / 2
        
        # Style matchup
        features['off_rating_diff'] = team_a_stats['off_rating'] - team_b_stats['def_rating']
        features['def_rating_diff'] = team_a_stats['def_rating'] - team_b_stats['off_rating']
        
        # Four factors comparison
        ff_a = self.calculate_four_factors(team_a_stats)
        ff_b = self.calculate_four_factors(team_b_stats)
        
        features['efg_diff'] = ff_a['efg_pct'] - ff_b['efg_pct']
        features['tov_diff'] = ff_b['tov_rate'] - ff_a['tov_rate']  # Lower is better
        features['oreb_diff'] = ff_a['oreb_rate'] - ff_b['oreb_rate']
        features['ft_rate_diff'] = ff_a['ft_rate'] - ff_b['ft_rate']
        
        # Strength of schedule
        features['sos_diff'] = team_a_stats['sos'] - team_b_stats['sos']
        
        return features
    
    def calculate_betting_features(self, game_data, odds_data):
        """
        Calculate betting-specific features
        """
        features = {}
        
        # Line movement
        if 'opening_spread' in odds_data and 'current_spread' in odds_data:
            features['spread_movement'] = odds_data['current_spread'] - odds_data['opening_spread']
            features['spread_movement_pct'] = (features['spread_movement'] / abs(odds_data['opening_spread'])) * 100 if odds_data['opening_spread'] != 0 else 0
        
        # Total movement
        if 'opening_total' in odds_data and 'current_total' in odds_data:
            features['total_movement'] = odds_data['current_total'] - odds_data['opening_total']
            features['total_movement_pct'] = (features['total_movement'] / odds_data['opening_total']) * 100
        
        # Public betting percentages (if available)
        if 'public_bet_pct' in odds_data:
            features['public_bet_pct'] = odds_data['public_bet_pct']
            features['sharp_side'] = 'home' if odds_data['public_bet_pct'] < 40 else 'away'
        
        # Implied probability from odds
        if 'home_ml' in odds_data:
            features['home_implied_prob'] = self.odds_to_probability(odds_data['home_ml'])
        if 'away_ml' in odds_data:
            features['away_implied_prob'] = self.odds_to_probability(odds_data['away_ml'])
        
        # Closing line value
        if 'historical_spread' in game_data and 'actual_margin' in game_data:
            features['clv'] = game_data['actual_margin'] - game_data['historical_spread']
        
        return features
    
    def calculate_situational_features(self, team_stats, game_context):
        """
        Calculate situational/contextual features
        """
        features = {}
        
        # Rest advantage
        features['rest_advantage'] = game_context['home_rest_days'] - game_context['away_rest_days']
        features['home_b2b'] = 1 if game_context['home_rest_days'] == 1 else 0
        features['away_b2b'] = 1 if game_context['away_rest_days'] == 1 else 0
        
        # Schedule spot
        features['home_schedule_difficulty'] = self.calculate_schedule_difficulty(
            game_context['home_prev_opponents'],
            game_context['home_next_opponents']
        )
        features['away_schedule_difficulty'] = self.calculate_schedule_difficulty(
            game_context['away_prev_opponents'],
            game_context['away_next_opponents']
        )
        
        # Travel distance
        if 'travel_distance' in game_context:
            features['away_travel_miles'] = game_context['travel_distance']
            features['travel_fatigue_factor'] = min(1.0, game_context['travel_distance'] / 3000)
        
        # Time zone changes
        if 'timezone_diff' in game_context:
            features['timezone_adjustment'] = abs(game_context['timezone_diff'])
        
        # Season timing
        features['games_played_pct'] = team_stats['games_played'] / 82
        features['season_phase'] = self.categorize_season_phase(team_stats['games_played'])
        
        # Playoff implications
        if 'playoff_odds' in team_stats:
            features['playoff_pressure'] = self.calculate_playoff_pressure(team_stats)
        
        return features
    
    def calculate_trend(self, series):
        """
        Calculate linear trend (positive = improving, negative = declining)
        """
        if len(series) < 2:
            return 0
        
        x = np.arange(len(series))
        slope, _, _, _, _ = stats.linregress(x, series.values)
        return slope
    
    def calculate_streak(self, win_series):
        """
        Calculate current win/loss streak
        """
        if len(win_series) == 0:
            return 0
        
        current = win_series.iloc[-1]
        streak = 1
        
        for i in range(len(win_series) - 2, -1, -1):
            if win_series.iloc[i] == current:
                streak += 1
            else:
                break
        
        return streak if current else -streak
    
    def calculate_schedule_difficulty(self, prev_opponents, next_opponents):
        """
        Calculate schedule difficulty based on opponent quality
        """
        # This would use actual team rankings/ratings
        # Simplified for demonstration
        avg_rating = (sum(prev_opponents) + sum(next_opponents)) / (len(prev_opponents) + len(next_opponents))
        return avg_rating
    
    def categorize_season_phase(self, games_played):
        """
        Categorize season phase
        """
        if games_played <= 10:
            return 'early'
        elif games_played <= 41:
            return 'mid'
        elif games_played <= 72:
            return 'late'
        else:
            return 'final'
    
    def calculate_playoff_pressure(self, team_stats):
        """
        Calculate playoff pressure based on standings and odds
        """
        playoff_odds = team_stats.get('playoff_odds', 50)
        
        # Maximum pressure when odds are 40-60% (bubble teams)
        if 40 <= playoff_odds <= 60:
            pressure = 10
        elif playoff_odds < 40:
            pressure = max(0, 10 - (40 - playoff_odds) * 0.2)
        else:
            pressure = max(0, 10 - (playoff_odds - 60) * 0.2)
        
        return pressure
    
    def odds_to_probability(self, american_odds):
        """
        Convert American odds to implied probability
        """
        if american_odds > 0:
            return 100 / (american_odds + 100)
        else:
            return abs(american_odds) / (abs(american_odds) + 100)
    
    def create_full_feature_set(self, team_a_stats, team_b_stats, game_context, odds_data):
        """
        Create complete feature set for a game
        """
        features = {}
        
        # Basic stats
        features.update({
            'home_off_rating': team_a_stats['off_rating'],
            'home_def_rating': team_a_stats['def_rating'],
            'away_off_rating': team_b_stats['off_rating'],
            'away_def_rating': team_b_stats['def_rating']
        })
        
        # Four factors
        features.update({f'home_{k}': v for k, v in self.calculate_four_factors(team_a_stats).items()})
        features.update({f'away_{k}': v for k, v in self.calculate_four_factors(team_b_stats).items()})
        
        # Momentum
        if 'game_log' in team_a_stats:
            features.update({f'home_{k}': v for k, v in self.calculate_momentum_features(team_a_stats['game_log']).items()})
        if 'game_log' in team_b_stats:
            features.update({f'away_{k}': v for k, v in self.calculate_momentum_features(team_b_stats['game_log']).items()})
        
        # Matchup
        features.update(self.calculate_matchup_features(team_a_stats, team_b_stats))
        
        # Betting
        features.update(self.calculate_betting_features({}, odds_data))
        
        # Situational
        features.update(self.calculate_situational_features(team_a_stats, game_context))
        
        return features

# Export singleton
feature_service = FeatureEngineeringService()
