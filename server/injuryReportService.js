const axios = require('axios');

/**
 * NBA Injury Report Service
 * Fetches and tracks player injury data from multiple sources
 */
class InjuryReportService {
  constructor() {
    // API keys (configure in .env)
    this.sportsDataIOKey = process.env.SPORTSDATA_IO_KEY;
    this.rapidApiKey = process.env.RAPID_API_KEY;
    
    // Cache
    this.cache = new Map();
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
    
    // Subscribers
    this.subscribers = [];
  }

  /**
   * Fetch current NBA injuries
   */
  async getInjuries() {
    const cacheKey = 'nba_injuries';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      // Try primary source: SportsDataIO
      let injuries = await this.fetchFromSportsDataIO();

      // Fallback to RapidAPI if primary fails
      if (!injuries || injuries.length === 0) {
        injuries = await this.fetchFromRapidAPI();
      }

      // Enrich with additional data
      injuries = injuries.map(injury => this.enrichInjuryData(injury));

      // Cache results
      this.cache.set(cacheKey, {
        data: injuries,
        timestamp: Date.now()
      });

      return injuries;

    } catch (error) {
      console.error('Failed to fetch injuries:', error);
      
      // Return cached data if available
      if (cached) {
        return cached.data;
      }

      throw error;
    }
  }

  /**
   * Fetch from SportsDataIO API
   */
  async fetchFromSportsDataIO() {
    if (!this.sportsDataIOKey) {
      return [];
    }

    try {
      const response = await axios.get(
        `https://api.sportsdata.io/v3/nba/scores/json/InjuredPlayers`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.sportsDataIOKey
          }
        }
      );

      return response.data.map(injury => ({
        playerId: injury.PlayerID,
        playerName: injury.Name,
        team: injury.Team,
        position: injury.Position,
        status: injury.Status,
        injuryType: injury.BodyPart,
        description: injury.InjuryStartDate,
        updated: injury.Updated,
        source: 'SportsDataIO'
      }));

    } catch (error) {
      console.error('SportsDataIO fetch failed:', error.message);
      return [];
    }
  }

  /**
   * Fetch from RapidAPI
   */
  async fetchFromRapidAPI() {
    if (!this.rapidApiKey) {
      return [];
    }

    try {
      const response = await axios.get(
        'https://api-basketball.p.rapidapi.com/injuries',
        {
          params: { league: '12', season: '2024' }, // NBA league ID
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': 'api-basketball.p.rapidapi.com'
          }
        }
      );

      return response.data.response.map(injury => ({
        playerId: injury.player.id,
        playerName: injury.player.name,
        team: injury.team.name,
        position: injury.player.position,
        status: injury.type,
        injuryType: injury.reason,
        description: injury.reason,
        updated: new Date().toISOString(),
        source: 'RapidAPI'
      }));

    } catch (error) {
      console.error('RapidAPI fetch failed:', error.message);
      return [];
    }
  }

  /**
   * Get injuries for specific team
   */
  async getTeamInjuries(teamName) {
    const allInjuries = await this.getInjuries();
    return allInjuries.filter(injury => 
      injury.team.toLowerCase().includes(teamName.toLowerCase())
    );
  }

  /**
   * Get injury status for specific player
   */
  async getPlayerInjuryStatus(playerName) {
    const allInjuries = await this.getInjuries();
    return allInjuries.find(injury =>
      injury.playerName.toLowerCase().includes(playerName.toLowerCase())
    );
  }

  /**
   * Enrich injury data with impact analysis
   */
  enrichInjuryData(injury) {
    return {
      ...injury,
      severity: this.calculateSeverity(injury),
      impact: this.calculateImpact(injury),
      expectedReturn: this.estimateReturn(injury)
    };
  }

  /**
   * Calculate injury severity
   */
  calculateSeverity(injury) {
    const status = injury.status?.toLowerCase() || '';
    
    if (status.includes('out')) {
return 'high';
}
    if (status.includes('doubtful')) {
return 'high';
}
    if (status.includes('questionable')) {
return 'medium';
}
    if (status.includes('probable')) {
return 'low';
}
    if (status.includes('day-to-day')) {
return 'medium';
}
    
    return 'unknown';
  }

  /**
   * Calculate betting impact
   */
  calculateImpact(injury) {
    const position = injury.position?.toLowerCase() || '';
    const severity = this.calculateSeverity(injury);

    // Star players have higher impact
    const isStarPosition = ['pg', 'sg', 'c'].includes(position);
    
    if (severity === 'high' && isStarPosition) {
      return 'critical';
    } else if (severity === 'high') {
      return 'high';
    } else if (severity === 'medium') {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Estimate return timeline
   */
  estimateReturn(injury) {
    const injuryType = injury.injuryType?.toLowerCase() || '';
    
    // Common injury timelines (in days)
    const timelines = {
      'ankle sprain': 7,
      'knee': 21,
      'hamstring': 14,
      'back': 10,
      'shoulder': 14,
      'concussion': 7,
      'illness': 3,
      'rest': 1
    };

    for (const [type, days] of Object.entries(timelines)) {
      if (injuryType.includes(type)) {
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + days);
        return returnDate.toISOString().split('T')[0];
      }
    }

    return 'Unknown';
  }

  /**
   * Get injury trends
   */
  async getInjuryTrends() {
    const injuries = await this.getInjuries();

    const trends = {
      totalInjuries: injuries.length,
      byStatus: {},
      byTeam: {},
      byType: {},
      byPosition: {},
      criticalInjuries: injuries.filter(i => i.impact === 'critical')
    };

    // Aggregate by different categories
    injuries.forEach(injury => {
      // By status
      trends.byStatus[injury.status] = (trends.byStatus[injury.status] || 0) + 1;

      // By team
      trends.byTeam[injury.team] = (trends.byTeam[injury.team] || 0) + 1;

      // By type
      trends.byType[injury.injuryType] = (trends.byType[injury.injuryType] || 0) + 1;

      // By position
      trends.byPosition[injury.position] = (trends.byPosition[injury.position] || 0) + 1;
    });

    return trends;
  }

  /**
   * Subscribe to injury updates
   */
  subscribe(callback) {
    this.subscribers.push(callback);
    
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify subscribers of injury updates
   */
  notifySubscribers(injury) {
    this.subscribers.forEach(callback => {
      try {
        callback(injury);
      } catch (error) {
        console.error('Subscriber notification failed:', error);
      }
    });
  }

  /**
   * Start polling for injury updates
   */
  startPolling(intervalMs = 5 * 60 * 1000) {
    this.pollingInterval = setInterval(async () => {
      try {
        const previousInjuries = this.cache.get('nba_injuries')?.data || [];
        const currentInjuries = await this.getInjuries();

        // Detect new injuries
        const newInjuries = currentInjuries.filter(current =>
          !previousInjuries.some(prev => 
            prev.playerId === current.playerId && 
            prev.status === current.status
          )
        );

        // Notify subscribers
        newInjuries.forEach(injury => {
          console.log('New injury detected:', injury.playerName, injury.status);
          this.notifySubscribers({
            type: 'new_injury',
            data: injury
          });
        });

      } catch (error) {
        console.error('Polling error:', error);
      }
    }, intervalMs);

    console.log(`✓ Injury polling started (${intervalMs / 1000}s interval)`);
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('✓ Injury polling stopped');
    }
  }

  /**
   * Get fantasy impact
   */
  async getFantasyImpact(playerName) {
    const injury = await this.getPlayerInjuryStatus(playerName);
    
    if (!injury) {
      return {
        impacted: false,
        message: 'No injury reported'
      };
    }

    return {
      impacted: true,
      severity: injury.severity,
      impact: injury.impact,
      status: injury.status,
      recommendation: this.getFantasyRecommendation(injury)
    };
  }

  /**
   * Get fantasy recommendation
   */
  getFantasyRecommendation(injury) {
    switch (injury.impact) {
      case 'critical':
        return 'Avoid betting on this player. Consider teammates for increased usage.';
      case 'high':
        return 'High risk. Monitor status closely before game time.';
      case 'medium':
        return 'Moderate risk. Consider lowering bet size or avoiding props.';
      case 'low':
        return 'Minor concern. Player likely to play with limited impact.';
      default:
        return 'Insufficient data to provide recommendation.';
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('✓ Injury cache cleared');
  }
}

// Singleton instance
const injuryReportService = new InjuryReportService();

module.exports = injuryReportService;
