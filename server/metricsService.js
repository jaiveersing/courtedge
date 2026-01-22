import express from 'express';
import promClient from 'prom-client';

/**
 * Prometheus Metrics Service
 * Exposes application metrics for Prometheus scraping
 */

class MetricsService {
  constructor() {
    // Create a Registry
    this.register = new promClient.Registry();

    // Add default metrics (CPU, memory, etc.)
    promClient.collectDefaultMetrics({
      register: this.register,
      prefix: 'courtedge_'
    });

    // Custom metrics
    this.initializeMetrics();
  }

  /**
   * Initialize custom application metrics
   */
  initializeMetrics() {
    // HTTP Request metrics
    this.httpRequestDuration = new promClient.Histogram({
      name: 'courtedge_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.001, 0.01, 0.1, 0.5, 1, 2, 5]
    });
    this.register.registerMetric(this.httpRequestDuration);

    this.httpRequestTotal = new promClient.Counter({
      name: 'courtedge_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status']
    });
    this.register.registerMetric(this.httpRequestTotal);

    // Betting metrics
    this.betsPlaced = new promClient.Counter({
      name: 'courtedge_bets_placed_total',
      help: 'Total number of bets placed',
      labelNames: ['sport', 'bet_type', 'market']
    });
    this.register.registerMetric(this.betsPlaced);

    this.betsSettled = new promClient.Counter({
      name: 'courtedge_bets_settled_total',
      help: 'Total number of bets settled',
      labelNames: ['sport', 'result']
    });
    this.register.registerMetric(this.betsSettled);

    this.betStake = new promClient.Histogram({
      name: 'courtedge_bet_stake_dollars',
      help: 'Distribution of bet stake amounts',
      buckets: [10, 25, 50, 100, 250, 500, 1000]
    });
    this.register.registerMetric(this.betStake);

    // Prediction metrics
    this.predictionsGenerated = new promClient.Counter({
      name: 'courtedge_predictions_generated_total',
      help: 'Total number of predictions generated',
      labelNames: ['sport', 'model_version']
    });
    this.register.registerMetric(this.predictionsGenerated);

    this.predictionAccuracy = new promClient.Gauge({
      name: 'courtedge_prediction_accuracy',
      help: 'Current prediction accuracy percentage',
      labelNames: ['sport', 'model_version', 'timeframe']
    });
    this.register.registerMetric(this.predictionAccuracy);

    // Database metrics
    this.dbQueryDuration = new promClient.Histogram({
      name: 'courtedge_db_query_duration_seconds',
      help: 'Duration of database queries',
      labelNames: ['operation', 'table'],
      buckets: [0.001, 0.01, 0.1, 0.5, 1, 2]
    });
    this.register.registerMetric(this.dbQueryDuration);

    this.dbConnections = new promClient.Gauge({
      name: 'courtedge_db_connections',
      help: 'Number of active database connections',
      labelNames: ['state']
    });
    this.register.registerMetric(this.dbConnections);

    // Cache metrics
    this.cacheHits = new promClient.Counter({
      name: 'courtedge_cache_hits_total',
      help: 'Total cache hits',
      labelNames: ['cache_type']
    });
    this.register.registerMetric(this.cacheHits);

    this.cacheMisses = new promClient.Counter({
      name: 'courtedge_cache_misses_total',
      help: 'Total cache misses',
      labelNames: ['cache_type']
    });
    this.register.registerMetric(this.cacheMisses);

    // WebSocket metrics
    this.wsConnections = new promClient.Gauge({
      name: 'courtedge_websocket_connections',
      help: 'Number of active WebSocket connections'
    });
    this.register.registerMetric(this.wsConnections);

    this.wsMessages = new promClient.Counter({
      name: 'courtedge_websocket_messages_total',
      help: 'Total WebSocket messages',
      labelNames: ['direction', 'channel']
    });
    this.register.registerMetric(this.wsMessages);

    // External API metrics
    this.externalApiCalls = new promClient.Counter({
      name: 'courtedge_external_api_calls_total',
      help: 'Total external API calls',
      labelNames: ['service', 'endpoint', 'status']
    });
    this.register.registerMetric(this.externalApiCalls);

    this.externalApiDuration = new promClient.Histogram({
      name: 'courtedge_external_api_duration_seconds',
      help: 'Duration of external API calls',
      labelNames: ['service', 'endpoint'],
      buckets: [0.1, 0.5, 1, 2, 5, 10]
    });
    this.register.registerMetric(this.externalApiDuration);

