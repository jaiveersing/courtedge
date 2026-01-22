"""
ELO Rating System
Dynamic rating system that updates after each game
Similar to chess ELO but adapted for basketball/sports
"""

import numpy as np
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ELORatingSystem:
    def __init__(self, k_factor=20, base_rating=1500):
        self.k_factor = k_factor  # How much ratings change per game
        self.base_rating = base_rating  # Starting rating for new teams
        self.ratings = {}
        self.rating_history = {}
        
        # League-specific adjustments
        self.home_advantage = {
            'nba': 100,  # Home team gets +100 ELO points
            'nfl': 65,
            'mlb': 40,
            'nhl': 55
        }
    
    def get_rating(self, team_id):
        """
        Get current ELO rating for a team
        """
        if team_id not in self.ratings:
            self.ratings[team_id] = self.base_rating
            self.rating_history[team_id] = []
        
        return self.ratings[team_id]
    
    def calculate_expected_score(self, rating1, rating2):
        """
        Calculate expected score (win probability) using ELO formula
        E = 1 / (1 + 10^((rating2 - rating1) / 400))
        """
        return 1 / (1 + 10 ** ((rating2 - rating1) / 400))
    
    def update_ratings(self, team1_id, team2_id, team1_score, team2_score, 
                      is_team1_home=True, league='nba', margin_of_victory=True):
        """
        Update ELO ratings after a game
        
        Args:
            team1_id: First team identifier
            team2_id: Second team identifier
            team1_score: Team 1 final score
            team2_score: Team 2 final score
            is_team1_home: Whether team1 was home team
            league: Sport league for home advantage adjustment
            margin_of_victory: Whether to apply MOV multiplier
        """
        logger.info(f"Updating ELO: {team1_id} vs {team2_id}")
        
        # Get current ratings
        rating1 = self.get_rating(team1_id)
        rating2 = self.get_rating(team2_id)
        
        # Adjust for home court advantage
        home_adj = self.home_advantage.get(league, 100)
        
        if is_team1_home:
            adjusted_rating1 = rating1 + home_adj
            adjusted_rating2 = rating2
        else:
            adjusted_rating1 = rating1
            adjusted_rating2 = rating2 + home_adj
        
        # Calculate expected scores
        expected1 = self.calculate_expected_score(adjusted_rating1, adjusted_rating2)
        expected2 = 1 - expected1
        
        # Determine actual scores (1 for win, 0.5 for tie, 0 for loss)
        if team1_score > team2_score:
            actual1, actual2 = 1.0, 0.0
        elif team1_score < team2_score:
            actual1, actual2 = 0.0, 1.0
        else:
            actual1, actual2 = 0.5, 0.5
        
        # Margin of victory multiplier
        mov_multiplier = 1.0
        if margin_of_victory and actual1 != 0.5:
            point_diff = abs(team1_score - team2_score)
            # Logarithmic scaling - bigger wins matter more but with diminishing returns
            mov_multiplier = np.log(point_diff + 1) / np.log(15 + 1)
            mov_multiplier = max(1.0, min(mov_multiplier * 2, 2.5))  # Cap between 1.0 and 2.5
        
        # Calculate rating changes
        k = self.k_factor * mov_multiplier
        
        change1 = k * (actual1 - expected1)
        change2 = k * (actual2 - expected2)
        
        # Update ratings
        new_rating1 = rating1 + change1
        new_rating2 = rating2 + change2
        
        self.ratings[team1_id] = new_rating1
        self.ratings[team2_id] = new_rating2
        
        # Record history
        timestamp = datetime.now()
        
        self.rating_history[team1_id].append({
            'timestamp': timestamp,
            'rating': new_rating1,
            'change': change1,
            'opponent': team2_id,
            'result': 'W' if actual1 == 1.0 else 'L' if actual1 == 0.0 else 'T'
        })
        
        self.rating_history[team2_id].append({
            'timestamp': timestamp,
            'rating': new_rating2,
            'change': change2,
            'opponent': team1_id,
            'result': 'W' if actual2 == 1.0 else 'L' if actual2 == 0.0 else 'T'
        })
        
        return {
            'team1': {
                'old_rating': rating1,
                'new_rating': new_rating1,
                'change': change1,
                'expected_win_prob': expected1
            },
            'team2': {
                'old_rating': rating2,
                'new_rating': new_rating2,
                'change': change2,
                'expected_win_prob': expected2
            }
        }
    
    def predict_game(self, team1_id, team2_id, is_team1_home=True, league='nba'):
        """
        Predict game outcome using current ELO ratings
        """
        rating1 = self.get_rating(team1_id)
        rating2 = self.get_rating(team2_id)
        
        # Adjust for home advantage
        home_adj = self.home_advantage.get(league, 100)
        
        if is_team1_home:
            adjusted_rating1 = rating1 + home_adj
            adjusted_rating2 = rating2
        else:
            adjusted_rating1 = rating1
            adjusted_rating2 = rating2 + home_adj
        
        # Calculate win probabilities
        team1_win_prob = self.calculate_expected_score(adjusted_rating1, adjusted_rating2)
        team2_win_prob = 1 - team1_win_prob
        
        # Estimate spread based on rating difference
        # Rule of thumb: ~25 ELO points = 1 point spread
        rating_diff = adjusted_rating1 - adjusted_rating2
        estimated_spread = rating_diff / 25
        
        return {
            'team1_id': team1_id,
            'team2_id': team2_id,
            'team1_rating': rating1,
            'team2_rating': rating2,
            'team1_win_probability': team1_win_prob,
            'team2_win_probability': team2_win_prob,
            'estimated_spread': estimated_spread,
            'rating_differential': rating_diff,
            'confidence': abs(0.5 - team1_win_prob) * 2  # 0-1 scale, higher = more confident
        }
    
    def get_rankings(self, min_games=10):
        """
        Get current ELO rankings
        """
        rankings = []
        
        for team_id, rating in self.ratings.items():
            games_played = len(self.rating_history.get(team_id, []))
            
            if games_played >= min_games:
                # Calculate recent form (last 10 games)
                recent_history = self.rating_history[team_id][-10:]
                recent_wins = sum(1 for g in recent_history if g['result'] == 'W')
                recent_change = sum(g['change'] for g in recent_history)
                
                rankings.append({
                    'team_id': team_id,
                    'rating': rating,
                    'games_played': games_played,
                    'recent_record': f"{recent_wins}-{len(recent_history) - recent_wins}",
                    'recent_rating_change': recent_change,
                    'trend': 'up' if recent_change > 0 else 'down' if recent_change < 0 else 'stable'
                })
        
        # Sort by rating
        rankings.sort(key=lambda x: x['rating'], reverse=True)
        
        # Add ranks
        for idx, team in enumerate(rankings):
            team['rank'] = idx + 1
        
        return rankings
    
    def get_team_history(self, team_id, num_games=20):
        """
        Get rating history for a team
        """
        if team_id not in self.rating_history:
            return []
        
        return self.rating_history[team_id][-num_games:]
    
    def calculate_strength_of_schedule(self, team_id):
        """
        Calculate average opponent ELO rating
        """
        if team_id not in self.rating_history:
            return None
        
        opponent_ratings = [
            self.get_rating(game['opponent'])
            for game in self.rating_history[team_id]
        ]
        
        if not opponent_ratings:
            return None
        
        return {
            'avg_opponent_rating': np.mean(opponent_ratings),
            'min_opponent_rating': min(opponent_ratings),
            'max_opponent_rating': max(opponent_ratings),
            'games_vs_top_teams': sum(1 for r in opponent_ratings if r > 1700),  # Top tier threshold
            'sos_rank': 'tough' if np.mean(opponent_ratings) > 1600 else 'average' if np.mean(opponent_ratings) > 1400 else 'easy'
        }
    
    def simulate_season(self, schedule, n_simulations=10000):
        """
        Simulate remaining season using ELO ratings
        """
        logger.info(f"Simulating season with {len(schedule)} games, {n_simulations} iterations")
        
        # Track wins for each team across simulations
        team_wins = {team_id: [] for team_id in self.ratings.keys()}
        
        for sim in range(n_simulations):
            sim_wins = {team_id: 0 for team_id in self.ratings.keys()}
            
            for game in schedule:
                prediction = self.predict_game(
                    game['team1_id'],
                    game['team2_id'],
                    game.get('is_team1_home', True),
                    game.get('league', 'nba')
                )
                
                # Simulate outcome based on probabilities
                if np.random.random() < prediction['team1_win_probability']:
                    sim_wins[game['team1_id']] += 1
                else:
                    sim_wins[game['team2_id']] += 1
            
            # Record wins for this simulation
            for team_id, wins in sim_wins.items():
                team_wins[team_id].append(wins)
        
        # Calculate statistics
        results = {}
        
        for team_id, wins_list in team_wins.items():
            results[team_id] = {
                'mean_wins': np.mean(wins_list),
                'median_wins': np.median(wins_list),
                'std_wins': np.std(wins_list),
                'min_wins': min(wins_list),
                'max_wins': max(wins_list),
                'win_distribution': {
                    '10th_percentile': np.percentile(wins_list, 10),
                    '90th_percentile': np.percentile(wins_list, 90)
                }
            }
        
        return results
    
    def regress_to_mean(self, regression_factor=0.33):
        """
        Apply mean regression to all ratings
        Typically done at start of new season
        """
        logger.info(f"Applying mean regression with factor {regression_factor}")
        
        mean_rating = np.mean(list(self.ratings.values()))
        
        for team_id in self.ratings:
            current_rating = self.ratings[team_id]
            # Move rating 1/3 of the way back to mean
            new_rating = current_rating + (mean_rating - current_rating) * regression_factor
            self.ratings[team_id] = new_rating

# Export singleton
elo_system = ELORatingSystem()
