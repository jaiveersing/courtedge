// ═══════════════════════════════════════════════════════════════════════════════════
// 🏀 NBA PLAYERS API - LIVE DATA FROM API-SPORTS.IO
// ═══════════════════════════════════════════════════════════════════════════════════
// Fetches REAL-TIME data from API-Sports.io Basketball API
// ═══════════════════════════════════════════════════════════════════════════════════

import express from 'express';
import nbaLiveApi from './nbaLiveApi.js';

const router = express.Router();

// Cache for player data with stats (populated from multiple API calls)
let playersWithStats = [];
let lastPlayersFetch = 0;
const PLAYERS_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Helper: Get all players with full statistics
 * Fetches from API-Sports.io and caches results
 */
async function getPlayersWithFullStats() {
  const now = Date.now();
  if (playersWithStats.length > 0 && now - lastPlayersFetch < PLAYERS_CACHE_DURATION) {
    return playersWithStats;
  }

  console.log('📡 Fetching fresh player data from API-Sports.io...');
  
  try {
    // Get all players from API
    const allPlayers = await nbaLiveApi.getAllPlayers();
    
    playersWithStats = allPlayers;
    lastPlayersFetch = now;
    
    console.log(`✅ Loaded ${playersWithStats.length} players from live API`);
    return playersWithStats;
  } catch (error) {
    console.error('❌ Failed to fetch players:', error.message);
    return playersWithStats; // Return cached data if available
  }
}

/**
 * GET /api/players
 * Get all players with optional filtering and pagination
 * Query params:
 *   - team: Filter by team code (e.g., LAL, GSW)
 *   - position: Filter by position (PG, SG, SF, PF, C)
 *   - minPpg: Minimum points per game
 *   - minRpg: Minimum rebounds per game
 *   - minApg: Minimum assists per game
 *   - search: Search by player name
 *   - sortBy: Field to sort by (ppg, rpg, apg, per, etc.)
 *   - sortOrder: asc or desc
 *   - page: Page number (default 1)
 *   - limit: Items per page (default 20)
 */
