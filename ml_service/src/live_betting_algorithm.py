"""
Live Betting Algorithm
Identifies valuable live betting opportunities during games
Monitors score, pace, momentum, and player performance in real-time
"""

import numpy as np
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class LiveBettingAlgorithm:
    def __init__(self):
        self.game_states = {}
        self.alerts_sent = {}
        
    def analyze_live_opportunity(self, game_id, game_state, pregame_prediction):
        """
        Analyze current game state for live betting opportunities
        
        Args:
            game_id: Unique game identifier
            game_state: {
                'quarter': 1-4,
                'time_remaining': seconds,
                'home_score': int,
                'away_score': int,
                'pace': possessions per 48 min,
                'home_fouls': int,
                'away_fouls': int,
                'momentum': -10 to 10,
                'key_injuries': []
            }
            pregame_prediction: Original prediction before game
        """
        logger.info(f"Analyzing live betting for game {game_id}")
        
        # Store/update game state
        if game_id not in self.game_states:
            self.game_states[game_id] = []
        self.game_states[game_id].append(game_state)
        
        opportunities = []
        
        # Check various opportunity types
        opportunities.extend(self._check_total_opportunities(game_id, game_state, pregame_prediction))
        opportunities.extend(self._check_spread_opportunities(game_id, game_state, pregame_prediction))
        opportunities.extend(self._check_momentum_opportunities(game_id, game_state))
        opportunities.extend(self._check_pace_opportunities(game_id, game_state, pregame_prediction))
        opportunities.extend(self._check_regression_opportunities(game_id, game_state))
        
        # Score and prioritize opportunities
        for opp in opportunities:
            opp['score'] = self._calculate_opportunity_score(opp)
        
        # Sort by score
        opportunities.sort(key=lambda x: x['score'], reverse=True)
        
        return opportunities
    
    def _check_total_opportunities(self, game_id, game_state, pregame_pred):
        """
        Identify total (over/under) opportunities
        """
        opportunities = []
        
        quarter = game_state['quarter']
        home_score = game_state['home_score']
        away_score = game_state['away_score']
        current_total = home_score + away_score
        
        # Calculate projected total based on current pace
        time_elapsed = (quarter - 1) * 12 + (12 - game_state['time_remaining'] / 60)
        time_remaining_total = 48 - time_elapsed
        
        points_per_minute = current_total / time_elapsed if time_elapsed > 0 else 0
        projected_total = current_total + (points_per_minute * time_remaining_total)
        
        # Compare to pregame prediction
        pregame_total = pregame_pred.get('predicted_total', 220)
        total_diff = projected_total - pregame_total
        
        # Check for significant deviation (>5 points)
        if abs(total_diff) > 5:
            # Slow start - consider under
            if total_diff < -5 and quarter <= 2:
                opportunities.append({
                    'type': 'total',
                    'bet': 'under',
                    'reasoning': f"Slow start - pace projecting {projected_total:.1f} vs pregame {pregame_total:.1f}",
                    'edge': abs(total_diff),
                    'confidence': 'medium',
                    'timing': 'early' if quarter <= 2 else 'late',
                    'projected_value': projected_total,
                    'pregame_value': pregame_total
                })
            
            # Hot start - consider over
            elif total_diff > 5 and quarter <= 2:
                opportunities.append({
                    'type': 'total',
                    'bet': 'over',
                    'reasoning': f"Hot start - pace projecting {projected_total:.1f} vs pregame {pregame_total:.1f}",
                    'edge': abs(total_diff),
                    'confidence': 'medium',
                    'timing': 'early',
                    'projected_value': projected_total,
                    'pregame_value': pregame_total
                })
        
        # Check shooting variance
        if quarter >= 2:
            # If current scoring is unsustainable (hot/cold shooting)
            pace = game_state.get('pace', 100)
            expected_points = (pace * time_elapsed / 48) * 1.1  # Rough estimate
            
            variance = current_total - expected_points
            
            if variance > 15:  # Unsustainably hot
                opportunities.append({
                    'type': 'total',
                    'bet': 'under',
                    'reasoning': f"Unsustainably hot shooting - regression likely",
                    'edge': variance * 0.5,
                    'confidence': 'high',
                    'timing': 'mid',
                    'regression_candidate': True
                })
        
        return opportunities
    
    def _check_spread_opportunities(self, game_id, game_state, pregame_pred):
        """
        Identify spread betting opportunities
        """
        opportunities = []
        
        quarter = game_state['quarter']
        score_diff = game_state['home_score'] - game_state['away_score']
        
        pregame_spread = pregame_pred.get('predicted_spread', 0)
        
        # Check if underdog is covering/competitive
        if quarter >= 2:
            spread_diff = abs(score_diff) - abs(pregame_spread)
            
            # Underdog outperforming expectations
            if pregame_spread < 0 and score_diff > pregame_spread + 5:
                opportunities.append({
                    'type': 'spread',
                    'bet': 'home',
                    'reasoning': f"Home underdog outperforming - currently {score_diff:+d} vs expected {pregame_spread:+.1f}",
                    'edge': spread_diff,
                    'confidence': 'medium',
                    'timing': 'mid' if quarter <= 3 else 'late'
                })
            elif pregame_spread > 0 and score_diff < pregame_spread - 5:
                opportunities.append({
                    'type': 'spread',
                    'bet': 'away',
                    'reasoning': f"Away underdog outperforming - currently {score_diff:+d} vs expected {pregame_spread:+.1f}",
                    'edge': spread_diff,
                    'confidence': 'medium',
                    'timing': 'mid' if quarter <= 3 else 'late'
                })
        
        # Check for comeback potential (3rd quarter)
        if quarter == 3 and abs(score_diff) >= 10 and abs(score_diff) <= 18:
            # Teams often make runs in 3rd quarter
            losing_team = 'away' if score_diff > 0 else 'home'
            opportunities.append({
                'type': 'spread',
                'bet': losing_team,
                'reasoning': f"Comeback potential - {abs(score_diff)} point deficit entering critical quarter",
                'edge': 3.0,
                'confidence': 'low',
                'timing': 'mid',
                'comeback_play': True
            })
        
        return opportunities
    
    def _check_momentum_opportunities(self, game_id, game_state):
        """
        Identify momentum-based opportunities
        """
        opportunities = []
        
        momentum = game_state.get('momentum', 0)
        quarter = game_state['quarter']
        
        # Strong momentum swings
        if abs(momentum) >= 7:
            # Bet against extreme momentum (regression)
            team_with_momentum = 'home' if momentum > 0 else 'away'
            team_against_momentum = 'away' if momentum > 0 else 'home'
            
            if quarter >= 2:
                opportunities.append({
                    'type': 'spread',
                    'bet': team_against_momentum,
                    'reasoning': f"Extreme momentum ({momentum:+d}) likely to regress - fade the run",
                    'edge': abs(momentum) * 0.5,
                    'confidence': 'medium',
                    'timing': 'mid',
                    'momentum_fade': True
                })
        
        return opportunities
    
    def _check_pace_opportunities(self, game_id, game_state, pregame_pred):
        """
        Identify pace-based opportunities
        """
        opportunities = []
        
        current_pace = game_state.get('pace', 100)
        pregame_pace = pregame_pred.get('expected_pace', 100)
        quarter = game_state['quarter']
        
        pace_diff = current_pace - pregame_pace
        
        # Significant pace deviation
        if abs(pace_diff) > 5 and quarter >= 2:
            if pace_diff > 5:
                opportunities.append({
                    'type': 'total',
                    'bet': 'over',
                    'reasoning': f"Pace {current_pace:.1f} significantly faster than expected {pregame_pace:.1f}",
                    'edge': pace_diff * 0.8,
                    'confidence': 'medium',
                    'timing': 'mid'
                })
            else:
                opportunities.append({
                    'type': 'total',
                    'bet': 'under',
                    'reasoning': f"Pace {current_pace:.1f} significantly slower than expected {pregame_pace:.1f}",
                    'edge': abs(pace_diff) * 0.8,
                    'confidence': 'medium',
                    'timing': 'mid'
                })
        
        return opportunities
    
    def _check_regression_opportunities(self, game_id, game_state):
        """
        Identify mean regression opportunities
        """
        opportunities = []
        
        quarter = game_state['quarter']
        
        # Only consider after enough data (2nd quarter+)
        if quarter < 2:
            return opportunities
        
        # Check if a team is shooting unsustainably well/poorly
        # Would need actual shooting percentages in production
        # For now, use score variance as proxy
        
        home_score = game_state['home_score']
        away_score = game_state['away_score']
        
        # If score is very lopsided early
        score_diff = abs(home_score - away_score)
        
        if score_diff >= 15 and quarter == 2:
            losing_team = 'away' if home_score > away_score else 'home'
            opportunities.append({
                'type': 'spread',
                'bet': losing_team,
                'reasoning': f"Large deficit ({score_diff} pts) likely to regress - teams rarely maintain such leads",
                'edge': score_diff * 0.3,
                'confidence': 'medium',
                'timing': 'mid',
                'regression_play': True
            })
        
        return opportunities
    
    def _calculate_opportunity_score(self, opportunity):
        """
        Calculate priority score for opportunity (0-100)
        """
        score = 0
        
        # Base score from edge
        score += min(opportunity.get('edge', 0) * 5, 40)
        
        # Confidence boost
        confidence_scores = {'high': 30, 'medium': 20, 'low': 10}
        score += confidence_scores.get(opportunity.get('confidence', 'low'), 10)
        
        # Timing boost (early game opportunities more valuable)
        timing_scores = {'early': 15, 'mid': 10, 'late': 5}
        score += timing_scores.get(opportunity.get('timing', 'mid'), 10)
        
        # Special play types
        if opportunity.get('regression_play'):
            score += 10
        if opportunity.get('momentum_fade'):
            score += 5
        
        return min(score, 100)
    
    def monitor_game(self, game_id, check_interval=60):
        """
        Continuously monitor game for opportunities
        Returns high-priority alerts
        """
        if game_id not in self.alerts_sent:
            self.alerts_sent[game_id] = set()
        
        # Would integrate with live game feed in production
        # For now, return framework
        
        return {
            'game_id': game_id,
            'monitoring': True,
            'check_interval_seconds': check_interval,
            'alerts_sent': len(self.alerts_sent[game_id])
        }
    
    def get_game_history(self, game_id):
        """
        Get historical game state snapshots
        """
        return self.game_states.get(game_id, [])

# Export singleton
live_betting_algo = LiveBettingAlgorithm()
