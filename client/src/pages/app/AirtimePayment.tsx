import { AppLayout } from "@/layouts/AppLayout";
import { useState } from "react";
import { PaymentFlowProvider, PaymentStepsEnum, usePaymentFlow } from "@/contexts/PaymentFlowContext";
import type { PaymentData } from "@/contexts/PaymentFlowContext";
import { AirtimeForm } from "../../components/app/payment/AirtimeForm";
import { PaymentReview, PaymentQR, PaymentSuccess, ShareReceipt } from "@/components/app/payment";
import type { PaymentReviewData, PaymentQRData, PaymentSuccessData, ShareReceiptData } from "@/components/app/payment";

const AirtimeFlowContent = () => {
    const { currentStep, paymentData, setStep, setPaymentData, goToNextStep, resetFlow } = usePaymentFlow();

    const BCH_RATE = 208333; // todo: update mock data...

    const handleFormSubmit = (formData: any) => {
        const bchAmount = formData.amount / BCH_RATE;
        
        const payment: PaymentData = {
            serviceName: 'Airtime',
            serviceProvider: `${formData.network} Airtime`,
            amount: formData.amount,
            bchAmount,
            bchRate: BCH_RATE,
            paymentFor: `Airtime - ${formData.phoneNumber}`,
            formData,
        };

        setPaymentData(payment);
        setStep(PaymentStepsEnum.REVIEW);
    };

    const handleProceedToPayment = () => {
        
        if (paymentData) {
            const updatedPayment: PaymentData = {
                ...paymentData,
                bchAddress: 'qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a', // update mock addy
            };
            setPaymentData(updatedPayment);
        }
        goToNextStep();
    };

    const handlePaymentConfirmed = () => {
        // TODO: handle payment confirm... when backend ready
        goToNextStep();
    };

    const handleShareReceipt = () => {
        setStep(PaymentStepsEnum.SHARE);
    };

    const handleDownloadReceipt = () => {
        // TODO: implemnt receipt download logic
        console.log('Download receipt');
    };

    const handleDone = () => {
        resetFlow();
    };

    // step renderer logics...
    if (currentStep === PaymentStepsEnum.FORM || !paymentData) {
        return (
            <AirtimeForm handleContinue={handleFormSubmit} />
        );
    }

    if (currentStep === PaymentStepsEnum.REVIEW) {
        const reviewData: PaymentReviewData = {
            serviceName: paymentData.serviceName,
            amount: paymentData.amount,
            bchAmount: paymentData.bchAmount,
            bchRate: paymentData.bchRate,
            paymentFor: paymentData.paymentFor,
        };

        return (
            <AppLayout serviceTabs={false}>
                <PaymentReview 
                    data={reviewData}
                    onProceed={handleProceedToPayment}
                    onCancel={() => setStep('form')}
                />
            </AppLayout>
        );
    }

    if (currentStep === PaymentStepsEnum.PAYMENT) {
        const qrData: PaymentQRData = {
            bchAddress: paymentData.bchAddress || '',
            bchAmount: paymentData.bchAmount,
            amountUSD: paymentData.amount / 1650, // TODO: update to server
            paymentFor: paymentData.paymentFor,
        };

        // simulating payment detection after 5 seconds (for demo...)
        setTimeout(() => {
            handlePaymentConfirmed();
        }, 5000);

        return (
            <AppLayout serviceTabs={false}>
                <PaymentQR 
                    data={qrData}
                    onCancel={() => setStep('review')}
                />
            </AppLayout>
        );
    }

    if (currentStep === PaymentStepsEnum.SUCCESS) {
        const successData: PaymentSuccessData = {
            serviceName: paymentData.serviceName,
            title: "Airtime delivered 🚀",
            serviceProvider: paymentData.serviceProvider,
            amount: paymentData.amount,
            bchAmount: paymentData.bchAmount,
        };

        return (
            <AppLayout serviceTabs={false}>
                <PaymentSuccess 
                    data={successData}
                    onShare={handleShareReceipt}
                    onDownload={handleDownloadReceipt}
                    onClose={handleDone}
                />
            </AppLayout>
        );
    }

    if (currentStep === PaymentStepsEnum.SHARE) {
        const shareData: ShareReceiptData = {
            title: 'Just topped up my airtime with Bitcoin Cash ⚡',
            serviceProvider: paymentData.serviceProvider,
            amount: paymentData.amount,
            bchAmount: paymentData.bchAmount,
        };

        return (
            <AppLayout serviceTabs={false}>
                <ShareReceipt 
                    data={shareData}
                    onDownload={handleDownloadReceipt}
                />
            </AppLayout>
        );
    }

    return null;
};

export const AirtimePayment = () => {
    return (
        <PaymentFlowProvider>
            <AirtimeFlowContent />
        </PaymentFlowProvider>
    );
};

