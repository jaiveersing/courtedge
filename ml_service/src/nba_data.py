import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from nba_api.stats.endpoints import playergamelog, leaguegamefinder, teamgamelog, commonplayerinfo
from nba_api.stats.static import players, teams
import logging
from pathlib import Path
import json

logger = logging.getLogger(__name__)

class NBADataCollector:
    """
    Real NBA data collection using nba_api
    """
    
    def __init__(self, cache_dir='../data/cache'):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.all_players = players.get_players()
        self.all_teams = teams.get_teams()
    
    def find_player_by_name(self, player_name: str):
        """Find player by name"""
        for player in self.all_players:
            if player_name.lower() in player['full_name'].lower():
                return player
        return None
    
    def get_player_season_stats(self, player_id: str, season: str = '2023-24'):
        """
        Fetch player season stats
        """
        try:
            cache_file = self.cache_dir / f"player_{player_id}_{season}.json"
            
            # Check cache (1 day TTL)
            if cache_file.exists():
                mtime = datetime.fromtimestamp(cache_file.stat().st_mtime)
                if (datetime.now() - mtime).days < 1:
                    with open(cache_file, 'r') as f:
                        return json.load(f)
            
            # Fetch from API
            gamelog = playergamelog.PlayerGameLog(
                player_id=player_id,
                season=season
            )
            
            df = gamelog.get_data_frames()[0]
            
            if df.empty:
                return None
            
            # Calculate season averages
            stats = {
                'player_id': player_id,
                'season': season,
                'games_played': len(df),
                'ppg': df['PTS'].mean(),
                'rpg': df['REB'].mean(),
                'apg': df['AST'].mean(),
                'fg_pct': df['FG_PCT'].mean() * 100,
                'fg3_pct': df['FG3_PCT'].mean() * 100,
                'ft_pct': df['FT_PCT'].mean() * 100,
                'mpg': df['MIN'].mean(),
                'stl_pg': df['STL'].mean(),
                'blk_pg': df['BLK'].mean(),
                'tov_pg': df['TOV'].mean(),
                'recent_games': df.head(10).to_dict('records'),
                'last_updated': datetime.now().isoformat()
            }
            
            # Cache results
            with open(cache_file, 'w') as f:
                json.dump(stats, f)
            
            logger.info(f"✅ Fetched stats for player {player_id}")
            return stats
            
        except Exception as e:
            logger.error(f"Error fetching player stats: {str(e)}")
            return None
    
    def get_player_game_logs(self, player_id: str, season: str = '2023-24', last_n: int = 30):
        """
        Get last N games for a player
        """
        try:
            gamelog = playergamelog.PlayerGameLog(
                player_id=player_id,
                season=season
            )
            
            df = gamelog.get_data_frames()[0]
            
            if df.empty:
                return []
            
            games = df.head(last_n).to_dict('records')
            
            return games
            
        except Exception as e:
            logger.error(f"Error fetching game logs: {str(e)}")
            return []
    
    def get_team_stats(self, team_id: str, season: str = '2023-24'):
        """
        Fetch team statistics
        """
        try:
            gamelog = teamgamelog.TeamGameLog(
                team_id=team_id,
                season=season
            )
            
            df = gamelog.get_data_frames()[0]
            
            if df.empty:
                return None
            
            stats = {
                'team_id': team_id,
                'season': season,
                'games_played': len(df),
                'ppg': df['PTS'].mean(),
                'opp_ppg': df['OPP_PTS'].mean(),
                'fg_pct': df['FG_PCT'].mean() * 100,
                'fg3_pct': df['FG3_PCT'].mean() * 100,
                'wins': df['WL'].value_counts().get('W', 0),
                'losses': df['WL'].value_counts().get('L', 0),
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error fetching team stats: {str(e)}")
            return None
    
    def get_todays_games(self):
        """
        Fetch today's NBA games
        """
        try:
            from nba_api.live.nba.endpoints import scoreboard
            
            board = scoreboard.ScoreBoard()
            games = board.games.get_dict()
            
            logger.info(f"✅ Fetched {len(games)} games for today")
            return games
            
        except Exception as e:
            logger.error(f"Error fetching today's games: {str(e)}")
            return []
    
    def calculate_advanced_features(self, player_stats: dict, opponent_stats: dict = None):
        """
        Calculate advanced features for ML model
        """
        features = {}
        
        # Basic stats
        features['ppg'] = player_stats.get('ppg', 0)
        features['rpg'] = player_stats.get('rpg', 0)
        features['apg'] = player_stats.get('apg', 0)
        
        # Efficiency
        features['fg_pct'] = player_stats.get('fg_pct', 0)
        features['true_shooting_pct'] = self.calculate_ts_pct(player_stats)
        
        # Recent form
        recent_games = player_stats.get('recent_games', [])
        if recent_games:
            features['l5_ppg'] = np.mean([g['PTS'] for g in recent_games[:5]])
            features['l10_ppg'] = np.mean([g['PTS'] for g in recent_games[:10]])
        
        # Opponent adjustment
        if opponent_stats:
            features['opp_def_rating'] = opponent_stats.get('opp_ppg', 110)
        
        return features
    
    def calculate_ts_pct(self, stats: dict) -> float:
        """Calculate True Shooting %"""
        try:
            pts = stats.get('ppg', 0)
            fga = stats.get('fga', 0)
            fta = stats.get('fta', 0)
            
            if fga == 0 and fta == 0:
                return 0
            
            ts_pct = pts / (2 * (fga + 0.44 * fta)) if (fga + 0.44 * fta) > 0 else 0
            return ts_pct * 100
        except:
            return 0

# Global instance
nba_data_collector = NBADataCollector()
