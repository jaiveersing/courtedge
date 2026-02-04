// ═══════════════════════════════════════════════════════════════════════════════════
// 🏀 NBA PLAYERS API CLIENT - LIVE DATA FROM ESPN & OTHER SOURCES
// ═══════════════════════════════════════════════════════════════════════════════════
// Fetches REAL-TIME data from backend which proxies ESPN/NBA APIs
// NO MORE STATIC DATA - Everything is live!
// ═══════════════════════════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class PlayersAPI {
  
  // ═══════════════════════════════════════════════════════════════════════════════════
  // CORE PLAYER METHODS
  // ═══════════════════════════════════════════════════════════════════════════════════

  /**
   * Get all players with optional filters (LIVE DATA)
   */
  static async getPlayers(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/players?${queryParams}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      
      const data = await response.json();
      // Ensure we always return an array
      if (Array.isArray(data)) {
return data;
}
      if (data?.data && Array.isArray(data.data)) {
return data.data;
}
      if (data?.players && Array.isArray(data.players)) {
return data.players;
}
      return [];
    } catch (error) {
      console.error('Error fetching players from live API:', error);
      return [];
    }
  }

  /**
   * Get a single player by ID (LIVE DATA with full stats)
   */
  static async getPlayerById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching player:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all players for a team (LIVE from ESPN)
   */
  static async getTeamPlayers(teamCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/team/${teamCode}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching team players:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Search players by name (LIVE API search)
   */
  static async searchPlayers(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error searching players:', error);
      return { success: false, data: [], count: 0 };
    }
  }

  /**
   * Get statistical leaders (LIVE DATA)
   */
  static async getLeaders(stat = 'ppg', limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/stats/leaders?stat=${stat}&limit=${limit}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaders:', error);
      return { success: false, data: [], stat, count: 0 };
    }
  }

  /**
   * Compare multiple players (LIVE stats comparison)
   */
  static async comparePlayers(playerIds) {
    try {
      const ids = Array.isArray(playerIds) ? playerIds.join(',') : playerIds;
      const response = await fetch(`${API_BASE_URL}/players/stats/compare?ids=${ids}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error comparing players:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get team statistics (LIVE DATA)
   */
  static async getTeamStats(teamCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/stats/team-stats/${teamCode}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching team stats:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all teams (LIVE from ESPN)
   */
  static async getTeams() {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching teams:', error);
      return { success: false, data: [], count: 0 };
    }
  }

  /**
   * Get position averages (LIVE calculation)
   */
  static async getPositionAverages() {
    try {
      const response = await fetch(`${API_BASE_URL}/players/stats/position-averages`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching position averages:', error);
      return { success: false, data: {} };
    }
  }

  /**
   * Advanced filter with multiple conditions
   */
  static async advancedFilter(filters, sortBy, sortOrder = 'desc') {
    try {
      const response = await fetch(`${API_BASE_URL}/players/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, sortBy, sortOrder })
      });
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error with advanced filter:', error);
      return { success: false, data: [], count: 0 };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════════
  // 🔴 LIVE DATA METHODS - Real-time NBA data
  // ═══════════════════════════════════════════════════════════════════════════════════

  /**
   * Get live NBA scoreboard (REAL-TIME SCORES)
   */
  static async getLiveScoreboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/scoreboard`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching live scoreboard:', error);
      return { success: false, data: { games: [] } };
    }
  }

  /**
   * Get NBA standings (LIVE)
   */
  static async getStandings() {
    try {
      const response = await fetch(`${API_BASE_URL}/standings`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching standings:', error);
      return { success: false, data: [] };
    }
  }

  /**
   * Get NBA news (LIVE)
   */
  static async getNews(limit = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/news?limit=${limit}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return { success: false, data: [] };
    }
  }

  /**
   * Get game box score (LIVE)
   */
  static async getBoxScore(gameId) {
    try {
      const response = await fetch(`${API_BASE_URL}/boxscore/${gameId}`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching box score:', error);
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════════════

  /**
   * Get cache status (for debugging)
   */
  static async getCacheStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/cache/status`);
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error fetching cache status:', error);
      return { success: false };
    }
  }

  /**
   * Clear all caches (force fresh data)
   */
  static async clearCache() {
    try {
      const response = await fetch(`${API_BASE_URL}/cache/clear`, { method: 'POST' });
      if (!response.ok) {
throw new Error(`HTTP ${response.status}`);
}
      return await response.json();
    } catch (error) {
      console.error('Error clearing cache:', error);
      return { success: false };
    }
  }

  /**
   * Get top performers across multiple stats
   * Fetches live data and sorts by various categories
   */
  static async getTopPerformers(minGames = 20) {
    try {
      // Fetch all players
      const players = await this.getPlayers({ limit: 500 });
      const eligible = players.filter(p => (p.gamesPlayed || 0) >= minGames);

      return {
        scoring: [...eligible].sort((a, b) => (b.ppg || 0) - (a.ppg || 0)).slice(0, 10),
        rebounding: [...eligible].sort((a, b) => (b.rpg || 0) - (a.rpg || 0)).slice(0, 10),
        assists: [...eligible].sort((a, b) => (b.apg || 0) - (a.apg || 0)).slice(0, 10),
        efficiency: [...eligible].sort((a, b) => (b.per || 0) - (a.per || 0)).slice(0, 10),
        shooting: [...eligible].sort((a, b) => (b.ts_pct || 0) - (a.ts_pct || 0)).slice(0, 10),
        defense: [...eligible].sort((a, b) => ((b.spg || 0) + (b.bpg || 0)) - ((a.spg || 0) + (a.bpg || 0))).slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching top performers:', error);
      return { scoring: [], rebounding: [], assists: [], efficiency: [], shooting: [], defense: [] };
    }
  }

  /**
   * Get random players from current roster
   */
  static async getRandomPlayers(count = 5) {
    try {
      const players = await this.getPlayers({ limit: 100 });
      const shuffled = [...players].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('Error fetching random players:', error);
      return [];
    }
  }

  /**
   * Get players by multiple IDs
   */
  static async getPlayersByIds(ids) {
    try {
      const playerPromises = ids.map(id => this.getPlayerById(id));
      const results = await Promise.allSettled(playerPromises);
      return results
        .filter(r => r.status === 'fulfilled' && r.value?.success)
        .map(r => r.value.data);
    } catch (error) {
      console.error('Error fetching players by IDs:', error);
      return [];
    }
  }
}

export default PlayersAPI;
