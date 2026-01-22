// NBA Players API Client - Frontend API calls
import nbaPlayersDatabase from '../data/nbaPlayersDatabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class PlayersAPI {
  /**
   * Get all players with optional filters
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
      const data = await response.json();
      // Ensure we always return an array
      if (Array.isArray(data)) return data;
      if (data?.data && Array.isArray(data.data)) return data.data;
      if (data?.players && Array.isArray(data.players)) return data.players;
      return this.getPlayersLocalArray(filters);
    } catch (error) {
      console.error('Error fetching players:', error);
      // Fallback to local data - return array directly
      return this.getPlayersLocalArray(filters);
    }
  }

  /**
   * Get players as array (for Workstation)
   */
  static getPlayersLocalArray(filters = {}) {
    let players = [...nbaPlayersDatabase];

    if (filters.team) {
      players = players.filter(p => p.team?.toLowerCase() === filters.team.toLowerCase());
    }

    if (filters.position) {
      players = players.filter(p => p.position === filters.position.toUpperCase());
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      players = players.filter(p =>
        p.name?.toLowerCase().includes(search) ||
        p.teamName?.toLowerCase().includes(search)
      );
    }

    if (filters.minPpg) {
      players = players.filter(p => p.ppg >= parseFloat(filters.minPpg));
    }

    if (filters.sortBy) {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      players.sort((a, b) => order * ((a[filters.sortBy] || 0) - (b[filters.sortBy] || 0)));
    }

    return players;
  }

  /**
   * Local fallback - filter players without API (with pagination)
   */
  static getPlayersLocal(filters = {}) {
    let players = [...nbaPlayersDatabase];

    if (filters.team) {
      players = players.filter(p => p.team.toLowerCase() === filters.team.toLowerCase());
    }

    if (filters.position) {
      players = players.filter(p => p.position === filters.position.toUpperCase());
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      players = players.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.teamName.toLowerCase().includes(search)
      );
    }

    if (filters.minPpg) {
      players = players.filter(p => p.ppg >= parseFloat(filters.minPpg));
    }

    if (filters.sortBy) {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      players.sort((a, b) => order * (a[filters.sortBy] - b[filters.sortBy]));
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      success: true,
      data: players.slice(start, end),
      pagination: {
        total: players.length,
        page,
        limit,
        totalPages: Math.ceil(players.length / limit)
      }
    };
  }

  /**
   * Get a single player by ID
   */
  static async getPlayerById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching player:', error);
      const player = nbaPlayersDatabase.find(p => p.id === parseInt(id));
      return { success: !!player, data: player };
    }
  }

  /**
   * Get all players for a team
   */
  static async getTeamPlayers(teamCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/team/${teamCode}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching team players:', error);
      const players = nbaPlayersDatabase
        .filter(p => p.team === teamCode.toUpperCase())
        .sort((a, b) => b.ppg - a.ppg);
      return { success: true, data: players, team: teamCode, count: players.length };
    }
  }

  /**
   * Search players by name
   */
  static async searchPlayers(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/search/${encodeURIComponent(query)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching players:', error);
      const results = nbaPlayersDatabase.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      return { success: true, data: results, count: results.length };
    }
  }

  /**
   * Get statistical leaders
   */
  static async getLeaders(stat = 'ppg', limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/stats/leaders?stat=${stat}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching leaders:', error);
      const leaders = [...nbaPlayersDatabase]
        .sort((a, b) => b[stat] - a[stat])
        .slice(0, limit)
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
      return { success: true, data: leaders, stat, count: leaders.length };
    }
  }

  /**
   * Compare multiple players
   */
  static async comparePlayers(playerIds) {
    try {
      const ids = Array.isArray(playerIds) ? playerIds.join(',') : playerIds;
      const response = await fetch(`${API_BASE_URL}/players/stats/compare?ids=${ids}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error comparing players:', error);
      const ids = Array.isArray(playerIds) ? playerIds : playerIds.split(',').map(id => parseInt(id));
      const players = nbaPlayersDatabase.filter(p => ids.includes(p.id));
      const comparison = {
        players,
        averages: {
          ppg: players.reduce((sum, p) => sum + p.ppg, 0) / players.length,
          rpg: players.reduce((sum, p) => sum + p.rpg, 0) / players.length,
          apg: players.reduce((sum, p) => sum + p.apg, 0) / players.length,
          per: players.reduce((sum, p) => sum + p.per, 0) / players.length
        }
      };
      return { success: true, data: comparison, count: players.length };
    }
  }

  /**
   * Get team statistics
   */
  static async getTeamStats(teamCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/stats/team-stats/${teamCode}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      const teamPlayers = nbaPlayersDatabase.filter(p => p.team === teamCode.toUpperCase());
      if (teamPlayers.length === 0) {
        return { success: false, error: 'Team not found' };
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
        topScorer: teamPlayers.reduce((max, p) => p.ppg > max.ppg ? p : max),
        topRebounder: teamPlayers.reduce((max, p) => p.rpg > max.rpg ? p : max),
        topAssister: teamPlayers.reduce((max, p) => p.apg > max.apg ? p : max)
      };

      return { success: true, data: teamStats };
    }
  }

  /**
   * Get all teams
   */
  static async getTeams() {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching teams:', error);
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
      return { success: true, data: teamsList, count: teamsList.length };
    }
  }

  /**
   * Get position averages
   */
  static async getPositionAverages() {
    try {
      const response = await fetch(`${API_BASE_URL}/players/stats/position-averages`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching position averages:', error);
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
            avgPer: players.reduce((sum, p) => sum + p.per, 0) / players.length
          };
        }
      });

      return { success: true, data: positionStats };
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
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error with advanced filter:', error);
      let results = [...nbaPlayersDatabase];

      filters.forEach(filter => {
        const { field, operator, value } = filter;
        switch (operator) {
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
          case 'eq':
            results = results.filter(p => p[field] === value);
            break;
        }
      });

      if (sortBy) {
        const order = sortOrder === 'asc' ? 1 : -1;
        results.sort((a, b) => order * (a[sortBy] - b[sortBy]));
      }

      return { success: true, data: results, count: results.length };
    }
  }

  /**
   * Get random players
   */
  static getRandomPlayers(count = 5) {
    const shuffled = [...nbaPlayersDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Get players by multiple IDs
   */
  static getPlayersByIds(ids) {
    return nbaPlayersDatabase.filter(p => ids.includes(p.id));
  }

  /**
   * Get top performers across multiple stats
   */
  static getTopPerformers(minGames = 50) {
    const eligible = nbaPlayersDatabase.filter(p => p.gamesPlayed >= minGames);

    return {
      scoring: eligible.sort((a, b) => b.ppg - a.ppg).slice(0, 10),
      rebounding: eligible.sort((a, b) => b.rpg - a.rpg).slice(0, 10),
      assists: eligible.sort((a, b) => b.apg - a.apg).slice(0, 10),
      efficiency: eligible.sort((a, b) => b.per - a.per).slice(0, 10),
      shooting: eligible.sort((a, b) => b.ts_pct - a.ts_pct).slice(0, 10),
      defense: eligible.sort((a, b) => (b.spg + b.bpg) - (a.spg + a.bpg)).slice(0, 10)
    };
  }
}

export default PlayersAPI;
