import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import DailyRotateFile from 'winston-daily-rotate-file';

/**
 * Centralized Logging Service
 * - Winston logger with multiple transports
 * - Elasticsearch integration for log aggregation
 * - Daily log rotation
 * - Structured logging
 * - Performance tracking
 * - Error tracking with stack traces
 */

class LoggingService {
  constructor() {
    // Elasticsearch client configuration
    this.esConfig = {
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
        auth: {
          username: process.env.ELASTICSEARCH_USER || 'elastic',
          password: process.env.ELASTICSEARCH_PASSWORD
        }
      },
      index: 'courtedge-logs',
      indexPrefix: 'courtedge',
      indexSuffixPattern: 'YYYY.MM.DD',
      messageType: 'log',
      ensureIndexTemplate: true
    };

    // Create logger instance
    this.logger = this.createLogger();

    // Performance metrics
    this.metrics = {
      requests: 0,
      errors: 0,
      warnings: 0
    };
  }

  /**
   * Create Winston logger with multiple transports
   */
  createLogger() {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
          msg += ' ' + JSON.stringify(meta, null, 2);
        }
        return msg;
      })
    );

    const transports = [
      // Console output
      new winston.transports.Console({
        format: consoleFormat,
        level: process.env.LOG_LEVEL || 'info'
      }),

      // Daily rotating file for all logs
      new DailyRotateFile({
        filename: 'logs/courtedge-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: logFormat
      }),

      // Separate file for errors
      new DailyRotateFile({
        filename: 'logs/courtedge-error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '30d',
        format: logFormat
      })
    ];

    // Add Elasticsearch transport in production
    if (process.env.NODE_ENV === 'production' && process.env.ELASTICSEARCH_URL) {
      transports.push(
        new ElasticsearchTransport(this.esConfig)
      );
    }

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      defaultMeta: {
        service: 'courtedge',
        environment: process.env.NODE_ENV || 'development'
      },
      transports,
      exceptionHandlers: [
        new DailyRotateFile({
          filename: 'logs/exceptions-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d'
        })
      ],
      rejectionHandlers: [
        new DailyRotateFile({
          filename: 'logs/rejections-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d'
        })
      ]
    });
  }

  /**
   * Log info message
   */
  info(message, meta = {}) {
    this.logger.info(message, this.enrichMeta(meta));
  }

  /**
   * Log warning
   */
  warn(message, meta = {}) {
    this.metrics.warnings++;
    this.logger.warn(message, this.enrichMeta(meta));
  }

  /**
   * Log error
   */
  error(message, error, meta = {}) {
    this.metrics.errors++;
    
    const errorMeta = {
      ...meta,
      error: {
        message: error?.message,
        stack: error?.stack,
        code: error?.code,
        name: error?.name
      }
    };

    this.logger.error(message, this.enrichMeta(errorMeta));
  }

  /**
   * Log debug message
   */
  debug(message, meta = {}) {
    this.logger.debug(message, this.enrichMeta(meta));
  }

  /**
   * Log HTTP request
   */
  logRequest(req, res, duration) {
    this.metrics.requests++;

    const meta = {
      type: 'http_request',
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
      requestId: req.id
    };

    if (res.statusCode >= 500) {
      this.error('HTTP Request Error', new Error(`${req.method} ${req.url}`), meta);
    } else if (res.statusCode >= 400) {
      this.warn('HTTP Request Warning', meta);
    } else {
      this.info('HTTP Request', meta);
    }
  }

  /**
   * Log database query
   */
  logQuery(query, duration, meta = {}) {
    this.info('Database Query', {
      type: 'database_query',
      query: query.substring(0, 200), // Truncate long queries
      duration: `${duration}ms`,
      ...meta
    });
  }

  /**
   * Log authentication event
   */
  logAuth(event, userId, success, meta = {}) {
    this.info('Authentication Event', {
      type: 'authentication',
      event,
      userId,
      success,
      ...meta
    });
  }

  /**
   * Log betting action
   */
  logBet(action, betId, userId, meta = {}) {
    this.info('Betting Action', {
      type: 'betting',
      action,
      betId,
      userId,
      ...meta
    });
  }

  /**
   * Log prediction event
   */
  logPrediction(predictionId, modelVersion, accuracy, meta = {}) {
    this.info('Prediction Generated', {
      type: 'prediction',
      predictionId,
      modelVersion,
      accuracy,
      ...meta
    });
  }

  /**
   * Log API call to external service
   */
  logExternalAPI(service, endpoint, duration, success, meta = {}) {
    const level = success ? 'info' : 'warn';
    
    this.logger[level]('External API Call', {
      type: 'external_api',
      service,
      endpoint,
      duration: `${duration}ms`,
      success,
      ...meta
    });
  }

  /**
   * Log cache event
   */
  logCache(event, key, hit, meta = {}) {
    this.debug('Cache Event', {
      type: 'cache',
      event,
      key,
      hit,
      ...meta
    });
  }

  /**
   * Log WebSocket event
   */
  logWebSocket(event, clientId, channel, meta = {}) {
    this.info('WebSocket Event', {
      type: 'websocket',
      event,
      clientId,
      channel,
      ...meta
    });
  }

  /**
   * Log performance metric
   */
  logPerformance(operation, duration, meta = {}) {
    this.info('Performance Metric', {
      type: 'performance',
      operation,
      duration: `${duration}ms`,
      ...meta
    });
  }

  /**
   * Enrich metadata with common fields
   */
  enrichMeta(meta) {
    return {
      ...meta,
      timestamp: new Date().toISOString(),
      hostname: process.env.HOSTNAME || 'unknown',
      pid: process.pid
    };
  }

  /**
   * Express middleware for request logging
   */
  requestLogger() {
    return (req, res, next) => {
      const start = Date.now();
      
      // Generate request ID
      req.id = this.generateRequestId();

      // Log when response finishes
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.logRequest(req, res, duration);
      });

      next();
    };
  }

  /**
   * Generate unique request ID
   */
  generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      requests: 0,
      errors: 0,
      warnings: 0
    };
  }

  /**
   * Create child logger with additional context
   */
  child(context) {
    return {
      info: (msg, meta) => this.info(msg, { ...context, ...meta }),
      warn: (msg, meta) => this.warn(msg, { ...context, ...meta }),
      error: (msg, err, meta) => this.error(msg, err, { ...context, ...meta }),
      debug: (msg, meta) => this.debug(msg, { ...context, ...meta })
    };
  }

  /**
   * Query logs from Elasticsearch
   */
  async queryLogs(query, options = {}) {
    // This would integrate with Elasticsearch client
    // Implementation depends on specific query requirements
    console.log('Querying logs:', query, options);
    return [];
  }

  /**
   * Get error statistics
   */
  async getErrorStats(timeRange = '24h') {
    // Query Elasticsearch for error statistics
    return {
      totalErrors: this.metrics.errors,
      timeRange,
      topErrors: []
    };
  }
}

// Export singleton instance
const logger = new LoggingService();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', new Error(reason), { promise });
});

export default logger;
