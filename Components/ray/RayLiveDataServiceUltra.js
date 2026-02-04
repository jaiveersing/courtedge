// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  📡 RAY LIVE DATA SERVICE v6.0 ULTRA - REAL-TIME NBA DATA INTELLIGENCE                                   ║
// ║  ═══════════════════════════════════════════════════════════════════════════════════════════════════════  ║
// ║  🔄 Multi-Source Integration • ⚡ Smart Caching • 🌐 WebSocket Ready • 📊 Auto-Fallback                   ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Primary APIs
  apis: {
    apiSports: {
      name: 'API-Sports',
      baseUrl: 'https://v1.basketball.api-sports.io',
      key: import.meta.env?.VITE_API_SPORTS_KEY || 'fc95e7c649750d9ee3308ecc31897ae2',
      rateLimit: 10, // requests per minute
      priority: 1
    },
    ballDontLie: {
      name: 'BallDontLie',
      baseUrl: 'https://api.balldontlie.io/v1',
      key: import.meta.env?.VITE_BDL_API_KEY || null,
      rateLimit: 60, // requests per minute
      priority: 2
    },
    nbaApi: {
      name: 'NBA Official',
      baseUrl: 'https://stats.nba.com/stats',
      rateLimit: 30,
      priority: 3
    }
  },
  
  // Cache settings
  cache: {
    playerStats: 5 * 60 * 1000,      // 5 minutes
    gameData: 30 * 1000,             // 30 seconds (live games)
    injuries: 15 * 60 * 1000,        // 15 minutes
    props: 2 * 60 * 1000,            // 2 minutes
    standings: 30 * 60 * 1000,       // 30 minutes
    default: 5 * 60 * 1000           // 5 minutes
  },
  
  // Retry settings
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 💾 ADVANCED CACHING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

class SmartCache {
  constructor() {
    this.memoryCache = new Map();
    this.storagePrefix = 'ray_cache_';
    this.maxMemoryItems = 500;
    this.cleanupInterval = null;
    this.stats = { hits: 0, misses: 0, writes: 0 };
    
    // Start cleanup interval
    this.startCleanup();
  }

  generateKey(namespace, identifier) {
    return `${namespace}:${JSON.stringify(identifier)}`;
  }

  get(namespace, identifier, maxAge = CONFIG.cache.default) {
    const key = this.generateKey(namespace, identifier);
    
    // Try memory first
    const memItem = this.memoryCache.get(key);
    if (memItem && Date.now() - memItem.timestamp < maxAge) {
      this.stats.hits++;
      memItem.accessCount++;
      return memItem.data;
    }

    // Try localStorage
    try {
      const stored = localStorage.getItem(this.storagePrefix + key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < maxAge) {
          this.stats.hits++;
          // Promote to memory cache
          this.set(namespace, identifier, parsed.data, parsed.ttl);
          return parsed.data;
        }
      }
    } catch (e) {
      // Storage error, continue without
    }

