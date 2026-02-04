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
// HTTP FETCH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════════
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
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
 * Get player statistics from ESPN
 */
export async function getPlayerStats(playerId) {
  const cacheKey = `espn_player_${playerId}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.PLAYER_STATS);
  if (cached) return cached;

  try {
    // Get player info and statistics
    const data = await fetchWithTimeout(`${ESPN_BASE}/athletes/${playerId}`);
    
    // Parse statistics
    const stats = data.statistics || [];
    const seasonStats = stats.find(s => s.type === 'total') || {};
    const categories = seasonStats.splits?.categories || [];
    
    // Extract stat values
    const statsMap = {};
    categories.forEach(cat => {
      (cat.stats || []).forEach(stat => {
        statsMap[stat.name] = parseFloat(stat.value) || stat.value;
      });
    });

    const result = {
      id: data.id,
      uid: data.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      displayName: data.displayName,
      position: data.position?.abbreviation,
      jersey: data.jersey,
      team: {
        id: data.team?.id,
        name: data.team?.displayName,
        abbreviation: data.team?.abbreviation,
        logo: data.team?.logos?.[0]?.href
      },
      headshot: data.headshot?.href,
      age: data.age,
      height: data.displayHeight,
      weight: data.displayWeight,
      experience: data.experience?.years,
      college: data.college?.name,
      birthDate: data.dateOfBirth,
      stats: {
        gamesPlayed: statsMap.gamesPlayed || 0,
        gamesStarted: statsMap.gamesStarted || 0,
        minutes: statsMap.minutes || 0,
        minutesPerGame: statsMap.avgMinutes || 0,
        points: statsMap.points || 0,
        pointsPerGame: statsMap.avgPoints || 0,
        rebounds: statsMap.rebounds || 0,
        reboundsPerGame: statsMap.avgRebounds || 0,
        assists: statsMap.assists || 0,
        assistsPerGame: statsMap.avgAssists || 0,
        steals: statsMap.steals || 0,
        stealsPerGame: statsMap.avgSteals || 0,
        blocks: statsMap.blocks || 0,
        blocksPerGame: statsMap.avgBlocks || 0,
        turnovers: statsMap.turnovers || 0,
        turnoversPerGame: statsMap.avgTurnovers || 0,
        fieldGoalsMade: statsMap.fieldGoalsMade || 0,
        fieldGoalsAttempted: statsMap.fieldGoalsAttempted || 0,
        fieldGoalPct: statsMap.fieldGoalPct || 0,
        threePointMade: statsMap.threePointFieldGoalsMade || 0,
        threePointAttempted: statsMap.threePointFieldGoalsAttempted || 0,
        threePointPct: statsMap.threePointFieldGoalPct || 0,
        freeThrowsMade: statsMap.freeThrowsMade || 0,
        freeThrowsAttempted: statsMap.freeThrowsAttempted || 0,
        freeThrowPct: statsMap.freeThrowPct || 0,
        offensiveRebounds: statsMap.offensiveRebounds || 0,
        defensiveRebounds: statsMap.defensiveRebounds || 0,
        personalFouls: statsMap.fouls || 0,
        plusMinus: statsMap.plusMinus || 0
      },
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`ESPN Player Error (ID ${playerId}):`, error);
    return { id: playerId, error: error.message };
  }
}

/**
 * Get box score for a specific game
 */
export async function getGameBoxScore(gameId) {
  const cacheKey = `espn_boxscore_${gameId}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.BOXSCORE);
  if (cached) return cached;

  try {
    const data = await fetchWithTimeout(`${ESPN_BASE}/summary?event=${gameId}`);
    
    const boxscore = data.boxscore || {};
    const teams = boxscore.teams || [];
    const players = boxscore.players || [];

    const result = {
      gameId,
      teams: teams.map(team => ({
        id: team.team?.id,
        name: team.team?.displayName,
        abbreviation: team.team?.abbreviation,
        logo: team.team?.logo,
        homeAway: team.homeAway,
        statistics: team.statistics || []
      })),
      players: players.map(teamPlayers => ({
        teamId: teamPlayers.team?.id,
        teamName: teamPlayers.team?.displayName,
        statistics: (teamPlayers.statistics || []).map(statCategory => ({
          category: statCategory.name,
          labels: statCategory.labels,
          athletes: (statCategory.athletes || []).map(athlete => ({
            id: athlete.athlete?.id,
            name: athlete.athlete?.displayName,
            position: athlete.athlete?.position?.abbreviation,
            starter: athlete.starter,
            stats: athlete.stats,
            didNotPlay: athlete.didNotPlay,
            reason: athlete.reason
          }))
        }))
      })),
      gameInfo: data.gameInfo || {},
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`ESPN BoxScore Error (Game ${gameId}):`, error);
    return { gameId, error: error.message };
  }
}

