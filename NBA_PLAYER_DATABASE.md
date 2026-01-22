# NBA Player Database - Usage Guide

## Overview
A comprehensive database of 100 NBA players with complete 2025-26 season statistics, including traditional stats, advanced metrics, and player information.

## Files Created

### 1. **src/data/nbaPlayersDatabase.js**
- Database of 100 NBA players
- Includes all 30 NBA teams
- Complete stats: PPG, RPG, APG, shooting percentages, advanced metrics
- Player info: height, weight, age, position, jersey number

### 2. **server/nbaPlayers.js**
- Express.js API routes for server-side operations
- 15+ endpoints for filtering, searching, sorting
- Team statistics aggregation
- Position averages
- Statistical leaders

### 3. **src/api/playersApi.js**
- Frontend API client
- Automatic fallback to local data if server unavailable
- All API methods with error handling
- Helper methods for common operations

### 4. **Components/player/PlayerDatabase.jsx**
- Full-featured player database UI
- Search, filter by team/position
- Table and card view modes
- Statistical leaders dashboard
- Sorting by any stat
- Pagination

## API Endpoints

### GET /api/players
Get all players with filtering and pagination
```javascript
// Query parameters:
// - team: Filter by team code (LAL, GSW, etc.)
// - position: Filter by position (PG, SG, SF, PF, C)
// - minPpg, minRpg, minApg: Minimum stats
// - search: Search by player name
// - sortBy: Field to sort by
// - sortOrder: asc or desc
// - page: Page number
// - limit: Items per page

fetch('/api/players?team=LAL&sortBy=ppg&sortOrder=desc')
```

### GET /api/players/:id
Get single player by ID
```javascript
fetch('/api/players/1')
```

### GET /api/players/team/:teamCode
Get all players for a specific team
```javascript
fetch('/api/players/team/LAL')
```

### GET /api/players/search/:query
Search players by name
```javascript
fetch('/api/players/search/lebron')
```

### GET /api/players/stats/leaders
Get statistical leaders
```javascript
// Query: stat=ppg&limit=10
fetch('/api/players/stats/leaders?stat=ppg&limit=10')
```

### GET /api/players/stats/compare
Compare multiple players
```javascript
// Query: ids=1,2,3
fetch('/api/players/stats/compare?ids=1,2,3')
```

### GET /api/players/stats/team-stats/:teamCode
Get aggregate team statistics
```javascript
fetch('/api/players/stats/team-stats/LAL')
```

### GET /api/teams
Get list of all teams
```javascript
fetch('/api/teams')
```

### GET /api/players/stats/position-averages
Get average stats by position
```javascript
fetch('/api/players/stats/position-averages')
```

### POST /api/players/filter
Advanced filtering with multiple conditions
```javascript
fetch('/api/players/filter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filters: [
      { field: 'ppg', operator: 'gte', value: 20 },
      { field: 'per', operator: 'gte', value: 20 }
    ],
    sortBy: 'ppg',
    sortOrder: 'desc'
  })
})
```

## Frontend API Usage

```javascript
import PlayersAPI from '@/api/playersApi';

// Get players with filters
const result = await PlayersAPI.getPlayers({
  team: 'LAL',
  position: 'PG',
  minPpg: 20,
  sortBy: 'ppg',
  sortOrder: 'desc',
  page: 1,
  limit: 20
});

// Get single player
const player = await PlayersAPI.getPlayerById(1);

// Search players
const results = await PlayersAPI.searchPlayers('lebron');

// Get statistical leaders
const scoringLeaders = await PlayersAPI.getLeaders('ppg', 10);
const reboundLeaders = await PlayersAPI.getLeaders('rpg', 10);
const assistLeaders = await PlayersAPI.getLeaders('apg', 10);

// Compare players
const comparison = await PlayersAPI.comparePlayers([1, 2, 3]);

// Get team stats
const teamStats = await PlayersAPI.getTeamStats('LAL');

// Get all teams
const teams = await PlayersAPI.getTeams();

// Get position averages
const positionAvgs = await PlayersAPI.getPositionAverages();

// Advanced filtering
const filtered = await PlayersAPI.advancedFilter([
  { field: 'ppg', operator: 'gte', value: 25 },
  { field: 'per', operator: 'gte', value: 22 }
], 'ppg', 'desc');

// Get random players
const random = PlayersAPI.getRandomPlayers(5);

// Get top performers
const topPerformers = PlayersAPI.getTopPerformers(50);
// Returns: { scoring, rebounding, assists, efficiency, shooting, defense }
```

