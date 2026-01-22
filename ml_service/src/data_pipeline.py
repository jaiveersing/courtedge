import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
import json
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class NBADataPipeline:
    def __init__(self):
        self.cache = {}
        self.base_url = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba"
    
    def fetch_nba_games_today(self) -> List[Dict]:
        try:
            url = f"{self.base_url}/scoreboard"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                games = []
                
                for event in data.get('events', []):
                    competitors = event['competitions'][0]['competitors']
                    game = {
                        'id': event['id'],
                        'date': event['date'],
                        'name': event['name'],
                        'status': event['status']['type']['name'],
                        'home_team': competitors[0]['team']['abbreviation'],
                        'away_team': competitors[1]['team']['abbreviation'],
                        'home_score': competitors[0].get('score', 0),
                        'away_score': competitors[1].get('score', 0)
                    }
                    games.append(game)
                
                logger.info(f"✅ Fetched {len(games)} games from ESPN")
                return games
            else:
                logger.warning(f"ESPN API returned status {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error fetching games: {str(e)}")
            return []
    
    def fetch_player_season_stats(self, player_name: str) -> Dict:
        try:
            # Mock data - replace with nba_api integration
            return {
                'player_name': player_name,
                'season': '2025-26',
                'stats': {
                    'ppg': 25.3,
                    'rpg': 8.2,
                    'apg': 6.5,
                    'fg_pct': 48.5,
                    'fg3_pct': 36.8,
                    'ft_pct': 82.1,
                    'mpg': 35.2,
                    'per': 24.5
                }
            }
        except Exception as e:
            logger.error(f"Error fetching player stats: {str(e)}")
            return {}
    
    def fetch_team_stats(self, team_abbr: str) -> Dict:
        return {
            'team': team_abbr,
            'offensive_rating': 118.5,
            'defensive_rating': 112.3,
            'net_rating': 6.2,
            'pace': 102.5,
            'record': '28-15'
        }
    
    def collect_daily_data(self):
        logger.info("📊 Starting daily data collection...")
        
        games = self.fetch_nba_games_today()
        
        self.cache['todays_games'] = games
        self.cache['last_updated'] = datetime.now()
        
        logger.info(f"✅ Daily data collection complete. {len(games)} games collected.")
        
        return games
    
    def get_cached_games(self):
        if 'todays_games' in self.cache:
            last_updated = self.cache.get('last_updated')
            if last_updated and (datetime.now() - last_updated).seconds < 300:
                return self.cache['todays_games']
        
        return self.collect_daily_data()

data_pipeline = NBADataPipeline()
