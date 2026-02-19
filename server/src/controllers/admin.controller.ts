import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { TransactionModel } from '../models/Transaction';
import { getSettings } from '../models/Settings';
import { generateAccessToken } from '../utils/jwt.utils';
import { responseHandler, sendSuccess, throwResponse } from '../utils/responseHandler';
import { catchAsAsync } from '../utils/catchAsAsync';
import logger from '../utils/logger';
import { TransactionService } from '../services/transaction.service';
import { BCHRateService } from '@/services/bchRate.service';

export class AdminController {
    /**
     * Admin login
     */
    static login = catchAsAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return throwResponse('Invalid credentials', 401);
        }

        const token = generateAccessToken({
            _id: user._id as string,
            email: user.email,
            role: user.role
        });

        return sendSuccess({
            res,
            message: 'Login successful',
            data: {
                token,
                admin: {
                    _id: user._id,
                    email: user.email,
                    role: user.role
                }
            }
        });
    });

    /**
     * Get dashboard statistics
     */
    static getStats = catchAsAsync(async (req: Request, res: Response) => {
        const { range = 'today' } = req.query;
        let dateFilter = {};

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (range === 'today') {
            dateFilter = { createdAt: { $gte: startOfDay } };
        } else if (range === 'week') {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            startOfWeek.setHours(0, 0, 0, 0);
            dateFilter = { createdAt: { $gte: startOfWeek } };
        } else if (range === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            dateFilter = { createdAt: { $gte: startOfMonth } };
        } else if (range === 'year') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            dateFilter = { createdAt: { $gte: startOfYear } };
        } else if (range === 'all') {
            dateFilter = {};
        }

        const statsMatch = { ...dateFilter, status: 'SUCCESS' };

        const [volumeData, successCount, activeServices, revenueData] = await Promise.all([
            TransactionModel.aggregate([
                { $match: statsMatch },
                { $group: { _id: null, total: { $sum: '$amount.bch' } } }
            ]),
            TransactionModel.countDocuments(statsMatch),
            getSettings(),
            TransactionModel.aggregate([
                { $match: statsMatch },
                { $group: { _id: null, total: { $sum: '$amount.ngn' } } }
            ])
        ]);

        const servicesCount = activeServices
            ? Object.values(activeServices.services).filter(v => v === true).length
            : 0;

        return sendSuccess({
            res,
            message: 'Stats retrieved successfully',
            data: {
                totalBchVolume: volumeData[0]?.total || 0,
                successfulTransactions: successCount,
                activeServices: servicesCount,
                revenueNgn: revenueData[0]?.total || 0
            }
        });
    });

    /**
     * Get paginated transactions
     */
    static getTransactions = catchAsAsync(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const service = req.query.service as string;

        const query: any = {};
        if (status) query.status = status;
        if (service) query.serviceType = service;

        const [transactions, total] = await Promise.all([
            TransactionModel.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            TransactionModel.countDocuments(query)
        ]);

        return sendSuccess({
            res,
            message: 'Transactions retrieved successfully',
            data: transactions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    });

    /**
     * Get transaction details
     */
    static getTransactionDetails = catchAsAsync(async (req: Request, res: Response) => {
        const { reference } = req.params;

        const transaction = await TransactionModel.findOne({ reference });

        if (!transaction) {
            return throwResponse('Transaction not found', 404);
        }

        return sendSuccess({
            res,
            message: 'Transaction details retrieved',
            data: transaction
        });
    });

    /**
     * Retry fulfillment for a failed but paid transaction
     */
    static retryFulfillment = catchAsAsync(async (req: Request, res: Response) => {
        const { reference } = req.params;

        try {
            const transaction = await TransactionService.retryFulfillment(reference as string);

            return sendSuccess({
                res,
                message: 'Fulfillment retry triggered',
                data: transaction
            });
        } catch (error: any) {
            return throwResponse(error.message || 'Failed to retry fulfillment', 400);
        }
    });

    /**
     * Get system settings
     */
    static getSettings = catchAsAsync(async (_req: Request, res: Response) => {
        const settings = await getSettings();
        return sendSuccess({
            res,
            message: 'Settings retrieved successfully',
            data: settings
        });
    });

    /**
     * Toggle service availability
     */
    static toggleService = catchAsAsync(async (req: Request, res: Response) => {
        const { serviceType: service } = req.params;
        const { enabled } = req.body;

        const settings = await getSettings();
        const services = settings.services as any;
        const serviceKey = service as string;
        if (services[serviceKey] === undefined) {
            return throwResponse('Invalid service type', 400);
        }

        services[serviceKey] = enabled;
        await settings.save();

        return sendSuccess({
            res,
            message: `Service ${service} ${enabled ? 'enabled' : 'disabled'}`,
            data: settings
        });
    });

    /**
     * Update manual exchange rate
     */
    static updateRate = catchAsAsync(async (req: Request, res: Response) => {
        let { rate } = req.body;

        if (!rate) {
            // auto sync with market
            rate = await BCHRateService.getBCHToNGNRate();
        }

        const settings = await getSettings();
        settings.rates.bchNgn = Number(rate);
        settings.rates.lastUpdated = new Date();
        await settings.save();

        return sendSuccess({
            res,
            message: 'Exchange rate updated successfully',
            data: settings
        });
    });
}