## Database Schema

Each player object contains:
```javascript
{
  id: 1,
  name: "LeBron James",
  team: "LAL",
  teamName: "Los Angeles Lakers",
  position: "SF",
  age: 41,
  height: "6'9\"",
  weight: 250,
  jersey: 23,
  
  // Traditional stats
  ppg: 24.8,
  rpg: 7.2,
  apg: 7.8,
  spg: 1.2,
  bpg: 0.6,
  tpg: 3.1,
  
  // Shooting percentages
  fgPct: 0.512,
  fg3Pct: 0.389,
  ftPct: 0.735,
  
  // Advanced metrics
  gamesPlayed: 58,
  minutesPerGame: 34.5,
  offensive_rating: 118.5,
  defensive_rating: 112.3,
  per: 24.6,
  ts_pct: 0.601,
  usg_pct: 29.3
}
```

## UI Features

### Player Database Page
Access at: `/players`

**Features:**
- 🔍 Real-time search by player name
- 🏀 Filter by team (all 30 NBA teams)
- 📍 Filter by position (PG, SG, SF, PF, C)
- 📊 Statistical leaders cards (scoring, rebounding, assists)
- 🔄 Sort by any stat (PPG, RPG, APG, PER, etc.)
- 👁️ Toggle between table and card views
- 📄 Pagination with page numbers
- 📈 Click column headers to sort

### Statistical Leaders
Top 5 players in:
- **Points** (PPG)
- **Rebounds** (RPG)
- **Assists** (APG)

### View Modes
1. **Table View**: Sortable columns, compact data display
2. **Card View**: Visual cards with player stats, team colors

## Integration

The player database is already integrated:
- ✅ Route added: `/players`
- ✅ Navigation menu updated
- ✅ Server API routes mounted
- ✅ Frontend API client ready
- ✅ Full UI component created

## Example Use Cases

### 1. Find Lakers players scoring over 20 PPG
```javascript
const lakersScorers = await PlayersAPI.getPlayers({
  team: 'LAL',
  minPpg: 20,
  sortBy: 'ppg',
  sortOrder: 'desc'
});
```

### 2. Compare top 3 scorers
```javascript
const leaders = await PlayersAPI.getLeaders('ppg', 3);
const ids = leaders.data.map(p => p.id);
const comparison = await PlayersAPI.comparePlayers(ids);
```

### 3. Find efficient big men
```javascript
const centers = await PlayersAPI.advancedFilter([
  { field: 'position', operator: 'eq', value: 'C' },
  { field: 'per', operator: 'gte', value: 20 },
  { field: 'ts_pct', operator: 'gte', value: 0.60 }
], 'per', 'desc');
```

### 4. Get team roster for game matchup
```javascript
const lakersRoster = await PlayersAPI.getTeamPlayers('LAL');
const warriorsRoster = await PlayersAPI.getTeamPlayers('GSW');
```

## Navigation Access

Player Database is accessible via:
- **Sidebar Navigation**: "Player Database" menu item
- **Direct URL**: `http://localhost:5175/players`
- **API**: `http://localhost:3000/api/players`

## Future Enhancements

Potential additions:
- Player comparison tool
- Historical stats trends
- Injury reports integration
- Matchup analysis
- Fantasy point projections
- Player prop suggestions
- Heat maps and shot charts
- Social media integration
- Export to CSV/Excel
