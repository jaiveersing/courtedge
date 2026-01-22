"""
Prop Correlation Analyzer
Identifies correlations between player props for:
- Same-game parlays
- Correlated player prop parlays
- Avoiding negatively correlated props
"""

import numpy as np
import pandas as pd
from scipy.stats import pearsonr, spearmanr
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)

class PropCorrelationAnalyzer:
    def __init__(self):
        # Common prop types
        self.prop_types = [
            'points', 'rebounds', 'assists', 'three_pointers',
            'steals', 'blocks', 'turnovers', 'minutes'
        ]
        
        # Known correlations (from historical data analysis)
        self.known_correlations = {
            ('points', 'minutes'): 0.75,
            ('rebounds', 'minutes'): 0.65,
            ('assists', 'minutes'): 0.70,
            ('points', 'three_pointers'): 0.55,
            ('rebounds', 'blocks'): 0.45,
            ('assists', 'turnovers'): 0.40,
            ('points', 'assists'): 0.25,  # High usage players
            ('rebounds', 'points'): 0.20,  # Big men
        }
        
        self.correlation_cache = {}
    
    def calculate_historical_correlation(self, player_id, prop1, prop2, games_back=20):
        """
        Calculate correlation between two props for a player
        """
        cache_key = f"{player_id}_{prop1}_{prop2}_{games_back}"
        
        if cache_key in self.correlation_cache:
            return self.correlation_cache[cache_key]
        
        try:
            # Fetch historical data (would connect to database in production)
            # For now, simulate with sample data
            logger.info(f"Calculating correlation: {prop1} vs {prop2} for player {player_id}")
            
            # This would be a database query:
            # SELECT prop1_value, prop2_value FROM player_game_logs
            # WHERE player_id = ? ORDER BY game_date DESC LIMIT ?
            
            # Simulated data for demonstration
            data1 = np.random.normal(25, 5, games_back)  # prop1 values
            data2 = np.random.normal(10, 3, games_back)  # prop2 values
            
            # Calculate Pearson correlation
            correlation, p_value = pearsonr(data1, data2)
            
            result = {
                'correlation': correlation,
                'p_value': p_value,
                'significant': p_value < 0.05,
                'sample_size': games_back,
                'strength': self._categorize_correlation(correlation)
            }
            
            self.correlation_cache[cache_key] = result
            
            return result
            
        except Exception as e:
            logger.error(f"Error calculating correlation: {e}")
            return {
                'correlation': 0.0,
                'p_value': 1.0,
                'significant': False,
                'sample_size': 0,
                'strength': 'none'
            }
    
    def calculate_game_correlation(self, player1_prop, player2_prop, games_back=50):
        """
        Calculate correlation between props of different players in same game
        Example: LeBron points vs AD rebounds
        """
        logger.info(f"Calculating game correlation: {player1_prop['player']} {player1_prop['prop']} vs {player2_prop['player']} {player2_prop['prop']}")
        
        try:
            # Fetch games where both players played
            # This would query database for head-to-head games
            
            # Check for known teammate correlations
            if self._are_teammates(player1_prop['player_id'], player2_prop['player_id']):
                # Teammates often have positive correlations
                base_correlation = 0.25
                
                # Specific position correlations
                if player1_prop['prop'] == 'assists' and player2_prop['prop'] in ['points', 'three_pointers']:
                    base_correlation = 0.45  # Assist to scoring
                elif player1_prop['prop'] == 'rebounds' and player2_prop['prop'] == 'rebounds':
                    base_correlation = -0.20  # Competing for rebounds
            else:
                # Opponents typically have negative correlations
                base_correlation = -0.15
                
                # Defensive matchup correlations
                if player1_prop['prop'] == 'points' and player2_prop['prop'] == 'blocks':
                    base_correlation = -0.30  # Good rim protection reduces scoring
            
            return {
                'correlation': base_correlation,
                'players': [player1_prop['player'], player2_prop['player']],
                'props': [player1_prop['prop'], player2_prop['prop']],
                'relationship': 'teammates' if self._are_teammates(player1_prop['player_id'], player2_prop['player_id']) else 'opponents',
                'strength': self._categorize_correlation(base_correlation)
            }
            
        except Exception as e:
            logger.error(f"Error calculating game correlation: {e}")
            return {'correlation': 0.0, 'strength': 'none'}
    
    def find_correlated_props(self, anchor_prop, min_correlation=0.4, max_props=5):
        """
        Find props that are highly correlated with anchor prop
        """
        logger.info(f"Finding props correlated with {anchor_prop['player']} {anchor_prop['prop']}")
        
        correlated_props = []
        
        # Same player correlations
        for prop_type in self.prop_types:
            if prop_type == anchor_prop['prop']:
                continue
            
            correlation_data = self.calculate_historical_correlation(
                anchor_prop['player_id'],
                anchor_prop['prop'],
                prop_type
            )
            
            if abs(correlation_data['correlation']) >= min_correlation:
                correlated_props.append({
                    'player': anchor_prop['player'],
                    'player_id': anchor_prop['player_id'],
                    'prop': prop_type,
                    'correlation': correlation_data['correlation'],
                    'strength': correlation_data['strength'],
                    'type': 'same_player'
                })
        
        # Teammate correlations
        teammates = self._get_teammates(anchor_prop['player_id'])
        
        for teammate in teammates:
            for prop_type in self.prop_types:
                teammate_prop = {
                    'player': teammate['name'],
                    'player_id': teammate['id'],
                    'prop': prop_type
                }
                
                game_corr = self.calculate_game_correlation(anchor_prop, teammate_prop)
                
                if abs(game_corr['correlation']) >= min_correlation:
                    correlated_props.append({
                        'player': teammate['name'],
                        'player_id': teammate['id'],
                        'prop': prop_type,
                        'correlation': game_corr['correlation'],
                        'strength': game_corr['strength'],
                        'type': 'teammate'
                    })
        
        # Sort by absolute correlation
        correlated_props.sort(key=lambda x: abs(x['correlation']), reverse=True)
        
        return correlated_props[:max_props]
    
    def analyze_prop_parlay(self, props):
        """
        Analyze correlation structure of a prop parlay
        """
        logger.info(f"Analyzing {len(props)} prop parlay")
        
        if len(props) < 2:
            return {'avg_correlation': 0, 'risk_score': 'low', 'recommendations': []}
        
        # Calculate all pairwise correlations
        correlations = []
        correlation_matrix = []
        
        for i, prop1 in enumerate(props):
            row = []
            for j, prop2 in enumerate(props):
                if i == j:
                    corr = 1.0
                elif i > j:
                    corr = correlation_matrix[j][i]
                else:
                    if prop1['player_id'] == prop2['player_id']:
                        corr_data = self.calculate_historical_correlation(
                            prop1['player_id'],
                            prop1['prop'],
                            prop2['prop']
                        )
                        corr = corr_data['correlation']
                    else:
                        game_corr = self.calculate_game_correlation(prop1, prop2)
                        corr = game_corr['correlation']
                    
                    correlations.append(corr)
                
                row.append(corr)
            correlation_matrix.append(row)
        
        # Calculate statistics
        avg_correlation = np.mean(correlations) if correlations else 0
        max_correlation = max(correlations) if correlations else 0
        min_correlation = min(correlations) if correlations else 0
        
        # Risk assessment
        risk_score = self._assess_correlation_risk(avg_correlation, max_correlation)
        
        # Generate recommendations
        recommendations = []
        
        if max_correlation > 0.6:
            recommendations.append({
                'type': 'warning',
                'message': 'High positive correlation detected. Props likely to move together.'
            })
        
        if min_correlation < -0.4:
            recommendations.append({
                'type': 'warning',
                'message': 'Strong negative correlation detected. Props working against each other.'
            })
        
        if avg_correlation > 0.3:
            recommendations.append({
                'type': 'info',
                'message': 'Consider reducing stake due to correlated outcomes.'
            })
        
        if -0.2 < avg_correlation < 0.2:
            recommendations.append({
                'type': 'success',
                'message': 'Good diversification - props are relatively independent.'
            })
        
        return {
            'num_props': len(props),
            'avg_correlation': avg_correlation,
            'max_correlation': max_correlation,
            'min_correlation': min_correlation,
            'correlation_matrix': correlation_matrix,
            'risk_score': risk_score,
            'recommendations': recommendations,
            'adjusted_probability': self._adjust_parlay_probability(props, avg_correlation)
        }
    
    def build_optimal_sgp(self, game_id, available_props, target_legs=3, strategy='balanced'):
        """
        Build optimal same-game parlay
        Strategies: 'balanced', 'positive_correlation', 'diversified'
        """
        logger.info(f"Building {strategy} SGP for game {game_id}")
        
        if len(available_props) < target_legs:
            return None
        
        best_parlay = None
        best_score = -float('inf')
        
        from itertools import combinations
        
        for combo in combinations(available_props, target_legs):
            props = list(combo)
            
            # Analyze correlation
            analysis = self.analyze_prop_parlay(props)
            
            # Calculate score based on strategy
            if strategy == 'positive_correlation':
                # Prefer high positive correlation
                score = analysis['avg_correlation']
            elif strategy == 'diversified':
                # Prefer low correlation
                score = -abs(analysis['avg_correlation'])
            else:  # balanced
                # Balance EV and correlation
                ev_sum = sum(prop.get('expected_value', 0) for prop in props)
                score = ev_sum * (1 - abs(analysis['avg_correlation']) * 0.5)
            
            if score > best_score:
                best_score = score
                best_parlay = {
                    'props': props,
                    'analysis': analysis,
                    'score': score,
                    'strategy': strategy
                }
        
        return best_parlay
    
    def _categorize_correlation(self, correlation):
        """
        Categorize correlation strength
        """
        abs_corr = abs(correlation)
        
        if abs_corr >= 0.7:
            return 'very_strong'
        elif abs_corr >= 0.5:
            return 'strong'
        elif abs_corr >= 0.3:
            return 'moderate'
        elif abs_corr >= 0.1:
            return 'weak'
        else:
            return 'none'
    
    def _assess_correlation_risk(self, avg_correlation, max_correlation):
        """
        Assess risk level based on correlations
        """
        if max_correlation > 0.7 or avg_correlation > 0.5:
            return 'high'
        elif max_correlation > 0.5 or avg_correlation > 0.3:
            return 'medium'
        else:
            return 'low'
    
    def _adjust_parlay_probability(self, props, avg_correlation):
        """
        Adjust parlay probability based on correlation
        """
        # Independent probability
        independent_prob = np.prod([prop.get('win_probability', 0.5) for prop in props])
        
        # Positive correlation increases joint probability
        # Negative correlation decreases it
        adjustment_factor = 1 + (avg_correlation * 0.3)
        
        adjusted_prob = independent_prob * adjustment_factor
        
        return max(0.01, min(0.99, adjusted_prob))
    
    def _are_teammates(self, player1_id, player2_id):
        """
        Check if players are on same team
        Would query database in production
        """
        # Simulated - would query database
        return np.random.random() > 0.5
    
    def _get_teammates(self, player_id):
        """
        Get player's teammates
        Would query database in production
        """
        # Simulated - would return actual teammates from database
        return [
            {'id': f'teammate_{i}', 'name': f'Teammate {i}'}
            for i in range(3)
        ]

# Export singleton
prop_correlation_analyzer = PropCorrelationAnalyzer()
