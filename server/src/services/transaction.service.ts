import { TransactionModel } from '@/models/Transaction';
import { PaymentModel } from '@/models/Payment';
import { FulfillmentModel } from '@/models/Fulfillment';
import { ServiceTypeEnum, TransactionStatusEnum, PaymentStatusEnum, FulfillmentStatusEnum } from '@shared/types';
import { BCHRateService } from './bchRate.service';
import { PromptCashService } from './promptcash.service';
import { VtPassService } from './vtpass.service';
import { CacheService, CACHE_KEYS, CACHE_TTL } from './cache.service';
import logger from '@/utils/logger';
import mongoose from 'mongoose';
import { config } from '@/config/config';

const APP_BASE_URL = config.app.APP_BASE_URL || 'https://app.paysats.io';
const API_BASE_URL = config.app.API_BASE_URL || 'https://api.paysats.io';

export interface ICreateAirtimeTransactionParams {
    network: string;
    phoneNumber: string;
    amount: number;
}

export interface ICreateDataTransactionParams {
    network: string;
    phoneNumber: string;
    planId: string;
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
                provider: 'VTPASS',
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
                expiration: 30,
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

    private static async fulfillService(transaction: any, session: any) {
        try {
            transaction.status = TransactionStatusEnum.PROCESSING;
            await transaction.save({ session });

            let vtPassResult: any;

            if (transaction.serviceType === ServiceTypeEnum.AIRTIME) {
                vtPassResult = await VtPassService.purchaseAirtime({
                    serviceId: transaction.serviceMeta.network.toLowerCase(),
                    phoneNumber: transaction.serviceMeta.phone,
                    amount: transaction.amount.ngn,
                });
            } else if (transaction.serviceType === ServiceTypeEnum.DATA) {
                throw new Error('Data purchase not yet implemented');
            } else {
                throw new Error(`Unsupported service type: ${transaction.serviceType}`);
            }

            const fulfillment = await FulfillmentModel.create([{
                transactionId: transaction._id,
                provider: 'VTPASS',
                serviceType: transaction.serviceType,
                providerTransactionId: vtPassResult.content?.transactions?.transactionId || '',
                providerRequestId: vtPassResult.requestId || '',
                status: vtPassResult.content?.transactions?.status === 'delivered' 
                    ? FulfillmentStatusEnum.SUCCESS 
                    : FulfillmentStatusEnum.FAILED,
                amount: {
                    ngn: vtPassResult.amount || transaction.amount.ngn,
                    commission: vtPassResult.content?.transactions?.commission || 0,
                    totalCharged: vtPassResult.content?.transactions?.total_amount || transaction.amount.ngn,
                },
                response: {
                    rawResponse: vtPassResult,
                },
            }], { session });

            transaction.fulfillmentId = fulfillment[0]._id;
            transaction.status = fulfillment[0].status === FulfillmentStatusEnum.SUCCESS
                ? TransactionStatusEnum.SUCCESS
                : TransactionStatusEnum.FAILED;
            transaction.fulfilledAt = new Date();

            if (fulfillment[0].status === FulfillmentStatusEnum.FAILED) {
                transaction.failureReason = vtPassResult.response_description || 'Fulfillment failed';
            }

            await transaction.save({ session });

            // Invalidate cache after fulfillment
            CacheService.invalidateTransaction(transaction.reference);

            logger.info('Service fulfilled successfully', {
                reference: transaction.reference,
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
}
