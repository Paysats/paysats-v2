import { AppLayout } from "@/layouts/AppLayout";
import { PaymentFlowProvider, PaymentStepsEnum, usePaymentFlow } from "@/contexts/PaymentFlowContext";
import type { PaymentData } from "@/contexts/PaymentFlowContext";
import { Data as DataForm } from "../../components/app/payment/DataForm";
import { PaymentReview, PaymentQR, PaymentSuccess, ShareReceipt } from "@/components/app/payment";
import type { PaymentReviewData, PaymentQRData, PaymentSuccessData, ShareReceiptData } from "@/components/app/payment";

const DataFlowContent = () => {
    const { currentStep, paymentData, setStep, setPaymentData, goToNextStep, resetFlow } = usePaymentFlow();

    // Mock BCH rate (replace with real API call)
    const BCH_RATE = 208333; // 1 BCH = ₦208,333

    const handleFormSubmit = (formData: any) => {
        const bchAmount = formData.amount / BCH_RATE;
        
        const payment: PaymentData = {
            serviceName: 'Data',
            serviceProvider: `${formData.network} Data`,
            amount: formData.amount,
            bchAmount,
            bchRate: BCH_RATE,
            paymentFor: `Data - ${formData.phoneNumber} (${formData.dataPlan || 'Plan'})`,
            formData,
        };

        setPaymentData(payment);
        setStep(PaymentStepsEnum.REVIEW);
    };

    const handleProceedToPayment = () => {
        
        if (paymentData) {
            const updatedPayment: PaymentData = {
                ...paymentData,
                bchAddress: 'qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a', // todo: update mock addy
            };
            setPaymentData(updatedPayment);
        }
        goToNextStep();
    };

    const handlePaymentConfirmed = () => {
        goToNextStep();
    };

    const handleShareReceipt = () => {
        setStep(PaymentStepsEnum.SHARE);
    };

    const handleDownloadReceipt = () => {
        console.log('Download receipt');
    };

    const handleDone = () => {
        resetFlow();
    };

    // Render appropriate step
    if (currentStep === PaymentStepsEnum.FORM || !paymentData) {
        return <DataForm handleContinue={handleFormSubmit} />;
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
            amountUSD: paymentData.amount / 1650, // todo: update after backend ready...
            paymentFor: paymentData.paymentFor,
        };

        // demo... simulating...
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
            title: "Data delivered 🚀",
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
            title: `Just purchased ${paymentData.serviceName} with Bitcoin Cash ⚡`,
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

export const DataWithPaymentFlow = () => {
    return (
        <PaymentFlowProvider>
            <DataFlowContent />
        </PaymentFlowProvider>
    );
};

export default DataWithPaymentFlow;
