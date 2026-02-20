import axios from 'axios';
import crypto from 'crypto';
import logger from '@/utils/logger';
import { config } from '@/config/config';

const PROMPT_CASH_API_BASE_URL = 'https://prompt.cash/api/v1';
const PROMPT_CASH_PUBLIC_TOKEN = config.promptCash.PUBLIC_TOKEN;
const PROMPT_CASH_SECRET_TOKEN = config.promptCash.SECRET_TOKEN;

// from prompt.cash API docs
export enum PromptCashStatusEnum {
    PENDING = 'PENDING',
    CONFIRMING = 'CONFIRMING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
    HOLD = 'HOLD',
    REFUNDED = 'REFUNDED',
}

export interface ICreatePaymentParams {
    tx_id: string;
    amount: number;
    currency: string;
    desc: string;
    callback: string;
    return: string;
    expiration?: number;
    confirm?: number;
}

export interface IPromptCashPayment {
    id: number;
    tx_id: string;
    amount_crypto: number;
    amount_fiat: number;
    status: PromptCashStatusEnum;
    paid_amount_crypto: number;
    fiat_currency: string;
    crypto_currency: string;
    slp_token: string;
    description: string;
    callback_url: string;
    return_url: string;
    referer: string;
    email: string;
    address: string;
    confirmations: number;
    hash: string;
    qr_url: string;
    payment_link: string;
    created_at: string;
    paid: string;
}

export interface ICreatePaymentResponse {
    payment: IPromptCashPayment;
    existing: boolean;
}

/**
 * Service for interacting with Prompt.cash API
 */
export class PromptCashService {
    /**
     * Helper to retry a function with exponential backoff
     */
    private static async withRetry<T>(
        operation: () => Promise<T>,
        tx_id: string,
        maxAttempts: number = 3,
        baseDelay: number = 2000
    ): Promise<T> {
        let lastError: any;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error: any) {
                lastError = error;

                // don't retry if it's a 4xx error (except 429)
                if (error.response?.status && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
                    throw error;
                }

                if (attempt < maxAttempts) {
                    const delay = baseDelay * Math.pow(2, attempt - 1);
                    logger.warn(`Prompt.cash API attempt ${attempt} failed, retrying in ${delay}ms...`, {
                        tx_id,
                        error: error.message,
                        status: error.response?.status
                    });
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw lastError;
    }

    /**
     * Create a new payment on Prompt.cash
     */
    static async createPayment(params: ICreatePaymentParams): Promise<ICreatePaymentResponse> {
        if (!PROMPT_CASH_PUBLIC_TOKEN) {
            throw new Error('PROMPT_CASH_PUBLIC_TOKEN is not configured');
        }

        return this.withRetry(async () => {
            const time = Math.floor(Date.now() / 1000);
            const requestParams: any = {
                token: PROMPT_CASH_PUBLIC_TOKEN,
                tx_id: params.tx_id,
                amount: params.amount,
                currency: params.currency,
                desc: params.desc,
                callback: params.callback,
                return: params.return,
                expiration: params.expiration || 30, // 30 minutes prompt cash default
                confirm: params.confirm || 0,
                time,
            };

            // Add signature if secret token is configured
            if (PROMPT_CASH_SECRET_TOKEN) {
                const signature = this.generateSignature(requestParams);
                requestParams.signature = signature;
            }

            logger.info('Creating Prompt.cash payment', { tx_id: params.tx_id, amount: params.amount });

            const response = await axios.post<ICreatePaymentResponse>(
                `${PROMPT_CASH_API_BASE_URL}/create-payment`,
                requestParams,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `${PROMPT_CASH_SECRET_TOKEN}`,
                    },
                    timeout: 10000, // 10s timeout
                }
            );

            const responseData = response.data;

            logger.info('Prompt.cash payment created successfully', {
                tx_id: params.tx_id,
                payment_id: responseData.payment.id,
                address: responseData.payment.address,
                status: responseData.payment.status,
            });

            return response.data;
        }, params.tx_id);
    }

    /**
     * Get a payment from Prompt.cash
     */
    static async getPayment(tx_id: string, force = false): Promise<IPromptCashPayment> {
        if (!PROMPT_CASH_SECRET_TOKEN) {
            throw new Error('PROMPT_CASH_SECRET_TOKEN is not configured');
        }

        return this.withRetry(async () => {
            const url = `${PROMPT_CASH_API_BASE_URL}/get-payment/${tx_id}${force ? '?force=true' : ''}`;

            const response = await axios.get<{ data: IPromptCashPayment }>(url, {
                headers: {
                    Authorization: PROMPT_CASH_SECRET_TOKEN,
                },
                timeout: 5000, // 5s timeout
            });

            return response.data.data;
        }, tx_id);
    }

    /**
     * Generate signature for API request
     * SHA256(Secret + token=...&tx_id=...&amount=...&currency=...&time=123)
     */
    private static generateSignature(params: Record<string, any>): string {
        if (!PROMPT_CASH_SECRET_TOKEN) {
            throw new Error('PROMPT_CASH_SECRET_TOKEN is required for signature generation');
        }

        // Build parameter string in the exact order required
        const paramString = `token=${params.token}&tx_id=${params.tx_id}&amount=${params.amount}&currency=${params.currency}&desc=${params.desc}&callback=${params.callback}&return=${params.return}&expiration=${params.expiration}&confirm=${params.confirm}&time=${params.time}`;

        // Concatenate secret with params
        const signatureInput = PROMPT_CASH_SECRET_TOKEN + paramString;

        // Generate SHA256 hash
        const signature = crypto.createHash('sha256').update(signatureInput).digest('hex');

        return signature;
    }

    /**
     * Verify webhook signature
     * Checks if the callback request includes Your-Secret-Account-Token 
     * under the JSON root key "token" to prevent spoofing
     */
    static verifyWebhookSignature(payload: any): boolean {
        if (!PROMPT_CASH_SECRET_TOKEN) {
            logger.warn('PROMPT_CASH_SECRET_TOKEN not configured, skipping webhook verification');
            return false; // Reject if no secret configured (security fix)
        }

        // Check if the token in the payload matches our secret token (root level)
        const tokenInPayload = payload.token;

        if (!tokenInPayload) {
            logger.error('Missing token in webhook payload');
            return false;
        }

        const isValid = tokenInPayload === PROMPT_CASH_SECRET_TOKEN;

        if (!isValid) {
            logger.error('Token mismatch in webhook payload', {
                receivedToken: tokenInPayload?.substring(0, 10) + '...',
                expectedToken: PROMPT_CASH_SECRET_TOKEN?.substring(0, 10) + '...'
            });
        }

        return isValid;
    }

    /**
     * Map Prompt.cash status to our PaymentStatusEnum
     */
    static mapStatus(promptStatus: PromptCashStatusEnum): 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED' {
        switch (promptStatus) {
            case PromptCashStatusEnum.PENDING:
            case PromptCashStatusEnum.CONFIRMING:
            case PromptCashStatusEnum.HOLD:
                return 'PENDING';
            case PromptCashStatusEnum.PAID:
                return 'CONFIRMED';
            case PromptCashStatusEnum.CANCELLED:
            case PromptCashStatusEnum.EXPIRED:
                return 'FAILED';
            case PromptCashStatusEnum.REFUNDED:
                return 'REFUNDED';
            default:
                return 'PENDING';
        }
    }
}
