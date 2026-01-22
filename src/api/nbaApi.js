// Real NBA API integration with balldontlie.io (free, no API key needed)
// Provides live player stats, game data, and historical information

const NBA_API_BASE = 'https://www.balldontlie.io/api/v1';

// Cache for reducing API calls
const cache = {
  players: null,
  playersTimestamp: null,
  teams: null,
  teamsTimestamp: null,
  CACHE_DURATION: 1000 * 60 * 60 // 1 hour
};

async function fetchNBA(endpoint, params = {}) {
  const url = new URL(`${NBA_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`NBA API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('NBA API fetch error:', error);
    throw error;
  }
}

// Get all NBA teams
export async function getTeams() {
  const now = Date.now();
  if (cache.teams && cache.teamsTimestamp && (now - cache.teamsTimestamp < cache.CACHE_DURATION)) {
    return cache.teams;
  }

  const response = await fetchNBA('/teams');
  cache.teams = response.data || [];
  cache.teamsTimestamp = now;
  return cache.teams;
}

// Get all active NBA players (paginated)
export async function getAllPlayers() {
  const now = Date.now();
  if (cache.players && cache.playersTimestamp && (now - cache.playersTimestamp < cache.CACHE_DURATION)) {
    return cache.players;
  }

  let allPlayers = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 20) { // Limit to 20 pages (about 2000 players)
    try {
      const response = await fetchNBA('/players', { 
        per_page: 100,
        page: page 
      });
      
      if (response.data && response.data.length > 0) {
        allPlayers = [...allPlayers, ...response.data];
        hasMore = response.meta.next_page !== null;
        page++;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error(`Error fetching players page ${page}:`, error);
      hasMore = false;
    }
  }

  cache.players = allPlayers;
  cache.playersTimestamp = now;
  return allPlayers;
}

// Search players by name
export async function searchPlayers(name) {
  if (!name || name.length < 2) return [];
  
  const response = await fetchNBA('/players', { 
    search: name,
    per_page: 25 
  });
  return response.data || [];
}

// Get player season stats for multiple seasons
export async function getPlayerSeasonStats(playerId, seasons = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014]) {
  const statsPromises = seasons.map(async (season) => {
    try {
      const response = await fetchNBA('/season_averages', {
        player_ids: [playerId],
        season: season
      });
      
      if (response.data && response.data.length > 0) {
        return {
          season: `${season}-${(season + 1).toString().slice(-2)}`,
          ...response.data[0]
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching stats for player ${playerId} season ${season}:`, error);
      return null;
    }
  });

  const results = await Promise.all(statsPromises);
  return results.filter(stat => stat !== null);
}

// Get recent games for a player
export async function getPlayerGameLogs(playerId, season = 2023, limit = 10) {
  try {
    const response = await fetchNBA('/stats', {
      player_ids: [playerId],
      seasons: [season],
      per_page: limit,
      start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching player game logs:', error);
    return [];
  }
}

// Get today's games
export async function getTodaysGames() {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const response = await fetchNBA('/games', {
      dates: [today],
      per_page: 100
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching today\'s games:', error);
    return [];
  }
}

// Get recent games (last 7 days)
export async function getRecentGames(days = 7) {
  const games = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const response = await fetchNBA('/games', {
        dates: [dateStr],
        per_page: 100
      });
      
      if (response.data) {
        games.push(...response.data);
      }
    } catch (error) {
      console.error(`Error fetching games for ${dateStr}:`, error);
    }
  }
  
  return games;
}

// Get game stats (box score)
export async function getGameStats(gameId) {
  try {
    const response = await fetchNBA('/stats', {
      game_ids: [gameId],
      per_page: 100
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return [];
  }
}

// Format player data for our app
export function formatPlayerForApp(player, seasonStats = []) {
  const currentStats = seasonStats[0] || {};
  
  return {
    id: player.id,
    player_name: `${player.first_name} ${player.last_name}`,
    first_name: player.first_name,
    last_name: player.last_name,
    team_abbreviation: player.team?.abbreviation || 'FA',
    team_name: player.team?.full_name || 'Free Agent',
    position: player.position || 'N/A',
    height_feet: player.height_feet,
    height_inches: player.height_inches,
    weight_pounds: player.weight_pounds,
    
    // Current season stats
    season: currentStats.season || '2023-24',
    games_played: currentStats.games_played || 0,
    minutes_per_game: currentStats.min ? parseFloat(currentStats.min) : 0,
    points_per_game: currentStats.pts || 0,
    rebounds_per_game: currentStats.reb || 0,
    assists_per_game: currentStats.ast || 0,
    steals_per_game: currentStats.stl || 0,
    blocks_per_game: currentStats.blk || 0,
    turnovers_per_game: currentStats.turnover || 0,
    field_goal_percentage: currentStats.fg_pct ? (currentStats.fg_pct * 100) : 0,
    three_point_percentage: currentStats.fg3_pct ? (currentStats.fg3_pct * 100) : 0,
    free_throw_percentage: currentStats.ft_pct ? (currentStats.ft_pct * 100) : 0,
    
    // Historical stats array
    career_stats: seasonStats
  };
}

// Batch fetch player data with stats
export async function getPlayersWithStats(limit = 50) {
  const players = await getAllPlayers();
  const activePlayers = players.filter(p => p.team).slice(0, limit);
  
  const playersWithStats = await Promise.all(
    activePlayers.map(async (player) => {
      try {
        const seasonStats = await getPlayerSeasonStats(player.id);
        return formatPlayerForApp(player, seasonStats);
      } catch (error) {
        console.error(`Error loading stats for ${player.first_name} ${player.last_name}:`, error);
        return formatPlayerForApp(player, []);
      }
    })
  );
  
  return playersWithStats;
}

export default {
  getTeams,
  getAllPlayers,
  searchPlayers,
  getPlayerSeasonStats,
  getPlayerGameLogs,
  getTodaysGames,
  getRecentGames,
  getGameStats,
  formatPlayerForApp,
  getPlayersWithStats
};