    // User metrics
    this.activeUsers = new promClient.Gauge({
      name: 'courtedge_active_users',
      help: 'Number of currently active users',
      labelNames: ['timeframe']
    });
    this.register.registerMetric(this.activeUsers);

    this.userRegistrations = new promClient.Counter({
      name: 'courtedge_user_registrations_total',
      help: 'Total user registrations'
    });
    this.register.registerMetric(this.userRegistrations);

    // Business metrics
    this.totalProfitLoss = new promClient.Gauge({
      name: 'courtedge_total_profit_loss_dollars',
      help: 'Total profit/loss across all users',
      labelNames: ['timeframe']
    });
    this.register.registerMetric(this.totalProfitLoss);

    this.activeSubscriptions = new promClient.Gauge({
      name: 'courtedge_active_subscriptions',
      help: 'Number of active paid subscriptions',
      labelNames: ['tier']
    });
    this.register.registerMetric(this.activeSubscriptions);
  }

  /**
   * Record HTTP request
   */
  recordHttpRequest(method, route, status, duration) {
    this.httpRequestTotal.inc({ method, route, status });
    this.httpRequestDuration.observe({ method, route, status }, duration / 1000);
  }

  /**
   * Record bet placed
   */
  recordBetPlaced(sport, betType, market, stakeAmount) {
    this.betsPlaced.inc({ sport, bet_type: betType, market });
    this.betStake.observe(stakeAmount);
  }

  /**
   * Record bet settled
   */
  recordBetSettled(sport, result) {
    this.betsSettled.inc({ sport, result });
  }

  /**
   * Record prediction generated
   */
  recordPrediction(sport, modelVersion) {
    this.predictionsGenerated.inc({ sport, model_version: modelVersion });
  }

  /**
   * Update prediction accuracy
   */
  updatePredictionAccuracy(sport, modelVersion, timeframe, accuracy) {
    this.predictionAccuracy.set({ sport, model_version: modelVersion, timeframe }, accuracy);
  }

  /**
   * Record database query
   */
  recordDbQuery(operation, table, duration) {
    this.dbQueryDuration.observe({ operation, table }, duration / 1000);
  }

  /**
   * Update database connections
   */
  updateDbConnections(active, idle) {
    this.dbConnections.set({ state: 'active' }, active);
    this.dbConnections.set({ state: 'idle' }, idle);
  }

  /**
   * Record cache hit/miss
   */
  recordCacheHit(cacheType) {
    this.cacheHits.inc({ cache_type: cacheType });
  }

  recordCacheMiss(cacheType) {
    this.cacheMisses.inc({ cache_type: cacheType });
  }

  /**
   * Update WebSocket connections
   */
  updateWsConnections(count) {
    this.wsConnections.set(count);
  }

  /**
   * Record WebSocket message
   */
  recordWsMessage(direction, channel) {
    this.wsMessages.inc({ direction, channel });
  }

  /**
   * Record external API call
   */
  recordExternalApiCall(service, endpoint, status, duration) {
    this.externalApiCalls.inc({ service, endpoint, status });
    this.externalApiDuration.observe({ service, endpoint }, duration / 1000);
  }

  /**
   * Update active users
   */
  updateActiveUsers(timeframe, count) {
    this.activeUsers.set({ timeframe }, count);
  }

  /**
   * Record user registration
   */
  recordUserRegistration() {
    this.userRegistrations.inc();
  }

  /**
   * Update business metrics
   */
  updateTotalProfitLoss(timeframe, amount) {
    this.totalProfitLoss.set({ timeframe }, amount);
  }

  updateActiveSubscriptions(tier, count) {
    this.activeSubscriptions.set({ tier }, count);
  }

  /**
   * Express middleware for automatic request metrics
   */
  middleware() {
    return (req, res, next) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        const route = req.route?.path || req.path || 'unknown';
        
        this.recordHttpRequest(
          req.method,
          route,
          res.statusCode.toString(),
          duration
        );
      });

      next();
    };
  }

  /**
   * Get metrics endpoint handler
   */
  getMetricsHandler() {
    return async (req, res) => {
      res.set('Content-Type', this.register.contentType);
      res.end(await this.register.metrics());
    };
  }

  /**
   * Setup metrics endpoint
   */
  setupEndpoint(app) {
    app.get('/metrics', this.getMetricsHandler());
  }
}

export default new MetricsService();
