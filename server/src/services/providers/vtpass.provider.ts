import { config } from "@/config/config";
import logger from "@/utils/logger";
import axios from "axios";
import { IAirtimePurchaseParams, IDataPurchaseParams, IFulfillmentResult, IUtilityProvider } from "./base.provider";

const VT_PASS_API_BASE_URL = config.vtpass.API_URL;
const apiKey = config.vtpass.API_KEY;
const secretKey = config.vtpass.SECRET_KEY;
const publicKey = config.vtpass.PUBLIC_KEY;

export class VtPassProvider implements IUtilityProvider {
    name: 'VTPASS' = 'VTPASS';

    private async generateRequestId() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const hour = today.getHours();
        const minute = today.getMinutes();
        const second = today.getSeconds();
        return `${year}${month}${day}${hour}${minute}${second}${Math.floor(Math.random() * 1000)}`;
    }

    private async postRequest(endpoint: string, body: Record<string, any>) {
        const headers = {
            'api-key': apiKey!,
            'secret-key': secretKey!
        };

        try {
            const response = await axios.post(`${VT_PASS_API_BASE_URL}${endpoint}`, body, { headers });
            return response.data;
        } catch (error: any) {
            logger.error('VtPass Provider POST Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async purchaseAirtime(params: IAirtimePurchaseParams): Promise<IFulfillmentResult> {
        logger.info('VtPassProvider: Purchasing airtime', { params });

        const requestId = await this.generateRequestId();

        const body = {
            serviceID: params.network.toLowerCase() + '-airtime', // vtpass uses network-airtime (e.g. mtn-airtime)
            phone: params.phoneNumber,
            amount: params.amount,
            request_id: requestId
        };

        // Note: VTpass serviceID mapping might need refinement based on network names
        // Mapping common names to vtpass service IDs
        const networkMap: Record<string, string> = {
            'mtn': 'mtn',
            'glo': 'glo',
            'airtel': 'airtel',
            '9mobile': '9mobile'
        };

        const serviceId = networkMap[params.network.toLowerCase()] || params.network.toLowerCase();
        body.serviceID = `${serviceId}-airtime`;

        try {
            const response = await this.postRequest('/pay', body);

            const isSuccess = response.code === '000' || response.content?.transactions?.status === 'delivered';

            return {
                success: isSuccess,
                provider: this.name,
                providerTransactionId: response.content?.transactions?.transactionId,
                providerRequestId: response.requestId || requestId,
                failureReason: isSuccess ? undefined : response.response_description || 'Transaction failed',
                amount: {
                    ngn: params.amount,
                    commission: response.content?.transactions?.commission,
                    totalCharged: response.content?.transactions?.total_amount,
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
        logger.info('VtPassProvider: Purchasing data', { params });

        const requestId = await this.generateRequestId();

        // VTpass data purchase implementation
        // This usually requires a variation_code which would be our planId
        const body = {
            serviceID: `${params.network.toLowerCase()}-data`,
            phone: params.phoneNumber,
            amount: params.amount,
            variation_code: params.planId,
            request_id: requestId
        };

        try {
            const response = await this.postRequest('/pay', body);
            const isSuccess = response.code === '000' || response.content?.transactions?.status === 'delivered';

            return {
                success: isSuccess,
                provider: this.name,
                providerTransactionId: response.content?.transactions?.transactionId,
                providerRequestId: response.requestId || requestId,
                failureReason: isSuccess ? undefined : response.response_description || 'Transaction failed',
                amount: {
                    ngn: params.amount,
                    commission: response.content?.transactions?.commission,
                    totalCharged: response.content?.transactions?.total_amount,
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
