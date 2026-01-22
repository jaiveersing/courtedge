"""
Matchup Analyzer
Deep dive analysis of head-to-head matchups
Identifies strengths, weaknesses, and betting angles
"""

import numpy as np
import pandas as pd
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class MatchupAnalyzer:
    def __init__(self):
        self.matchup_cache = {}
        
    def analyze_matchup(self, team1_id, team2_id, historical_games=None):
        """
        Comprehensive matchup analysis
        
        Args:
            team1_id: First team identifier
            team2_id: Second team identifier
            historical_games: List of previous meetings
        """
        logger.info(f"Analyzing matchup: {team1_id} vs {team2_id}")
        
        cache_key = f"{team1_id}_{team2_id}"
        
        analysis = {
            'team1_id': team1_id,
            'team2_id': team2_id,
            'head_to_head': self._analyze_head_to_head(historical_games) if historical_games else None,
            'style_matchup': self._analyze_style_matchup(team1_id, team2_id),
            'pace_matchup': self._analyze_pace_matchup(team1_id, team2_id),
            'four_factors_matchup': self._analyze_four_factors_matchup(team1_id, team2_id),
            'key_player_matchups': self._analyze_player_matchups(team1_id, team2_id),
            'coaching_matchup': self._analyze_coaching(team1_id, team2_id),
            'betting_angles': self._identify_betting_angles(team1_id, team2_id)
        }
        
        # Add recommendations
        analysis['recommendations'] = self._generate_recommendations(analysis)
        
        return analysis
    
    def _analyze_head_to_head(self, games):
        """
        Analyze historical head-to-head record
        """
        if not games:
            return None
        
        team1_wins = sum(1 for g in games if g['winner'] == g['team1_id'])
        team2_wins = len(games) - team1_wins
        
        # Scoring trends
        team1_avg_score = np.mean([g['team1_score'] for g in games])
        team2_avg_score = np.mean([g['team2_score'] for g in games])
        avg_total = team1_avg_score + team2_avg_score
        
        # Recent trend (last 5 games)
        recent_games = games[-5:]
        recent_team1_wins = sum(1 for g in recent_games if g['winner'] == g['team1_id'])
        
        # Spread performance
        ats_team1 = sum(
            1 for g in games 
            if self._covered_spread(g, 'team1')
        )
        
        return {
            'total_meetings': len(games),
            'team1_wins': team1_wins,
            'team2_wins': team2_wins,
            'team1_win_pct': team1_wins / len(games) * 100,
            'recent_team1_wins': recent_team1_wins,
            'recent_trend': 'team1' if recent_team1_wins >= 3 else 'team2' if recent_team1_wins <= 2 else 'split',
            'avg_team1_score': team1_avg_score,
            'avg_team2_score': team2_avg_score,
            'avg_total': avg_total,
            'team1_ats_record': f"{ats_team1}-{len(games) - ats_team1}",
            'over_under_record': self._analyze_over_under(games)
        }
    
    def _analyze_style_matchup(self, team1_id, team2_id):
        """
        Analyze playing style compatibility
        """
        # Would fetch from database in production
        team1_style = self._get_team_style(team1_id)
        team2_style = self._get_team_style(team2_id)
        
        # Identify style conflicts/synergies
        conflicts = []
        synergies = []
        
        if team1_style['three_point_rate'] > 0.4 and team2_style['three_point_defense_rank'] < 10:
            conflicts.append("Team1 relies on 3-point shooting but Team2 defends perimeter well")
        
        if team1_style['pace_rank'] < 5 and team2_style['pace_rank'] > 25:
            conflicts.append("Major pace differential - expect slower game")
        
        if team1_style['paint_scoring_pct'] > 0.5 and team2_style['rim_protection_rank'] < 10:
            conflicts.append("Team1 scores inside but Team2 has elite rim protection")
        
        if team1_style['turnover_rate'] > 15 and team2_style['forced_turnovers_rank'] < 10:
            synergies.append("Team1 turns it over, Team2 forces turnovers - edge to Team2")
        
        return {
            'team1_style': team1_style,
            'team2_style': team2_style,
            'style_conflicts': conflicts,
            'style_synergies': synergies,
            'matchup_rating': self._calculate_style_matchup_rating(team1_style, team2_style)
        }
    
    def _analyze_pace_matchup(self, team1_id, team2_id):
        """
        Analyze pace dynamics
        """
        team1_pace = self._get_team_stat(team1_id, 'pace')  # Possessions per game
        team2_pace = self._get_team_stat(team2_id, 'pace')
        
        # Expected game pace is geometric mean
        expected_pace = np.sqrt(team1_pace * team2_pace)
        
        # League average is typically 100
        league_avg_pace = 100
        
        pace_impact = {
            'team1_pace': team1_pace,
            'team2_pace': team2_pace,
            'expected_game_pace': expected_pace,
            'vs_league_average': expected_pace - league_avg_pace,
            'pace_category': 'fast' if expected_pace > 102 else 'slow' if expected_pace < 98 else 'average',
            'total_impact': 'favors_over' if expected_pace > 102 else 'favors_under' if expected_pace < 98 else 'neutral'
        }
        
        return pace_impact
    
    def _analyze_four_factors_matchup(self, team1_id, team2_id):
        """
        Analyze Dean Oliver's Four Factors matchup
        """
        team1_off = self._get_four_factors(team1_id, 'offense')
        team1_def = self._get_four_factors(team1_id, 'defense')
        team2_off = self._get_four_factors(team2_id, 'offense')
        team2_def = self._get_four_factors(team2_id, 'defense')
        
        # Calculate advantages
        advantages = {
            'team1_shooting_advantage': (team1_off['efg'] - team2_def['efg_allowed']),
            'team2_shooting_advantage': (team2_off['efg'] - team1_def['efg_allowed']),
            'team1_turnover_advantage': (team2_off['tov_rate'] - team1_off['tov_rate']),
            'team2_turnover_advantage': (team1_off['tov_rate'] - team2_off['tov_rate']),
            'team1_rebounding_advantage': (team1_off['oreb_rate'] - team2_def['dreb_rate']),
            'team2_rebounding_advantage': (team2_off['oreb_rate'] - team1_def['dreb_rate'])
        }
        
        # Weighted score
        team1_score = (
            advantages['team1_shooting_advantage'] * 0.4 +
            advantages['team1_turnover_advantage'] * 0.25 +
            advantages['team1_rebounding_advantage'] * 0.20
        )
        
        team2_score = (
            advantages['team2_shooting_advantage'] * 0.4 +
            advantages['team2_turnover_advantage'] * 0.25 +
            advantages['team2_rebounding_advantage'] * 0.20
        )
        
        return {
            'advantages': advantages,
            'team1_four_factors_score': team1_score,
            'team2_four_factors_score': team2_score,
            'overall_edge': 'team1' if team1_score > team2_score else 'team2'
        }
    
    def _analyze_player_matchups(self, team1_id, team2_id):
        """
        Analyze key individual player matchups
        """
        # Would fetch actual player data in production
        team1_stars = self._get_star_players(team1_id)
        team2_stars = self._get_star_players(team2_id)
        
        matchups = []
        
        for i in range(min(len(team1_stars), len(team2_stars))):
            p1 = team1_stars[i]
            p2 = team2_stars[i]
            
            matchup = {
                'player1': p1['name'],
                'player2': p2['name'],
                'position': p1['position'],
                'player1_ppg': p1['ppg'],
                'player2_ppg': p2['ppg'],
                'edge': 'player1' if p1['ppg'] > p2['ppg'] * 1.1 else 'player2' if p2['ppg'] > p1['ppg'] * 1.1 else 'even',
                'betting_angle': self._get_prop_betting_angle(p1, p2)
            }
            
            matchups.append(matchup)
        
        return matchups
    
    def _analyze_coaching(self, team1_id, team2_id):
        """
        Analyze coaching matchup
        """
        coach1 = self._get_coach_stats(team1_id)
        coach2 = self._get_coach_stats(team2_id)
        
        return {
            'coach1': coach1,
            'coach2': coach2,
            'experience_edge': 'coach1' if coach1['years'] > coach2['years'] else 'coach2' if coach2['years'] > coach1['years'] else 'even',
            'ats_edge': 'coach1' if coach1['ats_pct'] > coach2['ats_pct'] else 'coach2',
            'timeout_usage': {
                'coach1_avg': coach1['timeouts_per_game'],
                'coach2_avg': coach2['timeouts_per_game']
            }
        }
    
    def _identify_betting_angles(self, team1_id, team2_id):
        """
        Identify specific betting opportunities
        """
        angles = []
        
        # Pace-based total angle
        pace_analysis = self._analyze_pace_matchup(team1_id, team2_id)
        if pace_analysis['pace_category'] == 'fast':
            angles.append({
                'type': 'total',
                'bet': 'over',
                'reasoning': f"Expected pace of {pace_analysis['expected_game_pace']:.1f} significantly above average",
                'confidence': 'medium'
            })
        
        # Defensive matchup angle
        team1_def_rank = self._get_team_stat(team1_id, 'def_rating_rank')
        team2_def_rank = self._get_team_stat(team2_id, 'def_rating_rank')
        
        if team1_def_rank < 5 and team2_def_rank < 5:
            angles.append({
                'type': 'total',
                'bet': 'under',
                'reasoning': "Both teams are elite defensively",
                'confidence': 'high'
            })
        
        # Home/away splits
        team1_home_record = self._get_team_stat(team1_id, 'home_record')
        team2_away_record = self._get_team_stat(team2_id, 'away_record')
        
        if team1_home_record['win_pct'] > 0.7 and team2_away_record['win_pct'] < 0.4:
            angles.append({
                'type': 'spread',
                'bet': 'team1',
                'reasoning': f"Team1 strong at home ({team1_home_record['record']}), Team2 weak on road ({team2_away_record['record']})",
                'confidence': 'high'
            })
        
        return angles
    
    def _generate_recommendations(self, analysis):
        """
        Generate betting recommendations based on analysis
        """
        recommendations = []
        
        # Check betting angles
        if analysis['betting_angles']:
            for angle in analysis['betting_angles']:
                if angle['confidence'] == 'high':
                    recommendations.append({
                        'priority': 'high',
                        'recommendation': f"{angle['type'].upper()}: {angle['bet']}",
                        'reason': angle['reasoning']
                    })
        
        # Four Factors edge
        if analysis['four_factors_matchup']:
            edge = analysis['four_factors_matchup']['overall_edge']
            score_diff = abs(
                analysis['four_factors_matchup']['team1_four_factors_score'] -
                analysis['four_factors_matchup']['team2_four_factors_score']
            )
            
            if score_diff > 0.05:
                recommendations.append({
                    'priority': 'medium',
                    'recommendation': f"SPREAD: {edge}",
                    'reason': f"{edge} has significant Four Factors advantage"
                })
        
        return recommendations
    
    # Helper methods (would fetch from database in production)
    
    def _get_team_style(self, team_id):
        """Get team playing style metrics"""
        return {
            'pace_rank': np.random.randint(1, 31),
            'three_point_rate': np.random.uniform(0.3, 0.5),
            'three_point_defense_rank': np.random.randint(1, 31),
            'paint_scoring_pct': np.random.uniform(0.4, 0.6),
            'rim_protection_rank': np.random.randint(1, 31),
            'turnover_rate': np.random.uniform(12, 18),
            'forced_turnovers_rank': np.random.randint(1, 31)
        }
    
    def _get_team_stat(self, team_id, stat_name):
        """Get team statistic"""
        stats = {
            'pace': np.random.uniform(95, 105),
            'def_rating_rank': np.random.randint(1, 31),
            'home_record': {'record': '15-5', 'win_pct': 0.75},
            'away_record': {'record': '8-12', 'win_pct': 0.40}
        }
        return stats.get(stat_name, 0)
    
    def _get_four_factors(self, team_id, side):
        """Get Four Factors stats"""
        return {
            'efg': np.random.uniform(0.50, 0.58),
            'efg_allowed': np.random.uniform(0.50, 0.58),
            'tov_rate': np.random.uniform(12, 16),
            'oreb_rate': np.random.uniform(0.22, 0.30),
            'dreb_rate': np.random.uniform(0.70, 0.78)
        }
    
    def _get_star_players(self, team_id):
        """Get team's star players"""
        return [
            {'name': f'Player{i}', 'position': 'PG', 'ppg': np.random.uniform(15, 30)}
            for i in range(3)
        ]
    
    def _get_coach_stats(self, team_id):
        """Get coach statistics"""
        return {
            'name': f'Coach{team_id}',
            'years': np.random.randint(2, 20),
            'ats_pct': np.random.uniform(0.45, 0.55),
            'timeouts_per_game': np.random.uniform(3, 6)
        }
    
    def _get_prop_betting_angle(self, p1, p2):
        """Identify prop betting angle"""
        if p1['ppg'] > p2['ppg'] * 1.2:
            return f"{p1['name']} over points - strong matchup advantage"
        return None
    
    def _covered_spread(self, game, team):
        """Check if team covered spread"""
        return np.random.random() > 0.5
    
    def _analyze_over_under(self, games):
        """Analyze over/under performance"""
        return "12-8 O/U"
    
    def _calculate_style_matchup_rating(self, style1, style2):
        """Calculate style matchup rating"""
        return np.random.uniform(4, 9)

# Export singleton
matchup_analyzer = MatchupAnalyzer()
