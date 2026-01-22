const redis = require('redis');
const { promisify } = require('util');

/**
 * Redis Caching Service
 * High-performance caching layer for API responses and computed data
 */
class RedisCacheService {
  constructor() {
    this.client = null;
    this.connected = false;
    
    // Default TTLs (in seconds)
    this.ttls = {
      odds: 30,              // 30 seconds
      predictions: 3600,     // 1 hour
      player_stats: 1800,    // 30 minutes
      injury_reports: 900,   // 15 minutes
      leaderboard: 300,      // 5 minutes
      user_profile: 600,     // 10 minutes
      game_data: 300         // 5 minutes
    };
  }

  /**
   * Initialize Redis connection
   */
  async connect() {
    try {
      const config = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0'),
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('Redis server refused connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Redis retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined; // Stop retrying
          }
          return Math.min(options.attempt * 100, 3000);
        }
      };

      this.client = redis.createClient(config);

      // Promisify Redis methods
      this.get = promisify(this.client.get).bind(this.client);
      this.set = promisify(this.client.set).bind(this.client);
      this.del = promisify(this.client.del).bind(this.client);
      this.exists = promisify(this.client.exists).bind(this.client);
      this.expire = promisify(this.client.expire).bind(this.client);
      this.ttl = promisify(this.client.ttl).bind(this.client);
      this.keys = promisify(this.client.keys).bind(this.client);
      this.incr = promisify(this.client.incr).bind(this.client);
      this.decr = promisify(this.client.decr).bind(this.client);
      this.hset = promisify(this.client.hset).bind(this.client);
      this.hget = promisify(this.client.hget).bind(this.client);
      this.hgetall = promisify(this.client.hgetall).bind(this.client);
      this.zadd = promisify(this.client.zadd).bind(this.client);
      this.zrange = promisify(this.client.zrange).bind(this.client);

      this.client.on('connect', () => {
        console.log('✓ Redis connected');
        this.connected = true;
      });

      this.client.on('error', (error) => {
        console.error('Redis error:', error);
        this.connected = false;
      });

      this.client.on('end', () => {
        console.log('Redis connection closed');
        this.connected = false;
      });

