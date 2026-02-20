import { AppLayout } from "@/layouts/AppLayout";
import { useState, useEffect } from "react";
import { PaymentFlowProvider, PaymentStepsEnum, usePaymentFlow } from "@/contexts/PaymentFlowContext";
import type { PaymentData } from "@/contexts/PaymentFlowContext";
import { Data as DataForm } from "../components/payment/DataForm";
import { PaymentReview, PaymentQR, PaymentSuccess, PaymentFailure, ShareReceipt, Receipt } from "@/components/payment";
import type { PaymentReviewData, PaymentQRData, PaymentSuccessData, PaymentFailureData, ShareReceiptData, ReceiptData } from "@/components/payment";
import { transactionService } from "@/api/services/transaction.service";
import type { Transaction } from "@/api/services/transaction.service";
import { toast } from "react-next-toast";
import { isTransactionExpired } from "@shared/utils/transaction";
import { toPng } from 'html-to-image';
import { createRoot } from 'react-dom/client';
import { usePaymentSocket } from "@/hooks/usePaymentSocket";
import { rateService } from "@/api/services/rate.service";

const DataFlowContent = () => {
    const { currentStep, paymentData, setStep, setPaymentData, goToNextStep, resetFlow, isRestoringSession } = usePaymentFlow();
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [sessionRestored, setSessionRestored] = useState<boolean>(false);
    const [rates, setRates] = useState<{ ngn: number; usd: number }>({ ngn: 200000, usd: 140 });

    // socket integration
    usePaymentSocket(paymentData?.reference, (data: any) => {
        if (data && data.status) {
            handleTransactionUpdate({ status: data.status, ...data });
        }
    });

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const rateData = await rateService.getBCHRate();
                setRates({ ngn: rateData.rate, usd: (rateData as any).usdRate || 140 });
            } catch (error) {
                console.error("Error fetching BCH rate:", error);
            }
        };
        fetchRate();
    }, []);

    const handleTransactionUpdate = async (update: any) => {
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
                    toast.success('Data delivered successfully! 🚀');
                    setStep(PaymentStepsEnum.SUCCESS);
                }
            } else if (txn.status === 'FAILED' || txn.status === 'EXPIRED') {
                if (txn.paidAt) {
                    setStep(PaymentStepsEnum.FAILURE);
                } else {
                    toast.error(txn.failureReason || 'Transaction failed.');
                    resetFlow();
                }
            }
        } catch (e) {
            console.error("Error updating transaction from socket event", e);
        }
    };

    // restore transaction status when session is restored
    useEffect(() => {
        const checkRestoredTransaction = async () => {
            if (isRestoringSession || sessionRestored || !paymentData?.reference) {
                return;
            }

            try {
                console.log('Checking restored transaction status:', paymentData.reference);
                const txn = await transactionService.getTransaction(paymentData.reference);
                setTransaction(txn);

                if (isTransactionExpired(txn.createdAt)) {
                    toast.error('Transaction has expired. Please start a new transaction.');
                    resetFlow();
                    return;
                }

                if (txn.status === 'PENDING' || txn.status === 'PAYMENT_PENDING' || txn.status === 'INITIATED') {
                    toast.success('Session restored! Continue with your payment.');
                } else if (txn.status === 'PAYMENT_CONFIRMED' || txn.status === 'PROCESSING') {
                    toast.success('Payment detected! Processing your order...');
                    if (currentStep === 'review' || currentStep === 'form') {
                        setStep('payment');
                    }
                } else if (txn.status === 'SUCCESS') {
                    toast.success('Your transaction was completed successfully!');
                    setStep('success');
                } else if (txn.status === 'FAILED' || txn.status === 'EXPIRED') {
                    if (txn.paidAt) {
                        setStep(PaymentStepsEnum.FAILURE);
                    } else {
                        toast.error(txn.failureReason || 'Transaction has failed. Please start a new transaction.');
                        resetFlow();
                        return;
                    }
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

    const handleFormSubmit = async (formData: any) => {
        setLoading(true);

        try {
            const result = await transactionService.createDataTransaction({
                network: formData.network,
                phoneNumber: formData.phoneNumber,
                planCode: formData.plan.planCode,
                amount: Number(formData.amount),
            });

            const bchAmount = result.transaction.amount.bch;
            const bchRate = result.transaction.amount.rate;

            setTransaction(result as unknown as Transaction);

            const payment: PaymentData = {
                serviceName: 'Data',
                serviceProvider: `${formData.network} Data`,
                amount: formData.amount,
                bchAmount,
                bchRate,
                paymentFor: `Data - ${formData.phoneNumber} (${formData.plan?.name || 'Plan'})`,
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
        goToNextStep();
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
                title: 'Data Purchase',
                serviceName: 'Data',
                serviceProvider: paymentData.serviceProvider?.toUpperCase() || 'N/A',
                amount: paymentData.amount,
                bchAmount: paymentData.bchAmount,
                transactionReference: paymentData.reference,
                date: transaction?.paidAt ? new Date(transaction.paidAt).toLocaleString() : new Date().toLocaleString(),
                phoneNumber: paymentData.formData?.phoneNumber,
            };

            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '-9999px';
            document.body.appendChild(container);

            const root = createRoot(container);
            root.render(<Receipt data={receiptData} />);

            await new Promise(resolve => setTimeout(resolve, 100));

            const receiptElement = container.querySelector('#receipt-container') as HTMLElement;

            if (!receiptElement) {
                throw new Error('Receipt element not found');
            }

            const dataUrl = await toPng(receiptElement, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });

            const link = document.createElement('a');
            link.download = `paysats-receipt-${paymentData.reference || Date.now()}.png`;
            link.href = dataUrl;
            link.click();

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

    if (isRestoringSession) {
        return (
            <AppLayout serviceTabs={false}>
                <div className="flex items-center justify-center h-[400px]">
                    <div className="text-center">
                        <div className="mb-4">Restoring your session...</div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (currentStep === PaymentStepsEnum.FORM || !paymentData) {
        return <DataForm handleContinue={handleFormSubmit} loading={loading} />;
    }

    if (currentStep === PaymentStepsEnum.REVIEW) {
        const reviewData: PaymentReviewData = {
            serviceName: paymentData.serviceName,
            amount: paymentData.amount,
            bchAmount: paymentData.bchAmount,
            bchRate: paymentData.bchRate,
            paymentFor: paymentData.paymentFor,
            expiryMinutes: 10,
        };

        return (
            <AppLayout serviceTabs={false}>
                <PaymentReview
                    data={reviewData}
                    onProceed={handleProceedToPayment}
                    onCancel={() => setStep(PaymentStepsEnum.FORM)}
                    loading={loading}
                />
            </AppLayout>
        );
    }

    if (currentStep === PaymentStepsEnum.PAYMENT) {
        if (!paymentData || !paymentData.bchAddress) return null;

        const qrData: PaymentQRData = {
            bchAddress: paymentData.bchAddress,
            bchAmount: paymentData.bchAmount,
            amountUSD: paymentData.amount / 1650,
            paymentFor: paymentData.paymentFor,
        };

        return (
            <AppLayout serviceTabs={false}>
                <PaymentQR
                    data={qrData}
                    qrUrl={paymentData.qrUrl}
                    paymentLink={paymentData.paymentLink}
                    onManualCheck={async () => {
                        if (!paymentData.reference) return;
                        try {
                            toast.info('Checking transaction status...');
                            const txn = await transactionService.getTransaction(paymentData.reference, true);
                            setTransaction(txn);

                            if (txn.status === 'PAYMENT_PENDING' || txn.status === 'INITIATED') {
                                toast.info('Payment not detected yet. Please wait a moment.');
                            } else if (txn.status === 'PAYMENT_CONFIRMED' || txn.status === 'PROCESSING') {
                                toast.success('Payment detected! Processing your order...');
                                goToNextStep();
                            } else if (txn.status === 'SUCCESS') {
                                toast.success('Data delivered successfully!');
                                setStep(PaymentStepsEnum.SUCCESS);
                            } else {
                                toast.error('Transaction status: ' + txn.status);
                            }
                        } catch (error) {
                            console.error('Error manually checking status:', error);
                            toast.error('Failed to check status. Please try again.');
                        }
                    }}
                    onCancel={() => setStep(PaymentStepsEnum.REVIEW)}
                />
            </AppLayout>
        );
    }

    if (currentStep === PaymentStepsEnum.FAILURE) {
        const failureData: PaymentFailureData = {
            serviceName: paymentData.serviceName,
            title: "Fulfillment issue",
            serviceProvider: paymentData.serviceProvider,
            amount: paymentData.amount,
            bchAmount: paymentData.bchAmount,
            transactionReference: paymentData.reference,
            failureReason: transaction?.failureReason || 'Provider timeout',
            paidAt: transaction?.paidAt ? new Date(transaction.paidAt).toLocaleString() : undefined,
        };

        return (
            <AppLayout serviceTabs={false}>
                <PaymentFailure
                    data={failureData}
                    onClose={handleDone}
                    onRetry={async () => {
                        if (!paymentData.reference) return;
                        try {
                            toast.info('Retrying fulfillment...');
                            const txn = await transactionService.retryFulfillment(paymentData.reference);
                            setTransaction(txn);
                            if (txn.status === 'SUCCESS') {
                                toast.success('Data delivered successfully! 🚀');
                                setStep(PaymentStepsEnum.SUCCESS);
                            } else {
                                toast.error(txn.failureReason || 'Fulfillment still failing. Support has been notified.');
                            }
                        } catch (error) {
                            console.error('Error retrying fulfillment:', error);
                            toast.error('Failed to retry fulfillment. Please contact support.');
                        }
                    }}
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
        <PaymentFlowProvider serviceType="data">
            <DataFlowContent />
        </PaymentFlowProvider>
    );
};

export default DataWithPaymentFlow;
