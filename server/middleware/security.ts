/**
 * Security middleware for Express server
 * Implements rate limiting, input validation, CORS, and security headers
 */

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { log } from '../logger.js';

/**
 * Helmet security headers configuration
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", 'http://localhost:*', 'https://api.nba.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    log.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please slow down your requests',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

/**
 * Strict rate limiter for ML predictions
 */
export const mlRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 ML requests per minute
  message: 'Too many prediction requests, please try again later.',
  skipSuccessfulRequests: false,
  handler: (req: Request, res: Response) => {
    log.warn('ML rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'ML predictions are limited to 10 per minute',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

/**
 * Authentication rate limiter
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.',
  handler: (req: Request, res: Response) => {
    log.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      error: 'Too many attempts',
      message: 'Please wait before trying again',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

/**
 * Input validation middleware
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: Array<Record<string, any>> = [];
    errors.array().map((err: any) => extractedErrors.push({ [err.path]: err.msg }));

    log.warn('Validation failed', {
      ip: req.ip,
      path: req.path,
      errors: extractedErrors,
    });

    return res.status(400).json({
      error: 'Validation failed',
      details: extractedErrors,
    });
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  playerId: param('playerId').isString().trim().notEmpty(),
  gameId: param('gameId').isString().trim().notEmpty(),
  statType: body('stat_type').isIn(['points', 'rebounds', 'assists', 'threes']),
  date: query('date').optional().isISO8601(),
  limit: query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  offset: query('offset').optional().isInt({ min: 0 }).toInt(),
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '') // Remove < and >
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      log.warn('CORS blocked origin', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

/**
 * Error handling middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  log.error('Unhandled error', err, {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(isDevelopment && {
      stack: err.stack,
      details: err.details,
    }),
  });
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log request
  log.request(req, {
    body: req.method !== 'GET' ? req.body : undefined,
    query: req.query,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    log.response(req, res.statusCode, duration);
  });

  next();
};

/**
 * JWT token verification
 */
export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Import jwt dynamically to avoid issues if not installed
    const jwt = require('jsonwebtoken');
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err: any) {
    log.warn('Invalid token', { ip: req.ip, error: err?.message });
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * API key verification
 */
export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(401).json({ error: 'API key required' });
  }

  const validApiKeys = process.env.API_KEYS?.split(',') || [];

  if (!validApiKeys.includes(apiKey)) {
    log.warn('Invalid API key', { ip: req.ip });
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

export default {
  securityHeaders,
  apiRateLimiter,
  mlRateLimiter,
  authRateLimiter,
  validate,
  validationRules,
  sanitizeInput,
  corsOptions,
  errorHandler,
  requestLogger,
  authenticateToken,
  verifyApiKey,
};
