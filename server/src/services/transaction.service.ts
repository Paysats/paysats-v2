import { TransactionModel } from '@/models/Transaction';
import { PaymentModel } from '@/models/Payment';
import { FulfillmentModel } from '@/models/Fulfillment';
import { ServiceTypeEnum, TransactionStatusEnum, PaymentStatusEnum, FulfillmentStatusEnum } from '@shared/types';
import { BCHRateService } from './bchRate.service';
import { PromptCashService } from './promptcash.service';
import { UtilityService } from './utility.service';
import { CacheService, CACHE_KEYS, CACHE_TTL } from './cache.service';
import logger from '@/utils/logger';
import mongoose from 'mongoose';
import { config } from '@/config/config';

const APP_BASE_URL = config.app.APP_BASE_URL || 'https://app.trypaysats.xyz';
const API_BASE_URL = config.app.API_BASE_URL || 'https://api.trypaysats.xyz';

export interface ICreateAirtimeTransactionParams {
    network: string;
    phoneNumber: string;
    amount: number;
}

export interface ICreateDataTransactionParams {
    network: string;
    phoneNumber: string;
    planCode: string;
    amount: number;
}

export class TransactionService {
    private static generateReference(serviceType: ServiceTypeEnum): string {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const servicePrefix = serviceType === ServiceTypeEnum.AIRTIME ? 'AIR' :
            serviceType === ServiceTypeEnum.DATA ? 'DATA' :
                serviceType.substring(0, 3).toUpperCase();

        return `PAYSATS-${servicePrefix}-${dateStr}-${random}`;
    }

    static async createAirtimeTransaction(params: ICreateAirtimeTransactionParams) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (!params.network || !params.phoneNumber || !params.amount) {
                throw new Error('Missing required parameters');
            }

            if (params.amount < 50) {
                throw new Error('Minimum amount is ₦50');
            }

            if (params.amount > 50000) {
                throw new Error('Maximum amount is ₦50,000');
            }

            const bchRate = await BCHRateService.getBCHToNGNRate();
            const amountBCH = await BCHRateService.convertNGNToBCH(params.amount);
            const amountSats = BCHRateService.bchToSats(amountBCH);
            const reference = this.generateReference(ServiceTypeEnum.AIRTIME);

            const transaction = await TransactionModel.create([{
                reference,
                serviceType: ServiceTypeEnum.AIRTIME,
                provider: config.utility.DEFAULT_PROVIDER,
                amount: {
                    ngn: params.amount,
                    bch: amountBCH,
                    rate: bchRate,
                },
                serviceMeta: {
                    phone: params.phoneNumber,
                    network: params.network,
                },
                status: TransactionStatusEnum.INITIATED,
            }], { session });

            const txDoc = transaction[0];

            const promptCashPayment = await PromptCashService.createPayment({
                tx_id: reference,
                amount: amountBCH,
                currency: 'BCH',
                desc: `Paysats Airtime - ${params.network} - ${params.phoneNumber}`,
                callback: `${API_BASE_URL}/webhooks/promptcash`,
                return: `${APP_BASE_URL}/app/transaction/${reference}`,
                expiration: 5, // 5 minutes (custom expiration)
                confirm: 0, // Accept 0-conf (instant) payments
            });

            const payment = await PaymentModel.create([{
                transactionId: txDoc._id,
                blockchain: 'BCH',
                address: promptCashPayment.payment.address,
                amountBch: amountBCH,
                amountSats,
                status: PaymentStatusEnum.PENDING,
                confirmations: 0,
                rawBlockchainPayload: promptCashPayment,
            }], { session });

            await TransactionModel.findByIdAndUpdate(
                txDoc._id,
                {
                    paymentId: payment[0]._id,
                    status: TransactionStatusEnum.PAYMENT_PENDING,
                },
                { session }
            );

            await session.commitTransaction();

            logger.info('Airtime transaction created successfully', {
                reference,
                amount: params.amount,
                bchAmount: amountBCH,
                address: promptCashPayment.payment.address,
            });

