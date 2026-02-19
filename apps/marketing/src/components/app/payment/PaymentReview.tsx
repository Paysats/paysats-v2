import { Bitcoin, Clock, X } from "lucide-react";
import { Button } from "@shared-ui/Button";
import { MotionDiv } from "@shared-ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";
import { useState, useEffect } from "react";

export interface PaymentReviewData {
    serviceName: string;
    amount: number;
    bchAmount: number;
    bchRate: number;
    paymentFor: string;
    expiryMinutes?: number;
}

interface PaymentReviewProps {
    data: PaymentReviewData;
    onProceed: () => void;
    onCancel?: () => void;
    loading?: boolean;
}

export const PaymentReview = ({ data, onProceed, onCancel, loading = false }: PaymentReviewProps) => {
    const { serviceName, amount, bchAmount, bchRate, paymentFor, expiryMinutes = 5 } = data;

    const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60); // convert to seconds

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <MotionDiv
            className="flex flex-col items-center justify-center h-full gap-6 py-8 px-4 max-w-md mx-auto"
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
        >


            <MotionDiv
                variants={staggerItemVariants}
                className="flex flex-col items-center gap-2 w-full"
            >
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    Total to Pay
                </p>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                    ₦{amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
                <p className="text-lg text-muted-foreground flex items-center gap-1">
                    ≈ {bchAmount.toFixed(4)} BCH
                </p>
            </MotionDiv>

            {/* details */}
            <MotionDiv
                variants={staggerItemVariants}
                className="flex flex-col items-center gap-1 text-muted-foreground"
            >
                <p className="text-sm">
                    Rate: 1 BCH = ₦ {bchRate.toLocaleString('en-NG')}
                </p>
                <p className="text-sm">
                    Payment for: <span className="font-semibold text-foreground">{paymentFor}</span>
                </p>
            </MotionDiv>

            <MotionDiv
                variants={staggerItemVariants}
                className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg"
            >
                <Clock size={16} />
                <span className="text-sm font-medium">
                    Rate expires in {formatTime(timeLeft)}
                </span>
            </MotionDiv>

            <MotionDiv variants={staggerItemVariants} className="w-full">
                <Button
                    fullWidth
                    onClick={onProceed}
                    loading={loading}
                    disabled={timeLeft === 0}
                >
                    <span className="flex items-center gap-2">
                        Proceed to Payment
                        <span>→</span>
                    </span>
                </Button>
            </MotionDiv>

            {onCancel && (
                <MotionDiv variants={staggerItemVariants}>
                    <Button
                        variant="link"
                        onClick={onCancel}
                        className="!text-muted-foreground hover:text-foreground flex items-center"

                    >
                        <X size={14} />
                        Cancel
                    </Button>
                </MotionDiv>
            )}
        </MotionDiv>
    );
};
