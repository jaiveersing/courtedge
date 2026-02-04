// ═══════════════════════════════════════════════════════════════════════════════════
// 🏀 NBA LIVE API SERVICE - SERVER SIDE REAL-TIME DATA FETCHING
// ═══════════════════════════════════════════════════════════════════════════════════
// This service uses API-Sports.io Basketball API for NBA data
// ═══════════════════════════════════════════════════════════════════════════════════

import fetch from 'node-fetch';

// API Endpoints
const API_SPORTS_BASE = 'https://v1.basketball.api-sports.io';
const API_SPORTS_KEY = 'fc95e7c649750d9ee3308ecc31897ae2';

// Current NBA Season
const CURRENT_SEASON = '2024-2025';
const NBA_LEAGUE_ID = 12; // API-Sports.io NBA league ID

// ═══════════════════════════════════════════════════════════════════════════════════
// SERVER-SIDE CACHE
// ═══════════════════════════════════════════════════════════════════════════════════
class ServerCache {
  constructor() {
    this.data = new Map();
    this.timestamps = new Map();
  }

  // Cache durations in milliseconds
  static DURATIONS = {
    SCOREBOARD: 30 * 1000,        // 30 seconds for live scores
    BOXSCORE: 60 * 1000,          // 1 minute for box scores
    PLAYER_STATS: 5 * 60 * 1000,  // 5 minutes for player stats
    ROSTER: 30 * 60 * 1000,       // 30 minutes for rosters
    TEAMS: 24 * 60 * 60 * 1000,   // 24 hours for teams
    PLAYERS_LIST: 15 * 60 * 1000, // 15 minutes for all players
    SCHEDULE: 30 * 60 * 1000,     // 30 minutes for schedule
    STANDINGS: 15 * 60 * 1000,    // 15 minutes for standings
    NEWS: 10 * 60 * 1000,         // 10 minutes for news
  };

  get(key, duration) {
    const timestamp = this.timestamps.get(key);
    if (timestamp && Date.now() - timestamp < duration) {
      return this.data.get(key);
    }
    return null;
  }

  set(key, data) {
    this.data.set(key, data);
    this.timestamps.set(key, Date.now());
  }

  clear() {
    this.data.clear();
    this.timestamps.clear();
  }

  getStats() {
    return {
      size: this.data.size,
      keys: Array.from(this.data.keys())
    };
  }
}

const cache = new ServerCache();

// ═══════════════════════════════════════════════════════════════════════════════════
// HTTP UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════════
async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CourtEdge-NBA-App/1.0',
        ...options.headers
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

/**
 * Fetch from API-Sports.io with authentication
 */
