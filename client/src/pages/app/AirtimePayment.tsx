import { AppLayout } from "@/layouts/AppLayout";
import { useState, useEffect } from "react";
import { PaymentFlowProvider, PaymentStepsEnum, usePaymentFlow } from "@/contexts/PaymentFlowContext";
import type { PaymentData } from "@/contexts/PaymentFlowContext";
import { AirtimeForm } from "../../components/app/payment/AirtimeForm";
import { PaymentReview, PaymentQR, PaymentSuccess, ShareReceipt } from "@/components/app/payment";
import type { PaymentReviewData, PaymentQRData, PaymentSuccessData, ShareReceiptData } from "@/components/app/payment";
import { transactionService } from "@/api/services/transaction.service";
import type { Transaction } from "@/api/services/transaction.service";
import { toast } from "react-next-toast";
import { isTransactionExpired, isTransactionFinal } from "@/utils/transaction";

const AirtimeFlowContent = () => {
    const { currentStep, paymentData, setStep, setPaymentData, goToNextStep, resetFlow, isRestoringSession } = usePaymentFlow();
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [pollingInterval, setPollingInterval] = useState<number | null>(null);
    const [sessionRestored, setSessionRestored] = useState<boolean>(false);

    // Restore transaction status when session is restored
    useEffect(() => {
        const checkRestoredTransaction = async () => {
            // Only run once when session is restored
            if (isRestoringSession || sessionRestored || !paymentData?.reference) {
                return;
            }

            try {
                console.log('Checking restored transaction status:', paymentData.reference);
                const txn = await transactionService.getTransaction(paymentData.reference);
                setTransaction(txn);

                // Check if transaction has expired
                if (isTransactionExpired(txn.createdAt)) {
                    toast.error('Transaction has expired. Please start a new transaction.');
                    resetFlow();
                    return;
                }

                // Check transaction status and update step accordingly
                if (txn.status === 'PENDING') {
                    // Still waiting for payment
                    toast.success('Session restored! Continue with your payment.');
                    if (currentStep === 'review') {
                        // User was on review page
                    } else if (currentStep === 'payment') {
                        // Resume polling
                        startPolling(paymentData.reference);
                    }
                } else if (txn.status === 'PAYMENT_CONFIRMED' || txn.status === 'PROCESSING') {
                    // Payment detected, ensure we're on payment or later step
                    toast.success('Payment detected! Processing your order...');
                    if (currentStep === 'review') {
                        setStep('payment');
                    }
                    startPolling(paymentData.reference);
                } else if (txn.status === 'SUCCESS') {
                    // Transaction completed successfully
                    toast.success('Your transaction was completed successfully!');
                    setStep('success');
                } else if (txn.status === 'FAILED' || txn.status === 'EXPIRED') {
                    // Transaction failed or expired - reset flow
                    toast.error(txn.failureReason || 'Transaction has failed. Please start a new transaction.');
                    resetFlow();
                    return;
                }

                setSessionRestored(true);
            } catch (error) {
                console.error('Error checking restored transaction:', error);
                toast.error('Failed to restore transaction. Starting fresh.');
                resetFlow();
            }
        };

        checkRestoredTransaction();
    }, [isRestoringSession, sessionRestored, paymentData?.reference, currentStep]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const handleFormSubmit = async (formData: any) => {
        setLoading(true);
        
        try {
            const result = await transactionService.createAirtimeTransaction({
                network: formData.network,
                phoneNumber: formData.phoneNumber,
                amount: Number(formData.amount),
            });
console.log('airtime transaction result ===> :', result);
            const bchAmount = result.transaction.amount.bch;
            const bchRate = result.transaction.amount.rate;
            
            // Store transaction result
            setTransaction(result as unknown as Transaction);
            
            const payment: PaymentData = {
                serviceName: 'Airtime',
                serviceProvider: `${formData.network} Airtime`,
                amount: formData.amount,
                bchAmount,
                bchRate,
                paymentFor: `Airtime - ${formData.phoneNumber}`,
                reference: result.transaction.reference,
                bchAddress: result.payment.address,
                qrUrl: result.payment.qrUrl,
                paymentLink: result.payment.paymentLink,
                formData,
            };

            setPaymentData(payment);
            setStep(PaymentStepsEnum.REVIEW);
            toast.success('Transaction created successfully!');
        } catch (error: any) {
            console.error('Error creating transaction:', error);
            toast.error(error?.response?.data?.message || 'Failed to create transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleProceedToPayment = () => {
        if (paymentData && paymentData.reference) {
            // Start polling for payment status
            startPolling(paymentData.reference);
        }
        goToNextStep();
    };

    const startPolling = (reference: string) => {
        // clear any existing polling interval
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        // poll every 3 secs
        const interval = setInterval(async () => {
            try {
                const txn = await transactionService.getTransaction(reference);
                setTransaction(txn);

                // check if trx has reached a final state
                if (isTransactionFinal(txn.status)) {
                    clearInterval(interval);
                    setPollingInterval(null);
                }

                // Check if payment is confirmed
                if (txn.status === 'PAYMENT_CONFIRMED' || txn.status === 'PROCESSING') {
                    // Payment detected, move to processing
                    if (currentStep === PaymentStepsEnum.PAYMENT) {
                        toast.success('Payment detected! Processing your order...');
                        goToNextStep();
                    }
                }

                // Check if service is fulfilled
                if (txn.status === 'SUCCESS') {
                    if (currentStep !== PaymentStepsEnum.SUCCESS) {
                        toast.success('Airtime delivered successfully! 🚀');
                        setStep(PaymentStepsEnum.SUCCESS);
                    }
                }

                // Check if transaction failed
                if (txn.status === 'FAILED' || txn.status === 'EXPIRED') {
                    toast.error(txn.failureReason || 'Transaction failed. Please try again.');
                    // Don't reset automatically - let user see the error
                }
            } catch (error) {
                console.error('Error polling transaction:', error);
            }
        }, 3000); // Poll every 3 seconds

        setPollingInterval(interval);

        // Stop polling after 15 minutes (transaction expiry time)
        setTimeout(() => {
            if (interval) {
                clearInterval(interval);
                setPollingInterval(null);
                toast.warning('Transaction has expired. Please start a new transaction.');
            }
        }, 15 * 60 * 1000);
    };

    const handlePaymentConfirmed = () => {
    };

    const handleShareReceipt = () => {
        setStep(PaymentStepsEnum.SHARE);
    };

    const handleDownloadReceipt = () => {
        // TODO: implemnt receipt download logic
        console.log('Download receipt');
    };

    const handleDone = () => {
        // Clear polling if active
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
        resetFlow();
        setTransaction(null);
    };

    // show loading state while restoring session
    if (isRestoringSession) {
        return (
            <AppLayout serviceTabs={false}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px' }}>Restoring your session...</div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // step renderer logics...
    if (currentStep === PaymentStepsEnum.FORM || !paymentData) {
        return (
            <AirtimeForm handleContinue={handleFormSubmit} loading={loading} />
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
            amountUSD: paymentData.amount / 1650, // Approximate USD value
            paymentFor: paymentData.paymentFor,
        };

        

        return (
            <AppLayout serviceTabs={false}>
                <PaymentQR 
                    data={qrData}
                    qrUrl={paymentData.qrUrl}
                    paymentLink={paymentData.paymentLink}
                    onCancel={() => {
                        if (pollingInterval) {
                            clearInterval(pollingInterval);
                            setPollingInterval(null);
                        }
                        setStep('review');
                    }}
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
            transactionReference: paymentData.reference,
            date: transaction?.paidAt ? new Date(transaction.paidAt).toLocaleString() : new Date().toLocaleString(),
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
        <PaymentFlowProvider serviceType="airtime">
            <AirtimeFlowContent />
        </PaymentFlowProvider>
    );
};

