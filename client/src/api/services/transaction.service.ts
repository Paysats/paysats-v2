import api from '../api';

export interface CreateAirtimeTransactionRequest {
    network: string;
    phoneNumber: string;
    amount: number;
}

export interface CreateAirtimeTransactionResponse {
    transaction: {
        reference: string;
        serviceType: string;
        amount: {
            ngn: number;
            bch: number;
            rate: number;
        };
        status: string;
    };
    payment: {
        address: string;
        amountBCH: number;
        qrUrl: string;
        paymentLink: string;
    };
}

export interface Transaction {
    reference: string;
    serviceType: string;
    provider: string;
    amount: {
        ngn: number;
        bch: number;
        rate: number;
    };
    serviceMeta: {
        phone: string;
        network: string;
        planId?: string;
    };
    status: string;
    paymentId?: any;
    fulfillmentId?: any;
    paidAt?: string;
    fulfilledAt?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create airtime purchase transaction
 */
export const createAirtimeTransaction = async (
    data: CreateAirtimeTransactionRequest
): Promise<CreateAirtimeTransactionResponse> => {
    const response = await api.post<{ data: CreateAirtimeTransactionResponse} >(
        '/payments/airtime',
        data
    );
    return response.data.data;
};

/**
 * Get transaction by reference
 */
export const getTransaction = async (reference: string): Promise<Transaction> => {
    const response = await api.get<{ data: Transaction }>(`/payments/transaction/${reference}`);
    return response.data.data;
};

/**
 * Poll transaction status
 * Checks transaction status every interval until completed or max attempts reached
 */
export const pollTransactionStatus = async (
    reference: string,
    onUpdate: (transaction: Transaction) => void,
    options: {
        interval?: number; // milliseconds between polls
        maxAttempts?: number;
    } = {}
): Promise<Transaction> => {
    const { interval = 3000, maxAttempts = 60 } = options; // Default: 3 seconds, max 3 minutes
    
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
        const poll = async () => {
            try {
                attempts++;
                const transaction = await getTransaction(reference);
                
                // Call update callback
                onUpdate(transaction);
                
                // Check if transaction is in final state
                const finalStates = ['SUCCESS', 'FAILED', 'CANCELLED'];
                if (finalStates.includes(transaction.status)) {
                    resolve(transaction);
                    return;
                }
                
                // Check if max attempts reached
                if (attempts >= maxAttempts) {
                    reject(new Error('Transaction polling timeout'));
                    return;
                }
                
                // Schedule next poll
                setTimeout(poll, interval);
            } catch (error) {
                reject(error);
            }
        };
        
        // Start polling
        poll();
    });
};

export const transactionService = {
    createAirtimeTransaction,
    getTransaction,
    pollTransactionStatus,
};
