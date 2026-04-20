// FILE: js/core/cache.js

/* -----------------------------------
   SIMPLE IN-MEMORY CACHE
   Used for:
   - expensive engine outputs
   - filtered datasets
   - report summaries
----------------------------------- */

const CACHE = new Map();

/* -----------------------------------
   PUBLIC API
----------------------------------- */

/**
 * Save value in cache
 * @param {string} key
 * @param {*} value
 */
export function setCache(key, value) {
  CACHE.set(key, value);
  return value;
}

/**
 * Read value from cache
 * @param {string} key
 * @returns {*}
 */
export function getCache(key) {
  return CACHE.get(key);
}

/**
 * Check key exists
 * @param {string} key
 * @returns {boolean}
 */
export function hasCache(key) {
  return CACHE.has(key);
}

/**
 * Remove one key
 * @param {string} key
 */
export function clearCacheKey(key) {
  CACHE.delete(key);
}

/**
 * Clear everything
 */
export function clearAllCache() {
  CACHE.clear();
}

/* -----------------------------------
   HELPER
----------------------------------- */

/**
 * Cached compute
 * @param {string} key
 * @param {Function} factory
 */
export function remember(key, factory) {
  if (CACHE.has(key)) {
    return CACHE.get(key);
  }

  const value = factory();

  CACHE.set(key, value);

  return value;
}

/* -----------------------------------
   DEBUG
----------------------------------- */

export function getCacheStats() {
  return {
    size: CACHE.size,
    keys: Array.from(CACHE.keys())
  };
}