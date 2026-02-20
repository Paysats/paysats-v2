export interface IAirtimePurchaseParams {
    network: string;
    phoneNumber: string;
    amount: number;
    reference: string;
}

export interface IDataPurchaseParams {
    network: string;
    phoneNumber: string;
    planCode: string;
    amount: number;
    reference: string;
}

export interface IFulfillmentResult {
    success: boolean;
    provider: 'VTPASS' | 'PAYSCRIBE';
    providerTransactionId?: string;
    providerRequestId?: string;
    failureReason?: string;
    amount?: {
        ngn: number;
        commission?: number;
        totalCharged?: number;
    };
    rawResponse: any;
}

export interface IUtilityProvider {
    name: 'VTPASS' | 'PAYSCRIBE';
    purchaseAirtime(params: IAirtimePurchaseParams): Promise<IFulfillmentResult>;
    purchaseData(params: IDataPurchaseParams): Promise<IFulfillmentResult>;
    getDataPlans(network: string): Promise<any>;
}
