// ═══════════════════════════════════════════════════════════════════════════════════
// 🏀 NBA LIVE DATA SERVICE - CLIENT SIDE
// ═══════════════════════════════════════════════════════════════════════════════════
// This service connects to our backend API for live NBA data
// Backend uses API-Sports.io Basketball API
// ═══════════════════════════════════════════════════════════════════════════════════

// API Endpoints
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ═══════════════════════════════════════════════════════════════════════════════════
// CACHE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════════
const cache = {
  data: new Map(),
  timestamps: new Map(),
  
  // Cache durations
  DURATIONS: {
    SCOREBOARD: 30 * 1000,        // 30 seconds for live scores
    BOXSCORE: 60 * 1000,          // 1 minute for box scores
    PLAYER_STATS: 5 * 60 * 1000,  // 5 minutes for player stats
    ROSTER: 60 * 60 * 1000,       // 1 hour for rosters
    TEAMS: 24 * 60 * 60 * 1000,   // 24 hours for teams
    SCHEDULE: 30 * 60 * 1000,     // 30 minutes for schedule
    STANDINGS: 15 * 60 * 1000,    // 15 minutes for standings
    NEWS: 10 * 60 * 1000,         // 10 minutes for news
  },

  get(key, duration) {
    const timestamp = this.timestamps.get(key);
    if (timestamp && Date.now() - timestamp < duration) {
      return this.data.get(key);
    }
    return null;
  },

  set(key, data) {
    this.data.set(key, data);
    this.timestamps.set(key, Date.now());
  },

  clear() {
    this.data.clear();
    this.timestamps.clear();
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// API PROXY FUNCTIONS - Forward requests to backend API
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Get live NBA scoreboard with all today's games
 */
export async function getLiveScoreboard() {
  const cacheKey = 'scoreboard';
  const cached = cache.get(cacheKey, cache.DURATIONS.SCOREBOARD);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/scoreboard`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return { games: [] };
  } catch (error) {
    console.error('Scoreboard Error:', error);
    return { games: [], error: error.message };
  }
}

/**
 * Get all NBA teams
 */
export async function getAllTeams() {
  const cacheKey = 'teams';
  const cached = cache.get(cacheKey, cache.DURATIONS.TEAMS);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/teams`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Teams Error:', error);
    return [];
  }
}

/**
 * Get team roster with player details
 */
export async function getTeamRoster(teamId) {
  const cacheKey = `roster_${teamId}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.ROSTER);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/roster/${teamId}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return { teamId, athletes: [], error: 'No data' };
  } catch (error) {
    console.error(`Roster Error (Team ${teamId}):`, error);
    return { teamId, athletes: [], error: error.message };
  }
}

/**
 * Get player statistics
 */
export async function getPlayerStats(playerId) {
  const cacheKey = `player_${playerId}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.PLAYER_STATS);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/players/${playerId}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return { id: playerId, error: 'Player not found' };
  } catch (error) {
    console.error(`Player Error (ID ${playerId}):`, error);
    return { id: playerId, error: error.message };
  }
}

/**
 * Get box score for a specific game
 */
export async function getGameBoxScore(gameId) {
  const cacheKey = `boxscore_${gameId}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.BOXSCORE);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/boxscore/${gameId}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return { gameId, error: 'Game not found' };
  } catch (error) {
    console.error(`BoxScore Error (Game ${gameId}):`, error);
    return { gameId, error: error.message };
  }
}

/**
 * Get NBA standings
 */
export async function getStandings() {
  const cacheKey = 'standings';
  const cached = cache.get(cacheKey, cache.DURATIONS.STANDINGS);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/standings`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Standings Error:', error);
    return [];
  }
}

/**
 * Get NBA news and headlines
 */
export async function getNBANews(limit = 20) {
  const cacheKey = 'news';
  const cached = cache.get(cacheKey, cache.DURATIONS.NEWS);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/news?limit=${limit}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('News Error:', error);
    return [];
  }
}

/**
 * Get NBA schedule for specific date range
 */
export async function getSchedule(dates) {
  const cacheKey = `schedule_${dates || 'default'}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.SCHEDULE);
  if (cached) return cached;

  try {
    const params = dates ? `?dates=${dates}` : '';
    const response = await fetch(`${API_BASE}/api/schedule${params}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return { games: [] };
  } catch (error) {
    console.error('Schedule Error:', error);
    return { games: [], error: error.message };
  }
}

/**
 * Search players by name
 */
export async function searchPlayers(query) {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`${API_BASE}/api/players/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
}

/**
 * Get player game log
 */
export async function getPlayerGameLog(playerId, season) {
  const cacheKey = `gamelog_${playerId}_${season || 'current'}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.PLAYER_STATS);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/players/${playerId}/gamelog${season ? `?season=${season}` : ''}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      cache.set(cacheKey, data.data);
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Game Log Error:', error);
    return [];
  }
}

/**
 * Clear all cached data
 */
export function clearCache() {
  cache.clear();
}

/**
 * Class wrapper for backward compatibility
 */
class NBALiveService {
  getLiveScoreboard() { return getLiveScoreboard(); }
  getAllTeams() { return getAllTeams(); }
  getTeamRoster(teamId) { return getTeamRoster(teamId); }
  getPlayerStats(playerId) { return getPlayerStats(playerId); }
  getGameBoxScore(gameId) { return getGameBoxScore(gameId); }
  getStandings() { return getStandings(); }
  getNBANews(limit) { return getNBANews(limit); }
  getSchedule(dates) { return getSchedule(dates); }
  searchPlayers(query) { return searchPlayers(query); }
  getPlayerGameLog(playerId, season) { return getPlayerGameLog(playerId, season); }
  clearCache() { clearCache(); }
}

const nbaLiveService = new NBALiveService();
export default nbaLiveService;
