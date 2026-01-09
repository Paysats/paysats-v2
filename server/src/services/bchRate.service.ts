import axios from 'axios';
import logger from '@/utils/logger';
import { CacheService, CACHE_KEYS, CACHE_TTL } from './cache.service';

/**
 * Service for fetching and caching BCH exchange rates
 */
export class BCHRateService {
    /**
     * Get BCH to NGN exchange rate
     * Uses centralized cache service with 5-minute TTL
     * CRITICAL: No fallback rates - fails if API is unavailable
     */
    static async getBCHToNGNRate(): Promise<number> {
        const cacheKey = CACHE_KEYS.bchRate();

        try {
            // Use getOrSet pattern - will fetch if not cached or expired
            const rate = await CacheService.getOrSet<number>(
                cacheKey,
                async () => {
                    logger.info('Fetching fresh BCH/NGN rate from CoinGecko');

                    // Fetch from CoinGecko API
                    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                        params: {
                            ids: 'bitcoin-cash',
                            vs_currencies: 'ngn',
                        },
                        timeout: 10000, // 10 second timeout
                    });

                    const rate = response.data['bitcoin-cash']?.ngn;

                    if (!rate || typeof rate !== 'number' || rate <= 0) {
                        throw new Error('Invalid BCH/NGN rate received from CoinGecko');
                    }

                    logger.info('Fetched fresh BCH/NGN rate', { rate, source: 'CoinGecko' });
                    return rate;
                },
                CACHE_TTL.BCH_RATE
            );

            if (!rate || rate <= 0) {
                throw new Error('Invalid rate from cache');
            }

            return rate;
        } catch (error: any) {
            logger.error('CRITICAL: Failed to fetch BCH/NGN rate', {
                error: error?.message,
                stack: error?.stack
            });

            // Only use expired cache as last resort (within reasonable time window)
            const cachedRate = CacheService.get<number>(cacheKey);
            if (cachedRate && cachedRate > 0) {
                logger.warn('using recently expired cached rate due to API error', {
                    rate: cachedRate,
                    warning: 'this should only happen during temporary API outages'
                });
                return cachedRate;
            }

            // Better to reject transaction than use wrong price
            throw new Error(
                'Unable to fetch BCH exchange rate. Please try again in a few moments. ' +
                'If this persists, our exchange rate provider may be experiencing issues.'
            );
        }
    }

    /**
     * Convert NGN to BCH
     */
    static async convertNGNToBCH(amountNGN: number): Promise<number> {
        const rate = await this.getBCHToNGNRate();
        return amountNGN / rate;
    }

    /**
     * Convert BCH to NGN
     */
    static async convertBCHToNGN(amountBCH: number): Promise<number> {
        const rate = await this.getBCHToNGNRate();
        return amountBCH * rate;
    }

    /**
     * Convert BCH to Satoshis
     */
    static bchToSats(amountBCH: number): number {
        return Math.round(amountBCH * 100000000); // 1 BCH = 100,000,000 sats
    }

    /**
     * Convert Satoshis to BCH
     */
    static satsToBCH(amountSats: number): number {
        return amountSats / 100000000;
    }

    /**
     * Clear the rate cache (useful for testing)
     */
    static clearCache(): void {
        CacheService.invalidateBCHRate();
        logger.info('BCH rate cache cleared');
    }
}