async function fetchAPISports(endpoint, params = {}) {
  const url = new URL(`${API_SPORTS_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  return fetchWithTimeout(url.toString(), {
    headers: {
      'x-rapidapi-key': API_SPORTS_KEY,
      'x-rapidapi-host': 'v1.basketball.api-sports.io'
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════════
// TEAM ID MAPPING (API-Sports.io Team IDs)
// ═══════════════════════════════════════════════════════════════════════════════════
const TEAM_IDS = {
  'ATL': 1, 'BOS': 2, 'BKN': 17, 'CHA': 30, 'CHI': 4,
  'CLE': 5, 'DAL': 6, 'DEN': 7, 'DET': 8, 'GSW': 9,
  'HOU': 10, 'IND': 11, 'LAC': 12, 'LAL': 13, 'MEM': 29,
  'MIA': 14, 'MIL': 15, 'MIN': 16, 'NOP': 3, 'NYK': 18,
  'OKC': 25, 'ORL': 19, 'PHI': 20, 'PHX': 21, 'POR': 22,
  'SAC': 23, 'SAS': 24, 'TOR': 28, 'UTA': 26, 'WAS': 27
};

const TEAM_NAMES = {
  'ATL': 'Atlanta Hawks', 'BOS': 'Boston Celtics', 'BKN': 'Brooklyn Nets',
  'CHA': 'Charlotte Hornets', 'CHI': 'Chicago Bulls', 'CLE': 'Cleveland Cavaliers',
  'DAL': 'Dallas Mavericks', 'DEN': 'Denver Nuggets', 'DET': 'Detroit Pistons',
  'GSW': 'Golden State Warriors', 'HOU': 'Houston Rockets', 'IND': 'Indiana Pacers',
  'LAC': 'LA Clippers', 'LAL': 'Los Angeles Lakers', 'MEM': 'Memphis Grizzlies',
  'MIA': 'Miami Heat', 'MIL': 'Milwaukee Bucks', 'MIN': 'Minnesota Timberwolves',
  'NOP': 'New Orleans Pelicans', 'NYK': 'New York Knicks', 'OKC': 'Oklahoma City Thunder',
  'ORL': 'Orlando Magic', 'PHI': 'Philadelphia 76ers', 'PHX': 'Phoenix Suns',
  'POR': 'Portland Trail Blazers', 'SAC': 'Sacramento Kings', 'SAS': 'San Antonio Spurs',
  'TOR': 'Toronto Raptors', 'UTA': 'Utah Jazz', 'WAS': 'Washington Wizards'
};

// ═══════════════════════════════════════════════════════════════════════════════════
// API-SPORTS.IO API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Get all NBA teams from API-Sports.io
 */
export async function getAllTeams() {
  const cacheKey = 'teams_list';
  const cached = cache.get(cacheKey, ServerCache.DURATIONS.TEAMS);
  if (cached) {
return cached;
}

  try {
    const data = await fetchAPISports('/teams', { 
      league: NBA_LEAGUE_ID, 
      season: CURRENT_SEASON 
    });
    
    const teams = (data.response || []).map(team => ({
      id: team.id,
      code: team.code,
      name: team.name,
      logo: team.logo,
      country: team.country?.name || 'USA'
    }));

    cache.set(cacheKey, teams);
    return teams;
  } catch (error) {
    console.error('API-Sports Teams Error:', error.message);
    return [];
  }
}

/**
 * Get team roster from API-Sports.io
 * Note: Free tier doesn't provide detailed rosters
 */
export async function getTeamRoster(teamId) {
  const cacheKey = `roster_${teamId}`;
  const cached = cache.get(cacheKey, ServerCache.DURATIONS.ROSTER);
  if (cached) {
return cached;
}

  try {
    const data = await fetchAPISports('/teams', {
      id: teamId,
      league: NBA_LEAGUE_ID,
      season: CURRENT_SEASON
    });
    
    // API-Sports.io free tier doesn't provide detailed rosters
    const result = { teamId, athletes: [] };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Roster Error (Team ${teamId}):`, error.message);
    return { teamId, athletes: [] };
  }
}

/**
 * Get all active NBA players with generated statistics
 * Note: API-Sports.io free tier doesn't provide player rosters or stats
 * This returns mock data structure for development
 */
export async function getAllPlayers() {
  const cacheKey = 'all_players';
  const cached = cache.get(cacheKey, ServerCache.DURATIONS.PLAYERS_LIST);
  if (cached) {
return cached;
}

  try {
    console.log('📡 Fetching NBA teams from API-Sports.io...');
    const teams = await getAllTeams();
    
    // API-Sports.io free tier limitation: no player roster data
    // Would need premium subscription for actual player data
    console.log(`⚠️ Player data requires API-Sports.io premium subscription`);
    console.log(`   Free tier only provides: teams, games, standings`);
    
    cache.set(cacheKey, []);
    return [];
  } catch (error) {
    console.error('❌ Players fetch error:', error.message);
    return [];
  }
}

/**
 * Get player details and stats from API-Sports.io
 * Note: Free tier doesn't provide player statistics
 */
export async function getPlayerStats(playerId) {
  const cacheKey = `player_stats_${playerId}`;
  const cached = cache.get(cacheKey, ServerCache.DURATIONS.PLAYER_STATS);
  if (cached) {
return cached;
}

  try {
    // API-Sports.io free tier doesn't provide player stats
    console.log(`⚠️ Player statistics require premium API subscription`);
    return null;
  } catch (error) {
    console.error(`Player Stats Error (ID ${playerId}):`, error.message);
    return null;
  }
}

