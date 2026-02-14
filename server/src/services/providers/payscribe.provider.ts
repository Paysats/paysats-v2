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
            'Authorization': `Bearer ${apiKey}`
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

            logger.info('PayscribeProvider: Airtime purchase result', {
                success: isSuccess,
                ref: params.reference,
                description: response.description
            });

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
            plan: params.planId,
            recipient: params.phoneNumber,
            network: params.network.toLowerCase(),
            ref: params.reference
        };

        try {
            const response = await this.postRequest('/data/vend', body);
            const isSuccess = response.status === true;

            logger.info('PayscribeProvider: Data purchase result', {
                success: isSuccess,
                ref: params.reference,
                description: response.description
            });

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
}
