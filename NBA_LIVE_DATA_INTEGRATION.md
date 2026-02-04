# 🏀 NBA Live Data Integration - CourtEdge

## Overview

CourtEdge now fetches **REAL-TIME NBA data** from ESPN's public API instead of using static mock data. This document outlines the changes made and how the live data system works.

## Data Sources

### Primary: ESPN API (No API Key Required)
- **Base URL**: `https://site.api.espn.com/apis/site/v2/sports/basketball/nba`
- **Endpoints Used**:
  - `/scoreboard` - Live game scores and today's games
  - `/teams` - All 30 NBA teams
  - `/teams/{id}/roster` - Team rosters with player details
  - `/athletes/{id}` - Individual player stats
  - `/standings` - Conference standings
  - `/news` - Latest NBA news
  - `/summary?event={gameId}` - Game box scores

### Secondary: Ball Don't Lie API (Free, No Key)
- **Base URL**: `https://api.balldontlie.io/v1`
- Backup data source for historical stats

## Files Created/Modified

### NEW FILES

#### `src/api/nbaLiveService.js`
Frontend service for fetching live NBA data with caching:
- `getLiveScoreboard()` - Get today's games with live scores
- `getAllTeams()` - Get all 30 NBA teams
- `getTeamRoster(teamId)` - Get team roster
- `getPlayerStats(playerId)` - Get player season stats
- `getStandings()` - Get conference standings
- `getNBANews()` - Get latest news
- `searchPlayer(query)` - Search for players
- `getGameBoxScore(gameId)` - Get game box score

#### `server/nbaLiveApi.js`
Server-side API fetching with caching:
- Same endpoints as frontend service
- Server-side caching for performance
- Rate limit protection

#### `Components/ray/RayLiveDataWrapper.js`
Wrapper for Ray AI assistant to use live data:
- Merges live ESPN data with static advanced metrics
- Provides live scoreboard, standings, player data
- Falls back to static data when API unavailable

### MODIFIED FILES

#### `server/nbaPlayers.js`
**Before**: Imported static `nbaPlayersDatabase` (5410 lines of mock data)  
**After**: Fetches from ESPN API via `nbaLiveApi.js`

**New Endpoints Added**:
- `GET /api/scoreboard` - Live NBA scoreboard
- `GET /api/standings` - Current standings
- `GET /api/news` - NBA news
- `GET /api/boxscore/:gameId` - Game box scores
- `GET /api/cache/status` - View cache status
- `POST /api/cache/clear` - Clear all caches

#### `src/api/playersApi.js`
**Before**: Fell back to static `nbaPlayersDatabase` on API errors  
**After**: Pure API calls, no static data fallback

**New Methods Added**:
- `getLiveScoreboard()` - Get live game scores
- `getStandings()` - Get standings
- `getNews()` - Get news
- `getBoxScore(gameId)` - Get box score
- `getCacheStatus()` - View cache status
- `clearCache()` - Clear caches

#### `Pages/Analytics.jsx`
**Before**: Generated mock player data with `generateMockPlayerData()`  
**After**: Fetches real players from `PlayersAPI.getPlayers()`

#### `Pages/PlayerTrends.jsx`
**Before**: Generated static trend data  
**After**: Fetches live players, generates trends from real player stats

#### `Pages/MLWorkstation.jsx`
**Before**: Used static `nbaPlayersDatabase`  
**After**: Fetches live players from API

#### `Components/ray/RayAnalyticsEngine.js`
**Before**: Only used static `PLAYERS_DB`  
**After**: Can merge live data with static advanced metrics

## Caching Strategy

All API responses are cached to prevent rate limiting and improve performance:

| Data Type | Cache Duration |
|-----------|---------------|
| Live Scores | 30 seconds |
| Box Scores | 1 minute |
| Player Stats | 5 minutes |
| All Players | 15 minutes |
| Rosters | 30 minutes |
| Standings | 15 minutes |
| News | 10 minutes |
| Teams | 24 hours |

## What's Still Static (By Design)

### `src/data/mockBetsDatabase.js` - KEPT
Per user request, mock betting data is retained for chart demonstrations.

### `Components/ray/RayEnhancedDatabase.js` - KEPT AS REFERENCE
Contains advanced betting metrics that ESPN doesn't provide:
- Prop hit rates
- Home/away splits
- Rest day analysis
- Clutch performance
- Correlation data
- Fantasy projections

These are used as supplementary data when analyzing bets.

### `Components/ray/RayAnalyticsEngine.js` - KEPT AS REFERENCE
Contains detailed player analysis data:
- Historical matchup data
- Prop correlation analysis
- Betting pattern analysis

Used as fallback and for advanced analytics not available from APIs.

## Usage Examples

### Get Live Scoreboard
```javascript
import PlayersAPI from '@/src/api/playersApi';

const scoreboard = await PlayersAPI.getLiveScoreboard();
// Returns: { success: true, data: { games: [...], date: '...' } }
```

### Search Players (Live)
```javascript
const results = await PlayersAPI.searchPlayers('LeBron');
// Returns: { success: true, data: [{id, name, team, ...}], source: 'live' }
```

### Get Team Roster
```javascript
const roster = await PlayersAPI.getTeamPlayers('LAL');
// Returns: { success: true, data: [{...player}], team: 'LAL', source: 'live' }
```

### Get Player Stats
```javascript
const player = await PlayersAPI.getPlayerById(3032978); // ESPN ID
// Returns: { success: true, data: {...fullStats}, source: 'live' }
```

## Error Handling

All live data functions handle errors gracefully:
1. Return empty arrays/objects on failure
2. Log errors to console
3. No crashes or exceptions thrown to UI

## Testing the Integration

1. Start the backend server:
```bash
npm start
```

2. Test the live endpoints:
```bash
# Get live scoreboard
curl http://localhost:3001/api/scoreboard

# Get all teams
curl http://localhost:3001/api/teams

# Search for a player
curl http://localhost:3001/api/players/search/Curry

# Get Lakers roster
curl http://localhost:3001/api/players/team/LAL

# Get standings
curl http://localhost:3001/api/standings
```

3. Start the frontend:
```bash
npm run dev
```

4. Navigate to Analytics, Player Trends, or ML Workstation pages to see live data.

## Notes

- ESPN API is rate-limited; caching is essential
- Some detailed stats (advanced metrics, prop history) still come from static data
- Live data is best-effort - graceful degradation to empty states on failure
- All responses include `source: 'live'` or `source: 'cache'` for debugging