            return {
                transaction: {
                    reference,
                    serviceType: ServiceTypeEnum.AIRTIME,
                    amount: {
                        ngn: params.amount,
                        bch: amountBCH,
                        rate: bchRate,
                    },
                    status: TransactionStatusEnum.PAYMENT_PENDING,
                },
                payment: {
                    address: promptCashPayment.payment.address,
                    amountBCH,
                    qrUrl: promptCashPayment.payment.qr_url,
                    paymentLink: promptCashPayment.payment.payment_link,
                },
            };
        } catch (error: any) {
            await session.abortTransaction();
            logger.error('Error creating airtime transaction', { error: error?.message });
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async handlePaymentConfirmation(reference: string, paymentData: any) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const transaction = await TransactionModel.findOne({ reference }).populate('paymentId');
            if (!transaction) {
                throw new Error(`Transaction not found: ${reference}`);
            }

            const payment = await PaymentModel.findById(transaction.paymentId);
            if (!payment) {
                throw new Error(`Payment not found for transaction: ${reference}`);
            }

            const internalStatus = PromptCashService.mapStatus(paymentData.status);

            payment.status = internalStatus as PaymentStatusEnum;
            payment.txHash = paymentData.hash || payment.txHash;
            payment.confirmations = paymentData.confirmations || 0;
            payment.rawBlockchainPayload = paymentData;
            await payment.save({ session });

            if (paymentData.status === 'PAID') {
                const trxData = {
                    status: TransactionStatusEnum.PAYMENT_CONFIRMED,
                    paidAt: new Date(),
                }

                await TransactionModel.findByIdAndUpdate(
                    transaction._id,
                    trxData,
                    { session }
                );

                // invalid cache so frontend gets fresh status
                CacheService.invalidateTransaction(reference);

                await this.fulfillService(transaction, session);
            }

            await session.commitTransaction();

            // Invalidate cache after successful update
            CacheService.invalidateTransaction(reference);

            logger.info('Payment confirmation handled successfully', {
                reference,
                status: paymentData.status,
            });

            return transaction;
        } catch (error: any) {
            await session.abortTransaction();
            logger.error('Error handling payment confirmation', {
                reference,
                error: error?.message,
            });
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Manually retry fulfillment for a paid transaction
     */
    static async retryFulfillment(reference: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const transaction = await TransactionModel.findOne({ reference }).session(session);
            if (!transaction) throw new Error('Transaction not found');
            if (!transaction.paidAt) throw new Error('Transaction not paid yet');

            await this.fulfillService(transaction, session);

            await session.commitTransaction();
            return transaction;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    public static async fulfillService(transaction: any, session: any) {
        try {
            transaction.status = TransactionStatusEnum.PROCESSING;
            await transaction.save({ session });

            logger.info('TransactionService: Starting service fulfillment', {
                reference: transaction.reference,
                type: transaction.serviceType
            });

            let fulfillmentResult: any;

            if (transaction.serviceType === ServiceTypeEnum.AIRTIME) {
                fulfillmentResult = await UtilityService.purchaseAirtime({
                    network: transaction.serviceMeta.network,
                    phoneNumber: transaction.serviceMeta.phone,
                    amount: transaction.amount.ngn,
                    reference: transaction.reference
                });
            } else if (transaction.serviceType === ServiceTypeEnum.DATA) {
                fulfillmentResult = await UtilityService.purchaseData({
                    network: transaction.serviceMeta.network,
                    phoneNumber: transaction.serviceMeta.phone,
                    amount: transaction.amount.ngn,
                    planCode: transaction.serviceMeta.planCode,
                    reference: transaction.reference
                });
            } else {
                throw new Error(`Unsupported service type: ${transaction.serviceType}`);
            }

            const fulfillment = await FulfillmentModel.create([{
                transactionId: transaction._id,
                provider: fulfillmentResult.provider,
                serviceType: transaction.serviceType,
                providerTransactionId: fulfillmentResult.providerTransactionId || '',
                providerRequestId: fulfillmentResult.providerRequestId || '',
                status: fulfillmentResult.success
                    ? FulfillmentStatusEnum.SUCCESS
                    : FulfillmentStatusEnum.FAILED,
                amount: {
                    ngn: fulfillmentResult.amount?.ngn || transaction.amount.ngn,
                    commission: fulfillmentResult.amount?.commission || 0,
                    totalCharged: fulfillmentResult.amount?.totalCharged || transaction.amount.ngn,
                },
                response: {
                    rawResponse: fulfillmentResult.rawResponse,
                },
            }], { session });

            transaction.fulfillmentId = fulfillment[0]._id;
            transaction.provider = fulfillmentResult.provider; // Update provider in case of fallback
            transaction.status = fulfillment[0].status === FulfillmentStatusEnum.SUCCESS
                ? TransactionStatusEnum.SUCCESS
                : TransactionStatusEnum.FAILED;
            transaction.fulfilledAt = new Date();

            if (fulfillment[0].status === FulfillmentStatusEnum.FAILED) {
                transaction.failureReason = fulfillmentResult.failureReason || 'Fulfillment failed';
            }

            await transaction.save({ session });

            // Invalidate cache after fulfillment
            CacheService.invalidateTransaction(transaction.reference);

            logger.info('Service fulfillment step completed', {
                reference: transaction.reference,
                provider: fulfillmentResult.provider,
                status: transaction.status,
            });
        } catch (error: any) {
            transaction.status = TransactionStatusEnum.FAILED;
            transaction.failureReason = error?.message || 'Fulfillment error';
            await transaction.save({ session });

            // Invalidate cache even on failure
            CacheService.invalidateTransaction(transaction.reference);

            logger.error('Error fulfilling service', {
                reference: transaction.reference,
                error: error?.message,
            });
            throw error;
        }
    }

    /**
     * Get transaction by reference
     * Uses cache for better performance during polling
     */
    static async getTransaction(reference: string) {
        const cacheKey = CACHE_KEYS.transaction(reference);

        // Try cache first
        const cached = CacheService.get(cacheKey);
        if (cached) {
            logger.debug('Using cached transaction', { reference });
            return cached;
        }

        // Fetch from database
        const transaction = await TransactionModel.findOne({ reference })
            .populate('paymentId')
            .populate('fulfillmentId');

        if (!transaction) {
            throw new Error(`Transaction not found: ${reference}`);
        }

        // Cache for 2 minutes (frontend polls every 3 seconds)
        CacheService.set(cacheKey, transaction, CACHE_TTL.TRANSACTION);
        logger.debug('Cached transaction', { reference });

        return transaction;
    }
    static async createDataTransaction(params: ICreateDataTransactionParams) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (!params.network || !params.phoneNumber || !params.planCode || !params.amount) {
                throw new Error('Missing required parameters');
            }

            const bchRate = await BCHRateService.getBCHToNGNRate();
            const amountBCH = await BCHRateService.convertNGNToBCH(params.amount);
            const amountSats = BCHRateService.bchToSats(amountBCH);
            const reference = this.generateReference(ServiceTypeEnum.DATA);

            const transaction = await TransactionModel.create([{
                reference,
                serviceType: ServiceTypeEnum.DATA,
                provider: config.utility.DEFAULT_PROVIDER,
                amount: {
                    ngn: params.amount,
                    bch: amountBCH,
                    rate: bchRate,
                },
                serviceMeta: {
                    phone: params.phoneNumber,
                    network: params.network,
                    planCode: params.planCode,
                },
                status: TransactionStatusEnum.INITIATED,
            }], { session });

            const txDoc = transaction[0];

            const promptCashPayment = await PromptCashService.createPayment({
                tx_id: reference,
                amount: amountBCH,
                currency: 'BCH',
                desc: `Paysats Data - ${params.network} - ${params.phoneNumber}`,
                callback: `${API_BASE_URL}/webhooks/promptcash`,
                return: `${APP_BASE_URL}/app/transaction/${reference}`,
                expiration: 10,
                confirm: 0,
            });

            const payment = await PaymentModel.create([{
                transactionId: txDoc._id,
                blockchain: 'BCH',
                address: promptCashPayment.payment.address,
                amountBch: amountBCH,
                amountSats,
                status: PaymentStatusEnum.PENDING,
                confirmations: 0,
                rawBlockchainPayload: promptCashPayment,
            }], { session });

            await TransactionModel.findByIdAndUpdate(
                txDoc._id,
                {
                    paymentId: payment[0]._id,
                    status: TransactionStatusEnum.PAYMENT_PENDING,
                },
                { session }
            );

            await session.commitTransaction();

            logger.info('Data transaction created successfully', {
                reference,
                amount: params.amount,
                bchAmount: amountBCH,
                address: promptCashPayment.payment.address,
            });

            return {
                transaction: {
                    reference,
                    serviceType: ServiceTypeEnum.DATA,
                    amount: {
                        ngn: params.amount,
                        bch: amountBCH,
                        rate: bchRate,
                    },
                    status: TransactionStatusEnum.PAYMENT_PENDING,
                },
                payment: {
                    address: promptCashPayment.payment.address,
                    amountBCH,
                    qrUrl: promptCashPayment.payment.qr_url,
                    paymentLink: promptCashPayment.payment.payment_link,
                },
            };
        } catch (error: any) {
            await session.abortTransaction();
            logger.error('Error creating data transaction', { error: error?.message });
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Sync transaction status with Prompt.cash
     * Useful for manual "Check Status" to ensure we have latest blockchain info
     */
    static async syncWithProvider(reference: string) {
        const transaction = await TransactionModel.findOne({ reference }).populate('paymentId');
        if (!transaction) throw new Error('Transaction not found');

        // only sync if not already final
        if (transaction.status === TransactionStatusEnum.SUCCESS ||
            transaction.status === TransactionStatusEnum.FAILED) {
            return transaction;
        }

        logger.info(`Syncing transaction with Prompt.cash: ${reference}`);

        try {
            // force blockchain check, reconfirm status from prompt.cash
            const promptPayment = await PromptCashService.getPayment(reference, true);

            if (promptPayment.status === 'PAID') {
                logger.info(`Manual sync detected payment for reference: ${reference}`);
                // Use a separate session for confirmation to avoid locking
                return await this.handlePaymentConfirmation(reference, promptPayment);
            }

            // always update confirmations
            if (transaction.paymentId) {
                await PaymentModel.findByIdAndUpdate(transaction.paymentId, {
                    confirmations: promptPayment.confirmations || 0,
                    rawBlockchainPayload: promptPayment
                });
            }

            // Invalidate cache
            CacheService.invalidateTransaction(reference);

            return await this.getTransaction(reference);
        } catch (error: any) {
            logger.error(`Error syncing with Prompt.cash for ${reference}:`, error.message);
            throw error;
        }
    }
}
