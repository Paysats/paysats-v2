/**
 * VtPass API Services
 */




import { config } from '@/config/config';
import logger from '@/utils/logger';
import { NetworkProviderEnum } from "@shared/types/network-provider.types"
import axios from 'axios';


export interface IAirtimePurchaseParams {
    serviceId: NetworkProviderEnum;
    phoneNumber: string;
    amount: number;
}

const VT_PASS_API_BASE_URL = config.vtpass.API_URL;
const apiKey = config.vtpass.API_KEY;
const secretKey = config.vtpass.SECRET_KEY;
const publicKey = config.vtpass.PUBLIC_KEY;

export class VtPassService {
    /**
     * Generate a request ID >> Used for VTPASS API requests
     * @param suffix - The suffix to add to the request ID
     * @returns The request ID
     */
    private static async generateRequestId(
        suffix?: string | undefined
    ) {

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const hour = today.getHours();
        const minute = today.getMinutes();
        return `${year}${month}${day}${hour}${minute}${suffix ?? ''}`;
    }

    /**
     * POST request helper
     * @param endpoint - The API endpoint
     * @param body - The request body
     * @returns The response from the VtPass API
     */
    private static async postRequest(
        endpoint: string,
        body: Record<string, any>
    ) {


        const headers = {
            'api-key': apiKey!,
            'secret-key': secretKey!
        };

        try {
            const response = await axios.post(`${VT_PASS_API_BASE_URL}${endpoint}`, body, { headers });
            console.dir(response, { depth: null });

            return response.data;
        } catch (error) {
            console.error('Error making POST request:', error);
            throw error;
        }
    }

    /**
     * GET request helper
     * @param  endpoint- The API endpoint
     * @param params - The query parameters
     * @returns The response from the VtPass API
     */
    private static async getRequest(
        endpoint: string,
        params: Record<string, any>
    ) {

        const headers = {
            'api-key': apiKey!,
            'public-key': publicKey!
        };

        try {
            const response = await axios.get(`${VT_PASS_API_BASE_URL}${endpoint}`, { headers, params });
            logger.info('VtPass GET Response:', response);
            return response.data;
        } catch (error) {
            logger.error('Error making GET request:', error);
            throw error;
        }
    }

    /**
     * Purchase Airtime
     * @param params - The airtime purchase parameters
     * @returns The response from the VtPass API
     */
    static async purchaseAirtime(params: IAirtimePurchaseParams) {
        console.log("Purchasing airtime with params:", params);

        const requestId = await this.generateRequestId('AIRTIME');

        const body = {
            serviceID: params.serviceId,
            phone: params.phoneNumber,
            amount: params.amount,
            request_id: requestId
        };

        const response = await this.postRequest('/pay', body);
        if (response.content?.transactions?.status === 'failed') {
            throw new Error(`VtPass Airtime Purchase Failed: ${response?.response_description}`);
        }

        return response;


    }
}