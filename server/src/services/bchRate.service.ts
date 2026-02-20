import axios from 'axios';
import logger from '@/utils/logger';
import { CacheService, CACHE_KEYS, CACHE_TTL } from './cache.service';

/**
 * Service for fetching and caching BCH exchange rates
 */
export class BCHRateService {
    /**
     * Get BCH rates (NGN and USD)
     * Uses centralized cache service with 5-minute TTL
     */
    static async getBCHRate(): Promise<{ ngn: number; usd: number }> {
        const cacheKey = CACHE_KEYS.bchRate();

        try {
            return await CacheService.getOrSet<{ ngn: number; usd: number }>(
                cacheKey,
                async () => {
                    logger.info('Fetching fresh BCH rates from CoinGecko');

                    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                        params: {
                            ids: 'bitcoin-cash',
                            vs_currencies: 'ngn,usd',
                        },
                        timeout: 10000,
                    });

                    const ngn = response.data['bitcoin-cash']?.ngn;
                    const usd = response.data['bitcoin-cash']?.usd;

                    if (!ngn || !usd) {
                        throw new Error('Invalid BCH rates received from CoinGecko');
                    }

                    return { ngn, usd };
                },
                CACHE_TTL.BCH_RATE
            );
        } catch (error: any) {
            logger.error('CRITICAL: Failed to fetch BCH rates', { error: error?.message });

            // fallback to last cached value if avail
            const cached = CacheService.get<{ ngn: number; usd: number }>(cacheKey);
            if (cached) return cached;

            throw error;
        }
    }

    /**
     * get bch to ngn exchange rate
     */
    static async getBCHToNGNRate(): Promise<number> {
        const rates = await this.getBCHRate();
        return rates.ngn;
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
