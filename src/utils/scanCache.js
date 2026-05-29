/**
 * localStorage cache for scan results, keyed by barcode.
 * Prevents redundant API calls when the same product is scanned repeatedly.
 */

const CACHE_KEY_PREFIX = 'greenlens_cache_';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Retrieve a cached scan result for a given barcode.
 * Returns null if not found or expired.
 */
export function getCachedScan(barcode) {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${barcode}`);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${barcode}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Store a scan result for a given barcode.
 * Fails silently if localStorage is full.
 */
export function setCachedScan(barcode, data) {
  try {
    localStorage.setItem(
      `${CACHE_KEY_PREFIX}${barcode}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // localStorage quota exceeded — fail silently
  }
}

/**
 * Remove a specific barcode from the cache.
 */
export function invalidateCachedScan(barcode) {
  try {
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${barcode}`);
  } catch {
    // ignore
  }
}
