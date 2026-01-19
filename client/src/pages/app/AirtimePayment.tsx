import { AppLayout } from "@/layouts/AppLayout";
import { useState, useEffect } from "react";
import { PaymentFlowProvider, PaymentStepsEnum, usePaymentFlow } from "@/contexts/PaymentFlowContext";
import type { PaymentData } from "@/contexts/PaymentFlowContext";
import { AirtimeForm } from "../../components/app/payment/AirtimeForm";
import { PaymentReview, PaymentQR, PaymentSuccess, ShareReceipt, Receipt } from "@/components/app/payment";
import type { PaymentReviewData, PaymentQRData, PaymentSuccessData, ShareReceiptData, ReceiptData } from "@/components/app/payment";
import { transactionService } from "@/api/services/transaction.service";
import type { Transaction } from "@/api/services/transaction.service";
import { toast } from "react-next-toast";
import { isTransactionExpired, isTransactionFinal } from "@/utils/transaction";
import { toPng } from 'html-to-image';
import { createRoot } from 'react-dom/client';
import { usePaymentSocket } from "@/hooks/usePaymentSocket";


const AirtimeFlowContent = () => {
    const { currentStep, paymentData, setStep, setPaymentData, goToNextStep, resetFlow, isRestoringSession } = usePaymentFlow();
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    // const [pollingInterval, setPollingInterval] = useState<number | null>(null); // Removed polling
    const [sessionRestored, setSessionRestored] = useState<boolean>(false);

    // Socket integration
    usePaymentSocket(paymentData?.reference, (data: any) => {
        // Handle socket update
        if (data && data.status) {
            handleTransactionUpdate({ status: data.status, ...data });
        }
    });

    const handleTransactionUpdate = async (update: any) => {
        // Fetch full transaction to be safe/canonical, or use update data if sufficient
        // For now, let's fetch to ensure we have latest structure
        if (!paymentData?.reference) return;

        try {
            const txn = await transactionService.getTransaction(paymentData.reference);
            setTransaction(txn);

            if (txn.status === 'PAYMENT_CONFIRMED' || txn.status === 'PROCESSING') {
                if (currentStep === PaymentStepsEnum.PAYMENT) {
                    toast.success('Payment detected! Processing your order...');
                    goToNextStep();
                }
            } else if (txn.status === 'SUCCESS') {
                if (currentStep !== PaymentStepsEnum.SUCCESS) {
                    toast.success('Airtime delivered successfully! 🚀');
                    setStep(PaymentStepsEnum.SUCCESS);
                }
            } else if (txn.status === 'FAILED' || txn.status === 'EXPIRED') {
                toast.error(txn.failureReason || 'Transaction failed.');
            }
        } catch (e) {
            console.error("Error updating transaction from socket event", e);
        }
    };

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
                    // socket connection start point...
                } else if (txn.status === 'PAYMENT_CONFIRMED' || txn.status === 'PROCESSING') {
                    // Payment detected, ensure we're on payment or later step
                    toast.success('Payment detected! Processing your order...');
                    if (currentStep === 'review') {
                        setStep('payment');
                    }
                    // Socket handles subsequent updates
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

    // Cleanup polling on unmount - no longer needed as socket hook handles cleanup
    // useEffect(() => {
    //     return () => {
    //         if (pollingInterval) {
    //             clearInterval(pollingInterval);
    //         }
    //     };
    // }, [pollingInterval]);

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
        // no polling to start
        goToNextStep();
    };


    const handlePaymentConfirmed = () => {
    };

    const handleShareReceipt = () => {
        setStep(PaymentStepsEnum.SHARE);
    };

    const handleDownloadReceipt = async () => {
        if (!paymentData) {
            toast.error('No payment data available');
            return;
        }

        try {
            toast.info('Generating receipt...');

            const receiptData: ReceiptData = {
                title: 'Airtime Purchase',
                serviceName: 'Airtime',
                serviceProvider: paymentData.serviceProvider?.toUpperCase() || 'N/A',
                amount: paymentData.amount,
                bchAmount: paymentData.bchAmount,
                transactionReference: paymentData.reference,
                date: transaction?.paidAt ? new Date(transaction.paidAt).toLocaleString() : new Date().toLocaleString(),
                phoneNumber: paymentData.formData?.phoneNumber,
            };

            // create temp container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '-9999px';
            document.body.appendChild(container);

            // render the receipt component
            const root = createRoot(container);
            root.render(<Receipt data={receiptData} />);

            // wait for render
            await new Promise(resolve => setTimeout(resolve, 100));

            const receiptElement = container.querySelector('#receipt-container') as HTMLElement;

            if (!receiptElement) {
                throw new Error('Receipt element not found');
            }

            // Generate image
            const dataUrl = await toPng(receiptElement, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });

            const link = document.createElement('a');
            link.download = `paysats-receipt-${paymentData.reference || Date.now()}.png`;
            link.href = dataUrl;
            link.click();

            // Cleanup
            root.unmount();
            document.body.removeChild(container);

            toast.success('Receipt downloaded successfully!');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast.error('Failed to download receipt. Please try again.');
        }
    };

    const handleDone = () => {
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
            expiryMinutes: 5, // Custom expiration time (prompt.cash default is 30)
        };

        return (
            <AppLayout serviceTabs={false}>
                <PaymentReview
                    data={reviewData}
                    onProceed={handleProceedToPayment}
                    onCancel={() => setStep('form')}
                    loading={loading}
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
                    onManualCheck={async () => {
                        // Force refresh transaction status
                        if (!paymentData.reference) return;

                        const txn = await transactionService.getTransaction(paymentData.reference);
                        setTransaction(txn);

                        if (txn.status === 'PENDING') {
                            toast.info('Payment not detected yet. Please wait a moment.');
                        } else if (txn.status === 'PAYMENT_CONFIRMED' || txn.status === 'PROCESSING') {
                            toast.success('Payment detected! Processing your order...');
                        } else if (txn.status === 'SUCCESS') {
                            toast.success('Airtime delivered successfully!');
                            setStep(PaymentStepsEnum.SUCCESS);
                        } else {
                            toast.error('Transaction status: ' + txn.status);
                        }
                    }}
                    onCancel={() => {
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
            serviceProvider: paymentData.serviceProvider?.toUpperCase(),
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
            serviceProvider: paymentData.serviceProvider?.toUpperCase(),
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

