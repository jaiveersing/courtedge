"""
Power Ratings System
Calculates team power ratings using Pythagorean expectation and SRS
"""

import numpy as np
import pandas as pd
from scipy.optimize import minimize
import logging

logger = logging.getLogger(__name__)

class PowerRatingsSystem:
    def __init__(self):
        self.ratings = {}
        self.pythagorean_exponents = {
            'nba': 13.91,  # Pythagorean exponent for NBA
            'nfl': 2.37,
            'mlb': 1.83,
            'nhl': 2.0
        }
        
    def calculate_pythagorean_wins(self, points_for, points_against, league='nba'):
        """
        Calculate expected wins using Pythagorean expectation
        Formula: Win% = PF^exp / (PF^exp + PA^exp)
        """
        exponent = self.pythagorean_exponents[league]
        
        win_pct = (points_for ** exponent) / (
            (points_for ** exponent) + (points_against ** exponent)
        )
        
        return win_pct
    
    def calculate_srs(self, team_results, max_iterations=100, tolerance=0.01):
        """
        Calculate Simple Rating System (SRS)
        SRS = Point Differential + Strength of Schedule
        """
        logger.info(f"Calculating SRS for {len(team_results)} teams")
        
        teams = list(team_results.keys())
        n_teams = len(teams)
        
        # Initialize ratings
        ratings = {team: 0.0 for team in teams}
        
        for iteration in range(max_iterations):
            old_ratings = ratings.copy()
            
            for team in teams:
                games = team_results[team]
                
                # Calculate average point differential
                total_diff = sum(g['point_diff'] for g in games)
                avg_diff = total_diff / len(games) if games else 0
                
                # Calculate strength of schedule
                # SOS = average rating of opponents
                opp_ratings = [old_ratings[g['opponent']] for g in games]
                sos = sum(opp_ratings) / len(opp_ratings) if opp_ratings else 0
                
                # SRS = Point Diff + SOS
                ratings[team] = avg_diff + sos
            
            # Check convergence
            max_change = max(abs(ratings[team] - old_ratings[team]) for team in teams)
            
            if max_change < tolerance:
                logger.info(f"SRS converged after {iteration + 1} iterations")
                break
        
        # Normalize so average rating is 0
        avg_rating = sum(ratings.values()) / n_teams
        ratings = {team: rating - avg_rating for team, rating in ratings.items()}
        
        return ratings
    
    def calculate_offensive_defensive_ratings(self, team_results):
        """
        Calculate separate offensive and defensive ratings
        """
        logger.info("Calculating offensive and defensive ratings")
        
        teams = list(team_results.keys())
        n_teams = len(teams)
        
        # Initialize
        off_ratings = {team: 0.0 for team in teams}
        def_ratings = {team: 0.0 for team in teams}
        
        # Iterate to solve system
        for iteration in range(100):
            old_off = off_ratings.copy()
            old_def = def_ratings.copy()
            
            for team in teams:
                games = team_results[team]
                
                # Offensive rating
                # Points scored adjusted for opponent defense
                points_scored = []
                opp_def_ratings = []
                
                for g in games:
                    points_scored.append(g['points_for'])
                    opp_def_ratings.append(old_def[g['opponent']])
                
                if points_scored:
                    avg_points = np.mean(points_scored)
                    avg_opp_def = np.mean(opp_def_ratings)
                    off_ratings[team] = avg_points - avg_opp_def
                
                # Defensive rating
                # Points allowed adjusted for opponent offense
                points_allowed = []
                opp_off_ratings = []
                
                for g in games:
                    points_allowed.append(g['points_against'])
                    opp_off_ratings.append(old_off[g['opponent']])
                
                if points_allowed:
                    avg_allowed = np.mean(points_allowed)
                    avg_opp_off = np.mean(opp_off_ratings)
                    def_ratings[team] = avg_allowed - avg_opp_off
            
            # Check convergence
            max_change_off = max(abs(off_ratings[t] - old_off[t]) for t in teams)
            max_change_def = max(abs(def_ratings[t] - old_def[t]) for t in teams)
            
            if max_change_off < 0.01 and max_change_def < 0.01:
                break
        
        # Normalize
        avg_off = sum(off_ratings.values()) / n_teams
        avg_def = sum(def_ratings.values()) / n_teams
        
        off_ratings = {t: r - avg_off for t, r in off_ratings.items()}
        def_ratings = {t: r - avg_def for t, r in def_ratings.items()}
        
        return off_ratings, def_ratings
    
    def calculate_power_rating(self, team_data, league='nba'):
        """
        Comprehensive power rating combining multiple methods
        """
        team_name = team_data['name']
        
        # Pythagorean expectation
        pyth_win_pct = self.calculate_pythagorean_wins(
            team_data['points_for'],
            team_data['points_against'],
            league
        )
        
        # Actual winning percentage
        actual_win_pct = team_data['wins'] / team_data['games_played']
        
        # Point differential per game
        point_diff = (team_data['points_for'] - team_data['points_against']) / team_data['games_played']
        
        # Recent form (last 10 games)
        recent_win_pct = team_data.get('last_10_wins', 5) / 10
        
        # Weighted power rating
        # Weight: Pythagorean 35%, Point Diff 30%, Actual Record 25%, Recent Form 10%
        power_rating = (
            pyth_win_pct * 0.35 +
            (point_diff / 10 + 0.5) * 0.30 +  # Normalize point diff to ~0.5
            actual_win_pct * 0.25 +
            recent_win_pct * 0.10
        ) * 100  # Scale to 0-100
        
        return {
            'team': team_name,
            'power_rating': power_rating,
            'pythagorean_win_pct': pyth_win_pct,
            'actual_win_pct': actual_win_pct,
            'point_differential': point_diff,
            'recent_form': recent_win_pct,
            'rank': None  # Set after calculating all teams
        }
    
    def predict_game_outcome(self, team1_rating, team2_rating, home_advantage=2.5):
        """
        Predict game outcome using power ratings
        """
        # Adjust for home court
        team1_adjusted = team1_rating + home_advantage
        
        # Convert rating difference to win probability
        # Using logistic function
        rating_diff = team1_adjusted - team2_rating
        
        # Convert to win probability (approximately 1 rating point = 1% win probability)
        win_prob = 1 / (1 + 10 ** (-rating_diff / 25))
        
        # Predicted spread
        predicted_spread = rating_diff * 0.4  # Approximate conversion
        
        return {
            'team1_win_probability': win_prob,
            'team2_win_probability': 1 - win_prob,
            'predicted_spread': predicted_spread,
            'rating_differential': rating_diff
        }
    
    def rank_teams(self, teams_ratings):
        """
        Rank teams by power rating
        """
        sorted_teams = sorted(
            teams_ratings,
            key=lambda x: x['power_rating'],
            reverse=True
        )
        
        for idx, team in enumerate(sorted_teams):
            team['rank'] = idx + 1
        
        return sorted_teams
    
    def calculate_strength_of_schedule(self, team_name, team_results, power_ratings):
        """
        Calculate strength of schedule using power ratings
        """
        if team_name not in team_results:
            return 0
        
        games = team_results[team_name]
        
        opponent_ratings = [
            power_ratings.get(g['opponent'], 50)  # Default to 50 if not found
            for g in games
        ]
        
        if not opponent_ratings:
            return 50
        
        avg_opp_rating = np.mean(opponent_ratings)
        
        return avg_opp_rating
    
    def identify_over_underperformers(self, teams_data):
        """
        Find teams over/underperforming their Pythagorean expectation
        """
        overperformers = []
        underperformers = []
        
        for team in teams_data:
            pyth_wins = team['pythagorean_win_pct'] * team['games_played']
            actual_wins = team['wins']
            
            diff = actual_wins - pyth_wins
            
            if diff > 2:  # More than 2 games ahead
                overperformers.append({
                    'team': team['name'],
                    'actual_wins': actual_wins,
                    'expected_wins': pyth_wins,
                    'diff': diff,
                    'regression_candidate': True
                })
            elif diff < -2:  # More than 2 games behind
                underperformers.append({
                    'team': team['name'],
                    'actual_wins': actual_wins,
                    'expected_wins': pyth_wins,
                    'diff': diff,
                    'bounce_back_candidate': True
                })
        
        return {
            'overperformers': overperformers,
            'underperformers': underperformers
        }

# Export singleton
power_ratings = PowerRatingsSystem()
