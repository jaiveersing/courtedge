"""
Parlay Optimizer
Finds optimal parlay combinations based on:
- Expected value
- Correlation between legs
- Risk diversification
- Historical success rates
"""

import numpy as np
import pandas as pd
from itertools import combinations
from scipy.stats import norm
import logging

logger = logging.getLogger(__name__)

class ParlayOptimizer:
    def __init__(self, max_legs=10, min_legs=2):
        self.max_legs = max_legs
        self.min_legs = min_legs
        
        # Correlation matrix for common bet types
        # Positive correlation = bets likely to hit together
        self.correlation_matrix = {
            ('total_over', 'total_over'): 0.15,
            ('total_under', 'total_under'): 0.15,
            ('favorite_spread', 'favorite_spread'): 0.20,
            ('underdog_spread', 'underdog_spread'): 0.10,
            ('total_over', 'favorite_spread'): 0.25,  # Favorites often in high-scoring games
            ('total_under', 'underdog_spread'): 0.20,  # Underdogs often in low-scoring games
        }
    
    def calculate_parlay_odds(self, individual_odds):
        """
        Calculate parlay odds from individual American odds
        """
        decimal_odds = []
        
        for odds in individual_odds:
            if odds > 0:
                decimal = (odds / 100) + 1
            else:
                decimal = (100 / abs(odds)) + 1
            decimal_odds.append(decimal)
        
        # Parlay odds = product of all decimal odds
        parlay_decimal = np.prod(decimal_odds)
        
        # Convert back to American
        if parlay_decimal >= 2.0:
            parlay_american = (parlay_decimal - 1) * 100
        else:
            parlay_american = -100 / (parlay_decimal - 1)
        
        return parlay_american, parlay_decimal
    
    def calculate_true_probability(self, odds, win_probability):
        """
        Estimate true probability accounting for correlation
        """
        # Implied probability from odds
        if odds > 0:
            implied_prob = 100 / (odds + 100)
        else:
            implied_prob = abs(odds) / (abs(odds) + 100)
        
        # Blend with model prediction
        # Weight model more heavily if confident
        true_prob = 0.6 * win_probability + 0.4 * implied_prob
        
        return true_prob
    
    def calculate_ev(self, stake, odds, win_probability, correlation_adjustment=0):
        """
        Calculate expected value of a bet
        """
        # Adjust probability for correlation
        adjusted_prob = win_probability * (1 - correlation_adjustment)
        
        # Calculate potential payout
        if odds > 0:
            payout = stake * (odds / 100)
        else:
            payout = stake * (100 / abs(odds))
        
        # EV = (win_prob * payout) - (lose_prob * stake)
        ev = (adjusted_prob * payout) - ((1 - adjusted_prob) * stake)
        
        return ev
    
    def get_correlation(self, bet1, bet2):
        """
        Get correlation coefficient between two bets
        """
        # Same game bets are correlated
        if bet1['game_id'] == bet2['game_id']:
            key = (bet1['bet_type'], bet2['bet_type'])
            return self.correlation_matrix.get(key, 0.0)
        
        # Different games - check for schedule/situational correlation
        if bet1.get('date') == bet2.get('date'):
            # Same-slate correlation (smaller)
            return 0.05
        
        return 0.0
    
    def calculate_parlay_probability(self, bets):
        """
        Calculate probability of parlay hitting accounting for correlations
        """
        if len(bets) == 0:
            return 0.0
        
        # Start with independent probability
        independent_prob = np.prod([bet['win_probability'] for bet in bets])
        
        # Adjust for correlations
        total_correlation = 0
        correlation_count = 0
        
        for i in range(len(bets)):
            for j in range(i + 1, len(bets)):
                corr = self.get_correlation(bets[i], bets[j])
                total_correlation += corr
                correlation_count += 1
        
        avg_correlation = total_correlation / correlation_count if correlation_count > 0 else 0
        
        # Positive correlation increases probability
        # Negative correlation decreases it
        adjusted_prob = independent_prob * (1 + avg_correlation * 0.5)
        
        return min(adjusted_prob, 0.95)  # Cap at 95%
    
    def optimize_parlay(self, available_bets, target_legs=None, min_ev=0, max_risk=1000):
        """
        Find optimal parlay combination
        """
        logger.info(f"Optimizing parlay from {len(available_bets)} available bets")
        
        if target_legs is None:
            target_legs = range(self.min_legs, min(self.max_legs, len(available_bets)) + 1)
        else:
            target_legs = [target_legs]
        
        best_parlays = []
        
        for num_legs in target_legs:
            # Generate all combinations
            for combo in combinations(available_bets, num_legs):
                parlay = list(combo)
                
                # Calculate parlay odds
                individual_odds = [bet['odds'] for bet in parlay]
                parlay_odds, parlay_decimal = self.calculate_parlay_odds(individual_odds)
                
                # Calculate probability
                parlay_prob = self.calculate_parlay_probability(parlay)
                
                # Calculate EV
                stake = 100  # Standard unit
                parlay_ev = self.calculate_ev(stake, parlay_odds, parlay_prob)
                
                # Skip if below minimum EV
                if parlay_ev < min_ev:
                    continue
                
                # Calculate Kelly Criterion stake
                kelly_fraction = self.calculate_kelly(parlay_odds, parlay_prob)
                optimal_stake = kelly_fraction * max_risk
                
                # Calculate metrics
                roi = (parlay_ev / stake) * 100
                
                # Risk-adjusted score
                variance = parlay_prob * (1 - parlay_prob)
                sharpe_ratio = parlay_ev / np.sqrt(variance * stake) if variance > 0 else 0
                
                parlay_result = {
                    'legs': parlay,
                    'num_legs': num_legs,
                    'odds': parlay_odds,
                    'decimal_odds': parlay_decimal,
                    'probability': parlay_prob,
                    'expected_value': parlay_ev,
                    'roi': roi,
                    'kelly_stake': optimal_stake,
                    'sharpe_ratio': sharpe_ratio,
                    'score': parlay_ev * sharpe_ratio  # Combined score
                }
                
                best_parlays.append(parlay_result)
        
        # Sort by score (EV * Sharpe ratio)
        best_parlays.sort(key=lambda x: x['score'], reverse=True)
        
        logger.info(f"Found {len(best_parlays)} viable parlays")
        
        return best_parlays[:20]  # Return top 20
    
    def calculate_kelly(self, odds, win_probability):
        """
        Calculate Kelly Criterion for optimal bet sizing
        """
        if odds > 0:
            decimal_odds = (odds / 100) + 1
        else:
            decimal_odds = (100 / abs(odds)) + 1
        
        # Kelly = (p * decimal_odds - 1) / (decimal_odds - 1)
        kelly = (win_probability * decimal_odds - 1) / (decimal_odds - 1)
        
        # Use fractional Kelly (25%) for safety
        return max(0, kelly * 0.25)
    
    def generate_round_robin(self, bets, ways):
        """
        Generate round robin combinations
        Example: 5 team round robin by 3s creates all 3-leg parlays
        """
        logger.info(f"Generating {ways}-way round robin from {len(bets)} bets")
        
        if ways > len(bets):
            return []
        
        round_robin_parlays = []
        
        for combo in combinations(bets, ways):
            parlay = self.optimize_parlay(list(combo), target_legs=ways)
            if parlay:
                round_robin_parlays.append(parlay[0])
        
        return round_robin_parlays
    
    def calculate_hedge_opportunity(self, parlay, legs_remaining):
        """
        Calculate if hedging remaining legs is profitable
        """
        if legs_remaining == 0:
            return None
        
        # Calculate current parlay value
        completed_legs = parlay['num_legs'] - legs_remaining
        
        # Estimate value of completed legs
        # This would use live odds in production
        
        hedge_recommendation = {
            'should_hedge': False,
            'hedge_amount': 0,
            'guaranteed_profit': 0
        }
        
        return hedge_recommendation
    
    def analyze_same_game_parlay(self, game_bets):
        """
        Special analysis for same-game parlays (SGP)
        Higher correlations, different strategy
        """
        logger.info(f"Analyzing same-game parlay with {len(game_bets)} legs")
        
        # Check for conflicting bets
        conflicts = self._check_conflicts(game_bets)
        
        if conflicts:
            logger.warning(f"Conflicting bets detected: {conflicts}")
        
        # Calculate enhanced correlation
        sgp_correlation = self._calculate_sgp_correlation(game_bets)
        
        # Adjust probabilities
        for bet in game_bets:
            bet['win_probability'] *= (1 - sgp_correlation * 0.3)
        
        # Optimize
        optimal = self.optimize_parlay(game_bets)
        
        return {
            'optimal_parlay': optimal[0] if optimal else None,
            'correlation_factor': sgp_correlation,
            'conflicts': conflicts,
            'alternative_combos': optimal[1:5] if len(optimal) > 1 else []
        }
    
    def _check_conflicts(self, bets):
        """
        Check for conflicting same-game bets
        """
        conflicts = []
        
        for i, bet1 in enumerate(bets):
            for bet2 in bets[i+1:]:
                # Over/Under on same total
                if bet1['bet_type'].startswith('total_') and bet2['bet_type'].startswith('total_'):
                    if bet1['bet_type'] != bet2['bet_type']:
                        conflicts.append(f"Cannot combine {bet1['bet_type']} and {bet2['bet_type']}")
        
        return conflicts
    
    def _calculate_sgp_correlation(self, bets):
        """
        Calculate overall correlation for same-game parlay
        """
        if len(bets) < 2:
            return 0.0
        
        correlations = []
        
        for i in range(len(bets)):
            for j in range(i + 1, len(bets)):
                corr = self.get_correlation(bets[i], bets[j])
                correlations.append(corr)
        
        return np.mean(correlations) if correlations else 0.0

# Export singleton
parlay_optimizer = ParlayOptimizer()
