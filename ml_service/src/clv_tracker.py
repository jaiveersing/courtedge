"""
Closing Line Value (CLV) Tracker
Tracks and analyzes betting performance relative to closing lines
CLV is a key metric for evaluating betting skill
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class CLVTracker:
    def __init__(self):
        self.bets = []
        
    def record_bet(self, bet_data):
        """
        Record a bet with opening and closing lines
        
        Args:
            bet_data: {
                'bet_id': unique identifier,
                'user_id': user who placed bet,
                'game_id': game identifier,
                'bet_type': 'spread'|'moneyline'|'total',
                'selection': team/over/under,
                'stake': amount wagered,
                'odds_taken': odds when bet was placed,
                'closing_odds': odds at game start,
                'opening_odds': odds when market opened,
                'timestamp': when bet was placed,
                'result': 'win'|'loss'|'push' (after game)
            }
        """
        logger.info(f"Recording bet {bet_data['bet_id']} for CLV tracking")
        
        # Calculate CLV
        clv = self._calculate_clv(
            bet_data['odds_taken'],
            bet_data['closing_odds']
        )
        
        bet_data['clv'] = clv
        bet_data['clv_percentage'] = clv['percentage']
        bet_data['beat_closing'] = clv['beat_closing']
        
        self.bets.append(bet_data)
        
        return bet_data
    
    def _calculate_clv(self, odds_taken, closing_odds):
        """
        Calculate Closing Line Value
        """
        # Convert American odds to implied probability
        prob_taken = self._odds_to_probability(odds_taken)
        prob_closing = self._odds_to_probability(closing_odds)
        
        # CLV = (Closing Probability - Probability Taken) / Probability Taken
        clv_percentage = ((prob_closing - prob_taken) / prob_taken) * 100
        
        # Beat closing line if we got better odds
        beat_closing = prob_closing > prob_taken
        
        # Expected value difference
        ev_difference = prob_closing - prob_taken
        
        return {
            'percentage': clv_percentage,
            'beat_closing': beat_closing,
            'prob_taken': prob_taken,
            'prob_closing': prob_closing,
            'ev_difference': ev_difference
        }
    
    def _odds_to_probability(self, american_odds):
        """
        Convert American odds to implied probability
        """
        if american_odds > 0:
            return 100 / (american_odds + 100)
        else:
            return abs(american_odds) / (abs(american_odds) + 100)
    
    def _probability_to_odds(self, probability):
        """
        Convert probability to American odds
        """
        if probability >= 0.5:
            return -100 * probability / (1 - probability)
        else:
            return 100 * (1 - probability) / probability
    
    def calculate_user_clv(self, user_id, days_back=30):
        """
        Calculate CLV statistics for a user
        """
        cutoff_date = datetime.now() - timedelta(days=days_back)
        
        user_bets = [
            bet for bet in self.bets
            if bet['user_id'] == user_id and bet['timestamp'] > cutoff_date
        ]
        
        if not user_bets:
            return None
        
        # Overall CLV
        avg_clv = np.mean([bet['clv_percentage'] for bet in user_bets])
        
        # Percentage of bets that beat closing
        beat_closing_pct = (
            sum(1 for bet in user_bets if bet['beat_closing']) / len(user_bets)
        ) * 100
        
        # CLV by bet type
        by_type = {}
        for bet_type in ['spread', 'moneyline', 'total']:
            type_bets = [b for b in user_bets if b['bet_type'] == bet_type]
            if type_bets:
                by_type[bet_type] = {
                    'count': len(type_bets),
                    'avg_clv': np.mean([b['clv_percentage'] for b in type_bets]),
                    'beat_closing_pct': (
                        sum(1 for b in type_bets if b['beat_closing']) / len(type_bets)
                    ) * 100
                }
        
        # ROI correlation with CLV
        settled_bets = [b for b in user_bets if 'result' in b]
        
        roi = 0
        if settled_bets:
            total_staked = sum(b['stake'] for b in settled_bets)
            total_profit = sum(
                self._calculate_profit(b['stake'], b['odds_taken'], b['result'])
                for b in settled_bets
            )
            roi = (total_profit / total_staked) * 100 if total_staked > 0 else 0
        
        return {
            'user_id': user_id,
            'period_days': days_back,
            'total_bets': len(user_bets),
            'avg_clv_percentage': avg_clv,
            'beat_closing_percentage': beat_closing_pct,
            'clv_by_type': by_type,
            'roi': roi,
            'sharp_rating': self._calculate_sharp_rating(avg_clv, beat_closing_pct),
            'best_bet': max(user_bets, key=lambda x: x['clv_percentage']),
            'worst_bet': min(user_bets, key=lambda x: x['clv_percentage'])
        }
    
    def _calculate_profit(self, stake, odds, result):
        """
        Calculate profit/loss from a bet
        """
        if result == 'push':
            return 0
        elif result == 'win':
            if odds > 0:
                return stake * (odds / 100)
            else:
                return stake * (100 / abs(odds))
        else:  # loss
            return -stake
    
    def _calculate_sharp_rating(self, avg_clv, beat_closing_pct):
        """
        Calculate sharp bettor rating (0-100)
        Based on CLV and closing line beat percentage
        """
        # Positive CLV is good, >2% is excellent
        clv_score = min(avg_clv / 2 * 50, 50)  # Max 50 points from CLV
        
        # >55% beat closing is good
        beat_score = (beat_closing_pct - 50) * 2  # Max 50 points from beat %
        
        sharp_rating = max(0, min(100, clv_score + beat_score))
        
        if sharp_rating >= 80:
            rating_label = 'Elite'
        elif sharp_rating >= 60:
            rating_label = 'Sharp'
        elif sharp_rating >= 40:
            rating_label = 'Intermediate'
        else:
            rating_label = 'Recreational'
        
        return {
            'score': sharp_rating,
            'label': rating_label
        }
    
    def analyze_clv_by_timing(self, user_id):
        """
        Analyze CLV based on when bets are placed relative to game time
        """
        user_bets = [bet for bet in self.bets if bet['user_id'] == user_id]
        
        # Categorize by timing
        early_bets = []  # >24 hours before game
        late_bets = []   # <2 hours before game
        mid_bets = []    # 2-24 hours before game
        
        for bet in user_bets:
            # Would calculate time difference in production
            # For now, simulate categorization
            hours_before = np.random.uniform(0, 48)
            
            if hours_before > 24:
                early_bets.append(bet)
            elif hours_before < 2:
                late_bets.append(bet)
            else:
                mid_bets.append(bet)
        
        analysis = {}
        
        for category, bets in [('early', early_bets), ('mid', mid_bets), ('late', late_bets)]:
            if bets:
                analysis[category] = {
                    'count': len(bets),
                    'avg_clv': np.mean([b['clv_percentage'] for b in bets]),
                    'beat_closing_pct': (
                        sum(1 for b in bets if b['beat_closing']) / len(bets)
                    ) * 100
                }
        
        return analysis
    
    def compare_to_market(self, user_id, market_avg_clv=-1.5):
        """
        Compare user's CLV to market average
        Market average is typically negative (vig)
        """
        user_stats = self.calculate_user_clv(user_id)
        
        if not user_stats:
            return None
        
        user_clv = user_stats['avg_clv_percentage']
        
        # Difference from market
        edge_vs_market = user_clv - market_avg_clv
        
        # Percentile estimate
        # Assuming normal distribution with std of 2%
        from scipy.stats import norm
        percentile = norm.cdf(edge_vs_market / 2) * 100
        
        return {
            'user_clv': user_clv,
            'market_avg_clv': market_avg_clv,
            'edge_vs_market': edge_vs_market,
            'percentile': percentile,
            'interpretation': self._interpret_clv_comparison(edge_vs_market, percentile)
        }
    
    def _interpret_clv_comparison(self, edge, percentile):
        """
        Interpret CLV comparison results
        """
        if edge > 2:
            return {
                'rating': 'Exceptional',
                'description': f'Your CLV is {edge:.1f}% better than market average. You\'re beating the closing line consistently and finding value.',
                'percentile_label': f'Top {100 - percentile:.1f}% of bettors'
            }
        elif edge > 0:
            return {
                'rating': 'Above Average',
                'description': f'Your CLV is {edge:.1f}% better than market average. You\'re finding value more often than not.',
                'percentile_label': f'{percentile:.0f}th percentile'
            }
        elif edge > -1:
            return {
                'rating': 'Average',
                'description': f'Your CLV is {abs(edge):.1f}% below market average. You\'re roughly break-even with the market.',
                'percentile_label': f'{percentile:.0f}th percentile'
            }
        else:
            return {
                'rating': 'Below Average',
                'description': f'Your CLV is {abs(edge):.1f}% worse than market average. Consider being more selective with bets.',
                'percentile_label': f'{percentile:.0f}th percentile'
            }
    
    def get_leaderboard(self, limit=100, min_bets=50):
        """
        Get CLV leaderboard
        """
        # Get unique users
        user_ids = set(bet['user_id'] for bet in self.bets)
        
        leaderboard = []
        
        for user_id in user_ids:
            stats = self.calculate_user_clv(user_id, days_back=90)
            
            if stats and stats['total_bets'] >= min_bets:
                leaderboard.append({
                    'user_id': user_id,
                    'avg_clv': stats['avg_clv_percentage'],
                    'beat_closing_pct': stats['beat_closing_percentage'],
                    'total_bets': stats['total_bets'],
                    'roi': stats['roi'],
                    'sharp_rating': stats['sharp_rating']['score']
                })
        
        # Sort by CLV
        leaderboard.sort(key=lambda x: x['avg_clv'], reverse=True)
        
        return leaderboard[:limit]

# Export singleton
clv_tracker = CLVTracker()
