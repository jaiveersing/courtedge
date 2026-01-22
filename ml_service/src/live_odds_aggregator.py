"""
Live Odds Aggregator
Aggregates real-time odds from multiple sportsbooks
Detects line movements, arbitrage, and best available odds
"""

import os
import asyncio
import aiohttp
import time
from datetime import datetime, timedelta
import logging
from collections import defaultdict
import numpy as np

logger = logging.getLogger(__name__)

class LiveOddsAggregator:
    def __init__(self):
        self.api_keys = {
            'the_odds_api': os.getenv('ODDS_API_KEY'),
            'sportsdata': os.getenv('SPORTSDATA_API_KEY'),
            'rapidapi': os.getenv('RAPID_API_KEY')
        }
        
        # Sportsbook mappings
        self.sportsbooks = [
            'fanduel', 'draftkings', 'bet365', 'betmgm', 'caesars',
            'pointsbet', 'barstool', 'wynnbet', 'unibet', 'betrivers'
        ]
        
        # Cache for odds data
        self.odds_cache = {}
        self.cache_ttl = 30  # 30 seconds
        
        # Line movement tracking
        self.line_history = defaultdict(list)
        
        # WebSocket connections for real-time feeds
        self.ws_connections = {}
    
    async def fetch_all_odds(self, sport='basketball_nba', markets=['h2h', 'spreads', 'totals']):
        """
        Fetch odds from all available sources
        """
        logger.info(f"Fetching odds for {sport}, markets: {markets}")
        
        cache_key = f"{sport}_{','.join(markets)}"
        
        # Check cache
        if cache_key in self.odds_cache:
            cached = self.odds_cache[cache_key]
            if time.time() - cached['timestamp'] < self.cache_ttl:
                return cached['data']
        
        # Fetch from all sources in parallel
        tasks = [
            self._fetch_the_odds_api(sport, markets),
            self._fetch_sportsdata_api(sport),
            self._fetch_rapidapi_odds(sport)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Merge results
        all_odds = []
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Fetch error: {result}")
                continue
            if result:
                all_odds.extend(result)
        
        # Aggregate and normalize
        aggregated = self._aggregate_odds(all_odds)
        
        # Cache result
        self.odds_cache[cache_key] = {
            'data': aggregated,
            'timestamp': time.time()
        }
        
        # Track line movements
        self._track_line_movements(aggregated)
        
        return aggregated
    
    async def _fetch_the_odds_api(self, sport, markets):
        """
        Fetch from The Odds API
        """
        try:
            base_url = 'https://api.the-odds-api.com/v4/sports'
            
            async with aiohttp.ClientSession() as session:
                all_games = []
                
                for market in markets:
                    url = f"{base_url}/{sport}/odds"
                    params = {
                        'apiKey': self.api_keys['the_odds_api'],
                        'regions': 'us',
                        'markets': market,
                        'oddsFormat': 'american',
                        'bookmakers': ','.join(self.sportsbooks)
                    }
                    
                    async with session.get(url, params=params) as response:
                        if response.status == 200:
                            data = await response.json()
                            all_games.extend(self._parse_the_odds_api(data, market))
                
                return all_games
                
        except Exception as e:
            logger.error(f"The Odds API error: {e}")
            return []
    
    async def _fetch_sportsdata_api(self, sport):
        """
        Fetch from SportsData.io API
        """
        try:
            # Map sport to endpoint
            if 'nba' in sport:
                endpoint = 'nba'
            elif 'nfl' in sport:
                endpoint = 'nfl'
            else:
                return []
            
            base_url = f'https://api.sportsdata.io/v3/{endpoint}/odds/json/GameOdds'
            
            async with aiohttp.ClientSession() as session:
                headers = {'Ocp-Apim-Subscription-Key': self.api_keys['sportsdata']}
                
                async with session.get(base_url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_sportsdata_api(data)
            
            return []
            
        except Exception as e:
            logger.error(f"SportsData API error: {e}")
            return []
    
    async def _fetch_rapidapi_odds(self, sport):
        """
        Fetch from RapidAPI odds providers
        """
        try:
            # Use API-BASKETBALL for NBA odds
            if 'nba' not in sport:
                return []
            
            url = "https://api-basketball.p.rapidapi.com/odds"
            
            async with aiohttp.ClientSession() as session:
                headers = {
                    'X-RapidAPI-Key': self.api_keys['rapidapi'],
                    'X-RapidAPI-Host': 'api-basketball.p.rapidapi.com'
                }
                params = {'league': '12', 'season': '2025'}  # NBA
                
                async with session.get(url, headers=headers, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_rapidapi_odds(data)
            
            return []
            
        except Exception as e:
            logger.error(f"RapidAPI error: {e}")
            return []
    
    def _parse_the_odds_api(self, data, market_type):
        """
        Parse The Odds API response
        """
        games = []
        
        for game in data:
            game_data = {
                'game_id': game['id'],
                'commence_time': game['commence_time'],
                'home_team': game['home_team'],
                'away_team': game['away_team'],
                'market_type': market_type,
                'bookmakers': []
            }
            
            for bookmaker in game.get('bookmakers', []):
                book_data = {
                    'name': bookmaker['key'],
                    'last_update': bookmaker['last_update']
                }
                
                for market in bookmaker.get('markets', []):
                    if market['key'] == market_type:
                        book_data['outcomes'] = market['outcomes']
                
                game_data['bookmakers'].append(book_data)
            
            games.append(game_data)
        
        return games
    
    def _parse_sportsdata_api(self, data):
        """
        Parse SportsData.io response
        """
        games = []
        
        for game in data:
            for sportsbook in game.get('PregameOdds', []):
                game_data = {
                    'game_id': game['GameID'],
                    'home_team': game['HomeTeam'],
                    'away_team': game['AwayTeam'],
                    'commence_time': game['DateTime'],
                    'bookmaker': sportsbook['Sportsbook'],
                    'spread': {
                        'home': sportsbook.get('HomePointSpread'),
                        'away': sportsbook.get('AwayPointSpread'),
                        'home_odds': sportsbook.get('HomePointSpreadPayout'),
                        'away_odds': sportsbook.get('AwayPointSpreadPayout')
                    },
                    'moneyline': {
                        'home': sportsbook.get('HomeMoneyLine'),
                        'away': sportsbook.get('AwayMoneyLine')
                    },
                    'total': {
                        'value': sportsbook.get('OverUnder'),
                        'over_odds': sportsbook.get('OverPayout'),
                        'under_odds': sportsbook.get('UnderPayout')
                    }
                }
                games.append(game_data)
        
        return games
    
    def _parse_rapidapi_odds(self, data):
        """
        Parse RapidAPI response
        """
        # Implementation depends on specific API structure
        return []
    
    def _aggregate_odds(self, all_odds):
        """
        Aggregate odds from multiple sources
        """
        # Group by game
        games_map = defaultdict(lambda: {
            'bookmakers': {},
            'best_odds': {},
            'market_consensus': {}
        })
        
        for odds_data in all_odds:
            game_key = f"{odds_data['home_team']}_{odds_data['away_team']}"
            game = games_map[game_key]
            
            # Add basic info
            if 'home_team' not in game:
                game.update({
                    'game_id': odds_data.get('game_id'),
                    'home_team': odds_data['home_team'],
                    'away_team': odds_data['away_team'],
                    'commence_time': odds_data.get('commence_time')
                })
            
            # Add bookmaker odds
            bookmaker = odds_data.get('bookmaker', 'unknown')
            if bookmaker not in game['bookmakers']:
                game['bookmakers'][bookmaker] = {}
            
            # Store odds by market type
            if 'spread' in odds_data:
                game['bookmakers'][bookmaker]['spread'] = odds_data['spread']
            if 'moneyline' in odds_data:
                game['bookmakers'][bookmaker]['moneyline'] = odds_data['moneyline']
            if 'total' in odds_data:
                game['bookmakers'][bookmaker]['total'] = odds_data['total']
        
        # Calculate best odds and consensus for each game
        for game_key, game in games_map.items():
            game['best_odds'] = self._find_best_odds(game['bookmakers'])
            game['market_consensus'] = self._calculate_consensus(game['bookmakers'])
        
        return list(games_map.values())
    
    def _find_best_odds(self, bookmakers):
        """
        Find best available odds across all bookmakers
        """
        best = {
            'moneyline': {'home': {'odds': -float('inf'), 'book': None}, 
                         'away': {'odds': -float('inf'), 'book': None}},
            'spread': {'home': {'odds': -float('inf'), 'book': None}, 
                      'away': {'odds': -float('inf'), 'book': None}},
            'total': {'over': {'odds': -float('inf'), 'book': None}, 
                     'under': {'odds': -float('inf'), 'book': None}}
        }
        
        for book, odds in bookmakers.items():
            # Moneyline
            if 'moneyline' in odds:
                if odds['moneyline'].get('home', -10000) > best['moneyline']['home']['odds']:
                    best['moneyline']['home'] = {'odds': odds['moneyline']['home'], 'book': book}
                if odds['moneyline'].get('away', -10000) > best['moneyline']['away']['odds']:
                    best['moneyline']['away'] = {'odds': odds['moneyline']['away'], 'book': book}
            
            # Spread
            if 'spread' in odds:
                if odds['spread'].get('home_odds', -10000) > best['spread']['home']['odds']:
                    best['spread']['home'] = {'odds': odds['spread']['home_odds'], 'book': book, 'line': odds['spread']['home']}
                if odds['spread'].get('away_odds', -10000) > best['spread']['away']['odds']:
                    best['spread']['away'] = {'odds': odds['spread']['away_odds'], 'book': book, 'line': odds['spread']['away']}
            
            # Total
            if 'total' in odds:
                if odds['total'].get('over_odds', -10000) > best['total']['over']['odds']:
                    best['total']['over'] = {'odds': odds['total']['over_odds'], 'book': book, 'line': odds['total']['value']}
                if odds['total'].get('under_odds', -10000) > best['total']['under']['odds']:
                    best['total']['under'] = {'odds': odds['total']['under_odds'], 'book': book, 'line': odds['total']['value']}
        
        return best
    
    def _calculate_consensus(self, bookmakers):
        """
        Calculate market consensus (average) lines
        """
        spreads = []
        totals = []
        
        for book, odds in bookmakers.items():
            if 'spread' in odds and odds['spread'].get('home') is not None:
                spreads.append(odds['spread']['home'])
            if 'total' in odds and odds['total'].get('value') is not None:
                totals.append(odds['total']['value'])
        
        return {
            'spread': np.mean(spreads) if spreads else None,
            'total': np.mean(totals) if totals else None,
            'num_books': len(bookmakers)
        }
    
    def _track_line_movements(self, games):
        """
        Track line movements over time
        """
        timestamp = datetime.now()
        
        for game in games:
            game_key = f"{game['home_team']}_{game['away_team']}"
            
            self.line_history[game_key].append({
                'timestamp': timestamp,
                'consensus': game['market_consensus'],
                'best_odds': game['best_odds']
            })
            
            # Keep last 100 entries
            if len(self.line_history[game_key]) > 100:
                self.line_history[game_key] = self.line_history[game_key][-100:]
    
    def get_line_movement(self, game_id, lookback_minutes=60):
        """
        Get line movement history for a game
        """
        if game_id not in self.line_history:
            return []
        
        cutoff_time = datetime.now() - timedelta(minutes=lookback_minutes)
        
        recent_history = [
            entry for entry in self.line_history[game_id]
            if entry['timestamp'] > cutoff_time
        ]
        
        return recent_history
    
    def detect_steam_moves(self, game_id, threshold=1.0):
        """
        Detect sharp money steam moves
        """
        history = self.get_line_movement(game_id, lookback_minutes=15)
        
        if len(history) < 2:
            return None
        
        # Check spread movement
        spreads = [h['consensus']['spread'] for h in history if h['consensus']['spread'] is not None]
        
        if len(spreads) >= 2:
            movement = abs(spreads[-1] - spreads[0])
            
            if movement >= threshold:
                return {
                    'type': 'steam_move',
                    'market': 'spread',
                    'movement': movement,
                    'direction': 'up' if spreads[-1] > spreads[0] else 'down',
                    'time_window': '15min',
                    'significance': 'high' if movement >= 2.0 else 'medium'
                }
        
        return None

# Export singleton
odds_aggregator = LiveOddsAggregator()
