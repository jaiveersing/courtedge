"""
Portfolio Optimizer
Diversifies betting portfolio across multiple games/markets
Uses Modern Portfolio Theory adapted for sports betting
"""

import numpy as np
import pandas as pd
from scipy.optimize import minimize
import logging

logger = logging.getLogger(__name__)

class PortfolioOptimizer:
    def __init__(self, total_bankroll=10000, risk_free_rate=0.0):
        self.total_bankroll = total_bankroll
        self.risk_free_rate = risk_free_rate
        
    def optimize_portfolio(self, opportunities, objective='sharpe', constraints=None):
        """
        Optimize bet allocation across opportunities
        
        Args:
            opportunities: List of betting opportunities with expected returns and risks
            objective: 'sharpe', 'max_return', 'min_variance'
            constraints: Dict of constraints (max_single_bet, max_sport_allocation, etc.)
        """
        logger.info(f"Optimizing portfolio with {len(opportunities)} opportunities")
        
        if not opportunities:
            return None
        
        # Default constraints
        if constraints is None:
            constraints = {
                'max_single_bet': 0.05,  # Max 5% on any single bet
                'max_sport_allocation': 0.30,  # Max 30% in any sport
                'min_bet': 0.01,  # Min 1% if betting at all
                'max_total_exposure': 0.50  # Max 50% of bankroll at risk
            }
        
        # Calculate expected returns and covariance
        returns = np.array([opp['expected_return'] for opp in opportunities])
        risks = np.array([opp['risk'] for opp in opportunities])
        
        # Build covariance matrix
        correlation_matrix = self._build_correlation_matrix(opportunities)
        cov_matrix = np.outer(risks, risks) * correlation_matrix
        
        # Initial weights (equal allocation)
        n = len(opportunities)
        initial_weights = np.ones(n) / n
        
        # Define objective function
        if objective == 'sharpe':
            obj_func = lambda w: -self._sharpe_ratio(w, returns, cov_matrix)
        elif objective == 'max_return':
            obj_func = lambda w: -np.dot(w, returns)
        elif objective == 'min_variance':
            obj_func = lambda w: np.dot(w, np.dot(cov_matrix, w))
        else:
            obj_func = lambda w: -self._sharpe_ratio(w, returns, cov_matrix)
        
        # Constraints
        cons = [
            {'type': 'eq', 'fun': lambda w: np.sum(w) - constraints['max_total_exposure']},  # Total exposure
        ]
        
        # Bounds for each weight
        bounds = [(0, constraints['max_single_bet']) for _ in range(n)]
        
        # Optimize
        result = minimize(
            obj_func,
            initial_weights,
            method='SLSQP',
            bounds=bounds,
            constraints=cons
        )
        
        if not result.success:
            logger.warning(f"Optimization failed: {result.message}")
            return self._fallback_allocation(opportunities, constraints)
        
        optimal_weights = result.x
        
        # Calculate portfolio metrics
        portfolio_return = np.dot(optimal_weights, returns)
        portfolio_variance = np.dot(optimal_weights, np.dot(cov_matrix, optimal_weights))
        portfolio_risk = np.sqrt(portfolio_variance)
        sharpe = self._sharpe_ratio(optimal_weights, returns, cov_matrix)
        
        # Create allocation
        allocation = []
        for i, opp in enumerate(opportunities):
            if optimal_weights[i] > 0.001:  # Only include significant allocations
                stake = optimal_weights[i] * self.total_bankroll
                allocation.append({
                    'opportunity': opp,
                    'weight': optimal_weights[i],
                    'stake': stake,
                    'expected_profit': stake * opp['expected_return']
                })
        
        return {
            'allocation': allocation,
            'total_stake': sum(a['stake'] for a in allocation),
            'expected_return': portfolio_return,
            'portfolio_risk': portfolio_risk,
            'sharpe_ratio': sharpe,
            'diversification_ratio': self._diversification_ratio(optimal_weights, risks, cov_matrix)
        }
    
    def _sharpe_ratio(self, weights, returns, cov_matrix):
        """
        Calculate Sharpe ratio
        """
        portfolio_return = np.dot(weights, returns)
        portfolio_std = np.sqrt(np.dot(weights, np.dot(cov_matrix, weights)))
        
        if portfolio_std == 0:
            return 0
        
        return (portfolio_return - self.risk_free_rate) / portfolio_std
    
    def _build_correlation_matrix(self, opportunities):
        """
        Build correlation matrix between opportunities
        """
        n = len(opportunities)
        corr_matrix = np.eye(n)
        
        for i in range(n):
            for j in range(i + 1, n):
                corr = self._calculate_correlation(opportunities[i], opportunities[j])
                corr_matrix[i, j] = corr
                corr_matrix[j, i] = corr
        
        return corr_matrix
    
    def _calculate_correlation(self, opp1, opp2):
        """
        Calculate correlation between two opportunities
        """
        # Same game = high correlation
        if opp1.get('game_id') == opp2.get('game_id'):
            return 0.6
        
        # Same team involved = moderate correlation
        if (opp1.get('team') == opp2.get('team') or 
            opp1.get('opponent') == opp2.get('opponent')):
            return 0.3
        
        # Same sport, same date = low correlation
        if (opp1.get('sport') == opp2.get('sport') and 
            opp1.get('date') == opp2.get('date')):
            return 0.15
        
        # Different sports = very low correlation
        if opp1.get('sport') != opp2.get('sport'):
            return 0.05
        
        # Default
        return 0.1
    
    def _diversification_ratio(self, weights, risks, cov_matrix):
        """
        Calculate diversification ratio
        Higher = more diversified
        """
        weighted_avg_risk = np.dot(weights, risks)
        portfolio_risk = np.sqrt(np.dot(weights, np.dot(cov_matrix, weights)))
        
        if portfolio_risk == 0:
            return 0
        
        return weighted_avg_risk / portfolio_risk
    
    def _fallback_allocation(self, opportunities, constraints):
        """
        Simple fallback allocation if optimization fails
        """
        # Sort by expected value
        sorted_opps = sorted(opportunities, key=lambda x: x['expected_return'], reverse=True)
        
        # Take top opportunities up to exposure limit
        allocation = []
        total_weight = 0
        max_exposure = constraints['max_total_exposure']
        
        for opp in sorted_opps:
            if total_weight >= max_exposure:
                break
            
            weight = min(constraints['max_single_bet'], max_exposure - total_weight)
            stake = weight * self.total_bankroll
            
            allocation.append({
                'opportunity': opp,
                'weight': weight,
                'stake': stake,
                'expected_profit': stake * opp['expected_return']
            })
            
            total_weight += weight
        
        return {
            'allocation': allocation,
            'total_stake': sum(a['stake'] for a in allocation),
            'expected_return': sum(a['expected_profit'] for a in allocation) / self.total_bankroll,
            'portfolio_risk': 0,
            'sharpe_ratio': 0,
            'diversification_ratio': 0,
            'note': 'Fallback allocation used'
        }
    
    def analyze_risk(self, allocation):
        """
        Analyze risk concentration in portfolio
        """
        if not allocation or not allocation.get('allocation'):
            return {}
        
        bets = allocation['allocation']
        
        # Risk by sport
        by_sport = {}
        for bet in bets:
            sport = bet['opportunity'].get('sport', 'unknown')
            if sport not in by_sport:
                by_sport[sport] = {'stake': 0, 'count': 0}
            by_sport[sport]['stake'] += bet['stake']
            by_sport[sport]['count'] += 1
        
        # Risk by team
        by_team = {}
        for bet in bets:
            team = bet['opportunity'].get('team', 'unknown')
            if team not in by_team:
                by_team[team] = {'stake': 0, 'count': 0}
            by_team[team]['stake'] += bet['stake']
            by_team[team]['count'] += 1
        
        # Risk by bet type
        by_type = {}
        for bet in bets:
            bet_type = bet['opportunity'].get('bet_type', 'unknown')
            if bet_type not in by_type:
                by_type[bet_type] = {'stake': 0, 'count': 0}
            by_type[bet_type]['stake'] += bet['stake']
            by_type[bet_type]['count'] += 1
        
        # Calculate concentration metrics
        stakes = np.array([b['stake'] for b in bets])
        total_stake = stakes.sum()
        
        # Herfindahl index (0 = perfectly diversified, 1 = concentrated)
        herfindahl = np.sum((stakes / total_stake) ** 2) if total_stake > 0 else 0
        
        # Effective number of bets
        effective_n = 1 / herfindahl if herfindahl > 0 else len(bets)
        
        return {
            'by_sport': by_sport,
            'by_team': by_team,
            'by_type': by_type,
            'herfindahl_index': herfindahl,
            'effective_n_bets': effective_n,
            'concentration_score': 'low' if herfindahl < 0.2 else 'medium' if herfindahl < 0.4 else 'high'
        }
    
    def rebalance_portfolio(self, current_positions, new_opportunities):
        """
        Rebalance portfolio with new opportunities
        """
        logger.info(f"Rebalancing portfolio: {len(current_positions)} current, {len(new_opportunities)} new")
        
        # Combine current and new
        all_opportunities = current_positions + new_opportunities
        
        # Optimize
        optimal = self.optimize_portfolio(all_opportunities)
        
        if not optimal:
            return None
        
        # Determine what to add/remove
        current_ids = set(p['id'] for p in current_positions)
        
        changes = {
            'add': [],
            'remove': [],
            'adjust': []
        }
        
        for allocation in optimal['allocation']:
            opp_id = allocation['opportunity']['id']
            
            if opp_id not in current_ids:
                changes['add'].append(allocation)
            else:
                # Check if stake needs adjustment
                current = next(p for p in current_positions if p['id'] == opp_id)
                if abs(allocation['stake'] - current['stake']) > 10:  # $10 threshold
                    changes['adjust'].append({
                        'opportunity': allocation['opportunity'],
                        'old_stake': current['stake'],
                        'new_stake': allocation['stake'],
                        'change': allocation['stake'] - current['stake']
                    })
        
        # Find positions to remove
        optimal_ids = set(a['opportunity']['id'] for a in optimal['allocation'])
        for position in current_positions:
            if position['id'] not in optimal_ids:
                changes['remove'].append(position)
        
        return {
            'optimal_portfolio': optimal,
            'changes': changes
        }
    
    def kelly_portfolio(self, opportunities):
        """
        Portfolio using Kelly Criterion for each bet
        """
        logger.info(f"Building Kelly portfolio with {len(opportunities)} opportunities")
        
        allocation = []
        
        for opp in opportunities:
            edge = opp.get('edge', 0)
            odds = opp.get('odds', -110)
            
            if edge <= 0:
                continue
            
            # Kelly formula
            if odds > 0:
                decimal_odds = 1 + (odds / 100)
            else:
                decimal_odds = 1 + (100 / abs(odds))
            
            kelly_fraction = edge / (decimal_odds - 1)
            
            # Use fractional Kelly (25%) for safety
            weight = kelly_fraction * 0.25
            weight = min(weight, 0.05)  # Cap at 5%
            
            if weight > 0.01:  # Min 1%
                stake = weight * self.total_bankroll
                allocation.append({
                    'opportunity': opp,
                    'weight': weight,
                    'stake': stake,
                    'expected_profit': stake * opp['expected_return']
                })
        
        total_stake = sum(a['stake'] for a in allocation)
        
        return {
            'allocation': allocation,
            'total_stake': total_stake,
            'method': 'fractional_kelly'
        }

# Export
portfolio_optimizer = PortfolioOptimizer()
