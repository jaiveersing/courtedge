import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to debounce a value
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

/**
 * Hook to track online/offline status
 * @returns {boolean} - Whether the user is online
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

/**
 * Hook for request caching with deduplication and retry logic
 * @returns {Object} - Cache utilities
 */
export const useRequestCache = () => {
  const cache = useRef(new Map());
  const pendingRequests = useRef(new Map());
  
  const getCached = useCallback((key) => {
    const cached = cache.current.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000; // 5 min TTL
    if (isExpired) {
      cache.current.delete(key);
      return null;
    }
    
    return cached.data;
  }, []);
  
  const setCached = useCallback((key, data) => {
    cache.current.set(key, { data, timestamp: Date.now() });
  }, []);
  
  const fetchWithCache = useCallback(async (key, fetchFn, options = {}) => {
    // Check cache first (cache-first strategy)
    const cached = getCached(key);
    if (cached && !options.forceRefresh) {
      return cached;
    }
    
    // Check if request is already pending (deduplication)
    if (pendingRequests.current.has(key)) {
      return pendingRequests.current.get(key);
    }
    
    // Create new request with retry logic and timeout
    const requestPromise = (async () => {
      let lastError;
      const maxRetries = 3;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
          
          const result = await fetchFn({ signal: controller.signal });
          clearTimeout(timeoutId);
          
          setCached(key, result);
          pendingRequests.current.delete(key);
          return result;
        } catch (error) {
          lastError = error;
          
          if (error.name === 'AbortError') {
            throw new Error('Request timeout - please try again');
          }
          
          // Exponential backoff: 1s, 2s, 4s
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          }
        }
      }
      
      pendingRequests.current.delete(key);
      throw lastError;
    })();
    
    pendingRequests.current.set(key, requestPromise);
    return requestPromise;
  }, [getCached, setCached]);
  
  return { fetchWithCache, getCached, setCached };
};

/**
 * Hook for intersection observer (lazy loading)
 * @param {Object} options - Intersection observer options
 * @returns {Array} - [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });
    
    observer.observe(element);
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);
  
  return [ref, isIntersecting];
};

/**
 * Hook for throttling a callback
 * @param {Function} callback - The callback to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled callback
 */
export const useThrottle = (callback, delay = 100) => {
  const lastRan = useRef(Date.now());
  
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = now;
    }
  }, [callback, delay]);
};

/**
 * Hook for local storage with automatic sync
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
};

/**
 * Hook for performance monitoring
 * @param {string} name - Performance mark name
 * @returns {Function} - Function to end measurement
 */
export const usePerformanceMark = (name) => {
  useEffect(() => {
    performance.mark(`${name}-start`);
    
    return () => {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name)[0];
        if (measure && measure.duration > 1000) {
          console.warn(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        // Performance API not supported or marks not found
      }
    };
  }, [name]);
};