      return true;

    } catch (error) {
      console.error('Redis connection failed:', error);
      return false;
    }
  }

  /**
   * Cache data with automatic TTL
   */
  async cache(key, data, type = 'default') {
    if (!this.connected) return false;

    try {
      const value = JSON.stringify(data);
      const ttl = this.ttls[type] || 300;
      
      await this.set(key, value, 'EX', ttl);
      return true;

    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Get cached data
   */
  async getCached(key) {
    if (!this.connected) return null;

    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;

    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Cache with tags for easy invalidation
   */
  async cacheWithTags(key, data, tags = [], ttl = 300) {
    if (!this.connected) return false;

    try {
      // Store main data
      await this.set(key, JSON.stringify(data), 'EX', ttl);

      // Store tags mapping
      for (const tag of tags) {
        await this.client.sadd(`tag:${tag}`, key);
        await this.expire(`tag:${tag}`, ttl);
      }

      return true;

    } catch (error) {
      console.error('Tagged cache error:', error);
      return false;
    }
  }

  /**
   * Invalidate cache by tag
   */
  async invalidateByTag(tag) {
    if (!this.connected) return false;

    try {
      const keys = await this.client.smembers(`tag:${tag}`);
      
      if (keys && keys.length > 0) {
        await this.del(...keys);
        await this.del(`tag:${tag}`);
      }

      return true;

    } catch (error) {
      console.error('Tag invalidation error:', error);
      return false;
    }
  }

  /**
   * Cache-aside pattern wrapper
   */
  async getOrFetch(key, fetchFn, type = 'default') {
    // Try cache first
    const cached = await this.getCached(key);
    if (cached !== null) {
      return { data: cached, fromCache: true };
    }

    // Fetch from source
    try {
      const data = await fetchFn();
      
      // Cache result
      await this.cache(key, data, type);
      
      return { data, fromCache: false };

    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  /**
   * Rate limiting with Redis
   */
  async checkRateLimit(key, limit, window) {
    if (!this.connected) return { allowed: true };

    try {
      const current = await this.incr(key);
      
      if (current === 1) {
        await this.expire(key, window);
      }

      return {
        allowed: current <= limit,
        current,
        limit,
        resetIn: await this.ttl(key)
      };

    } catch (error) {
      console.error('Rate limit error:', error);
      return { allowed: true };
    }
  }

  /**
   * Leaderboard using sorted sets
   */
  async updateLeaderboard(leaderboardKey, userId, score) {
    if (!this.connected) return false;

    try {
      await this.zadd(leaderboardKey, score, userId);
      await this.expire(leaderboardKey, this.ttls.leaderboard);
      return true;

    } catch (error) {
      console.error('Leaderboard update error:', error);
      return false;
    }
  }

  /**
   * Get top N from leaderboard
   */
  async getTopLeaderboard(leaderboardKey, count = 10) {
    if (!this.connected) return [];

    try {
      const results = await this.client.zrevrange(
        leaderboardKey, 
        0, 
        count - 1, 
        'WITHSCORES'
      );

      // Parse results into objects
      const leaderboard = [];
      for (let i = 0; i < results.length; i += 2) {
        leaderboard.push({
          userId: results[i],
          score: parseFloat(results[i + 1])
        });
      }

      return leaderboard;

    } catch (error) {
      console.error('Leaderboard get error:', error);
      return [];
    }
  }

  /**
   * Cache prediction results
   */
  async cachePrediction(gameId, prediction) {
    const key = `prediction:${gameId}`;
    return this.cache(key, prediction, 'predictions');
  }

  /**
   * Cache odds data
   */
  async cacheOdds(sport, odds) {
    const key = `odds:${sport}:${Date.now()}`;
    return this.cache(key, odds, 'odds');
  }

  /**
   * Cache player stats
   */
  async cachePlayerStats(playerId, stats) {
    const key = `player:${playerId}:stats`;
    return this.cacheWithTags(
      key, 
      stats, 
      ['player_stats', `player:${playerId}`],
      this.ttls.player_stats
    );
  }

  /**
   * Cache user profile
   */
  async cacheUserProfile(userId, profile) {
    const key = `user:${userId}:profile`;
    return this.cache(key, profile, 'user_profile');
  }

  /**
   * Invalidate user cache
   */
  async invalidateUser(userId) {
    const patterns = [
      `user:${userId}:*`,
      `bets:${userId}:*`,
      `bankroll:${userId}:*`
    ];

    for (const pattern of patterns) {
      const keys = await this.keys(pattern);
      if (keys.length > 0) {
        await this.del(...keys);
      }
    }
  }

  /**
   * Cache recent bets
   */
  async cacheRecentBets(userId, bets) {
    const key = `bets:${userId}:recent`;
    return this.cache(key, bets, 'default');
  }

  /**
   * Get cache stats
   */
  async getStats() {
    if (!this.connected) return null;

    try {
      const info = await promisify(this.client.info).bind(this.client)();
      
      // Parse info string
      const stats = {};
      info.split('\r\n').forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          stats[key] = value;
        }
      });

      return {
        connected: this.connected,
        usedMemory: stats.used_memory_human,
        totalKeys: parseInt(stats.db0?.match(/keys=(\d+)/)?.[1] || '0'),
        hits: parseInt(stats.keyspace_hits || '0'),
        misses: parseInt(stats.keyspace_misses || '0'),
        hitRate: this.calculateHitRate(stats)
      };

    } catch (error) {
      console.error('Stats error:', error);
      return null;
    }
  }

  calculateHitRate(stats) {
    const hits = parseInt(stats.keyspace_hits || '0');
    const misses = parseInt(stats.keyspace_misses || '0');
    const total = hits + misses;
    
    return total > 0 ? ((hits / total) * 100).toFixed(2) : 0;
  }

  /**
   * Clear all cache
   */
  async flushAll() {
    if (!this.connected) return false;

    try {
      await promisify(this.client.flushdb).bind(this.client)();
      console.log('✓ Redis cache cleared');
      return true;

    } catch (error) {
      console.error('Flush error:', error);
      return false;
    }
  }

  /**
   * Close connection
   */
  async disconnect() {
    if (this.client) {
      await promisify(this.client.quit).bind(this.client)();
      this.connected = false;
      console.log('✓ Redis disconnected');
    }
  }
}

// Singleton instance
const cacheService = new RedisCacheService();

// Express middleware for caching
const cacheMiddleware = (type = 'default') => {
  return async (req, res, next) => {
    if (!cacheService.connected) {
      return next();
    }

    const key = `cache:${req.method}:${req.originalUrl}`;
    
    try {
      const cached = await cacheService.getCached(key);
      
      if (cached) {
        return res.json(cached);
      }

      // Override res.json to cache response
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        cacheService.cache(key, data, type);
        return originalJson(data);
      };

      next();

    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = cacheService;
module.exports.cacheMiddleware = cacheMiddleware;
