import api from '../index';
import { ServiceTypeEnum, TransactionStatusEnum } from '@shared/types';

export interface IDashboardStats {
    totalBchVolume: number;
    successfulTransactions: number;
    activeServices: number;
    revenueNgn: number;
}

export interface IAdminTransaction {
    _id: string;
    reference: string;
    paymentId?: string;
    amount: {
        bch: number;
        ngn: number;
        rate: number;
    };
    status: TransactionStatusEnum;
    serviceType: ServiceTypeEnum;
    serviceMeta: {
        phone?: string;
        account?: string;
        network?: string;
        provider?: string;
        [key: string]: any;
    };
    failureReason?: string;
    paidAt?: string;
    fulfilledAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ISettings {
    _id: string;
    rates: {
        bchNgn: number;
        lastUpdated: string;
    };
    services: {
        airtime: boolean;
        data: boolean;
        electricity: boolean;
        cable_tv: boolean;
        [key: string]: boolean;
    };
}

export const dashService = {
    login: async (credentials: any) => {
        return api.post('/login', credentials);
    },

    getStats: async (range: string = 'today'): Promise<IDashboardStats> => {
        const response = await api.get('/stats', { params: { range } });
        return (response as any).data;
    },

    getTransactions: async (params: any): Promise<{ data: IAdminTransaction[], meta: any }> => {
        const response = await api.get('/transactions', { params });
        return (response as any).data;
    },

    getTransactionDetails: async (reference: string): Promise<IAdminTransaction> => {
        const response = await api.get(`/transactions/${reference}`);
        return (response as any).data;
    },

    retryFulfillment: async (reference: string) => {
        const response = await api.post(`/transactions/${reference}/retry`);
        return (response as any).data;
    },

    getSettings: async (): Promise<ISettings> => {
        const response = await api.get('/settings');
        return (response as any).data;
    },

    toggleService: async (serviceType: string, enabled: boolean): Promise<ISettings> => {
        const response = await api.post(`/services/${serviceType}/toggle`, { enabled });
        return (response as any).data;
    },

    updateRate: async (rate?: number): Promise<ISettings> => {
        const response = await api.post('/rates/update', { rate });
        return (response as any).data;
    },

    getMarketRate: async (): Promise<{ rate: number }> => {
        const response = await api.get('/rates/bch');
        return (response as any).data;
    }
};
