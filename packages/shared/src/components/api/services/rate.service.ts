import api from '../api';

export interface BCHRate {
    rate: number;
    currency: string;
    blockchain: string;
    timestamp: string;
}

export interface ConversionResult {
    ngn: number;
    bch: number;
    sats: number;
    rate: number;
    timestamp: string;
}

/**
 * Get current BCH to NGN exchange rate
 */
export const getBCHRate = async (): Promise<BCHRate> => {
    const response = await api.get<{ data: BCHRate }>('/rates/bch');
    return response.data.data;
};

/**
 * Convert NGN amount to BCH
 */
export const convertNGNToBCH = async (amount: number): Promise<ConversionResult> => {
    const response = await api.get<{ data: ConversionResult }>(`/rates/convert/ngn-to-bch?amount=${amount}`);

    return response.data.data;
};

/**
 * Convert BCH amount to NGN
 */
export const convertBCHToNGN = async (amount: number): Promise<ConversionResult> => {
    const response = await api.get<{ data: ConversionResult }>(`/rates/convert/bch-to-ngn?amount=${amount}`);
    return response.data.data;
};

export const rateService = {
    getBCHRate,
    convertNGNToBCH,
    convertBCHToNGN,
};
