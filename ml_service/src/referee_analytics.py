"""
Referee Analytics
Analyzes referee tendencies and their impact on game totals, fouls, pace
"""

import numpy as np
import pandas as pd
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class RefereeAnalytics:
    def __init__(self):
        self.referee_stats = {}
        
    def analyze_referee_tendencies(self, referee_id, historical_games):
        """
        Analyze referee's historical tendencies
        """
        logger.info(f"Analyzing referee {referee_id} tendencies")
        
        if not historical_games:
            return self._default_referee_profile(referee_id)
        
        # Calculate key metrics
        total_games = len(historical_games)
        
        # Foul calling rate
        avg_fouls = np.mean([g['total_fouls'] for g in historical_games])
        avg_fouls_per_team = avg_fouls / 2
        
        # Total scoring
        avg_total = np.mean([g['total_points'] for g in historical_games])
        
        # Over/Under record
        games_with_line = [g for g in historical_games if 'total_line' in g]
        if games_with_line:
            overs = sum(1 for g in games_with_line if g['total_points'] > g['total_line'])
            over_pct = (overs / len(games_with_line)) * 100
        else:
            over_pct = 50.0
        
        # Technical fouls
        avg_techs = np.mean([g.get('technical_fouls', 0) for g in historical_games])
        
        # Pace (possessions per game)
        avg_pace = np.mean([g.get('pace', 100) for g in historical_games])
        
        # Home team foul differential
        home_foul_diff = np.mean([
            g['home_fouls'] - g['away_fouls']
            for g in historical_games
            if 'home_fouls' in g and 'away_fouls' in g
        ])
        
        # Home/away bias detection
        home_bias = 'pro_home' if home_foul_diff < -1 else 'pro_away' if home_foul_diff > 1 else 'neutral'
        
        # Categorize referee style
        style = self._categorize_referee_style(avg_fouls, avg_techs, avg_pace)
        
        # Calculate consistency
        foul_std = np.std([g['total_fouls'] for g in historical_games])
        consistency = 'high' if foul_std < 3 else 'medium' if foul_std < 5 else 'low'
        
        profile = {
            'referee_id': referee_id,
            'games_analyzed': total_games,
            'avg_fouls_per_game': avg_fouls,
            'avg_fouls_per_team': avg_fouls_per_team,
            'avg_total_points': avg_total,
            'over_under_pct': over_pct,
            'avg_technical_fouls': avg_techs,
            'avg_pace': avg_pace,
            'home_foul_differential': home_foul_diff,
            'home_bias': home_bias,
            'style': style,
            'consistency': consistency,
            'foul_std_dev': foul_std,
            'reputation': self._get_referee_reputation(style, avg_techs)
        }
        
        self.referee_stats[referee_id] = profile
        
        return profile
    
    def predict_game_impact(self, referee_id, team1_style, team2_style):
        """
        Predict how referee will impact specific game
        """
        logger.info(f"Predicting referee {referee_id} impact on game")
        
        ref_profile = self.referee_stats.get(referee_id)
        
        if not ref_profile:
            return self._default_game_impact()
        
        # Base predictions
        predicted_fouls = ref_profile['avg_fouls_per_game']
        predicted_total = ref_profile['avg_total_points']
        predicted_pace = ref_profile['avg_pace']
        
        # Adjust for team styles
        # Aggressive teams draw more fouls with whistle-happy refs
        team1_aggression = team1_style.get('drives_per_game', 30)
        team2_aggression = team2_style.get('drives_per_game', 30)
        avg_aggression = (team1_aggression + team2_aggression) / 2
        
        if ref_profile['style'] == 'whistle_happy' and avg_aggression > 35:
            predicted_fouls += 4
            predicted_total -= 3  # More fouls = slower game
        elif ref_profile['style'] == 'lets_them_play' and avg_aggression > 35:
            predicted_fouls -= 2
            predicted_total += 2  # Less whistles = faster pace
        
        # Adjust for team pace preference
        team_avg_pace = (team1_style.get('pace', 100) + team2_style.get('pace', 100)) / 2
        pace_diff = team_avg_pace - 100
        predicted_pace += pace_diff * 0.5
        
        # Total prediction adjustments
        if predicted_pace > 102:
            predicted_total += 3
        elif predicted_pace < 98:
            predicted_total -= 3
        
        # Over/Under recommendation
        if ref_profile['over_under_pct'] > 55:
            total_rec = 'over'
            confidence = 'medium' if ref_profile['over_under_pct'] > 60 else 'low'
        elif ref_profile['over_under_pct'] < 45:
            total_rec = 'under'
            confidence = 'medium' if ref_profile['over_under_pct'] < 40 else 'low'
        else:
            total_rec = 'neutral'
            confidence = 'low'
        
        return {
            'referee_id': referee_id,
            'predicted_fouls': predicted_fouls,
            'predicted_total': predicted_total,
            'predicted_pace': predicted_pace,
            'total_recommendation': total_rec,
            'confidence': confidence,
            'reasoning': self._generate_reasoning(ref_profile, total_rec),
            'key_factors': [
                f"{ref_profile['style']} referee",
                f"Averages {ref_profile['avg_fouls_per_game']:.1f} fouls/game",
                f"{ref_profile['over_under_pct']:.0f}% over rate"
            ]
        }
    
    def compare_referees(self, referee_ids):
        """
        Compare multiple referees side-by-side
        """
        comparison = []
        
        for ref_id in referee_ids:
            if ref_id in self.referee_stats:
                profile = self.referee_stats[ref_id]
                comparison.append({
                    'referee_id': ref_id,
                    'style': profile['style'],
                    'avg_fouls': profile['avg_fouls_per_game'],
                    'over_pct': profile['over_under_pct'],
                    'avg_total': profile['avg_total_points'],
                    'consistency': profile['consistency']
                })
        
        return sorted(comparison, key=lambda x: x['avg_fouls'], reverse=True)
    
    def identify_referee_edges(self, referee_id, market_total):
        """
        Identify betting edges based on referee assignment
        """
        ref_profile = self.referee_stats.get(referee_id)
        
        if not ref_profile:
            return []
        
        edges = []
        
        # Total edge
        expected_total = ref_profile['avg_total_points']
        total_diff = expected_total - market_total
        
        if abs(total_diff) >= 3:
            edges.append({
                'type': 'total',
                'bet': 'over' if total_diff > 0 else 'under',
                'edge': abs(total_diff),
                'reasoning': f"Referee averages {expected_total:.1f} total vs market {market_total}",
                'confidence': 'high' if abs(total_diff) >= 5 else 'medium'
            })
        
        # Over/Under bias edge
        if ref_profile['over_under_pct'] > 57:
            edges.append({
                'type': 'total',
                'bet': 'over',
                'edge': ref_profile['over_under_pct'] - 52.38,  # Break-even with -110 juice
                'reasoning': f"{ref_profile['over_under_pct']:.1f}% historical over rate",
                'confidence': 'medium' if ref_profile['over_under_pct'] > 60 else 'low'
            })
        elif ref_profile['over_under_pct'] < 43:
            edges.append({
                'type': 'total',
                'bet': 'under',
                'edge': 52.38 - ref_profile['over_under_pct'],
                'reasoning': f"{ref_profile['over_under_pct']:.1f}% historical over rate (under tendency)",
                'confidence': 'medium' if ref_profile['over_under_pct'] < 40 else 'low'
            })
        
        # Foul trouble props
        if ref_profile['style'] == 'whistle_happy':
            edges.append({
                'type': 'prop',
                'bet': 'player_fouls_over',
                'edge': 2.0,
                'reasoning': f"Whistle-happy ref averages {ref_profile['avg_fouls_per_game']:.1f} fouls/game",
                'confidence': 'medium'
            })
        
        return edges
    
    def analyze_referee_crew(self, crew_ids):
        """
        Analyze entire referee crew for a game
        """
        logger.info(f"Analyzing referee crew: {crew_ids}")
        
        crew_profiles = [
            self.referee_stats.get(ref_id)
            for ref_id in crew_ids
            if ref_id in self.referee_stats
        ]
        
        if not crew_profiles:
            return None
        
        # Aggregate crew tendencies
        avg_fouls = np.mean([p['avg_fouls_per_game'] for p in crew_profiles])
        avg_total = np.mean([p['avg_total_points'] for p in crew_profiles])
        avg_pace = np.mean([p['avg_pace'] for p in crew_profiles])
        
        # Crew style (most common)
        styles = [p['style'] for p in crew_profiles]
        crew_style = max(set(styles), key=styles.count)
        
        return {
            'crew_size': len(crew_profiles),
            'crew_avg_fouls': avg_fouls,
            'crew_avg_total': avg_total,
            'crew_avg_pace': avg_pace,
            'crew_style': crew_style,
            'individual_profiles': crew_profiles
        }
    
    def _categorize_referee_style(self, avg_fouls, avg_techs, avg_pace):
        """
        Categorize referee style
        """
        if avg_fouls > 48:
            return 'whistle_happy'
        elif avg_fouls < 42:
            return 'lets_them_play'
        elif avg_techs > 1.0:
            return 'strict'
        elif avg_pace > 102:
            return 'fast_paced'
        else:
            return 'balanced'
    
    def _get_referee_reputation(self, style, avg_techs):
        """
        Get referee reputation/nickname
        """
        reputations = {
            'whistle_happy': 'Whistle Happy',
            'lets_them_play': 'Lets Them Play',
            'strict': 'Strict' if avg_techs > 1.5 else 'By The Book',
            'fast_paced': 'Fast Paced',
            'balanced': 'Balanced'
        }
        return reputations.get(style, 'Unknown')
    
    def _generate_reasoning(self, ref_profile, recommendation):
        """
        Generate reasoning for recommendation
        """
        if recommendation == 'over':
            return f"Referee has {ref_profile['over_under_pct']:.0f}% over rate and averages {ref_profile['avg_total_points']:.1f} points"
        elif recommendation == 'under':
            return f"Referee has {ref_profile['over_under_pct']:.0f}% over rate (favors under) and is {ref_profile['style']}"
        else:
            return "Referee impact is neutral based on historical data"
    
    def _default_referee_profile(self, referee_id):
        """
        Default profile for unknown referee
        """
        return {
            'referee_id': referee_id,
            'games_analyzed': 0,
            'avg_fouls_per_game': 45.0,
            'avg_fouls_per_team': 22.5,
            'avg_total_points': 220.0,
            'over_under_pct': 50.0,
            'avg_technical_fouls': 0.5,
            'avg_pace': 100.0,
            'home_foul_differential': 0.0,
            'home_bias': 'unknown',
            'style': 'unknown',
            'consistency': 'unknown',
            'reputation': 'Unknown'
        }
    
    def _default_game_impact(self):
        """
        Default game impact prediction
        """
        return {
            'predicted_fouls': 45.0,
            'predicted_total': 220.0,
            'predicted_pace': 100.0,
            'total_recommendation': 'neutral',
            'confidence': 'low',
            'reasoning': 'Insufficient referee data',
            'key_factors': ['Unknown referee tendencies']
        }

# Export singleton
referee_analytics = RefereeAnalytics()
