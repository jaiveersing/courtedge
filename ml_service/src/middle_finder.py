"""
Middle Finder
Identifies middling opportunities where bettor can win both sides
Example: Bet Team +7 at Book A, then Team -4.5 at Book B
If final margin is 5 or 6, both bets win (middle hit)
"""

import numpy as np
from itertools import combinations
import logging

logger = logging.getLogger(__name__)

class MiddleFinder:
    def __init__(self):
        self.middle_opportunities = []
        
    def find_middle_opportunities(self, game_odds_by_book, min_middle=2.0):
        """
        Find middling opportunities across sportsbooks
        
        Args:
            game_odds_by_book: {
                'game_id': 'ABC123',
                'home_team': 'LAL',
                'away_team': 'GSW',
                'books': [
                    {'book': 'fanduel', 'spread': 5.5, 'over': 220.5, ...},
                    {'book': 'draftkings', 'spread': 4.5, 'over': 221.5, ...}
                ]
            }
            min_middle: Minimum middle size (in points)
        """
        logger.info(f"Finding middle opportunities for game {game_odds_by_book.get('game_id')}")
        
        middles = []
        
        books = game_odds_by_book.get('books', [])
        
        if len(books) < 2:
            return middles
        
        # Check spread middles
        spread_middles = self._find_spread_middles(books, min_middle)
        middles.extend(spread_middles)
        
        # Check total middles
        total_middles = self._find_total_middles(books, min_middle)
        middles.extend(total_middles)
        
        # Calculate profitability for each middle
        for middle in middles:
            middle['profitability'] = self._calculate_middle_profitability(middle)
            middle['recommendation'] = self._generate_middle_recommendation(middle)
        
        # Sort by expected value
        middles.sort(key=lambda x: x['profitability']['ev'], reverse=True)
        
        return middles
    
    def _find_spread_middles(self, books, min_middle):
        """
        Find spread middle opportunities
        """
        middles = []
        
        # Get all spreads
        spreads = [
            {
                'book': book['book'],
                'spread': book.get('spread'),
                'home_odds': book.get('home_spread_odds', -110),
                'away_odds': book.get('away_spread_odds', -110)
            }
            for book in books
            if book.get('spread') is not None
        ]
        
        # Check all combinations
        for book1, book2 in combinations(spreads, 2):
            spread1 = book1['spread']
            spread2 = book2['spread']
            
            # Calculate middle size
            middle_size = abs(spread1 - spread2)
            
            if middle_size >= min_middle:
                # Determine which side to bet at each book
                # Bet opposite sides to create middle
                
                if spread1 > spread2:
                    # Book 1 has higher spread (home favored less)
                    # Bet home at Book 1, away at Book 2
                    bet1_side = 'home'
                    bet1_spread = spread1
                    bet1_odds = book1['home_odds']
                    
                    bet2_side = 'away'
                    bet2_spread = spread2
                    bet2_odds = book2['away_odds']
                    
                    middle_range = (spread2, spread1)
                else:
                    # Book 2 has higher spread
                    bet1_side = 'away'
                    bet1_spread = spread1
                    bet1_odds = book1['away_odds']
                    
                    bet2_side = 'home'
                    bet2_spread = spread2
                    bet2_odds = book2['home_odds']
                    
                    middle_range = (spread1, spread2)
                
                # Calculate middle hit probability
                hit_probability = self._estimate_middle_probability(middle_size, 'spread')
                
                middles.append({
                    'type': 'spread',
                    'bet1': {
                        'book': book1['book'],
                        'side': bet1_side,
                        'line': bet1_spread,
                        'odds': bet1_odds
                    },
                    'bet2': {
                        'book': book2['book'],
                        'side': bet2_side,
                        'line': bet2_spread,
                        'odds': bet2_odds
                    },
                    'middle_size': middle_size,
                    'middle_range': middle_range,
                    'hit_probability': hit_probability,
                    'risk_level': 'low' if middle_size >= 4 else 'medium'
                })
        
        return middles
    
    def _find_total_middles(self, books, min_middle):
        """
        Find total (over/under) middle opportunities
        """
        middles = []
        
        # Get all totals
        totals = [
            {
                'book': book['book'],
                'total': book.get('total'),
                'over_odds': book.get('over_odds', -110),
                'under_odds': book.get('under_odds', -110)
            }
            for book in books
            if book.get('total') is not None
        ]
        
        # Check all combinations
        for book1, book2 in combinations(totals, 2):
            total1 = book1['total']
            total2 = book2['total']
            
            # Calculate middle size
            middle_size = abs(total1 - total2)
            
            if middle_size >= min_middle:
                # Bet over on lower total, under on higher total
                if total1 < total2:
                    bet1_side = 'over'
                    bet1_total = total1
                    bet1_odds = book1['over_odds']
                    
                    bet2_side = 'under'
                    bet2_total = total2
                    bet2_odds = book2['under_odds']
                    
                    middle_range = (total1, total2)
                else:
                    bet1_side = 'under'
                    bet1_total = total1
                    bet1_odds = book1['under_odds']
                    
                    bet2_side = 'over'
                    bet2_total = total2
                    bet2_odds = book2['over_odds']
                    
                    middle_range = (total2, total1)
                
                # Calculate middle hit probability
                hit_probability = self._estimate_middle_probability(middle_size, 'total')
                
                middles.append({
                    'type': 'total',
                    'bet1': {
                        'book': book1['book'],
                        'side': bet1_side,
                        'line': bet1_total,
                        'odds': bet1_odds
                    },
                    'bet2': {
                        'book': book2['book'],
                        'side': bet2_side,
                        'line': bet2_total,
                        'odds': bet2_odds
                    },
                    'middle_size': middle_size,
                    'middle_range': middle_range,
                    'hit_probability': hit_probability,
                    'risk_level': 'low' if middle_size >= 5 else 'medium'
                })
        
        return middles
    
    def _estimate_middle_probability(self, middle_size, bet_type):
        """
        Estimate probability of hitting the middle
        """
        if bet_type == 'spread':
            # NBA spread middles
            # Empirical probabilities based on historical data
            if middle_size >= 7:
                return 0.12  # 12% chance
            elif middle_size >= 5:
                return 0.08
            elif middle_size >= 3:
                return 0.05
            else:
                return 0.03
        
        elif bet_type == 'total':
            # NBA total middles
            if middle_size >= 8:
                return 0.10
            elif middle_size >= 5:
                return 0.06
            elif middle_size >= 3:
                return 0.04
            else:
                return 0.02
        
        return 0.05  # Default
    
    def _calculate_middle_profitability(self, middle):
        """
        Calculate expected value and outcomes for a middle
        """
        bet1_odds = middle['bet1']['odds']
        bet2_odds = middle['bet2']['odds']
        
        # Convert to decimal odds
        bet1_decimal = self._american_to_decimal(bet1_odds)
        bet2_decimal = self._american_to_decimal(bet2_odds)
        
        # Assume $100 stake on each bet
        stake = 100
        
        # Outcome 1: Middle hits (both bets win)
        middle_hit_profit = (stake * bet1_decimal) + (stake * bet2_decimal) - (2 * stake)
        
        # Outcome 2: Only bet1 wins
        bet1_wins_profit = (stake * bet1_decimal) - (2 * stake)
        
        # Outcome 3: Only bet2 wins
        bet2_wins_profit = (stake * bet2_decimal) - (2 * stake)
        
        # Outcome 4: Both lose (outside middle range on wrong side)
        both_lose_profit = -(2 * stake)
        
        # Probabilities
        p_middle_hit = middle['hit_probability']
        
        # Estimate other probabilities
        # This is simplified - would use historical distribution in production
        p_bet1_only = 0.45 - (p_middle_hit / 2)
        p_bet2_only = 0.45 - (p_middle_hit / 2)
        p_both_lose = 1 - p_middle_hit - p_bet1_only - p_bet2_only
        
        # Expected value
        ev = (
            p_middle_hit * middle_hit_profit +
            p_bet1_only * bet1_wins_profit +
            p_bet2_only * bet2_wins_profit +
            p_both_lose * both_lose_profit
        )
        
        # ROI
        roi = (ev / (2 * stake)) * 100
        
        return {
            'ev': ev,
            'roi': roi,
            'scenarios': {
                'middle_hit': {
                    'probability': p_middle_hit,
                    'profit': middle_hit_profit
                },
                'bet1_only': {
                    'probability': p_bet1_only,
                    'profit': bet1_wins_profit
                },
                'bet2_only': {
                    'probability': p_bet2_only,
                    'profit': bet2_wins_profit
                },
                'both_lose': {
                    'probability': p_both_lose,
                    'profit': both_lose_profit
                }
            }
        }
    
    def _generate_middle_recommendation(self, middle):
        """
        Generate recommendation for middle opportunity
        """
        ev = middle['profitability']['ev']
        roi = middle['profitability']['roi']
        hit_prob = middle['hit_probability']
        
        if roi > 2:
            recommendation = 'strong_bet'
            reasoning = f"Excellent middle - {roi:.1f}% ROI with {hit_prob*100:.1f}% chance to hit both"
        elif roi > 0:
            recommendation = 'bet'
            reasoning = f"Positive EV middle - {roi:.1f}% ROI"
        elif roi > -2:
            recommendation = 'small_bet'
            reasoning = f"Slightly negative EV but worth shot at middle - {roi:.1f}% ROI"
        else:
            recommendation = 'pass'
            reasoning = f"Negative EV - {roi:.1f}% ROI not worth the risk"
        
        return {
            'action': recommendation,
            'reasoning': reasoning,
            'confidence': 'high' if abs(roi) > 2 else 'medium'
        }
    
    def _american_to_decimal(self, american_odds):
        """
        Convert American odds to decimal
        """
        if american_odds > 0:
            return (american_odds / 100) + 1
        else:
            return (100 / abs(american_odds)) + 1
    
    def find_scalp_opportunities(self, game_odds_by_book):
        """
        Find scalping opportunities (risk-free guaranteed profit)
        """
        logger.info("Finding scalp opportunities")
        
        scalps = []
        books = game_odds_by_book.get('books', [])
        
        # Check spreads
        for book1, book2 in combinations(books, 2):
            # Check if we can bet both sides and guarantee profit
            home_odds_1 = book1.get('home_spread_odds', -110)
            away_odds_2 = book2.get('away_spread_odds', -110)
            
            # Calculate if arbitrage exists
            implied_prob_1 = self._odds_to_probability(home_odds_1)
            implied_prob_2 = self._odds_to_probability(away_odds_2)
            
            total_prob = implied_prob_1 + implied_prob_2
            
            if total_prob < 1.0:  # Arbitrage opportunity
                profit_margin = (1 - total_prob) * 100
                
                scalps.append({
                    'type': 'spread_scalp',
                    'bet1': {
                        'book': book1['book'],
                        'side': 'home',
                        'odds': home_odds_1
                    },
                    'bet2': {
                        'book': book2['book'],
                        'side': 'away',
                        'odds': away_odds_2
                    },
                    'profit_margin': profit_margin,
                    'guaranteed': True
                })
        
        return scalps
    
    def _odds_to_probability(self, american_odds):
        """
        Convert odds to implied probability
        """
        if american_odds > 0:
            return 100 / (american_odds + 100)
        else:
            return abs(american_odds) / (abs(american_odds) + 100)

# Export singleton
middle_finder = MiddleFinder()
