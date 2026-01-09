import { sendSuccess } from '@/utils/responseHandler';
import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get('', (_req: Request, res: Response) => {
    return sendSuccess({
        res,
        message: 'Server is healthy',
        data: { status: 'OK' },
    });
});

export default router;