"""
Rest & Travel Analysis
Analyzes impact of rest days, back-to-backs, and travel on performance
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from geopy.distance import geodesic
import logging

logger = logging.getLogger(__name__)

class RestTravelAnalyzer:
    def __init__(self):
        # Stadium locations (lat, lon)
        self.stadium_locations = {
            # NBA
            'ATL': (33.7573, -84.3963),
            'BOS': (42.3662, -71.0621),
            'BKN': (40.6826, -73.9754),
            'CHA': (35.2251, -80.8392),
            'CHI': (41.8807, -87.6742),
            'CLE': (41.4965, -81.6882),
            'DAL': (32.7905, -96.8103),
            'DEN': (39.7487, -105.0077),
            'DET': (42.3410, -83.0550),
            'GSW': (37.7680, -122.3878),
            'HOU': (29.7508, -95.3621),
            'IND': (39.7640, -86.1555),
            'LAC': (34.0430, -118.2673),
            'LAL': (34.0430, -118.2673),
            'MEM': (35.1382, -90.0506),
            'MIA': (25.7814, -80.1870),
            'MIL': (43.0436, -87.9170),
            'MIN': (44.9795, -93.2761),
            'NOP': (29.9490, -90.0821),
            'NYK': (40.7505, -73.9934),
            'OKC': (35.4634, -97.5151),
            'ORL': (28.5392, -81.3839),
            'PHI': (39.9012, -75.1720),
            'PHX': (33.4458, -112.0712),
            'POR': (45.5316, -122.6668),
            'SAC': (38.5802, -121.4997),
            'SAS': (29.4270, -98.4375),
            'TOR': (43.6435, -79.3791),
            'UTA': (40.7683, -111.9011),
            'WAS': (38.8981, -77.0209)
        }
        
        # Performance impact multipliers
        self.rest_multipliers = {
            0: 0.92,   # Back-to-back (8% decrease)
            1: 0.96,   # 1 day rest (4% decrease)
            2: 1.00,   # 2 days rest (normal)
            3: 1.02,   # 3 days rest (2% increase)
            4: 1.00,   # 4+ days rest (slight rust)
        }
        
        self.travel_fatigue_thresholds = {
            'short': 500,    # < 500 miles
            'medium': 1500,  # 500-1500 miles
            'long': 2500,    # 1500-2500 miles
            'coast': 3000    # > 2500 miles (coast-to-coast)
        }
        
    def analyze_game_rest(self, team_id, game_date, previous_games):
        """
        Analyze rest situation for a team
        """
        logger.info(f"Analyzing rest for {team_id} on {game_date}")
        
        if not previous_games:
            return {
                'days_rest': 7,
                'is_rested': True,
                'rest_advantage': 'high',
                'fatigue_level': 0
            }
        
        # Sort games by date
        sorted_games = sorted(previous_games, key=lambda x: x['date'], reverse=True)
        last_game = sorted_games[0]
        
        # Calculate days of rest
        days_rest = (game_date - last_game['date']).days
        
        # Check for back-to-backs and 3-in-4 nights
        is_back_to_back = days_rest == 0
        
        # Check last 4 games for 3-in-4 or 4-in-5
        recent_4_games = sorted_games[:4]
        if len(recent_4_games) >= 3:
            days_span = (recent_4_games[0]['date'] - recent_4_games[2]['date']).days
            is_3_in_4 = days_span <= 3
            is_4_in_5 = len(recent_4_games) == 4 and (recent_4_games[0]['date'] - recent_4_games[3]['date']).days <= 4
        else:
            is_3_in_4 = False
            is_4_in_5 = False
        
        # Calculate fatigue level (0-10 scale)
        fatigue = 0
        if is_back_to_back:
            fatigue += 4
        if is_3_in_4:
            fatigue += 3
        if is_4_in_5:
            fatigue += 2
        if days_rest >= 3:
            fatigue = max(0, fatigue - 2)
        
        # Rest advantage category
        if days_rest >= 3:
            rest_advantage = 'high'
        elif days_rest == 2:
            rest_advantage = 'medium'
        elif days_rest == 1:
            rest_advantage = 'low'
        else:
            rest_advantage = 'none'
        
        # Performance multiplier
        multiplier = self.rest_multipliers.get(min(days_rest, 4), 1.0)
        
        return {
            'days_rest': days_rest,
            'is_back_to_back': is_back_to_back,
            'is_3_in_4': is_3_in_4,
            'is_4_in_5': is_4_in_5,
            'is_rested': days_rest >= 2,
            'rest_advantage': rest_advantage,
            'fatigue_level': min(fatigue, 10),
            'performance_multiplier': multiplier,
            'games_last_week': len([g for g in sorted_games if (game_date - g['date']).days <= 7])
        }
    
    def calculate_travel_distance(self, from_city, to_city):
        """
        Calculate travel distance between cities
        """
        if from_city not in self.stadium_locations or to_city not in self.stadium_locations:
            return 0
        
        from_coords = self.stadium_locations[from_city]
        to_coords = self.stadium_locations[to_city]
        
        # Calculate distance in miles
        distance = geodesic(from_coords, to_coords).miles
        
        return distance
    
    def analyze_travel_impact(self, team_id, game_location, previous_games):
        """
        Analyze travel fatigue and time zone changes
        """
        logger.info(f"Analyzing travel impact for {team_id}")
        
        if not previous_games:
            return {
                'total_miles': 0,
                'travel_category': 'none',
                'timezone_changes': 0,
                'travel_fatigue': 0
            }
        
        # Get last game location
        last_game = sorted(previous_games, key=lambda x: x['date'], reverse=True)[0]
        last_location = last_game['location']
        
        # Calculate distance
        distance = self.calculate_travel_distance(last_location, game_location)
        
        # Categorize travel
        if distance < self.travel_fatigue_thresholds['short']:
            travel_category = 'short'
            fatigue_impact = 0.5
        elif distance < self.travel_fatigue_thresholds['medium']:
            travel_category = 'medium'
            fatigue_impact = 1.5
        elif distance < self.travel_fatigue_thresholds['long']:
            travel_category = 'long'
            fatigue_impact = 3.0
        else:
            travel_category = 'coast_to_coast'
            fatigue_impact = 4.0
        
        # Calculate timezone changes
        tz_change = self._calculate_timezone_change(last_location, game_location)
        
        # Adjust for timezone changes (especially east to west coast)
        if abs(tz_change) >= 3:
            fatigue_impact += 2.0
        elif abs(tz_change) >= 2:
            fatigue_impact += 1.0
        
        # Calculate total recent travel (last 7 days)
        recent_games = [g for g in previous_games if (datetime.now() - g['date']).days <= 7]
        total_recent_miles = sum(
            self.calculate_travel_distance(recent_games[i]['location'], recent_games[i-1]['location'])
            for i in range(1, len(recent_games))
        )
        
        # Long road trip factor
        consecutive_away = self._count_consecutive_away_games(previous_games)
        if consecutive_away >= 4:
            fatigue_impact += 2.0
        
        return {
            'distance_miles': distance,
            'travel_category': travel_category,
            'timezone_changes': tz_change,
            'travel_fatigue': min(fatigue_impact, 10),
            'total_recent_miles': total_recent_miles,
            'consecutive_away_games': consecutive_away,
            'is_long_road_trip': consecutive_away >= 4,
            'performance_impact': -fatigue_impact * 0.01  # Convert to percentage
        }
    
    def analyze_rest_advantage(self, team1_id, team2_id, team1_rest, team2_rest):
        """
        Compare rest advantage between two teams
        """
        team1_fatigue = team1_rest['fatigue_level']
        team2_fatigue = team2_rest['fatigue_level']
        
        fatigue_diff = team1_fatigue - team2_fatigue
        
        # Rest edge
        if abs(fatigue_diff) >= 3:
            rest_edge = 'team1' if fatigue_diff < 0 else 'team2'
            edge_significance = 'significant'
        elif abs(fatigue_diff) >= 1.5:
            rest_edge = 'team1' if fatigue_diff < 0 else 'team2'
            edge_significance = 'moderate'
        else:
            rest_edge = 'none'
            edge_significance = 'minimal'
        
        # Specific advantages
        advantages = []
        
        if team1_rest['is_back_to_back'] and not team2_rest['is_back_to_back']:
            advantages.append({
                'team': 'team2',
                'advantage': 'Rest advantage - opponent on back-to-back',
                'impact': 'high'
            })
        
        if team1_rest['is_3_in_4'] and not team2_rest['is_3_in_4']:
            advantages.append({
                'team': 'team2',
                'advantage': 'Rest advantage - opponent playing 3-in-4',
                'impact': 'medium'
            })
        
        if team1_rest['days_rest'] >= 3 and team2_rest['days_rest'] <= 1:
            advantages.append({
                'team': 'team1',
                'advantage': f"{team1_rest['days_rest']} days rest vs {team2_rest['days_rest']}",
                'impact': 'medium'
            })
        
        return {
            'team1_fatigue': team1_fatigue,
            'team2_fatigue': team2_fatigue,
            'fatigue_differential': fatigue_diff,
            'rest_edge': rest_edge,
            'edge_significance': edge_significance,
            'advantages': advantages,
            'betting_recommendation': self._generate_rest_betting_rec(rest_edge, edge_significance)
        }
    
    def analyze_schedule_difficulty(self, team_id, upcoming_games, opponent_ratings):
        """
        Analyze upcoming schedule difficulty
        """
        logger.info(f"Analyzing schedule difficulty for {team_id}")
        
        if not upcoming_games:
            return None
        
        # Calculate average opponent rating
        avg_opponent_rating = np.mean([
            opponent_ratings.get(game['opponent'], 50)
            for game in upcoming_games
        ])
        
        # Count back-to-backs and 3-in-4s in upcoming stretch
        dates = sorted([g['date'] for g in upcoming_games])
        back_to_backs = sum(
            1 for i in range(1, len(dates))
            if (dates[i] - dates[i-1]).days == 0
        )
        
        # Home/away split
        home_games = sum(1 for g in upcoming_games if g['is_home'])
        away_games = len(upcoming_games) - home_games
        
        # Travel miles
        total_miles = sum(
            self.calculate_travel_distance(upcoming_games[i]['location'], upcoming_games[i+1]['location'])
            for i in range(len(upcoming_games) - 1)
        )
        
        # Difficulty score (0-100)
        difficulty = (
            (avg_opponent_rating / 100) * 40 +  # Opponent strength: 40 points
            (back_to_backs * 10) +               # B2Bs: 10 points each
            (away_games / len(upcoming_games)) * 20 +  # Away games: 20 points
            (total_miles / 10000) * 20           # Travel: 20 points per 10k miles
        )
        
        difficulty_rating = 'brutal' if difficulty > 75 else 'tough' if difficulty > 60 else 'average' if difficulty > 40 else 'easy'
        
        return {
            'num_games': len(upcoming_games),
            'avg_opponent_rating': avg_opponent_rating,
            'back_to_backs': back_to_backs,
            'home_games': home_games,
            'away_games': away_games,
            'total_travel_miles': total_miles,
            'difficulty_score': difficulty,
            'difficulty_rating': difficulty_rating,
            'regression_candidate': difficulty > 70,
            'bounce_back_candidate': difficulty < 35
        }
    
    def _calculate_timezone_change(self, from_city, to_city):
        """
        Calculate timezone change between cities
        """
        # Simplified timezone mapping
        eastern = ['ATL', 'BOS', 'BKN', 'CHA', 'CLE', 'DET', 'IND', 'MIA', 'NYK', 'ORL', 'PHI', 'TOR', 'WAS']
        central = ['CHI', 'DAL', 'HOU', 'MEM', 'MIL', 'MIN', 'NOP', 'OKC', 'SAS']
        mountain = ['DEN', 'UTA']
        pacific = ['GSW', 'LAC', 'LAL', 'PHX', 'POR', 'SAC']
        
        def get_tz_offset(city):
            if city in eastern:
                return -5
            elif city in central:
                return -6
            elif city in mountain:
                return -7
            elif city in pacific:
                return -8
            return 0
        
        return get_tz_offset(to_city) - get_tz_offset(from_city)
    
    def _count_consecutive_away_games(self, previous_games):
        """
        Count consecutive away games (road trip length)
        """
        consecutive = 0
        for game in sorted(previous_games, key=lambda x: x['date'], reverse=True):
            if not game.get('is_home', False):
                consecutive += 1
            else:
                break
        return consecutive
    
    def _generate_rest_betting_rec(self, edge, significance):
        """
        Generate betting recommendation based on rest advantage
        """
        if edge == 'none' or significance == 'minimal':
            return {
                'recommendation': 'neutral',
                'reasoning': 'No significant rest advantage'
            }
        
        favored_team = edge
        
        if significance == 'significant':
            return {
                'recommendation': f'Bet {favored_team} spread',
                'reasoning': f'{favored_team} has significant rest advantage - back rested team',
                'confidence': 'high'
            }
        else:
            return {
                'recommendation': f'Consider {favored_team}',
                'reasoning': f'{favored_team} has moderate rest advantage',
                'confidence': 'medium'
            }

# Export singleton
rest_travel_analyzer = RestTravelAnalyzer()
