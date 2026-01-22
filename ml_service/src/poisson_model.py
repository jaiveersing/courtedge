"""
Poisson Distribution Models
Statistical models for predicting game scores and totals
"""

import numpy as np
from scipy.stats import poisson, skellam
import pandas as pd
import logging

logger = logging.getLogger(__name__)

class PoissonModel:
    def __init__(self):
        self.league_avg_scoring = {
            'nba': 110.0,  # Points per team per game
            'nfl': 23.0,
            'mlb': 4.5,
            'nhl': 3.0
        }
        
    def predict_game_score(self, team1_stats, team2_stats, league='nba'):
        """
        Predict final scores using Poisson distribution
        
        Args:
            team1_stats: {'off_rating': 115, 'def_rating': 108, ...}
            team2_stats: {'off_rating': 112, 'def_rating': 110, ...}
            league: 'nba', 'nfl', etc.
        """
        logger.info(f"Predicting {league} game score")
        
        # Calculate expected scoring rates
        team1_lambda = self._calculate_lambda(team1_stats, team2_stats, league, is_home=True)
        team2_lambda = self._calculate_lambda(team2_stats, team1_stats, league, is_home=False)
        
        # Most likely scores
        team1_score = int(team1_lambda)
        team2_score = int(team2_lambda)
        
        # Probability distributions
        team1_dist = self._generate_score_distribution(team1_lambda, max_score=200 if league == 'nba' else 60)
        team2_dist = self._generate_score_distribution(team2_lambda, max_score=200 if league == 'nba' else 60)
        
        # Calculate probabilities
        win_probability = self._calculate_win_probability(team1_lambda, team2_lambda)
        
        return {
            'team1_predicted_score': team1_score,
            'team2_predicted_score': team2_score,
            'team1_lambda': team1_lambda,
            'team2_lambda': team2_lambda,
            'total_predicted': team1_score + team2_score,
            'team1_win_probability': win_probability,
            'team2_win_probability': 1 - win_probability,
            'team1_score_distribution': team1_dist,
            'team2_score_distribution': team2_dist
        }
    
    def _calculate_lambda(self, team_stats, opponent_stats, league, is_home):
        """
        Calculate Poisson lambda (expected scoring rate)
        """
        league_avg = self.league_avg_scoring[league]
        
        # Offensive strength
        off_rating = team_stats.get('off_rating', league_avg)
        
        # Defensive strength of opponent
        opp_def_rating = opponent_stats.get('def_rating', league_avg)
        
        # Home court advantage (typically 2-3 points in NBA)
        home_advantage = 2.5 if is_home else 0
        
        # Calculate lambda
        # Lambda = (Team Off Rating / League Avg) * (Opp Def Rating / League Avg) * League Avg + Home Advantage
        attack_strength = off_rating / league_avg
        defense_weakness = opp_def_rating / league_avg
        
        lambda_value = attack_strength * defense_weakness * league_avg + home_advantage
        
        # Pace adjustment
        pace = team_stats.get('pace', 100)
        league_avg_pace = 100
        pace_factor = pace / league_avg_pace
        
        lambda_value *= pace_factor
        
        return lambda_value
    
    def _generate_score_distribution(self, lambda_param, max_score=150):
        """
        Generate probability distribution of scores
        """
        scores = np.arange(0, max_score + 1)
        probabilities = poisson.pmf(scores, lambda_param)
        
        return {
            'scores': scores.tolist(),
            'probabilities': probabilities.tolist(),
            'mean': lambda_param,
            'std': np.sqrt(lambda_param)
        }
    
    def _calculate_win_probability(self, lambda1, lambda2):
        """
        Calculate probability team1 beats team2 using Skellam distribution
        """
        # Skellam distribution models difference of two Poisson variables
        # P(X1 > X2) = P(X1 - X2 > 0)
        
        # Sum probabilities for all positive differences
        max_diff = 50
        diffs = np.arange(1, max_diff + 1)
        
        # Skellam PMF
        win_prob = skellam.sf(0, lambda1, lambda2)  # P(X > 0)
        
        return float(win_prob)
    
    def predict_total(self, team1_stats, team2_stats, league='nba'):
        """
        Predict game total (over/under)
        """
        prediction = self.predict_game_score(team1_stats, team2_stats, league)
        
        predicted_total = prediction['total_predicted']
        
        # Calculate distribution of possible totals
        # Total = Team1Score + Team2Score
        # Variance of sum = Var(Team1) + Var(Team2)
        total_variance = prediction['team1_lambda'] + prediction['team2_lambda']
        total_std = np.sqrt(total_variance)
        
        return {
            'predicted_total': predicted_total,
            'expected_total': prediction['team1_lambda'] + prediction['team2_lambda'],
            'std_dev': total_std,
            'confidence_interval_95': (
                predicted_total - 1.96 * total_std,
                predicted_total + 1.96 * total_std
            )
        }
    
    def calculate_spread_probability(self, team1_stats, team2_stats, spread, league='nba'):
        """
        Calculate probability of covering spread
        """
        prediction = self.predict_game_score(team1_stats, team2_stats, league)
        
        lambda1 = prediction['team1_lambda']
        lambda2 = prediction['team2_lambda']
        
        # P(Team1 - Team2 > spread)
        # Using Skellam distribution
        cover_prob = skellam.sf(spread, lambda1, lambda2)
        
        return {
            'spread': spread,
            'cover_probability': float(cover_prob),
            'expected_margin': lambda1 - lambda2,
            'fair_spread': lambda1 - lambda2
        }
    
    def calculate_total_probability(self, team1_stats, team2_stats, total_line, league='nba'):
        """
        Calculate probability of going over/under total
        """
        prediction = self.predict_total(team1_stats, team2_stats, league)
        
        # Total follows approximately normal distribution (sum of two Poissons)
        mean_total = prediction['expected_total']
        std_total = prediction['std_dev']
        
        # P(Total > line)
        from scipy.stats import norm
        z_score = (total_line - mean_total) / std_total
        over_prob = 1 - norm.cdf(z_score)
        
        return {
            'total_line': total_line,
            'over_probability': over_prob,
            'under_probability': 1 - over_prob,
            'expected_total': mean_total,
            'fair_total': mean_total
        }
    
    def simulate_game(self, team1_stats, team2_stats, league='nba', n_simulations=10000):
        """
        Monte Carlo simulation of game outcomes
        """
        logger.info(f"Simulating game {n_simulations} times")
        
        # Calculate lambdas
        team1_lambda = self._calculate_lambda(team1_stats, team2_stats, league, is_home=True)
        team2_lambda = self._calculate_lambda(team2_stats, team1_stats, league, is_home=False)
        
        # Generate random scores
        team1_scores = np.random.poisson(team1_lambda, n_simulations)
        team2_scores = np.random.poisson(team2_lambda, n_simulations)
        
        # Calculate outcomes
        team1_wins = (team1_scores > team2_scores).sum()
        ties = (team1_scores == team2_scores).sum()
        
        margins = team1_scores - team2_scores
        totals = team1_scores + team2_scores
        
        return {
            'team1_win_pct': (team1_wins / n_simulations) * 100,
            'team2_win_pct': ((n_simulations - team1_wins - ties) / n_simulations) * 100,
            'tie_pct': (ties / n_simulations) * 100,
            'avg_team1_score': team1_scores.mean(),
            'avg_team2_score': team2_scores.mean(),
            'avg_margin': margins.mean(),
            'avg_total': totals.mean(),
            'margin_distribution': {
                'mean': margins.mean(),
                'std': margins.std(),
                'median': np.median(margins),
                'percentiles': {
                    '5th': np.percentile(margins, 5),
                    '25th': np.percentile(margins, 25),
                    '75th': np.percentile(margins, 75),
                    '95th': np.percentile(margins, 95)
                }
            },
            'total_distribution': {
                'mean': totals.mean(),
                'std': totals.std(),
                'median': np.median(totals),
                'percentiles': {
                    '5th': np.percentile(totals, 5),
                    '25th': np.percentile(totals, 25),
                    '75th': np.percentile(totals, 75),
                    '95th': np.percentile(totals, 95)
                }
            }
        }

# Export singleton
poisson_model = PoissonModel()
