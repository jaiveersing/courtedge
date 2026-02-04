/**
 * Winston-based structured logging service for CourtEdge
 * Provides consistent logging across the application with multiple transports
 */

import winston from 'winston';
import path from 'path';

const { combine, timestamp, json, printf, colorize, errors } = winston.format;

interface LogInfo {
  level: string;
  message: string;
  timestamp?: string;
  [key: string]: any;
}

// Custom format for console output
const consoleFormat = printf((info: any) => {
  const { level, message, timestamp, ...metadata } = info;
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

// Create logger instance
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  defaultMeta: { service: 'courtedge-api' },
  transports: [
    // Console transport with color in development
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      ),
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'rejections.log'),
    }),
  ],
});

// Production-specific transports
if (!isDevelopment) {
  // Could add external logging services here (e.g., Datadog, Sentry)
  // logger.add(new winston.transports.Http({ ... }));
}

/**
 * Structured logging methods with context
 */
export const log = {
  /**
   * Log info level message
   */
  info: (message: string, meta?: Record<string, unknown>) => {
    logger.info(message, meta);
  },

  /**
   * Log warning level message
   */
  warn: (message: string, meta?: Record<string, unknown>) => {
    logger.warn(message, meta);
  },

  /**
   * Log error level message
   */
  error: (message: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
    const errorMeta = {
      ...meta,
      ...(error instanceof Error && {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      }),
    };
    logger.error(message, errorMeta);
  },

  /**
   * Log debug level message
   */
  debug: (message: string, meta?: Record<string, unknown>) => {
    logger.debug(message, meta);
  },

  /**
   * Log API request
   */
  request: (req: { method: string; url: string; ip?: string; [key: string]: any }, meta?: Record<string, unknown>) => {
    logger.info('API Request', {
      type: 'request',
      method: req.method,
      url: req.url,
      ip: req.ip,
      ...meta,
    });
  },

  /**
   * Log API response
   */
  response: (
    req: { method: string; url: string; [key: string]: any },
    statusCode: number,
    duration: number,
    meta?: Record<string, unknown>
  ) => {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    logger.log(level, 'API Response', {
      type: 'response',
      method: req.method,
      url: req.url,
      statusCode,
      duration: `${duration}ms`,
      ...meta,
    });
  },

  /**
   * Log ML prediction
   */
  prediction: (
    model: string,
    input: Record<string, unknown>,
    output: Record<string, unknown>,
    duration: number
  ) => {
    logger.info('ML Prediction', {
      type: 'ml_prediction',
      model,
      input,
      output,
      duration: `${duration}ms`,
    });
  },

  /**
   * Log cache hit/miss
   */
  cache: (action: 'hit' | 'miss' | 'set' | 'delete', key: string, meta?: Record<string, unknown>) => {
    logger.debug(`Cache ${action}`, {
      type: 'cache',
      action,
      key,
      ...meta,
    });
  },

  /**
   * Log database query
   */
  query: (sql: string, duration: number, meta?: Record<string, unknown>) => {
    logger.debug('Database Query', {
      type: 'db_query',
      sql,
      duration: `${duration}ms`,
      ...meta,
    });
  },
};

export default logger;
