import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getFromStorage, setInStorage, removeFromStorage, STORAGE_KEYS } from '@/utils/storage';

export type PaymentStep = 'form' | 'review' | 'payment' | 'success' | 'share';
export enum PaymentStepsEnum {
    FORM = 'form',
    REVIEW = 'review',
    PAYMENT = 'payment',
    SUCCESS = 'success',
    SHARE = 'share',
}

export interface PaymentFormData {
    network?: string;
    phoneNumber?: string;
    amount?: number;
    dataPlan?: string;
    [key: string]: any;
}

export interface PaymentData {
    serviceName: string;
    serviceProvider: string;
    amount: number;
    bchAmount: number;
    bchRate: number;
    bchAddress?: string;
    paymentFor: string;
    reference?: string; // trx reference from backend
    qrUrl?: string; // QR code URL from Prompt.cash
    paymentLink?: string; // Payment link from Prompt.cash
    transactionId?: string;
    formData: PaymentFormData;
}

interface PersistedPaymentState {
    step: PaymentStep;
    data: PaymentData;
    timestamp: number;
    serviceType: string; // 'airtime', 'data', etc.
}

interface PaymentFlowContextType {
    currentStep: PaymentStep;
    paymentData: PaymentData | null;
    loading: boolean;
    error: string | null;
    isRestoringSession: boolean;

    // Actions
    setStep: (step: PaymentStep) => void;
    setPaymentData: (data: PaymentData) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetFlow: () => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
}

const PaymentFlowContext = createContext<PaymentFlowContextType | undefined>(undefined);

const stepOrder: PaymentStep[] = ['form', 'review', 'payment', 'success', 'share'];

// Session expiry time (15 minutes)
const SESSION_EXPIRY_MS = 15 * 60 * 1000;

// Get storage key based on service type
const getStorageKey = (serviceType: string): string => {
    const keyMap: Record<string, string> = {
        'airtime': STORAGE_KEYS.PAYMENT_SESSION_AIRTIME,
        'data': STORAGE_KEYS.PAYMENT_SESSION_DATA,
        'bills': STORAGE_KEYS.PAYMENT_SESSION_BILLS,
    };
    return keyMap[serviceType] || `paysats_payment_session_${serviceType}`;
};

export const PaymentFlowProvider = ({ children, serviceType = 'airtime' }: { children: ReactNode; serviceType?: string }) => {
    const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStepsEnum.FORM);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isRestoringSession, setIsRestoringSession] = useState<boolean>(true);

    const storageKey = getStorageKey(serviceType);

    // restore session on mount
    useEffect(() => {
        const restoreSession = () => {
            try {
                const savedState = getFromStorage<PersistedPaymentState | null>(storageKey, null);
                if (!savedState) {
                    setIsRestoringSession(false);
                    return;
                }
                
                // check if session has expired
                const now = Date.now();
                const age = now - savedState.timestamp;
                
                if (age > SESSION_EXPIRY_MS) {
                    console.log('Payment session expired, clearing...');
                    removeFromStorage(storageKey);
                    setIsRestoringSession(false);
                    return;
                }

                setCurrentStep(savedState.step);
                setPaymentData(savedState.data);
                setIsRestoringSession(false);
            } catch (error) {
                console.error('Error restoring payment session:', error);
                removeFromStorage(storageKey);
                setIsRestoringSession(false);
            }
        };

        restoreSession();
    }, [storageKey]);

    // persist state whenever it changes
    useEffect(() => {
        // Don't persist if we're on the form step or if there's no payment data
        if (currentStep === PaymentStepsEnum.FORM || !paymentData) {
            removeFromStorage(storageKey);
            return;
        }

        // Don't persist if we're on success/share (transaction is complete)
        if (currentStep === PaymentStepsEnum.SUCCESS || currentStep === PaymentStepsEnum.SHARE) {
            removeFromStorage(storageKey);
            return;
        }

        const state: PersistedPaymentState = {
            step: currentStep,
            data: paymentData,
            timestamp: Date.now(),
            serviceType,
        };

        setInStorage(storageKey, state);
        console.log('Payment session saved:', state);
    }, [currentStep, paymentData, storageKey, serviceType]);

    const goToNextStep = () => {
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const goToPreviousStep = () => {
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };

    const resetFlow = () => {
        setCurrentStep('form');
        setPaymentData(null);
        setLoading(false);
        setError(null);
        // Clear persisted session
        removeFromStorage(storageKey);
    };

    const value = {
        currentStep,
        paymentData,
        loading,
        error,
        isRestoringSession,
        setStep: setCurrentStep,
        setPaymentData,
        setLoading,
        setError,
        resetFlow,
        goToNextStep,
        goToPreviousStep,
    }

    return (
        <PaymentFlowContext.Provider
            value={
                value
            }
        >
            {children}
        </PaymentFlowContext.Provider>
    );
};

export const usePaymentFlow = () => {
    const context = useContext(PaymentFlowContext);
    if (!context) {
        throw new Error('usePaymentFlow must be used within a PaymentFlowProvider');
    }
    return context;
};