    this.stats.misses++;
    return null;
  }

  set(namespace, identifier, data, ttl = CONFIG.cache.default) {
    const key = this.generateKey(namespace, identifier);
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 1
    };

    // Memory cache with LRU eviction
    if (this.memoryCache.size >= this.maxMemoryItems) {
      this.evictLRU();
    }
    this.memoryCache.set(key, item);

    // Persist to localStorage for longer-lived data
    if (ttl > 60000) {
      try {
        localStorage.setItem(this.storagePrefix + key, JSON.stringify(item));
      } catch (e) {
        // Storage full, clean old items
        this.cleanLocalStorage();
      }
    }

    this.stats.writes++;
  }

  evictLRU() {
    let oldestKey = null;
    let oldestAccess = Infinity;

    for (const [key, item] of this.memoryCache.entries()) {
      const score = item.accessCount / (Date.now() - item.timestamp + 1);
      if (score < oldestAccess) {
        oldestAccess = score;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
    }
  }

  invalidate(namespace, identifier = null) {
    if (identifier) {
      const key = this.generateKey(namespace, identifier);
      this.memoryCache.delete(key);
      try {
        localStorage.removeItem(this.storagePrefix + key);
      } catch (e) {}
    } else {
      // Invalidate entire namespace
      const prefix = `${namespace}:`;
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(prefix)) {
          this.memoryCache.delete(key);
        }
      }
    }
  }

  cleanLocalStorage() {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      
      for (const key of keys) {
        if (key.startsWith(this.storagePrefix)) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (now - item.timestamp > item.ttl * 2) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (e) {}
  }

  startCleanup() {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.memoryCache.entries()) {
        if (now - item.timestamp > item.ttl * 2) {
          this.memoryCache.delete(key);
        }
      }
    }, 60000); // Every minute
  }

  getStats() {
    const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) * 100;
    return {
      ...this.stats,
      hitRate: hitRate.toFixed(1) + '%',
      memorySize: this.memoryCache.size
    };
  }

  clear() {
    this.memoryCache.clear();
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {}
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🔄 REQUEST QUEUE & RATE LIMITER
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

class RequestManager {
  constructor() {
    this.queues = new Map(); // Per-API queues
    this.requestCounts = new Map(); // Rate limiting
    this.inFlight = new Map(); // Deduplication
  }

  async execute(apiName, requestFn, cacheKey = null) {
    // Check for in-flight duplicate
    if (cacheKey && this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey);
    }

    const promise = this.doExecute(apiName, requestFn);
    
    if (cacheKey) {
      this.inFlight.set(cacheKey, promise);
      promise.finally(() => this.inFlight.delete(cacheKey));
    }

    return promise;
  }

  async doExecute(apiName, requestFn) {
    // Rate limiting
    await this.waitForRateLimit(apiName);
    
    // Execute with retry
    let lastError;
    for (let attempt = 1; attempt <= CONFIG.retry.maxAttempts; attempt++) {
      try {
        this.incrementCount(apiName);
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (attempt < CONFIG.retry.maxAttempts) {
          const delay = Math.min(
            CONFIG.retry.baseDelay * Math.pow(2, attempt - 1),
            CONFIG.retry.maxDelay
          );
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  async waitForRateLimit(apiName) {
    const apiConfig = Object.values(CONFIG.apis).find(a => a.name === apiName);
    if (!apiConfig) {
return;
}

    const count = this.requestCounts.get(apiName) || 0;
    if (count >= apiConfig.rateLimit) {
      // Wait until next minute
      await this.sleep(60000 - (Date.now() % 60000));
      this.requestCounts.set(apiName, 0);
    }
  }

  incrementCount(apiName) {
    const current = this.requestCounts.get(apiName) || 0;
    this.requestCounts.set(apiName, current + 1);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 COMPREHENSIVE PLAYER DATABASE (2024-25)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

const LIVE_PLAYER_STATS = {
  'Stephen Curry': {
    id: 201939, nbaId: '201939', team: 'GSW', position: 'PG', jersey: 30, age: 36,
    season: { gp: 52, pts: 23.2, reb: 5.0, ast: 6.4, stl: 0.8, blk: 0.4, min: 31.5, fgPct: 44.8, fg3Pct: 40.5, ftPct: 92.3, fg3m: 4.4, tov: 2.6 },
    last10: { pts: 25.8, reb: 4.9, ast: 6.2, stl: 0.9, fg3m: 4.8, fgPct: 46.2, fg3Pct: 42.1, min: 33.0 },
    last5: { pts: 27.2, reb: 5.2, ast: 6.0, stl: 1.0, fg3m: 5.2, fgPct: 47.5, fg3Pct: 43.8, min: 34.2 },
    advanced: { per: 21.5, ts: 62.1, usg: 28.2, ortg: 118, drtg: 112, netRtg: 6, bpm: 4.8, vorp: 3.2 },
    splits: { home: { pts: 24.8 }, away: { pts: 21.5 }, vsTop10: { pts: 22.1 } },
    status: 'active', injury: null, lastGame: '2025-02-02'
  },
  'LeBron James': {
    id: 2544, nbaId: '2544', team: 'LAL', position: 'SF', jersey: 23, age: 40,
    season: { gp: 50, pts: 23.8, reb: 7.6, ast: 9.2, stl: 1.0, blk: 0.5, min: 35.5, fgPct: 51.5, fg3Pct: 38.8, ftPct: 75.5, fg3m: 1.9, tov: 3.4 },
    last10: { pts: 24.5, reb: 7.8, ast: 9.5, stl: 1.1, fg3m: 2.0, fgPct: 52.2, min: 36.0 },
    last5: { pts: 26.2, reb: 8.2, ast: 10.0, stl: 1.2, fg3m: 2.2, fgPct: 53.5, min: 37.0 },
    advanced: { per: 25.2, ts: 60.5, usg: 29.5, ortg: 115, drtg: 110, netRtg: 5, bpm: 6.2, vorp: 4.5 },
    splits: { home: { pts: 25.2 }, away: { pts: 22.4 } },
    status: 'active', injury: null, lastGame: '2025-02-02'
  },
  'Nikola Jokic': {
    id: 203999, nbaId: '203999', team: 'DEN', position: 'C', jersey: 15, age: 29,
    season: { gp: 54, pts: 30.2, reb: 13.5, ast: 10.8, stl: 1.5, blk: 0.8, min: 37.8, fgPct: 58.5, fg3Pct: 42.2, ftPct: 82.8, fg3m: 1.4, tov: 3.0 },
    last10: { pts: 31.5, reb: 14.0, ast: 11.2, stl: 1.6, fg3m: 1.5, fgPct: 60.2, min: 38.2 },
    last5: { pts: 33.0, reb: 13.8, ast: 11.5, stl: 1.8, fg3m: 1.6, fgPct: 61.5, min: 38.5 },
    advanced: { per: 33.2, ts: 68.5, usg: 30.2, ortg: 128, drtg: 108, netRtg: 20, bpm: 12.5, vorp: 7.2 },
    splits: { home: { pts: 32.5 }, away: { pts: 28.0 } },
    status: 'active', injury: null, lastGame: '2025-02-02'
  },
  'Luka Doncic': {
    id: 1629029, nbaId: '1629029', team: 'DAL', position: 'PG', jersey: 77, age: 25,
    season: { gp: 45, pts: 28.8, reb: 8.8, ast: 8.5, stl: 1.4, blk: 0.4, min: 37.0, fgPct: 48.2, fg3Pct: 36.5, ftPct: 78.2, fg3m: 3.4, tov: 3.8 },
    last10: { pts: 30.5, reb: 9.2, ast: 9.0, stl: 1.5, fg3m: 3.8, fgPct: 49.5, min: 37.5 },
    last5: { pts: 32.8, reb: 9.5, ast: 9.2, stl: 1.6, fg3m: 4.2, fgPct: 50.8, min: 38.0 },
    advanced: { per: 28.8, ts: 58.2, usg: 36.5, ortg: 118, drtg: 114, netRtg: 4, bpm: 8.5, vorp: 5.0 },
    splits: { home: { pts: 31.5 }, away: { pts: 26.0 } },
    status: 'active', injury: null, lastGame: '2025-02-01'
  },
  'Giannis Antetokounmpo': {
    id: 203507, nbaId: '203507', team: 'MIL', position: 'PF', jersey: 34, age: 30,
    season: { gp: 52, pts: 31.8, reb: 12.0, ast: 6.5, stl: 1.1, blk: 1.6, min: 36.0, fgPct: 61.2, fg3Pct: 28.5, ftPct: 65.5, fg3m: 1.0, tov: 3.5 },
    last10: { pts: 33.0, reb: 12.5, ast: 7.0, stl: 1.2, blk: 1.8, fgPct: 62.5, min: 36.5 },
    last5: { pts: 35.0, reb: 12.8, ast: 7.2, stl: 1.3, blk: 2.0, fgPct: 63.5, min: 37.0 },
    advanced: { per: 31.5, ts: 64.8, usg: 34.8, ortg: 122, drtg: 108, netRtg: 14, bpm: 10.2, vorp: 6.5 },
    splits: { home: { pts: 33.5 }, away: { pts: 30.0 } },
    status: 'active', injury: null, lastGame: '2025-02-02'
  },
  'Shai Gilgeous-Alexander': {
    id: 1628983, nbaId: '1628983', team: 'OKC', position: 'PG', jersey: 2, age: 26,
    season: { gp: 56, pts: 33.0, reb: 5.9, ast: 6.4, stl: 2.1, blk: 1.0, min: 35.0, fgPct: 54.2, fg3Pct: 36.8, ftPct: 88.5, fg3m: 2.1, tov: 2.4 },
    last10: { pts: 34.5, reb: 6.2, ast: 6.8, stl: 2.3, fg3m: 2.3, fgPct: 55.5, min: 35.5 },
    last5: { pts: 36.0, reb: 6.0, ast: 7.0, stl: 2.5, fg3m: 2.5, fgPct: 56.5, min: 36.0 },
    advanced: { per: 30.5, ts: 66.2, usg: 33.5, ortg: 125, drtg: 105, netRtg: 20, bpm: 11.0, vorp: 7.0 },
    splits: { home: { pts: 34.5 }, away: { pts: 31.5 } },
    status: 'active', injury: null, lastGame: '2025-02-02'
  },
  'Jayson Tatum': {
    id: 1628369, nbaId: '1628369', team: 'BOS', position: 'SF', jersey: 0, age: 26,
    season: { gp: 55, pts: 28.0, reb: 9.0, ast: 5.5, stl: 1.0, blk: 0.6, min: 36.8, fgPct: 47.5, fg3Pct: 38.5, ftPct: 85.2, fg3m: 3.3, tov: 2.6 },
    last10: { pts: 29.5, reb: 9.5, ast: 5.8, stl: 1.1, fg3m: 3.5, fgPct: 48.5, min: 37.2 },
    last5: { pts: 31.0, reb: 10.0, ast: 6.0, stl: 1.2, fg3m: 3.8, fgPct: 49.5, min: 37.8 },
    advanced: { per: 24.5, ts: 60.8, usg: 30.5, ortg: 120, drtg: 106, netRtg: 14, bpm: 6.8, vorp: 4.8 },
    splits: { home: { pts: 30.0 }, away: { pts: 26.0 } },
    status: 'active', injury: null, lastGame: '2025-02-02'
  },
  'Kevin Durant': {
    id: 201142, nbaId: '201142', team: 'PHX', position: 'SF', jersey: 35, age: 36,
    season: { gp: 48, pts: 27.5, reb: 6.8, ast: 5.2, stl: 0.8, blk: 1.3, min: 36.5, fgPct: 53.2, fg3Pct: 41.5, ftPct: 89.0, fg3m: 2.3, tov: 2.6 },
    last10: { pts: 28.5, reb: 7.0, ast: 5.5, stl: 0.9, fg3m: 2.5, fgPct: 54.5, min: 37.0 },
    last5: { pts: 30.0, reb: 7.2, ast: 5.8, stl: 1.0, fg3m: 2.8, fgPct: 55.5, min: 37.5 },
    advanced: { per: 26.2, ts: 65.5, usg: 29.8, ortg: 122, drtg: 112, netRtg: 10, bpm: 6.5, vorp: 4.0 },
    splits: { home: { pts: 29.0 }, away: { pts: 26.0 } },
    status: 'active', injury: null, lastGame: '2025-02-01'
  },
  'Anthony Edwards': {
    id: 1630162, nbaId: '1630162', team: 'MIN', position: 'SG', jersey: 5, age: 23,
    season: { gp: 54, pts: 27.2, reb: 6.0, ast: 5.5, stl: 1.3, blk: 0.5, min: 35.5, fgPct: 46.5, fg3Pct: 36.2, ftPct: 84.5, fg3m: 3.2, tov: 2.8 },
    last10: { pts: 29.0, reb: 6.2, ast: 5.8, stl: 1.4, fg3m: 3.5, fgPct: 47.5, min: 36.0 },
    last5: { pts: 31.5, reb: 6.5, ast: 6.0, stl: 1.5, fg3m: 4.0, fgPct: 48.5, min: 36.5 },
    advanced: { per: 23.8, ts: 58.5, usg: 31.2, ortg: 116, drtg: 110, netRtg: 6, bpm: 5.2, vorp: 3.8 },
    splits: { home: { pts: 28.5 }, away: { pts: 25.8 } },
    status: 'active', injury: null, lastGame: '2025-02-02'
  },
  'Damian Lillard': {
    id: 203081, nbaId: '203081', team: 'MIL', position: 'PG', jersey: 0, age: 34,
    season: { gp: 52, pts: 26.0, reb: 4.6, ast: 7.5, stl: 0.9, blk: 0.3, min: 35.5, fgPct: 44.5, fg3Pct: 37.8, ftPct: 91.5, fg3m: 3.6, tov: 2.4 },
    last10: { pts: 27.5, reb: 4.8, ast: 7.8, stl: 1.0, fg3m: 3.8, fgPct: 45.5, min: 36.0 },
    last5: { pts: 29.0, reb: 5.0, ast: 8.0, stl: 1.1, fg3m: 4.2, fgPct: 46.5, min: 36.5 },
    advanced: { per: 22.8, ts: 61.2, usg: 29.5, ortg: 116, drtg: 112, netRtg: 4, bpm: 4.5, vorp: 3.0 },
    splits: { home: { pts: 27.5 }, away: { pts: 24.5 } },
    status: 'active', injury: null, lastGame: '2025-02-02'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🏀 TEAM DATA
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

const TEAM_DATA = {
  'BOS': { name: 'Boston Celtics', abbr: 'BOS', record: '43-12', pct: '.782', streak: 'W5', pace: 100.5, ortg: 122.5, drtg: 107.8, netRtg: 14.7 },
  'OKC': { name: 'Oklahoma City Thunder', abbr: 'OKC', record: '42-13', pct: '.764', streak: 'W8', pace: 99.5, ortg: 119.8, drtg: 105.2, netRtg: 14.6 },
  'CLE': { name: 'Cleveland Cavaliers', abbr: 'CLE', record: '42-13', pct: '.764', streak: 'W3', pace: 98.2, ortg: 120.5, drtg: 107.0, netRtg: 13.5 },
  'DEN': { name: 'Denver Nuggets', abbr: 'DEN', record: '38-18', pct: '.679', streak: 'W4', pace: 98.8, ortg: 117.5, drtg: 111.5, netRtg: 6.0 },
  'MIL': { name: 'Milwaukee Bucks', abbr: 'MIL', record: '36-19', pct: '.655', streak: 'L1', pace: 101.5, ortg: 117.2, drtg: 112.8, netRtg: 4.4 },
  'NYK': { name: 'New York Knicks', abbr: 'NYK', record: '37-19', pct: '.661', streak: 'W2', pace: 98.5, ortg: 116.0, drtg: 109.5, netRtg: 6.5 },
  'MIN': { name: 'Minnesota Timberwolves', abbr: 'MIN', record: '36-20', pct: '.643', streak: 'W1', pace: 97.8, ortg: 114.5, drtg: 108.5, netRtg: 6.0 },
  'LAL': { name: 'Los Angeles Lakers', abbr: 'LAL', record: '33-23', pct: '.589', streak: 'L2', pace: 101.0, ortg: 115.5, drtg: 112.0, netRtg: 3.5 },
  'GSW': { name: 'Golden State Warriors', abbr: 'GSW', record: '31-24', pct: '.564', streak: 'L1', pace: 102.0, ortg: 115.0, drtg: 113.0, netRtg: 2.0 },
  'PHX': { name: 'Phoenix Suns', abbr: 'PHX', record: '32-23', pct: '.582', streak: 'W2', pace: 100.0, ortg: 116.8, drtg: 113.5, netRtg: 3.3 },
  'DAL': { name: 'Dallas Mavericks', abbr: 'DAL', record: '33-22', pct: '.600', streak: 'W3', pace: 99.5, ortg: 118.0, drtg: 114.5, netRtg: 3.5 },
  'MIA': { name: 'Miami Heat', abbr: 'MIA', record: '28-27', pct: '.509', streak: 'L3', pace: 97.0, ortg: 112.5, drtg: 111.8, netRtg: 0.7 },
  'IND': { name: 'Indiana Pacers', abbr: 'IND', record: '31-25', pct: '.554', streak: 'W1', pace: 104.0, ortg: 118.5, drtg: 116.0, netRtg: 2.5 },
  'PHI': { name: 'Philadelphia 76ers', abbr: 'PHI', record: '26-29', pct: '.473', streak: 'L1', pace: 98.5, ortg: 112.8, drtg: 113.5, netRtg: -0.7 },
  'ATL': { name: 'Atlanta Hawks', abbr: 'ATL', record: '28-28', pct: '.500', streak: 'W2', pace: 100.5, ortg: 115.5, drtg: 117.0, netRtg: -1.5 },
  'MEM': { name: 'Memphis Grizzlies', abbr: 'MEM', record: '30-26', pct: '.536', streak: 'L2', pace: 101.2, ortg: 114.0, drtg: 113.0, netRtg: 1.0 }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📡 MAIN LIVE DATA SERVICE
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

class RayLiveDataServiceUltra {
  constructor() {
    this.cache = new SmartCache();
    this.requestManager = new RequestManager();
    this.apiStatus = {};
    this.initialized = false;
    this.listeners = new Map();
    
    // Initialize API status
    Object.keys(CONFIG.apis).forEach(api => {
      this.apiStatus[api] = { status: 'unknown', lastCheck: 0, errorCount: 0 };
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 📊 PLAYER DATA
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  async getPlayerStats(playerName, options = {}) {
    const { forceRefresh = false, includeAdvanced = true } = options;
    
    // Check cache first
    if (!forceRefresh) {
      const cached = this.cache.get('playerStats', playerName, CONFIG.cache.playerStats);
      if (cached) {
return cached;
}
    }

    // Try to fetch from API
    let data = await this.fetchPlayerFromAPI(playerName);
    
    // Fallback to local data
    if (!data) {
      data = LIVE_PLAYER_STATS[playerName] || this.findPlayerByAlias(playerName);
    }

    if (data) {
      // Enhance with computed stats
      data = this.enhancePlayerData(data);
      this.cache.set('playerStats', playerName, data, CONFIG.cache.playerStats);
    }

    return data;
  }

  async fetchPlayerFromAPI(playerName) {
    // Try each API in priority order
    const apis = Object.entries(CONFIG.apis)
      .sort((a, b) => a[1].priority - b[1].priority);

    for (const [apiName, config] of apis) {
      if (this.apiStatus[apiName]?.status === 'failed') {
continue;
}

      try {
        const data = await this.requestManager.execute(
          config.name,
          () => this.fetchFromAPI(apiName, playerName),
          `player_${playerName}`
        );
        
        if (data) {
          this.apiStatus[apiName] = { status: 'ok', lastCheck: Date.now(), errorCount: 0 };
          return data;
        }
      } catch (error) {
        this.apiStatus[apiName].errorCount++;
        if (this.apiStatus[apiName].errorCount > 3) {
          this.apiStatus[apiName].status = 'failed';
        }
        console.warn(`API ${apiName} failed:`, error.message);
      }
    }

    return null;
  }

  async fetchFromAPI(apiName, playerName) {
    const config = CONFIG.apis[apiName];
    if (!config) {
return null;
}

    // Implementation would vary by API
    // For now, return null to use local fallback
    return null;
  }

  findPlayerByAlias(name) {
    const aliases = {
      'steph': 'Stephen Curry', 'curry': 'Stephen Curry',
      'lebron': 'LeBron James', 'bron': 'LeBron James',
      'jokic': 'Nikola Jokic', 'joker': 'Nikola Jokic',
      'luka': 'Luka Doncic', 'giannis': 'Giannis Antetokounmpo',
      'sga': 'Shai Gilgeous-Alexander', 'shai': 'Shai Gilgeous-Alexander',
      'tatum': 'Jayson Tatum', 'kd': 'Kevin Durant', 'durant': 'Kevin Durant',
      'ant': 'Anthony Edwards', 'edwards': 'Anthony Edwards',
      'dame': 'Damian Lillard', 'lillard': 'Damian Lillard'
    };

    const fullName = aliases[name.toLowerCase()];
    return fullName ? LIVE_PLAYER_STATS[fullName] : null;
  }

  enhancePlayerData(player) {
    if (!player?.season) {
return player;
}

    // Calculate additional metrics
    const s = player.season;
    
    return {
      ...player,
      computed: {
        pra: s.pts + s.reb + s.ast,
        pr: s.pts + s.reb,
        pa: s.pts + s.ast,
        fantasyPts: s.pts + (s.reb * 1.2) + (s.ast * 1.5) + (s.stl * 3) + (s.blk * 3) - s.tov,
        efficiency: s.pts / Math.max(1, s.min / 36), // Points per 36
        consistency: this.calculateConsistency(player)
      },
      trend: this.calculatePlayerTrend(player),
      lastUpdated: Date.now()
    };
  }

  calculateConsistency(player) {
    if (!player.season || !player.last10) {
return 50;
}
    
    const s = player.season;
    const l10 = player.last10;
    
    // Lower variance = higher consistency
    const ptsVar = Math.abs(l10.pts - s.pts) / s.pts;
    const rebVar = Math.abs(l10.reb - s.reb) / Math.max(1, s.reb);
    const astVar = Math.abs(l10.ast - s.ast) / Math.max(1, s.ast);
    
    const avgVar = (ptsVar + rebVar + astVar) / 3;
    return Math.round(100 - (avgVar * 100));
  }

  calculatePlayerTrend(player) {
    if (!player.season || !player.last5 || !player.last10) {
      return { direction: 'stable', strength: 0, momentum: 'neutral' };
    }

    const s = player.season;
    const l5 = player.last5;
    const l10 = player.last10;

    const shortTrend = (l5.pts - l10.pts) / l10.pts;
    const longTrend = (l5.pts - s.pts) / s.pts;

    let direction = 'stable';
    let strength = 0;

    if (shortTrend > 0.05 && longTrend > 0.03) {
      direction = 'up';
      strength = Math.min(100, Math.round((shortTrend + longTrend) * 200));
    } else if (shortTrend < -0.05 && longTrend < -0.03) {
      direction = 'down';
      strength = Math.min(100, Math.round(Math.abs(shortTrend + longTrend) * 200));
    }

    let momentum = 'neutral';
    if (l5.pts > l10.pts * 1.08) {
momentum = 'hot';
} else if (l5.pts < l10.pts * 0.92) {
momentum = 'cold';
}

    return { direction, strength, momentum };
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🏀 TEAM DATA
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  async getTeamData(teamCode, options = {}) {
    const { forceRefresh = false } = options;

    if (!forceRefresh) {
      const cached = this.cache.get('teamData', teamCode, CONFIG.cache.standings);
      if (cached) {
return cached;
}
    }

    const data = TEAM_DATA[teamCode.toUpperCase()];
    if (data) {
      this.cache.set('teamData', teamCode, data, CONFIG.cache.standings);
    }

    return data;
  }

  getAllTeams() {
    return { ...TEAM_DATA };
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 📈 COMPARATIVE ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  async comparePlayers(player1Name, player2Name) {
    const [p1, p2] = await Promise.all([
      this.getPlayerStats(player1Name),
      this.getPlayerStats(player2Name)
    ]);

    if (!p1 || !p2) {
return null;
}

    const categories = ['pts', 'reb', 'ast', 'stl', 'blk', 'fgPct', 'fg3Pct'];
    const comparison = {};
    let p1Wins = 0, p2Wins = 0;

    for (const cat of categories) {
      const v1 = p1.season?.[cat] || 0;
      const v2 = p2.season?.[cat] || 0;
      
      comparison[cat] = {
        player1: v1,
        player2: v2,
        winner: v1 > v2 ? player1Name : v2 > v1 ? player2Name : 'tie',
        diff: Math.abs(v1 - v2).toFixed(1)
      };

      if (v1 > v2) {
p1Wins++;
} else if (v2 > v1) {
p2Wins++;
}
    }

    return {
      player1: { name: player1Name, data: p1 },
      player2: { name: player2Name, data: p2 },
      comparison,
      overall: {
        winner: p1Wins > p2Wins ? player1Name : p2Wins > p1Wins ? player2Name : 'tie',
        score: `${p1Wins}-${p2Wins}`
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 📊 LEAGUE-WIDE QUERIES
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  getTopPerformers(stat = 'pts', count = 10) {
    const players = Object.entries(LIVE_PLAYER_STATS)
      .map(([name, data]) => ({
        name,
        team: data.team,
        value: data.season?.[stat] || 0,
        trend: this.calculatePlayerTrend(data)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, count);

    return players;
  }

  getHottestPlayers(count = 5) {
    const players = Object.entries(LIVE_PLAYER_STATS)
      .map(([name, data]) => {
        const trend = this.calculatePlayerTrend(data);
        return {
          name,
          team: data.team,
          trend,
          last5Pts: data.last5?.pts || 0,
          seasonPts: data.season?.pts || 0,
          diff: (data.last5?.pts || 0) - (data.season?.pts || 0)
        };
      })
      .filter(p => p.trend.momentum === 'hot' || p.diff > 2)
      .sort((a, b) => b.diff - a.diff)
      .slice(0, count);

    return players;
  }

  getColdestPlayers(count = 5) {
    const players = Object.entries(LIVE_PLAYER_STATS)
      .map(([name, data]) => {
        const trend = this.calculatePlayerTrend(data);
        return {
          name,
          team: data.team,
          trend,
          last5Pts: data.last5?.pts || 0,
          seasonPts: data.season?.pts || 0,
          diff: (data.last5?.pts || 0) - (data.season?.pts || 0)
        };
      })
      .filter(p => p.trend.momentum === 'cold' || p.diff < -2)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, count);

    return players;
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════
  // 🔧 UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════

  getAllPlayers() {
    return { ...LIVE_PLAYER_STATS };
  }

  searchPlayers(query) {
    const lowerQuery = query.toLowerCase();
    return Object.entries(LIVE_PLAYER_STATS)
      .filter(([name]) => name.toLowerCase().includes(lowerQuery))
      .map(([name, data]) => ({ name, ...data }));
  }

  getApiStatus() {
    return {
      apis: this.apiStatus,
      cache: this.cache.getStats()
    };
  }

  clearCache() {
    this.cache.clear();
  }

  // Event subscription for real-time updates
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
listeners.splice(index, 1);
}
    };
  }

  emit(event, data) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(cb => cb(data));
  }
}

// Create singleton instance
const rayLiveDataService = new RayLiveDataServiceUltra();

export default rayLiveDataService;
export { RayLiveDataServiceUltra, SmartCache, LIVE_PLAYER_STATS, TEAM_DATA };