/**
 * Get NBA standings
 */
export async function getStandings() {
  const cacheKey = 'espn_standings';
  const cached = cache.get(cacheKey, cache.DURATIONS.STANDINGS);
  if (cached) return cached;

  try {
    const data = await fetchWithTimeout(`${ESPN_BASE}/standings`);
    
    const standings = (data.children || []).map(conference => ({
      name: conference.name,
      abbreviation: conference.abbreviation,
      standings: (conference.standings?.entries || []).map(entry => ({
        teamId: entry.team?.id,
        teamName: entry.team?.displayName,
        abbreviation: entry.team?.abbreviation,
        logo: entry.team?.logos?.[0]?.href,
        wins: parseInt(entry.stats?.find(s => s.name === 'wins')?.value) || 0,
        losses: parseInt(entry.stats?.find(s => s.name === 'losses')?.value) || 0,
        winPct: parseFloat(entry.stats?.find(s => s.name === 'winPercent')?.value) || 0,
        gamesBehind: parseFloat(entry.stats?.find(s => s.name === 'gamesBehind')?.value) || 0,
        streak: entry.stats?.find(s => s.name === 'streak')?.displayValue,
        home: entry.stats?.find(s => s.name === 'home')?.displayValue,
        away: entry.stats?.find(s => s.name === 'road')?.displayValue,
        last10: entry.stats?.find(s => s.name === 'Last Ten Games')?.displayValue,
        pointsFor: parseFloat(entry.stats?.find(s => s.name === 'pointsFor')?.value) || 0,
        pointsAgainst: parseFloat(entry.stats?.find(s => s.name === 'pointsAgainst')?.value) || 0,
        differential: parseFloat(entry.stats?.find(s => s.name === 'differential')?.value) || 0
      }))
    }));

    cache.set(cacheKey, standings);
    return standings;
  } catch (error) {
    console.error('ESPN Standings Error:', error);
    return [];
  }
}

/**
 * Get NBA news and headlines
 */
export async function getNBANews(limit = 20) {
  const cacheKey = 'espn_news';
  const cached = cache.get(cacheKey, cache.DURATIONS.NEWS);
  if (cached) return cached;

  try {
    const data = await fetchWithTimeout(`${ESPN_BASE}/news?limit=${limit}`);
    
    const articles = (data.articles || []).map(article => ({
      id: article.dataSourceIdentifier,
      headline: article.headline,
      description: article.description,
      published: article.published,
      image: article.images?.[0]?.url,
      link: article.links?.web?.href,
      categories: article.categories?.map(c => c.description)
    }));

    cache.set(cacheKey, articles);
    return articles;
  } catch (error) {
    console.error('ESPN News Error:', error);
    return [];
  }
}

/**
 * Get schedule for upcoming games
 */
