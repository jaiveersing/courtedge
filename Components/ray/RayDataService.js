/**
 * RAY DATA SERVICE
 * Unified data integration for Ray AI Assistant
 * Connects to real APIs: NBA Stats, ESPN, Odds API, ML Service
 * API Key: 8fc95e7c649750d9ee3308ecc31897ae2
 */

import * as nbaApi from '../../src/api/nbaApi.js';
import * as espnApi from '../../src/api/espnApi.js';

// ═══════════════════════════════════════════════════════════════════
// API CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const API_CONFIG = {
  oddsApiKey: '8fc95e7c649750d9ee3308ecc31897ae2',
  mlServiceUrl: 'https://courtedge-ml-api.onrender.com',
  
  // API Priorities (fallback chain)
  statsProvider: 'nba', // nba -> espn -> mock
  oddsProvider: 'odds-api', // odds-api -> mock
  
  // Cache settings
  cachePlayerStats: 5 * 60 * 1000, // 5 minutes
  cacheOdds: 30 * 1000, // 30 seconds
  cacheGameData: 2 * 60 * 1000, // 2 minutes
};

// Global cache
const cache = {
  playerStats: new Map(),
  gameData: new Map(),
  odds: new Map(),
  injuries: new Map(),
};

// ═══════════════════════════════════════════════════════════════════
// PLAYER STATS - Real game logs, averages, trends
// ═══════════════════════════════════════════════════════════════════

/**
 * Get player statistics with game logs
 * @param {string} playerName - Full player name (e.g., "LeBron James")
 * @param {number} gamesCount - Number of recent games to fetch (default 20)
 * @returns {Promise<Object>} Player stats with game logs
 */
export async function getPlayerStats(playerName, gamesCount = 20) {
  const cacheKey = `${playerName}-${gamesCount}`;
  const cached = getCached('playerStats', cacheKey, API_CONFIG.cachePlayerStats);
  if (cached) return cached;

  try {
    console.log(`🏀 Fetching real stats for: ${playerName}`);
    
    // Try NBA API first
    let playerData = await fetchFromNBAApi(playerName, gamesCount);
    
    // Fallback to ESPN if NBA API fails
    if (!playerData || !playerData.gameLogs || playerData.gameLogs.length === 0) {
      console.log('Trying ESPN API fallback...');
      playerData = await fetchFromESPNApi(playerName, gamesCount);
    }
    
    // If still no data, use fallback mock data for demo
    if (!playerData || !playerData.gameLogs || playerData.gameLogs.length === 0) {
      console.warn(`Using fallback data for ${playerName}`);
      playerData = getFallbackPlayerData(playerName);
    }
    
    // If still no data, return structured empty response
    if (!playerData || !playerData.gameLogs || playerData.gameLogs.length === 0) {
      console.warn(`No data found for ${playerName}`);
      return createEmptyPlayerStats(playerName);
    }
    
    // Calculate advanced stats
    const enriched = enrichPlayerData(playerData);
    
    setCached('playerStats', cacheKey, enriched);
    return enriched;
    
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return createEmptyPlayerStats(playerName);
  }
}

/**
 * Fetch from NBA API (balldontlie.io)
 */
async function fetchFromNBAApi(playerName, gamesCount) {
  try {
    console.log(`📡 Calling NBA API for: ${playerName}`);
    
    // Search for player
    const playerSearch = await nbaApi.searchPlayers(playerName);
    console.log(`NBA API search results:`, playerSearch);
    
    if (!playerSearch || playerSearch.length === 0) {
      console.warn(`NBA API: No results for ${playerName}`);
      return null;
    }
    
    const player = playerSearch[0];
    console.log(`Found player:`, player);
    
    // Get season averages using correct function name
    const seasonStats = await nbaApi.getPlayerSeasonStats(player.id, [2025, 2024, 2023]);
    console.log(`Season stats:`, seasonStats);
    
    // Get game logs - using correct function signature (playerId, season, limit)
    const gameLogs = await nbaApi.getPlayerGameLogs(player.id, 2025, gamesCount);
    console.log(`NBA API game logs:`, gameLogs?.length || 0);
    
    return {
      playerInfo: {
        id: player.id,
        name: `${player.first_name} ${player.last_name}`,
        team: player.team?.full_name || 'Free Agent',
        position: player.position || 'N/A',
      },
      seasonAverages: seasonStats?.[0] || {},
      gameLogs: gameLogs || [],
      source: 'nba-api'
    };
  } catch (error) {
    console.error('NBA API error:', error);
    return null;
  }
}

