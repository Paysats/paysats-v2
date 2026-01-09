import { LRUCache } from 'lru-cache';

const DEFAULT_TTL = 1000 * 60 * 60 * 24; // 1 day

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  // Exchange rates
  BCH_RATE: 1000 * 60 * 5, // 5 minutes
  
  // Transactions
  TRANSACTION: 1000 * 60 * 2, // 2 minutes
  ACTIVE_TRANSACTION: 1000 * 30, // 30 seconds (frequently updated)
  
  // Payment verification
  PAYMENT_STATUS: 1000 * 10, // 10 seconds (real-time-ish)
  
  // Service provider data
  NETWORK_PROVIDERS: 1000 * 60 * 60 * 24, // 24 hours (rarely changes)
  DATA_PLANS: 1000 * 60 * 60 * 12, // 12 hours
  
  // Analytics
  TRANSACTION_STATS: 1000 * 60 * 5, // 5 minutes
  REVENUE_STATS: 1000 * 60 * 5, // 5 minutes
};

// Cache key generators
export const CACHE_KEYS = {
  // Exchange rates
  bchRate: () => 'rate:bch:ngn',
  
  // Transactions
  transaction: (reference: string) => `transaction:${reference}`,
  activeTransaction: (userId?: string) => userId ? `transaction:active:${userId}` : 'transaction:active:anonymous',
  
  // Payments
  payment: (paymentId: string) => `payment:${paymentId}`,
  promptCashPayment: (txId: string) => `promptcash:payment:${txId}`,
  
  // Fulfillments
  fulfillment: (fulfillmentId: string) => `fulfillment:${fulfillmentId}`,
  
  // Service providers
  networkProviders: () => 'providers:networks',
  dataPlans: (network: string) => `providers:dataplans:${network.toLowerCase()}`,
  
  // Analytics
  transactionStats: (period: string) => `stats:transactions:${period}`,
  revenueStats: (period: string) => `stats:revenue:${period}`,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: DEFAULT_TTL,
});

export class CacheService {
  /**
   * Get a value from the cache
   */
  static get<T = unknown>(key: string): T | undefined {
    return cache.get(key) as T | undefined;
  }

  /**
   * Set a value in the cache
   */
  static set(key: string, value: unknown, ttl: number = DEFAULT_TTL): void {
    cache.set(key, value, { ttl });
  }

  /**
   * Check if a key exists in the cache
   */
  static has(key: string): boolean {
    return cache.has(key);
  }

  /**
   * Delete a value from the cache
   */
  static delete(key: string): boolean {
    return cache.delete(key);
  }

  /**
   * Clear all values from the cache
   */
  static clear(): void {
    cache.clear();
  }

  /**
   * Get the current cache size
   */
  static get size(): number {
    return cache.size;
  }

  /**
   * Get all keys in the cache
   */
  static keys(): string[] {
    return [...cache.keys()];
  }

  /**
   * Delete all keys matching a pattern (prefix)
   * @param pattern - The prefix to match (e.g., 'profile:public:')
   */
  static deleteByPattern(pattern: string): number {
    const keys = this.keys().filter(key => key.startsWith(pattern));
    keys.forEach(key => this.delete(key));
    return keys.length;
  }

  /**
   * Get or set pattern - fetch from cache or execute fn and cache result
   * @param key - Cache key
   * @param fn - Function to execute if cache miss
   * @param ttl - Time to live in milliseconds
   */
  static async getOrSet<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = await fn();
    if (result !== undefined && result !== null) {
      this.set(key, result, ttl);
    }
    return result;
  }


  // PAYMENT-SPECIFIC CACHE INVALIDATION
  
  /**
   * Invalidate transaction cache
   * calling when transaction status changes
   */
  static invalidateTransaction(reference: string): void {
    this.delete(CACHE_KEYS.transaction(reference));
  }

  /**
   * Invalidate active transaction cache
   * calling when user creates new transaction or completes one
   */
  static invalidateActiveTransaction(userId?: string): void {
    this.delete(CACHE_KEYS.activeTransaction(userId));
  }

  /**
   * Invalidate payment cache
   * called when payment status is updated
   */
  static invalidatePayment(paymentId: string, txId?: string): void {
    this.delete(CACHE_KEYS.payment(paymentId));
    if (txId) {
      this.delete(CACHE_KEYS.promptCashPayment(txId));
    }
  }

  /**
   * Invalidate all transaction-related caches
   * Call this when transaction is updated
   */
  static invalidateTransactionCaches(reference: string, userId?: string): void {
    this.invalidateTransaction(reference);
    this.invalidateActiveTransaction(userId);
  }

  /**
   * Invalidate BCH rate cache
   * calling to force fresh rate fetch
   */
  static invalidateBCHRate(): void {
    this.delete(CACHE_KEYS.bchRate());
  }

  /**
   * Invalidate all stats caches
   * Call this when new transactions complete
   */
  static invalidateStats(): void {
    this.deleteByPattern('stats:');
  }
}