/**
 * Get live scoreboard from API-Sports.io
 */
export async function getLiveScoreboard() {
  const cacheKey = 'scoreboard';
  const cached = cache.get(cacheKey, ServerCache.DURATIONS.SCOREBOARD);
  if (cached) {
return cached;
}

  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await fetchAPISports('/games', {
      league: NBA_LEAGUE_ID,
      season: CURRENT_SEASON,
      date: today
    });
    
    const games = (data.response || []).map(game => ({
      id: game.id,
      date: game.date,
      status: {
        state: game.status?.long,
        short: game.status?.short,
        clock: game.status?.timer || null,
        period: game.status?.quarters || null
      },
      homeTeam: {
        id: game.teams?.home?.id,
        name: game.teams?.home?.name,
        logo: game.teams?.home?.logo,
        score: game.scores?.home?.total || 0
      },
      awayTeam: {
        id: game.teams?.away?.id,
        name: game.teams?.away?.name,
        logo: game.teams?.away?.logo,
        score: game.scores?.away?.total || 0
      }
    }));

    const result = {
      games,
      date: today,
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Scoreboard Error:', error.message);
    return { games: [], error: error.message };
  }
}

/**
 * Get NBA standings from API-Sports.io
 */
export async function getStandings() {
  const cacheKey = 'standings';
  const cached = cache.get(cacheKey, ServerCache.DURATIONS.STANDINGS);
  if (cached) {
return cached;
}

  try {
    const data = await fetchAPISports('/standings', {
      league: NBA_LEAGUE_ID,
      season: CURRENT_SEASON
    });
    
    const standings = (data.response || []).map(standingsEntry => ({
      conference: standingsEntry.group?.name || 'NBA',
      teams: (standingsEntry || []).map(team => ({
        teamId: team.team?.id,
        teamName: team.team?.name,
        logo: team.team?.logo,
        wins: team.games?.win?.total || 0,
        losses: team.games?.lose?.total || 0,
        winPct: team.games?.win?.percentage || '0.000',
        position: team.position || 0
      }))
    }));

    cache.set(cacheKey, standings);
    return standings;
  } catch (error) {
    console.error('Standings Error:', error.message);
    return [];
  }
}

/**
 * Get NBA news
 */
export async function getNBANews(limit = 20) {
  // News endpoint not available in API-Sports.io
  return [];
}

/**
 * Search players by name
 */
export async function searchPlayers(query) {
  if (!query || query.length < 2) {
return [];
}

  try {
    // First, try ESPN search API
    const data = await fetchWithTimeout(`${ESPN_BASE}/athletes?search=${encodeURIComponent(query)}&limit=25`);
    
    if (data.items && data.items.length > 0) {
      return data.items.map(item => ({
        id: parseInt(item.id),
        name: item.fullName || item.displayName,
        position: item.position?.abbreviation,
        team: item.team?.abbreviation,
        teamName: item.team?.displayName,
        headshot: item.headshot?.href
      }));
    }

    return [];
  } catch (error) {
    console.error('Search Players Error:', error.message);
    return [];
  }
}

/**
 * Get box score for a specific game
 */
export async function getBoxScore(gameId) {
  const cacheKey = `boxscore_${gameId}`;
  const cached = cache.get(cacheKey, ServerCache.DURATIONS.BOXSCORE);
  if (cached) {
return cached;
}

  try {
    const data = await fetchWithTimeout(`${ESPN_BASE}/summary?event=${gameId}`);
    
    const boxscore = data.boxscore || {};
    const result = {
      gameId,
      teams: boxscore.teams || [],
      players: boxscore.players || [],
      gameInfo: data.gameInfo || {},
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`BoxScore Error (Game ${gameId}):`, error.message);
    return { gameId, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════
// EXPORT ALL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════
export default {
  getAllTeams,
  getTeamRoster,
  getAllPlayers,
  getPlayerStats,
  getLiveScoreboard,
  getStandings,
  getNBANews,
  searchPlayers,
  getBoxScore,
  TEAM_IDS,
  TEAM_NAMES,
  clearCache: () => cache.clear(),
  getCacheStats: () => cache.getStats()
};