/**
 * Fetch from ESPN API
 */
async function fetchFromESPNApi(playerName, gamesCount) {
  try {
    // Search for player in ESPN
    const playerSearch = await espnApi.searchPlayer(playerName);
    if (!playerSearch) {
      return null;
    }
    
    // Get player stats
    const stats = await espnApi.getPlayerStats(playerSearch.id);
    
    return {
      playerInfo: {
        id: playerSearch.id,
        name: playerSearch.displayName,
        team: playerSearch.team?.displayName || 'N/A',
        position: playerSearch.position?.abbreviation || 'N/A',
      },
      seasonAverages: stats?.seasonAverages || {},
      gameLogs: stats?.gameLogs?.slice(0, gamesCount) || [],
      source: 'espn-api'
    };
  } catch (error) {
    console.error('ESPN API error:', error);
    return null;
  }
}

/**
 * Enrich player data with advanced stats
 */
function enrichPlayerData(playerData) {
  const { gameLogs } = playerData;
  
  if (!gameLogs || gameLogs.length === 0) {
    return playerData;
  }
  
  // Calculate recent form (last 5, 10, 20 games)
  const recentForm = {
    last5: calculateAverages(gameLogs.slice(0, 5)),
    last10: calculateAverages(gameLogs.slice(0, 10)),
    last20: calculateAverages(gameLogs.slice(0, 20)),
    allGames: calculateAverages(gameLogs)
  };
  
  // Calculate trends
  const trends = calculateTrends(gameLogs);
  
  // Consistency metrics
  const consistency = calculateConsistency(gameLogs);
  
  return {
    ...playerData,
    recentForm,
    trends,
    consistency,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Calculate averages for game logs
 */
function calculateAverages(games) {
  if (!games || games.length === 0) {
    return null;
  }
  
  const sum = games.reduce((acc, game) => ({
    pts: acc.pts + (game.pts || 0),
    reb: acc.reb + (game.reb || 0),
    ast: acc.ast + (game.ast || 0),
    stl: acc.stl + (game.stl || 0),
    blk: acc.blk + (game.blk || 0),
    fg3m: acc.fg3m + (game.fg3m || 0),
    fga: acc.fga + (game.fga || 0),
    fgm: acc.fgm + (game.fgm || 0),
    min: acc.min + (parseFloat(game.min) || 0),
  }), { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, fg3m: 0, fga: 0, fgm: 0, min: 0 });
  
  const count = games.length;
  
  return {
    points: (sum.pts / count).toFixed(1),
    rebounds: (sum.reb / count).toFixed(1),
    assists: (sum.ast / count).toFixed(1),
    steals: (sum.stl / count).toFixed(1),
    blocks: (sum.blk / count).toFixed(1),
    threes: (sum.fg3m / count).toFixed(1),
    fgPct: sum.fga > 0 ? ((sum.fgm / sum.fga) * 100).toFixed(1) : 0,
    minutes: (sum.min / count).toFixed(1),
    gamesPlayed: count
  };
}

/**
 * Calculate trends (trending up/down/stable)
 */
function calculateTrends(games) {
  if (!games || games.length < 5) {
    return { points: 'stable', rebounds: 'stable', assists: 'stable' };
  }
  
  const recent5 = games.slice(0, 5);
  const previous5 = games.slice(5, 10);
  
  if (previous5.length < 5) {
    return { points: 'stable', rebounds: 'stable', assists: 'stable' };
  }
  
  const recentAvg = calculateAverages(recent5);
  const previousAvg = calculateAverages(previous5);
  
  const getTrend = (recent, previous) => {
    const diff = parseFloat(recent) - parseFloat(previous);
    if (Math.abs(diff) < 1) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };
  
  return {
    points: getTrend(recentAvg.points, previousAvg.points),
    rebounds: getTrend(recentAvg.rebounds, previousAvg.rebounds),
    assists: getTrend(recentAvg.assists, previousAvg.assists),
    threes: getTrend(recentAvg.threes, previousAvg.threes)
  };
}

/**
 * Calculate consistency (standard deviation)
 */
function calculateConsistency(games) {
  if (!games || games.length < 3) {
    return { points: 0, rebounds: 0, assists: 0 };
  }
  
  const points = games.map(g => g.pts || 0);
  const rebounds = games.map(g => g.reb || 0);
  const assists = games.map(g => g.ast || 0);
  
  return {
    points: calculateStdDev(points).toFixed(1),
    rebounds: calculateStdDev(rebounds).toFixed(1),
    assists: calculateStdDev(assists).toFixed(1)
  };
}

function calculateStdDev(values) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  return Math.sqrt(avgSquareDiff);
}

/**
 * Create empty player stats structure (when no data found)
 */
function createEmptyPlayerStats(playerName) {
  return {
    playerInfo: {
      name: playerName,
      team: 'Unknown',
      position: 'N/A',
    },
    seasonAverages: {},
    gameLogs: [],
    recentForm: null,
    trends: null,
    consistency: null,
    source: 'none',
    lastUpdated: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════════
// BETTING LINES - Current props, spreads, moneylines
// ═══════════════════════════════════════════════════════════════════

/**
 * Get current betting line for player prop
 * @param {string} playerName - Full player name
 * @param {string} market - Market type: 'points', 'rebounds', 'assists', 'threes'
 * @returns {Promise<Object>} Line data with odds
 */
export async function getCurrentLine(playerName, market = 'points') {
  const cacheKey = `${playerName}-${market}`;
  const cached = getCached('odds', cacheKey, API_CONFIG.cacheOdds);
  if (cached) return cached;

  try {
    console.log(`💰 Fetching line for ${playerName} - ${market}`);
    
    // Try Odds API
    const lineData = await fetchLineFromOddsApi(playerName, market);
    
    if (!lineData) {
      console.warn(`No line found for ${playerName} ${market}`);
      return createEmptyLine(playerName, market);
    }
    
    setCached('odds', cacheKey, lineData);
    return lineData;
    
  } catch (error) {
    console.error('Error fetching line:', error);
    return createEmptyLine(playerName, market);
  }
}

/**
 * Fetch line from Odds API
 */
async function fetchLineFromOddsApi(playerName, market) {
  try {
    // Get NBA player props
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_nba/odds?` +
      `apiKey=${API_CONFIG.oddsApiKey}&` +
      `regions=us&` +
      `markets=player_points,player_rebounds,player_assists,player_threes&` +
      `oddsFormat=american`
    );
    
    if (!response.ok) {
      throw new Error(`Odds API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Find player's line in the odds data
    const playerLine = findPlayerLine(data, playerName, market);
    
    return playerLine;
    
  } catch (error) {
    console.error('Odds API error:', error);
    return null;
  }
}

/**
 * Find specific player line in odds data
 */
function findPlayerLine(oddsData, playerName, market) {
  // Map market to Odds API market name
  const marketMap = {
    'points': 'player_points',
    'rebounds': 'player_rebounds',
    'assists': 'player_assists',
    'threes': 'player_threes'
  };
  
  const oddsMarket = marketMap[market] || 'player_points';
  
  // Search through games for player
  for (const game of oddsData) {
    if (!game.bookmakers) continue;
    
    for (const bookmaker of game.bookmakers) {
      const marketData = bookmaker.markets?.find(m => m.key === oddsMarket);
      if (!marketData) continue;
      
      // Find player in outcomes
      const playerOutcome = marketData.outcomes?.find(outcome => 
        outcome.description?.toLowerCase().includes(playerName.toLowerCase())
      );
      
      if (playerOutcome) {
        return {
          player: playerName,
          market: market,
          line: playerOutcome.point,
          overOdds: playerOutcome.price,
          underOdds: marketData.outcomes?.find(o => 
            o.name === 'Under' && o.description?.toLowerCase().includes(playerName.toLowerCase())
          )?.price || null,
          bookmaker: bookmaker.title,
          game: {
            home: game.home_team,
            away: game.away_team,
            startTime: game.commence_time
          },
          lastUpdated: new Date().toISOString()
        };
      }
    }
  }
  
  return null;
}

/**
 * Create empty line structure
 */
function createEmptyLine(playerName, market) {
  return {
    player: playerName,
    market: market,
    line: null,
    overOdds: null,
    underOdds: null,
    bookmaker: null,
    game: null,
    lastUpdated: new Date().toISOString(),
    source: 'none'
  };
}

// ═══════════════════════════════════════════════════════════════════
// GAME DATA - Schedules, matchups, scores
// ═══════════════════════════════════════════════════════════════════

/**
 * Get game data for today or specific date
 * @param {string} date - ISO date string (optional, defaults to today)
 * @returns {Promise<Array>} List of games
 */
export async function getTodaysGames(date = null) {
  const dateKey = date || new Date().toISOString().split('T')[0];
  const cached = getCached('gameData', dateKey, API_CONFIG.cacheGameData);
  if (cached) return cached;

  try {
    console.log(`🏀 Fetching games for ${dateKey}`);
    
    // Try ESPN scoreboard first (better live data)
    let games = await espnApi.getScoreboard(dateKey);
    
    if (!games || games.length === 0) {
      // Fallback to NBA API
      games = await nbaApi.getGames(dateKey);
    }
    
    setCached('gameData', dateKey, games);
    return games || [];
    
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

/**
 * Get specific game by ID
 */
export async function getGame(gameId) {
  try {
    const game = await espnApi.getGameSummary(gameId);
    return game || null;
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
}

/**
 * Get team schedule
 */
export async function getTeamSchedule(teamName, limit = 10) {
  try {
    const schedule = await espnApi.getTeamSchedule(teamName, limit);
    return schedule || [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════
// INJURY REPORTS - Current injury status
// ═══════════════════════════════════════════════════════════════════

/**
 * Get injury report for player
 */
export async function getInjuryStatus(playerName) {
  const cached = getCached('injuries', playerName, 60 * 60 * 1000); // 1 hour cache
  if (cached) return cached;

  try {
    // ESPN has injury data in their player endpoint
    const playerSearch = await espnApi.searchPlayer(playerName);
    if (!playerSearch) {
      return { status: 'active', note: null };
    }
    
    const injuryStatus = playerSearch.injuries?.[0] || null;
    
    const result = {
      status: injuryStatus ? 'injured' : 'active',
      note: injuryStatus?.details || null,
      lastUpdated: new Date().toISOString()
    };
    
    setCached('injuries', playerName, result);
    return result;
    
  } catch (error) {
    console.error('Error fetching injury status:', error);
    return { status: 'unknown', note: null };
  }
}

// ═══════════════════════════════════════════════════════════════════
// ML SERVICE INTEGRATION - Predictions from trained models
// ═══════════════════════════════════════════════════════════════════

/**
 * Get ML prediction for player prop
 */
export async function getMLPrediction(playerName, market, line) {
  try {
    const response = await fetch(`${API_CONFIG.mlServiceUrl}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player: playerName,
        market: market,
        line: line,
        includeConfidence: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`ML Service error: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('ML Service error:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// CACHE UTILITIES
// ═══════════════════════════════════════════════════════════════════

function getCached(category, key, maxAge) {
  const item = cache[category].get(key);
  if (!item) return null;
  
  const age = Date.now() - item.timestamp;
  if (age > maxAge) {
    cache[category].delete(key);
    return null;
  }
  
  return item.data;
}

function setCached(category, key, data) {
  cache[category].set(key, {
    data: data,
    timestamp: Date.now()
  });
}

/**
 * Clear all caches
 */
export function clearCache() {
  cache.playerStats.clear();
  cache.gameData.clear();
  cache.odds.clear();
  cache.injuries.clear();
  console.log('🗑️ Ray data cache cleared');
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  return {
    playerStats: cache.playerStats.size,
    gameData: cache.gameData.size,
    odds: cache.odds.size,
    injuries: cache.injuries.size,
    total: cache.playerStats.size + cache.gameData.size + cache.odds.size + cache.injuries.size
  };
}

// ═══════════════════════════════════════════════════════════════════
// FALLBACK MOCK DATA (Used when APIs are unavailable)
// ═══════════════════════════════════════════════════════════════════

function getFallbackPlayerData(playerName) {
  const mockPlayers = {
    'Stephen Curry': { pts: [28, 32, 25, 30, 27, 35, 24, 29, 31, 26, 28, 33, 22, 30, 27, 34, 25, 29, 31, 28], reb: [5, 4, 6, 5, 4, 7, 5, 4, 6, 5, 4, 5, 6, 4, 5, 6, 4, 5, 5, 4], ast: [6, 8, 5, 7, 6, 9, 5, 7, 8, 6, 7, 6, 8, 5, 7, 6, 8, 7, 6, 7], fg3m: [5, 7, 4, 6, 5, 8, 4, 5, 6, 5, 6, 7, 3, 6, 5, 7, 4, 5, 6, 5] },
    'LeBron James': { pts: [27, 25, 30, 28, 24, 32, 26, 29, 25, 27, 30, 24, 28, 26, 31, 25, 27, 29, 26, 28], reb: [8, 7, 9, 8, 7, 10, 8, 7, 9, 8, 7, 8, 9, 7, 8, 9, 7, 8, 8, 7], ast: [8, 9, 7, 8, 10, 8, 7, 9, 8, 7, 9, 8, 7, 9, 8, 7, 9, 8, 7, 8], fg3m: [2, 3, 2, 3, 1, 4, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3] },
    'Nikola Jokic': { pts: [26, 28, 30, 25, 27, 32, 24, 29, 27, 26, 28, 31, 25, 27, 29, 26, 28, 30, 27, 28], reb: [12, 14, 11, 13, 12, 15, 11, 13, 12, 14, 11, 13, 12, 14, 11, 13, 12, 14, 12, 13], ast: [9, 11, 8, 10, 9, 12, 8, 10, 9, 11, 8, 10, 9, 11, 8, 10, 9, 11, 9, 10], fg3m: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2] },
    'Luka Doncic': { pts: [32, 35, 28, 33, 30, 38, 29, 34, 31, 33, 35, 27, 32, 30, 36, 28, 33, 31, 34, 32], reb: [9, 8, 10, 9, 8, 11, 8, 9, 10, 8, 9, 10, 8, 9, 10, 8, 9, 10, 9, 9], ast: [8, 10, 7, 9, 8, 11, 7, 9, 8, 10, 7, 9, 8, 10, 7, 9, 8, 10, 8, 9], fg3m: [4, 5, 3, 4, 4, 6, 3, 4, 5, 4, 5, 3, 4, 4, 5, 3, 4, 5, 4, 4] },
    'Jayson Tatum': { pts: [28, 30, 25, 29, 27, 32, 24, 28, 30, 27, 29, 31, 25, 28, 30, 26, 29, 27, 30, 28], reb: [8, 7, 9, 8, 7, 9, 7, 8, 9, 7, 8, 9, 7, 8, 9, 7, 8, 9, 8, 8], ast: [5, 6, 4, 5, 6, 7, 4, 5, 6, 5, 6, 5, 4, 5, 6, 5, 6, 5, 6, 5], fg3m: [4, 5, 3, 4, 4, 5, 3, 4, 5, 4, 4, 5, 3, 4, 5, 4, 4, 4, 5, 4] },
    'Giannis Antetokounmpo': { pts: [32, 30, 35, 31, 28, 38, 29, 33, 31, 30, 34, 28, 32, 30, 36, 29, 33, 31, 34, 32], reb: [12, 11, 13, 12, 10, 14, 11, 12, 13, 11, 12, 13, 11, 12, 13, 11, 12, 13, 12, 12], ast: [6, 5, 7, 6, 5, 8, 5, 6, 7, 5, 6, 7, 5, 6, 7, 5, 6, 7, 6, 6], fg3m: [1, 0, 2, 1, 0, 2, 0, 1, 1, 1, 1, 1, 0, 1, 2, 0, 1, 1, 1, 1] },
    'Kevin Durant': { pts: [29, 27, 31, 28, 25, 33, 26, 30, 28, 27, 30, 32, 25, 29, 31, 27, 29, 28, 30, 29], reb: [7, 6, 8, 7, 6, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 7, 7], ast: [5, 6, 4, 5, 6, 6, 4, 5, 6, 5, 5, 6, 4, 5, 6, 5, 5, 5, 6, 5], fg3m: [3, 2, 4, 3, 2, 4, 2, 3, 3, 3, 3, 4, 2, 3, 4, 2, 3, 3, 3, 3] },
    'Joel Embiid': { pts: [34, 32, 36, 33, 30, 40, 31, 35, 33, 32, 35, 38, 30, 34, 36, 32, 34, 33, 35, 34], reb: [11, 10, 12, 11, 9, 13, 10, 11, 12, 10, 11, 12, 10, 11, 12, 10, 11, 12, 11, 11], ast: [4, 5, 3, 4, 5, 5, 3, 4, 5, 4, 4, 5, 3, 4, 5, 4, 4, 4, 5, 4], fg3m: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2] },
    'Anthony Edwards': { pts: [27, 29, 24, 28, 26, 32, 23, 27, 29, 26, 28, 30, 24, 27, 29, 25, 28, 26, 29, 27], reb: [6, 5, 7, 6, 5, 7, 5, 6, 7, 5, 6, 7, 5, 6, 7, 5, 6, 7, 6, 6], ast: [5, 6, 4, 5, 6, 6, 4, 5, 6, 5, 5, 6, 4, 5, 6, 5, 5, 5, 6, 5], fg3m: [3, 4, 2, 3, 3, 5, 2, 3, 4, 3, 3, 4, 2, 3, 4, 3, 3, 3, 4, 3] },
    'Tyrese Haliburton': { pts: [20, 22, 18, 21, 19, 24, 17, 21, 22, 19, 21, 23, 18, 20, 22, 19, 21, 20, 22, 20], reb: [4, 3, 5, 4, 3, 5, 3, 4, 5, 3, 4, 5, 3, 4, 5, 3, 4, 5, 4, 4], ast: [11, 12, 10, 11, 10, 13, 9, 11, 12, 10, 11, 12, 10, 11, 12, 10, 11, 12, 11, 11], fg3m: [3, 4, 2, 3, 3, 4, 2, 3, 4, 3, 3, 4, 2, 3, 4, 3, 3, 3, 4, 3] },
    'Domantas Sabonis': { pts: [19, 18, 21, 19, 17, 23, 18, 20, 19, 18, 20, 22, 17, 19, 21, 18, 20, 19, 21, 19], reb: [14, 13, 15, 14, 12, 16, 13, 14, 15, 13, 14, 15, 13, 14, 15, 13, 14, 15, 14, 14], ast: [7, 8, 6, 7, 8, 9, 6, 7, 8, 7, 7, 8, 6, 7, 8, 7, 7, 7, 8, 7], fg3m: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
  };
  
  // Find matching player (case insensitive)
  const matchedName = Object.keys(mockPlayers).find(name => 
    name.toLowerCase().includes(playerName.toLowerCase()) ||
    playerName.toLowerCase().includes(name.toLowerCase().split(' ')[1]) // Match last name
  );
  
  if (!matchedName) {
    console.log(`No fallback data for: ${playerName}`);
    return null;
  }
  
  const data = mockPlayers[matchedName];
  
  // Convert to game log format
  const gameLogs = data.pts.map((pts, i) => ({
    pts: pts,
    reb: data.reb[i],
    ast: data.ast[i],
    fg3m: data.fg3m[i],
    stl: Math.floor(Math.random() * 3),
    blk: Math.floor(Math.random() * 2),
    min: 32 + Math.floor(Math.random() * 8),
    fga: Math.floor(pts / 2) + 5,
    fgm: Math.floor(pts / 2.2),
    date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    home: i % 2 === 0
  }));
  
  console.log(`✅ Using fallback data for ${matchedName}: ${gameLogs.length} games`);
  
  return {
    playerInfo: {
      id: matchedName.replace(' ', '_'),
      name: matchedName,
      team: 'NBA Team',
      position: 'G/F'
    },
    seasonAverages: {},
    gameLogs: gameLogs,
    source: 'fallback-mock'
  };
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════

export default {
  getPlayerStats,
  getCurrentLine,
  getTodaysGames,
  getGame,
  getTeamSchedule,
  getInjuryStatus,
  getMLPrediction,
  clearCache,
  getCacheStats
};
