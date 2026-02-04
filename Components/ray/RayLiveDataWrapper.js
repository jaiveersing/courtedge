// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔴 RAY LIVE DATA WRAPPER - REAL-TIME NBA DATA FOR RAY AI ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// This wrapper fetches LIVE data from ESPN API and augments it with advanced analytics
// Uses real-time player stats, scores, and standings instead of static mock data
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

import PlayersAPI from '../../src/api/playersApi';
import nbaLiveService from '../../src/api/nbaLiveService';
import { EXTENDED_PLAYERS, TEAMS_DATABASE, BettingAlgorithms, PropCorrelationAnalyzer } from './RayEnhancedDatabase';

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🏀 LIVE DATA SERVICE FOR RAY
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

class RayLiveDataService {
  constructor() {
    this.cache = {
      players: null,
      teams: null,
      scoreboard: null,
      standings: null,
      lastUpdate: 0
    };
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid() {
    return Date.now() - this.cache.lastUpdate < this.CACHE_DURATION;
  }

  /**
   * Get live scoreboard with today's games
   */
  async getLiveScoreboard() {
    try {
      const result = await PlayersAPI.getLiveScoreboard();
      if (result.success && result.data) {
        this.cache.scoreboard = result.data;
        return result.data;
      }
      // Fallback to direct service call
      return await nbaLiveService.getLiveScoreboard();
    } catch (error) {
      console.error('Ray Live Data - Scoreboard Error:', error);
      return { games: [], error: error.message };
    }
  }

  /**
   * Get live standings
   */
  async getLiveStandings() {
    try {
      const result = await PlayersAPI.getStandings();
      if (result.success && result.data) {
        this.cache.standings = result.data;
        return result.data;
      }
      return await nbaLiveService.getStandings();
    } catch (error) {
      console.error('Ray Live Data - Standings Error:', error);
      return [];
    }
  }

  /**
   * Get live player stats
   * Merges live ESPN data with advanced metrics from static database
   */
  async getPlayerData(playerName) {
    try {
      // Search for player via API
      const searchResult = await PlayersAPI.searchPlayers(playerName);
      let liveData = null;

      if (searchResult.data && searchResult.data.length > 0) {
        const match = searchResult.data.find(
          p => p.name?.toLowerCase() === playerName.toLowerCase()
        ) || searchResult.data[0];

        if (match && match.id) {
          // Get detailed stats
          const playerResult = await PlayersAPI.getPlayerById(match.id);
          if (playerResult.success && playerResult.data) {
            liveData = playerResult.data;
          }
        }
      }

      // Check static database for advanced metrics
      const staticData = EXTENDED_PLAYERS[playerName] || null;

      // Merge live data with static advanced metrics
      if (liveData) {
        return {
          ...liveData,
          source: 'live',
          lastUpdated: new Date().toISOString(),
          // Augment with advanced metrics from static data if available
          advanced: staticData?.advanced || null,
          propHitRates: staticData?.propHitRates || null,
          splits: staticData?.splits || null,
          vsTeam: staticData?.vsTeam || null,
          gameLog: staticData?.gameLog || null,
          injuries: staticData?.injuries || null,
          fantasy: staticData?.fantasy || null,
          career: staticData?.career || null
        };
      }

      // Fallback to static data if live data unavailable
      if (staticData) {
        return {
          ...staticData,
          source: 'static',
          lastUpdated: null
        };
      }

      return null;
    } catch (error) {
      console.error('Ray Live Data - Player Error:', error);
      // Fallback to static data
      return EXTENDED_PLAYERS[playerName] || null;
    }
  }

  /**
   * Get all active players (live)
   */
  async getAllPlayers() {
    try {
      if (this.cache.players && this.isCacheValid()) {
        return this.cache.players;
      }

      const players = await PlayersAPI.getPlayers({ limit: 500 });
      if (players && players.length > 0) {
        this.cache.players = players;
        this.cache.lastUpdate = Date.now();
        return players;
      }

      // Fallback to static data keys
      return Object.values(EXTENDED_PLAYERS);
    } catch (error) {
      console.error('Ray Live Data - All Players Error:', error);
      return Object.values(EXTENDED_PLAYERS);
    }
  }

  /**
   * Search for players (live)
   */
  async searchPlayers(query) {
    try {
      const result = await PlayersAPI.searchPlayers(query);
      if (result.data && result.data.length > 0) {
        return result.data;
      }

      // Fallback: search static database
      const queryLower = query.toLowerCase();
      const matches = Object.keys(EXTENDED_PLAYERS).filter(
        name => name.toLowerCase().includes(queryLower)
      );
      return matches.map(name => EXTENDED_PLAYERS[name]);
    } catch (error) {
      console.error('Ray Live Data - Search Error:', error);
      // Fallback to static data
      const queryLower = query.toLowerCase();
      const matches = Object.keys(EXTENDED_PLAYERS).filter(
        name => name.toLowerCase().includes(queryLower)
      );
      return matches.map(name => EXTENDED_PLAYERS[name]);
    }
  }

  /**
   * Get team data (live)
   */
  async getTeamData(teamCode) {
    try {
      const result = await PlayersAPI.getTeamStats(teamCode);
      if (result.success && result.data) {
        // Merge with static advanced data
        const staticTeam = TEAMS_DATABASE[teamCode];
        return {
          ...result.data,
          source: 'live',
          // Add static advanced metrics
          situational: staticTeam?.situational || null,
          schedule: staticTeam?.schedule || null,
          betting: staticTeam?.betting || null,
          keyPlayers: staticTeam?.keyPlayers || null
        };
      }

      // Fallback to static
      return TEAMS_DATABASE[teamCode] || null;
    } catch (error) {
      console.error('Ray Live Data - Team Error:', error);
      return TEAMS_DATABASE[teamCode] || null;
    }
  }

  /**
   * Get live news
   */
  async getNews(limit = 10) {
    try {
      const result = await PlayersAPI.getNews(limit);
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Ray Live Data - News Error:', error);
      return [];
    }
  }

  /**
   * Get box score for a game
   */
  async getBoxScore(gameId) {
    try {
      const result = await PlayersAPI.getBoxScore(gameId);
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Ray Live Data - BoxScore Error:', error);
      return null;
    }
  }

  /**
   * Get today's games with betting info
   */
  async getTodaysGamesWithOdds() {
    try {
      const scoreboard = await this.getLiveScoreboard();
      const games = scoreboard.games || [];

      return games.map(game => ({
        id: game.id,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        status: game.status,
        odds: game.odds,
        venue: game.venue,
        broadcast: game.broadcast,
        // Add static betting data if available
        homeTeamData: TEAMS_DATABASE[game.homeTeam?.abbreviation],
        awayTeamData: TEAMS_DATABASE[game.awayTeam?.abbreviation]
      }));
    } catch (error) {
      console.error('Ray Live Data - Today\'s Games Error:', error);
      return [];
    }
  }

  /**
   * Analyze player prop bet using live data
   */
  async analyzePlayerProp(playerName, propType, line) {
    try {
      const playerData = await this.getPlayerData(playerName);
      if (!playerData) {
        return { error: 'Player not found', success: false };
      }

      // Use BettingAlgorithms from static database for analysis
      const algorithms = new BettingAlgorithms();
      const analysis = algorithms.calculatePropConfidence(playerData, propType, line);

      return {
        success: true,
        player: playerData,
        analysis,
        source: playerData.source || 'live'
      };
    } catch (error) {
      console.error('Ray Live Data - Prop Analysis Error:', error);
      return { error: error.message, success: false };
    }
  }

  /**
   * Get prop correlations
   */
  getCorrelationAnalysis(playerId, propType) {
    const analyzer = new PropCorrelationAnalyzer();
    return analyzer.analyzeCorrelations(playerId, propType);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// EXPORT SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

const rayLiveData = new RayLiveDataService();

export default rayLiveData;

export {
  RayLiveDataService,
  // Re-export static data for fallback/advanced metrics
  EXTENDED_PLAYERS,
  TEAMS_DATABASE,
  BettingAlgorithms,
  PropCorrelationAnalyzer
};
