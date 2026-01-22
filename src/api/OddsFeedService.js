/**
 * Live Odds Feed Service
 * Integrates with The Odds API, polls every 30 seconds, caches responses
 */

const ODDS_API_KEY = process.env.ODDS_API_KEY || 'demo_key';
const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4';

class OddsFeedService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 30000; // 30 seconds
    this.isPolling = false;
    this.pollInterval = null;
    this.requestCount = 0;
    this.requestLimit = 500; // Monthly API limit
    this.subscribers = new Map();
  }

  /**
   * Start polling for odds updates
   */
  startPolling(sports = ['basketball_nba']) {
    if (this.isPolling) {
      console.log('Polling already active');
      return;
    }

    this.isPolling = true;
    console.log(`📡 Starting odds feed polling for: ${sports.join(', ')}`);

    // Initial fetch
    this.fetchAllOdds(sports);

    // Poll every 30 seconds
    this.pollInterval = setInterval(() => {
      this.fetchAllOdds(sports);
    }, this.cacheExpiry);
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      this.isPolling = false;
      console.log('📡 Stopped odds feed polling');
    }
  }

  /**
   * Fetch odds for all sports
   */
  async fetchAllOdds(sports) {
    for (const sport of sports) {
      try {
        await this.fetchOdds(sport);
      } catch (error) {
        console.error(`Error fetching odds for ${sport}:`, error.message);
      }
    }
  }

  /**
   * Fetch odds from The Odds API
   */
  async fetchOdds(sport = 'basketball_nba', markets = ['h2h', 'spreads', 'totals']) {
    const cacheKey = `${sport}_${markets.join('_')}`;
    
    // Check cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Check rate limit
    if (this.requestCount >= this.requestLimit) {
      console.warn('⚠️ API rate limit reached, using cached data only');
      return cached || [];
    }

    try {
      const url = `${ODDS_API_BASE_URL}/sports/${sport}/odds/`;
      const params = new URLSearchParams({
        apiKey: ODDS_API_KEY,
        regions: 'us',
        markets: markets.join(','),
        oddsFormat: 'american',
        dateFormat: 'iso'
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.requestCount++;
      
      // Transform data
      const transformed = this.transformOddsData(data);
      
      // Cache it
      this.setCache(cacheKey, transformed);
      
      // Notify subscribers
      this.notifySubscribers(sport, transformed);
      
      console.log(`✅ Fetched ${transformed.length} games for ${sport}`);
      return transformed;

    } catch (error) {
      console.error(`Error fetching odds: ${error.message}`);
      return cached || [];
    }
  }

  /**
   * Transform API response to our format
   */
  transformOddsData(apiData) {
    return apiData.map(game => {
      const bookmakerOdds = {};
      
      game.bookmakers.forEach(bookmaker => {
        const bookName = bookmaker.key;
        bookmakerOdds[bookName] = {};
        
        bookmaker.markets.forEach(market => {
          const marketType = market.key;
          bookmakerOdds[bookName][marketType] = {
            outcomes: market.outcomes,
            lastUpdate: market.last_update
          };
        });
      });

      return {
        id: game.id,
        sport: game.sport_key,
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        commenceTime: game.commence_time,
        bookmakers: bookmakerOdds,
        fetchedAt: new Date().toISOString()
      };
    });
  }

  /**
   * Get odds for specific game
   */
  async getGameOdds(gameId, sport = 'basketball_nba') {
    const odds = await this.fetchOdds(sport);
    return odds.find(game => game.id === gameId);
  }

  /**
   * Get best odds across all books
   */
  getBestOdds(game, betType = 'h2h', teamSide = 'home') {
    if (!game || !game.bookmakers) return null;

    let bestOdds = null;
    let bestBook = null;
    let bestValue = -Infinity;

    Object.entries(game.bookmakers).forEach(([bookName, markets]) => {
      if (!markets[betType]) return;

      const outcomes = markets[betType].outcomes;
      const outcome = outcomes.find(o => {
        if (teamSide === 'home') return o.name === game.homeTeam;
        if (teamSide === 'away') return o.name === game.awayTeam;
        return o.name === teamSide;
      });

      if (outcome && outcome.price > bestValue) {
        bestValue = outcome.price;
        bestOdds = outcome;
        bestBook = bookName;
      }
    });

    return { book: bestBook, odds: bestOdds, value: bestValue };
  }

  /**
   * Find arbitrage opportunities
   */
  findArbitrage(game) {
    if (!game || !game.bookmakers) return null;

    const opportunities = [];

    // Check h2h (moneyline) arbitrage
    const homeOdds = [];
    const awayOdds = [];

    Object.entries(game.bookmakers).forEach(([bookName, markets]) => {
      if (markets.h2h) {
        markets.h2h.outcomes.forEach(outcome => {
          if (outcome.name === game.homeTeam) {
            homeOdds.push({ book: bookName, odds: outcome.price });
          } else if (outcome.name === game.awayTeam) {
            awayOdds.push({ book: bookName, odds: outcome.price });
          }
        });
      }
    });

    // Find best home and away odds
    const bestHome = homeOdds.reduce((best, curr) => 
      curr.odds > best.odds ? curr : best
    , { odds: -Infinity });

    const bestAway = awayOdds.reduce((best, curr) => 
      curr.odds > best.odds ? curr : best
    , { odds: -Infinity });

    // Calculate arbitrage
    const homeImplied = this.oddsToImpliedProbability(bestHome.odds);
    const awayImplied = this.oddsToImpliedProbability(bestAway.odds);
    const totalImplied = homeImplied + awayImplied;

    if (totalImplied < 1.0) {
      const profit = ((1 / totalImplied) - 1) * 100;
      opportunities.push({
        type: 'moneyline',
        homeBook: bestHome.book,
        homeOdds: bestHome.odds,
        awayBook: bestAway.book,
        awayOdds: bestAway.odds,
        profit: profit.toFixed(2),
        stake: {
          home: (homeImplied / totalImplied * 100).toFixed(2),
          away: (awayImplied / totalImplied * 100).toFixed(2)
        }
      });
    }

    return opportunities.length > 0 ? opportunities : null;
  }

  /**
   * Convert American odds to implied probability
   */
  oddsToImpliedProbability(americanOdds) {
    if (americanOdds > 0) {
      return 100 / (americanOdds + 100);
    } else {
      return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
    }
  }

  /**
   * Track line movements
   */
  trackLineMovement(game, previousGame) {
    if (!previousGame) return null;

    const movements = [];

    Object.entries(game.bookmakers).forEach(([bookName, currentMarkets]) => {
      const previousMarkets = previousGame.bookmakers[bookName];
      if (!previousMarkets) return;

      ['h2h', 'spreads', 'totals'].forEach(marketType => {
        const current = currentMarkets[marketType];
        const previous = previousMarkets[marketType];

        if (current && previous) {
          current.outcomes.forEach((currentOutcome, idx) => {
            const previousOutcome = previous.outcomes[idx];
            if (previousOutcome && currentOutcome.price !== previousOutcome.price) {
              movements.push({
                book: bookName,
                market: marketType,
                team: currentOutcome.name,
                from: previousOutcome.price,
                to: currentOutcome.price,
                change: currentOutcome.price - previousOutcome.price,
                timestamp: new Date().toISOString()
              });
            }
          });
        }
      });
    });

    return movements.length > 0 ? movements : null;
  }

  /**
   * Subscribe to odds updates
   */
  subscribe(sport, callback) {
    if (!this.subscribers.has(sport)) {
      this.subscribers.set(sport, []);
    }
    this.subscribers.get(sport).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(sport);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all subscribers of updates
   */
  notifySubscribers(sport, data) {
    const callbacks = this.subscribers.get(sport);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Cache management
   */
  getFromCache(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  /**
   * Get API usage stats
   */
  getStats() {
    return {
      requestCount: this.requestCount,
      requestLimit: this.requestLimit,
      remaining: this.requestLimit - this.requestCount,
      cacheSize: this.cache.size,
      isPolling: this.isPolling
    };
  }
}

// Singleton instance
const oddsFeedService = new OddsFeedService();

module.exports = oddsFeedService;
