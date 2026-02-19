import { Request, Response } from 'express';
import { getSettings } from '../models/Settings';
import { sendSuccess } from '../utils/responseHandler';
import { catchAsAsync } from '../utils/catchAsAsync';

export class ConfigController {
    /**
     * Get public system configuration (active services, exchange rates)
     */
    static getPublicConfig = catchAsAsync(async (_req: Request, res: Response) => {
        const settings = await getSettings();

        return sendSuccess({
            res,
            message: 'Public configuration retrieved successfully',
            data: {
                services: settings.services,
                rates: {
                    bchNgn: settings.rates.bchNgn,
                    lastUpdated: settings.rates.lastUpdated
                }
            }
        });
    });
}