router.get('/players', async (req, res) => {
  try {
    const allPlayers = await getPlayersWithFullStats();
    let filteredPlayers = [...allPlayers];

    // Apply filters
    const { team, position, minPpg, minRpg, minApg, minPer, search, sortBy, sortOrder, page, limit } = req.query;

    if (team) {
      filteredPlayers = filteredPlayers.filter(p => p.team.toLowerCase() === team.toLowerCase());
    }

    if (position) {
      filteredPlayers = filteredPlayers.filter(p => p.position === position.toUpperCase());
    }

    if (minPpg) {
      filteredPlayers = filteredPlayers.filter(p => p.ppg >= parseFloat(minPpg));
    }

    if (minRpg) {
      filteredPlayers = filteredPlayers.filter(p => p.rpg >= parseFloat(minRpg));
    }

    if (minApg) {
      filteredPlayers = filteredPlayers.filter(p => p.apg >= parseFloat(minApg));
    }

    if (minPer) {
      filteredPlayers = filteredPlayers.filter(p => p.per >= parseFloat(minPer));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPlayers = filteredPlayers.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.teamName.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      filteredPlayers.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === 'string') {
          return order * aVal.localeCompare(bVal);
        }
        return order * (aVal - bVal);
      });
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedPlayers,
      pagination: {
        total: filteredPlayers.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredPlayers.length / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/:id
 * Get a single player by ID with full stats
 */
router.get('/players/:id', async (req, res) => {
  try {
    const playerId = parseInt(req.params.id);
    
    // Try to get player stats from API
    const detailedPlayer = await nbaLiveApi.getPlayerStats(playerId);
    if (detailedPlayer && !detailedPlayer.error) {
      return res.json({ success: true, data: detailedPlayer, source: 'live' });
    }

    // Fallback: find in cached roster data
    const allPlayers = await getPlayersWithFullStats();
    const player = allPlayers.find(p => p.id === playerId);

    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }

    res.json({ success: true, data: player, source: 'cache' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/team/:teamCode
 * Get all players for a specific team
 */
router.get('/players/team/:teamCode', async (req, res) => {
  try {
    const teamCode = req.params.teamCode.toUpperCase();
    const teamId = nbaLiveApi.TEAM_IDS[teamCode];

    if (!teamId) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }

    // Fetch team roster
    const roster = await nbaLiveApi.getTeamRoster(teamId);
    const teamPlayers = roster.athletes || [];

    if (teamPlayers.length === 0) {
      return res.status(404).json({ success: false, error: 'Team not found or no players' });
    }

    res.json({
      success: true,
      data: teamPlayers,
      team: teamCode,
      teamName: roster.teamName,
      count: teamPlayers.length,
      source: 'live'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/position/:position
 * Get all players for a specific position
 */
router.get('/players/position/:position', async (req, res) => {
  try {
    const position = req.params.position.toUpperCase();
    const allPlayers = await getPlayersWithFullStats();
    const positionPlayers = allPlayers.filter(p => p.position === position);

    if (positionPlayers.length === 0) {
      return res.status(404).json({ success: false, error: 'Invalid position or no players' });
    }

    // Sort by PER descending
    positionPlayers.sort((a, b) => b.per - a.per);

    res.json({
      success: true,
      data: positionPlayers,
      position: position,
      count: positionPlayers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/search/:query
 * Search players by name (live API)
 */
router.get('/players/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const results = await nbaLiveApi.searchPlayers(query);

    res.json({
      success: true,
      data: results,
      count: results.length,
      query: query,
      source: 'live'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/stats/leaders
 * Get statistical leaders
 * Query params:
 *   - stat: ppg, rpg, apg, spg, bpg, per, ts_pct, etc.
 *   - limit: Number of players to return (default 10)
 */
router.get('/players/stats/leaders', async (req, res) => {
  try {
    const { stat = 'ppg', limit = 10 } = req.query;
    const limitNum = parseInt(limit);
    
    const allPlayers = await getPlayersWithFullStats();

    if (allPlayers.length === 0 || !allPlayers[0].hasOwnProperty(stat)) {
      return res.status(400).json({ success: false, error: 'Invalid stat category or no data' });
    }

    const leaders = [...allPlayers]
      .sort((a, b) => b[stat] - a[stat])
      .slice(0, limitNum)
      .map(p => ({
        id: p.id,
        name: p.name,
        team: p.team,
        position: p.position,
        value: p[stat],
        ppg: p.ppg,
        rpg: p.rpg,
        apg: p.apg
      }));

    res.json({
      success: true,
      data: leaders,
      stat: stat,
      count: leaders.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/stats/compare
 * Compare multiple players
 * Query params:
 *   - ids: Comma-separated player IDs (e.g., 1,2,3)
 */
router.get('/players/stats/compare', async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ success: false, error: 'Player IDs required' });
    }

    const playerIds = ids.split(',').map(id => parseInt(id.trim()));
    
    // Fetch detailed stats for each player
    const playerPromises = playerIds.map(id => nbaLiveApi.getPlayerStats(id));
    const results = await Promise.allSettled(playerPromises);
    
    const players = results
      .filter(r => r.status === 'fulfilled' && r.value)
      .map(r => r.value);

    if (players.length === 0) {
      return res.status(404).json({ success: false, error: 'No players found' });
    }

    // Calculate comparison stats
    const comparison = {
      players: players,
      averages: {
        ppg: players.reduce((sum, p) => sum + (p.ppg || 0), 0) / players.length,
        rpg: players.reduce((sum, p) => sum + (p.rpg || 0), 0) / players.length,
        apg: players.reduce((sum, p) => sum + (p.apg || 0), 0) / players.length,
        per: players.reduce((sum, p) => sum + (p.per || 15), 0) / players.length
      }
    };

    res.json({
      success: true,
      data: comparison,
      count: players.length,
      source: 'live'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/stats/team-stats/:teamCode
 * Get aggregate team statistics
 */
router.get('/players/stats/team-stats/:teamCode', async (req, res) => {
  try {
    const teamCode = req.params.teamCode.toUpperCase();
    const teamId = nbaLiveApi.TEAM_IDS[teamCode];

    if (!teamId) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }

    const roster = await nbaLiveApi.getTeamRoster(teamId);
    const teamPlayers = roster.athletes || [];

    if (teamPlayers.length === 0) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }

    const teamStats = {
      team: teamCode,
      teamName: roster.teamName || nbaLiveApi.TEAM_NAMES[teamCode],
      playerCount: teamPlayers.length,
      totalPpg: teamPlayers.reduce((sum, p) => sum + (p.ppg || 0), 0),
      totalRpg: teamPlayers.reduce((sum, p) => sum + (p.rpg || 0), 0),
      totalApg: teamPlayers.reduce((sum, p) => sum + (p.apg || 0), 0),
      avgPer: teamPlayers.reduce((sum, p) => sum + (p.per || 15), 0) / teamPlayers.length,
      avgFgPct: teamPlayers.reduce((sum, p) => sum + (p.fgPct || 0), 0) / teamPlayers.length,
      avgFg3Pct: teamPlayers.reduce((sum, p) => sum + (p.fg3Pct || 0), 0) / teamPlayers.length,
      players: teamPlayers
    };

    res.json({
      success: true,
      data: teamStats,
      source: 'live'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/teams
 * Get list of all teams
 */
router.get('/teams', async (req, res) => {
  try {
    const teams = await nbaLiveApi.getAllTeams();

    res.json({
      success: true,
      data: teams,
      count: teams.length,
      source: 'live'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/stats/position-averages
 * Get average stats by position
 */
router.get('/players/stats/position-averages', async (req, res) => {
  try {
    const allPlayers = await getPlayersWithFullStats();
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
    const positionStats = {};

    positions.forEach(pos => {
      const players = allPlayers.filter(p => p.position === pos);
      if (players.length > 0) {
        positionStats[pos] = {
          position: pos,
          count: players.length,
          avgPpg: players.reduce((sum, p) => sum + (p.ppg || 0), 0) / players.length,
          avgRpg: players.reduce((sum, p) => sum + (p.rpg || 0), 0) / players.length,
          avgApg: players.reduce((sum, p) => sum + (p.apg || 0), 0) / players.length,
          avgPer: players.reduce((sum, p) => sum + (p.per || 15), 0) / players.length,
          avgFgPct: players.reduce((sum, p) => sum + (p.fgPct || 0), 0) / players.length,
          avgFg3Pct: players.reduce((sum, p) => sum + (p.fg3Pct || 0), 0) / players.length
        };
      }
    });

    res.json({
      success: true,
      data: positionStats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/advanced/efficiency
 * Get players with best efficiency ratings
 * Query params:
 *   - minGames: Minimum games played (default 40)
 *   - limit: Number of players to return (default 20)
 */
router.get('/players/advanced/efficiency', async (req, res) => {
  try {
    const { minGames = 40, limit = 20 } = req.query;
    const minGamesNum = parseInt(minGames);
    const limitNum = parseInt(limit);
    
    const allPlayers = await getPlayersWithFullStats();

    const efficientPlayers = allPlayers
      .filter(p => (p.gamesPlayed || 0) >= minGamesNum)
      .map(p => ({
        ...p,
        efficiencyScore: ((p.per || 15) * (p.ts_pct || 0.5) * 100) / Math.max(p.tpg || 1, 1)
      }))
      .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
      .slice(0, limitNum);

    res.json({
      success: true,
      data: efficientPlayers,
      count: efficientPlayers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/players/filter
 * Advanced filtering with multiple conditions
 * Body:
 *   - filters: Array of filter objects
 *   - sortBy: Field to sort by
 *   - sortOrder: asc or desc
 */
router.post('/players/filter', async (req, res) => {
  try {
    const { filters = [], sortBy, sortOrder = 'desc' } = req.body;
    const allPlayers = await getPlayersWithFullStats();
    let results = [...allPlayers];

    // Apply each filter
    filters.forEach(filter => {
      const { field, operator, value } = filter;

      switch (operator) {
        case 'eq':
          results = results.filter(p => p[field] === value);
          break;
        case 'gt':
          results = results.filter(p => p[field] > value);
          break;
        case 'gte':
          results = results.filter(p => p[field] >= value);
          break;
        case 'lt':
          results = results.filter(p => p[field] < value);
          break;
        case 'lte':
          results = results.filter(p => p[field] <= value);
          break;
        case 'contains':
          results = results.filter(p =>
            String(p[field]).toLowerCase().includes(String(value).toLowerCase())
          );
          break;
        case 'in':
          results = results.filter(p => value.includes(p[field]));
          break;
      }
    });

    // Sort results
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      results.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === 'string') {
          return order * aVal.localeCompare(bVal);
        }
        return order * (aVal - bVal);
      });
    }

    res.json({
      success: true,
      data: results,
      count: results.length,
      filtersApplied: filters.length,
      source: 'live'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════════
// 🔴 LIVE DATA ROUTES - Real-time NBA Data
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/scoreboard
 * Get live NBA scoreboard with today's games
 */
router.get('/scoreboard', async (req, res) => {
  try {
    const scoreboard = await nbaLiveApi.getLiveScoreboard();
    res.json({
      success: true,
      data: scoreboard,
      source: 'api-sports'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/standings
 * Get current NBA standings
 */
router.get('/standings', async (req, res) => {
  try {
    const standings = await nbaLiveApi.getStandings();
    res.json({
      success: true,
      data: standings,
      source: 'api-sports'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/news
 * Get latest NBA news
 */
router.get('/news', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const news = await nbaLiveApi.getNBANews(parseInt(limit));
    res.json({
      success: true,
      data: news,
      count: news.length,
      source: 'api-sports'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/boxscore/:gameId
 * Get box score for a specific game
 */
router.get('/boxscore/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const boxscore = await nbaLiveApi.getBoxScore(gameId);
    res.json({
      success: true,
      data: boxscore,
      source: 'api-sports'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/cache/status
 * Get cache status for debugging
 */
router.get('/cache/status', (req, res) => {
  res.json({
    success: true,
    cache: nbaLiveApi.getCacheStats(),
    playersCache: {
      count: playersWithStats.length,
      lastFetch: new Date(lastPlayersFetch).toISOString()
    }
  });
});

/**
 * POST /api/cache/clear
 * Clear all caches
 */
router.post('/cache/clear', (req, res) => {
  nbaLiveApi.clearCache();
  playersWithStats = [];
  lastPlayersFetch = 0;
  res.json({ success: true, message: 'All caches cleared' });
});

export default router;
