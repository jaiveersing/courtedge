// NBA Players API - Server-side routes and controllers
import express from 'express';
import nbaPlayersDatabase from '../src/data/nbaPlayersDatabase.js';

const router = express.Router();

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
router.get('/players', (req, res) => {
  try {
    let filteredPlayers = [...nbaPlayersDatabase];

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
 * Get a single player by ID
 */
router.get('/players/:id', (req, res) => {
  try {
    const playerId = parseInt(req.params.id);
    const player = nbaPlayersDatabase.find(p => p.id === playerId);

    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }

    res.json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/team/:teamCode
 * Get all players for a specific team
 */
router.get('/players/team/:teamCode', (req, res) => {
  try {
    const teamCode = req.params.teamCode.toUpperCase();
    const teamPlayers = nbaPlayersDatabase.filter(p => p.team === teamCode);

    if (teamPlayers.length === 0) {
      return res.status(404).json({ success: false, error: 'Team not found or no players' });
    }

    // Sort by PPG descending
    teamPlayers.sort((a, b) => b.ppg - a.ppg);

    res.json({
      success: true,
      data: teamPlayers,
      team: teamCode,
      count: teamPlayers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/position/:position
 * Get all players for a specific position
 */
router.get('/players/position/:position', (req, res) => {
  try {
    const position = req.params.position.toUpperCase();
    const positionPlayers = nbaPlayersDatabase.filter(p => p.position === position);

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
 * Search players by name
 */
router.get('/players/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const results = nbaPlayersDatabase.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    res.json({
      success: true,
      data: results,
      count: results.length,
      query: req.params.query
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
router.get('/players/stats/leaders', (req, res) => {
  try {
    const { stat = 'ppg', limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    if (!nbaPlayersDatabase[0].hasOwnProperty(stat)) {
      return res.status(400).json({ success: false, error: 'Invalid stat category' });
    }

    const leaders = [...nbaPlayersDatabase]
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
router.get('/players/stats/compare', (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ success: false, error: 'Player IDs required' });
    }

    const playerIds = ids.split(',').map(id => parseInt(id.trim()));
    const players = nbaPlayersDatabase.filter(p => playerIds.includes(p.id));

    if (players.length === 0) {
      return res.status(404).json({ success: false, error: 'No players found' });
    }

    // Calculate comparison stats
    const comparison = {
      players: players,
      averages: {
        ppg: players.reduce((sum, p) => sum + p.ppg, 0) / players.length,
        rpg: players.reduce((sum, p) => sum + p.rpg, 0) / players.length,
        apg: players.reduce((sum, p) => sum + p.apg, 0) / players.length,
        per: players.reduce((sum, p) => sum + p.per, 0) / players.length
      }
    };

    res.json({
      success: true,
      data: comparison,
      count: players.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/stats/team-stats/:teamCode
 * Get aggregate team statistics
 */
router.get('/players/stats/team-stats/:teamCode', (req, res) => {
  try {
    const teamCode = req.params.teamCode.toUpperCase();
    const teamPlayers = nbaPlayersDatabase.filter(p => p.team === teamCode);

    if (teamPlayers.length === 0) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }

    const teamStats = {
      team: teamCode,
      teamName: teamPlayers[0].teamName,
      playerCount: teamPlayers.length,
      totalPpg: teamPlayers.reduce((sum, p) => sum + p.ppg, 0),
      totalRpg: teamPlayers.reduce((sum, p) => sum + p.rpg, 0),
      totalApg: teamPlayers.reduce((sum, p) => sum + p.apg, 0),
      avgPer: teamPlayers.reduce((sum, p) => sum + p.per, 0) / teamPlayers.length,
      avgFgPct: teamPlayers.reduce((sum, p) => sum + p.fgPct, 0) / teamPlayers.length,
      avgFg3Pct: teamPlayers.reduce((sum, p) => sum + p.fg3Pct, 0) / teamPlayers.length,
      topScorer: teamPlayers.reduce((max, p) => p.ppg > max.ppg ? p : max),
      topRebounder: teamPlayers.reduce((max, p) => p.rpg > max.rpg ? p : max),
      topAssister: teamPlayers.reduce((max, p) => p.apg > max.apg ? p : max)
    };

    res.json({
      success: true,
      data: teamStats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/teams
 * Get list of all teams with player counts
 */
router.get('/teams', (req, res) => {
  try {
    const teams = {};

    nbaPlayersDatabase.forEach(player => {
      if (!teams[player.team]) {
        teams[player.team] = {
          code: player.team,
          name: player.teamName,
          playerCount: 0,
          totalPpg: 0
        };
      }
      teams[player.team].playerCount++;
      teams[player.team].totalPpg += player.ppg;
    });

    const teamsList = Object.values(teams).sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: teamsList,
      count: teamsList.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/players/stats/position-averages
 * Get average stats by position
 */
router.get('/players/stats/position-averages', (req, res) => {
  try {
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
    const positionStats = {};

    positions.forEach(pos => {
      const players = nbaPlayersDatabase.filter(p => p.position === pos);
      if (players.length > 0) {
        positionStats[pos] = {
          position: pos,
          count: players.length,
          avgPpg: players.reduce((sum, p) => sum + p.ppg, 0) / players.length,
          avgRpg: players.reduce((sum, p) => sum + p.rpg, 0) / players.length,
          avgApg: players.reduce((sum, p) => sum + p.apg, 0) / players.length,
          avgPer: players.reduce((sum, p) => sum + p.per, 0) / players.length,
          avgFgPct: players.reduce((sum, p) => sum + p.fgPct, 0) / players.length,
          avgFg3Pct: players.reduce((sum, p) => sum + p.fg3Pct, 0) / players.length
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
router.get('/players/advanced/efficiency', (req, res) => {
  try {
    const { minGames = 40, limit = 20 } = req.query;
    const minGamesNum = parseInt(minGames);
    const limitNum = parseInt(limit);

    const efficientPlayers = nbaPlayersDatabase
      .filter(p => p.gamesPlayed >= minGamesNum)
      .map(p => ({
        ...p,
        efficiencyScore: (p.per * p.ts_pct * 100) / p.tpg // Custom efficiency metric
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
router.post('/players/filter', (req, res) => {
  try {
    const { filters = [], sortBy, sortOrder = 'desc' } = req.body;
    let results = [...nbaPlayersDatabase];

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
      filtersApplied: filters.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