export async function getSchedule(dates = null) {
  const cacheKey = `espn_schedule_${dates || 'default'}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.SCHEDULE);
  if (cached) return cached;

  try {
    const params = dates ? `?dates=${dates}` : '';
    const data = await fetchWithTimeout(`${ESPN_BASE}/scoreboard${params}`);
    
    const events = (data.events || []).map(event => ({
      id: event.id,
      name: event.name,
      date: event.date,
      status: event.status?.type?.name,
      homeTeam: event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'home')?.team,
      awayTeam: event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'away')?.team,
      venue: event.competitions?.[0]?.venue?.fullName,
      broadcast: event.competitions?.[0]?.broadcasts?.[0]?.names?.[0],
      odds: event.competitions?.[0]?.odds?.[0]
    }));

    cache.set(cacheKey, events);
    return events;
  } catch (error) {
    console.error('ESPN Schedule Error:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════
// AGGREGATED DATA FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Get all active NBA players with stats
 * Fetches rosters from all 30 teams and aggregates
 */
export async function getAllPlayersWithStats() {
  const cacheKey = 'all_players_stats';
  const cached = cache.get(cacheKey, cache.DURATIONS.PLAYER_STATS);
  if (cached) return cached;

  try {
    const teams = await getAllTeams();
    const allPlayers = [];

    // ESPN team IDs for all 30 NBA teams
    const teamPromises = teams.slice(0, 30).map(async (team) => {
      try {
        const roster = await getTeamRoster(team.id);
        return roster.athletes.map(athlete => ({
          ...athlete,
          team: team.abbreviation,
          teamName: team.name,
          teamId: team.id,
          teamLogo: team.logo
        }));
      } catch (err) {
        console.warn(`Failed to get roster for ${team.name}`);
        return [];
      }
    });

    const rosters = await Promise.allSettled(teamPromises);
    rosters.forEach(result => {
      if (result.status === 'fulfilled') {
        allPlayers.push(...result.value);
      }
    });

    cache.set(cacheKey, allPlayers);
    return allPlayers;
  } catch (error) {
    console.error('Get All Players Error:', error);
    return [];
  }
}

/**
 * Search for a player by name
 */
export async function searchPlayer(query) {
  if (!query || query.length < 2) return [];

  try {
    // First try ESPN API search
    const data = await fetchWithTimeout(`${ESPN_BASE}/athletes?search=${encodeURIComponent(query)}&limit=20`);
    
    if (data.items && data.items.length > 0) {
      return data.items.map(item => ({
        id: item.id,
        fullName: item.fullName || item.displayName,
        position: item.position?.abbreviation,
        team: item.team?.abbreviation,
        headshot: item.headshot?.href
      }));
    }

    // Fallback: search through cached players
    const allPlayers = await getAllPlayersWithStats();
    const queryLower = query.toLowerCase();
    return allPlayers.filter(p => 
      p.fullName?.toLowerCase().includes(queryLower) ||
      p.displayName?.toLowerCase().includes(queryLower)
    ).slice(0, 20);
  } catch (error) {
    console.error('Player Search Error:', error);
    return [];
  }
}

/**
 * Get player game logs (recent games)
 */
export async function getPlayerGameLog(playerId, limit = 10) {
  const cacheKey = `player_gamelog_${playerId}`;
  const cached = cache.get(cacheKey, cache.DURATIONS.PLAYER_STATS);
  if (cached) return cached;

  try {
    const data = await fetchWithTimeout(`${ESPN_BASE}/athletes/${playerId}/gamelog`);
    
    const games = (data.events || []).slice(0, limit).map(event => ({
      gameId: event.id,
      date: event.gameDate,
      opponent: event.opponent?.displayName,
      opponentLogo: event.opponent?.logo,
      homeAway: event.homeAway,
      result: event.gameResult,
      stats: event.stats?.reduce((acc, stat) => {
        acc[stat.name] = stat.value;
        return acc;
      }, {})
    }));

    cache.set(cacheKey, games);
    return games;
  } catch (error) {
    console.error(`Player Game Log Error (ID ${playerId}):`, error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════
// DATA SERVICE SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════════

class NBALiveService {
  constructor() {
    this.isInitialized = false;
    this.lastUpdate = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    console.log('🏀 Initializing NBA Live Data Service...');

    try {
      // Pre-fetch essential data
      await Promise.allSettled([
        getAllTeams(),
        getLiveScoreboard(),
        getStandings()
      ]);

      this.isInitialized = true;
      this.lastUpdate = new Date();
      console.log('✅ NBA Live Data Service initialized');
    } catch (error) {
      console.error('Failed to initialize NBA Live Service:', error);
    }
  }

  // Expose all functions
  getLiveScoreboard = getLiveScoreboard;
  getAllTeams = getAllTeams;
  getTeamRoster = getTeamRoster;
  getPlayerStats = getPlayerStats;
  getGameBoxScore = getGameBoxScore;
  getStandings = getStandings;
  getNBANews = getNBANews;
  getSchedule = getSchedule;
  getAllPlayersWithStats = getAllPlayersWithStats;
  searchPlayer = searchPlayer;
  getPlayerGameLog = getPlayerGameLog;

  clearCache() {
    cache.clear();
    console.log('🗑️ NBA Live Data cache cleared');
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      lastUpdate: this.lastUpdate,
      cacheSize: cache.data.size
    };
  }
}

// Export singleton instance
const nbaLiveService = new NBALiveService();
export default nbaLiveService;

// Also export individual functions for direct use
export {
  cache,
  fetchWithTimeout
};
