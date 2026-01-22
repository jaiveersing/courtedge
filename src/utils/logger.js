/**
 * Production Logger Utility
 * 
 * Disables console logs in production while keeping error reporting
 * Import this at the top of main.jsx to apply globally
 */

const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Store original console methods
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
  trace: console.trace,
};

/**
 * Custom logger that respects environment
 */
export const logger = {
  // Always log errors
  error: (...args) => originalConsole.error('[CourtEdge Error]', ...args),
  
  // Warnings shown in development and production
  warn: (...args) => {
    if (!isProduction || import.meta.env.VITE_SHOW_WARNINGS === 'true') {
      originalConsole.warn('[CourtEdge Warn]', ...args);
    }
  },
  
  // Info logs only in development
  info: (...args) => {
    if (isDevelopment) {
      originalConsole.info('[CourtEdge Info]', ...args);
    }
  },
  
  // Debug logs only in development
  debug: (...args) => {
    if (isDevelopment) {
      originalConsole.debug('[CourtEdge Debug]', ...args);
    }
  },
  
  // Standard logs only in development
  log: (...args) => {
    if (isDevelopment) {
      originalConsole.log(...args);
    }
  },
};

/**
 * Initialize production logging
 * Call this function in main.jsx to apply globally
 */
export const initProductionLogging = () => {
  if (isProduction) {
    // In production, suppress standard console methods
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
    
    // Keep warnings and errors for monitoring
    console.warn = (...args) => {
      // Could send to logging service here
      originalConsole.warn('[Prod Warning]', ...args);
    };
    
    console.error = (...args) => {
      // Could send to error tracking service (Sentry, etc.)
      originalConsole.error('[Prod Error]', ...args);
    };
    
    // Log that production mode is active (once)
    originalConsole.info('🚀 CourtEdge running in production mode');
  } else {
    originalConsole.info('🛠️  CourtEdge running in development mode');
  }
};

/**
 * Performance measurement utility
 */
export const measurePerformance = (name, fn) => {
  if (isDevelopment) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    logger.debug(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
};

/**
 * Async performance measurement
 */
export const measurePerformanceAsync = async (name, fn) => {
  if (isDevelopment) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    logger.debug(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
};

export default logger;
