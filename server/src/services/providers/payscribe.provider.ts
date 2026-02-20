import { config } from "@/config/config";
import logger from "@/utils/logger";
import axios from "axios";
import { IAirtimePurchaseParams, IDataPurchaseParams, IFulfillmentResult, IUtilityProvider } from "./base.provider";

const PAYSCRIBE_API_BASE_URL = config.payscribe.API_URL;
const apiKey = config.payscribe.API_KEY;

export class PayscribeProvider implements IUtilityProvider {
    name: 'PAYSCRIBE' = 'PAYSCRIBE';

    private async postRequest(endpoint: string, body: Record<string, any>) {
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };

        try {
            logger.info(`PayscribeProvider: Sending POST request to ${endpoint}`, { body });
            const response = await axios.post(`${PAYSCRIBE_API_BASE_URL}${endpoint}`, body, { headers });
            logger.info(`PayscribeProvider: Received response from ${endpoint}`, { response: response.data });
            return response.data;
        } catch (error: any) {
            logger.error('Payscribe Provider POST Error:', error.response?.data || error.message);
            throw error;
        }
    }

    private async getRequest(endpoint: string, params: Record<string, any>) {
        const headers = {
            'Authorization': `Bearer ${apiKey}`
        };

        try {
            const response = await axios.get(`${PAYSCRIBE_API_BASE_URL}${endpoint}`, { headers, params });
            return response.data;
        } catch (error: any) {
            logger.error('Payscribe Provider GET Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async purchaseAirtime(params: IAirtimePurchaseParams): Promise<IFulfillmentResult> {
        logger.info('PayscribeProvider: Purchasing airtime', { params });

        const body = {
            network: params.network.toLowerCase(),
            amount: params.amount,
            recipient: params.phoneNumber,
            ref: params.reference
        };

        try {
            const response = await this.postRequest('/airtime', body);

            const isSuccess = response.status === true;

            return {
                success: isSuccess,
                provider: this.name,
                providerTransactionId: response.message?.details?.trans_id,
                failureReason: isSuccess ? undefined : response.description || 'Transaction failed',
                amount: {
                    ngn: params.amount,
                    commission: response.message?.details?.discount,
                    totalCharged: response.message?.details?.total_charge,
                },
                rawResponse: response
            };
        } catch (error: any) {
            return {
                success: false,
                provider: this.name,
                failureReason: error.message,
                rawResponse: error.response?.data || error
            };
        }
    }

    async purchaseData(params: IDataPurchaseParams): Promise<IFulfillmentResult> {
        logger.info('PayscribeProvider: Purchasing data', { params });

        const body = {
            plan: params.planCode,
            recipient: params.phoneNumber,
            network: params.network.toLowerCase(),
            ref: params.reference
        };

        try {
            const response = await this.postRequest('/data/vend', body);
            const isSuccess = response.status === true;

            return {
                success: isSuccess,
                provider: this.name,
                providerTransactionId: response.message?.details?.trans_id,
                failureReason: isSuccess ? undefined : response.description || 'Transaction failed',
                amount: {
                    ngn: params.amount,
                    commission: response.message?.details?.discount,
                    totalCharged: response.message?.details?.total_charge,
                },
                rawResponse: response
            };
        } catch (error: any) {
            return {
                success: false,
                provider: this.name,
                failureReason: error.message,
                rawResponse: error.response?.data || error
            };
        }
    }

    async getDataPlans(network: string): Promise<any> {
        const endpoint = '/data/lookup';
        const params = { network: network.toLowerCase() };

        try {
            const response = await this.getRequest(endpoint, params);

            if (response.status === true) {
                const details = response.message?.details;
                let rawPlans = [];

                if (Array.isArray(details) && details.length > 0) {
                    rawPlans = details[0].plans || [];
                } else if (details && typeof details === 'object') {
                    rawPlans = details.plans || [];
                }

                return rawPlans.map((p: any) => ({
                    planCode: p.plan_code,
                    name: p.name,
                    amount: parseFloat(p.amount || p.variation_amount || '0'),
                    duration: p.duration || p.validity || ''
                }));
            }

            throw new Error(response.description || 'Failed to fetch data plans');
        } catch (error: any) {
            logger.error('Payscribe Provider getDataPlans Error:', error.response?.data || error.message);
            throw error;
        }
    }
}
