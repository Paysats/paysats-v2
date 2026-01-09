import { Request, Response } from 'express';
import { BCHRateService } from '@/services/bchRate.service';
import { catchAsAsync } from '@/utils/catchAsAsync';
import { sendSuccess } from '@/utils/responseHandler';
import logger from '@/utils/logger';

export class RateController {
    /**
     * Get current BCH to NGN exchange rate
     */
    static getBCHRate = catchAsAsync(async (_req: Request, res: Response) => {
        try {
            const rate = await BCHRateService.getBCHToNGNRate();

            const data = {
                rate,
                    currency: 'NGN',
                    blockchain: 'BCH',
                    timestamp: new Date().toISOString(),
            }

            return sendSuccess({
                res,
                data,
                message: 'BCH rate fetched successfully',
            });
        } catch (error: any) {
            logger.error('Error fetching BCH rate', { error: error?.message });
            throw error;
        }
    });

    /**
     * Convert NGN amount to BCH
     */
    static convertNGNToBCH = catchAsAsync(async (req: Request, res: Response) => {
        const { amount } = req.query;

        if (!amount || isNaN(Number(amount))) {
            return res.status(400).json({
                success: false,
                message: 'Valid amount is required',
            });
        }

        try {
            const ngnAmount = Number(amount);
            const rate = await BCHRateService.getBCHToNGNRate();
            const bchAmount = await BCHRateService.convertNGNToBCH(ngnAmount);
            const satsAmount = BCHRateService.bchToSats(bchAmount);

            const data = {
                ngn: ngnAmount,
                bch: bchAmount,
                sats: satsAmount,
                rate,
                timestamp: new Date().toISOString(),
            }

            return sendSuccess({
                res,
                data,
                message: 'Conversion successful',
            });
        } catch (error: any) {
            logger.error('Error converting NGN to BCH', { error: error?.message });
            throw error;
        }
    });

    /**
     * Convert BCH amount to NGN
     */
    static convertBCHTONGN = catchAsAsync(async (req: Request, res: Response) => {
        const { amount } = req.query;

        if (!amount || isNaN(Number(amount))) {
            return res.status(400).json({
                success: false,
                message: 'Valid amount is required',
            });
        }

        try {
            const bchAmount = Number(amount);
            const rate = await BCHRateService.getBCHToNGNRate();
            const ngnAmount = await BCHRateService.convertBCHToNGN(bchAmount);
            const satsAmount = BCHRateService.bchToSats(bchAmount);


            const data = {
                bch: bchAmount,
                ngn: ngnAmount,
                sats: satsAmount,
                rate,
                timestamp: new Date().toISOString(),
            }

            return sendSuccess({
                res,
                data,
                message: 'Conversion successful',
            });
        } catch (error: any) {
            logger.error('Error converting BCH to NGN', { error: error?.message });
            throw error;
        }
    });
}
