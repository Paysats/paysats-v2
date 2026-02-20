import { Request, Response } from 'express';
import { UtilityService } from '@/services/utility.service';
import { catchAsAsync } from '@/utils/catchAsAsync';
import { sendSuccess, throwResponse } from '@/utils/responseHandler';
import logger from '@/utils/logger';

export class UtilityController {
    /**
     * get data plans for a network
     */
    static getDataPlans = catchAsAsync(async (req: Request, res: Response) => {
        const { network } = req.params;
        if (!network) {
            return throwResponse('Network is required', 400);
        }

        const plans = await UtilityService.getDataPlans(network as string);

        return sendSuccess({
            res,
            message: 'Data plans retrieved successfully',
            data: plans
        });
    });
}
