import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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
    transactionId?: string;
    formData: PaymentFormData;
}

interface PaymentFlowContextType {
    currentStep: PaymentStep;
    paymentData: PaymentData | null;
    loading: boolean;
    error: string | null;

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

export const PaymentFlowProvider = ({ children }: { children: ReactNode }) => {
    const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStepsEnum.FORM);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
    };

    const value = {
        currentStep,
        paymentData,
        loading,
        error,
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
