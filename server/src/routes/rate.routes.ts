import { Router } from 'express';
import { RateController } from '@/controllers/rate.controller';

const router = Router();

/**
 * Get current BCH to NGN exchange rate
 */
router.get('/bch', RateController.getBCHRate);

/**
 * Convert NGN amount to BCH
 */
router.get('/convert/ngn-to-bch', RateController.convertNGNToBCH);

/**
 * Convert BCH amount to NGN
 */
router.get('/convert/bch-to-ngn', RateController.convertBCHTONGN);

export default router;
