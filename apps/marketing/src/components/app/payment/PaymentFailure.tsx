import { AlertTriangle, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@shared-ui/Button";
import { MotionDiv } from "@shared-ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";
import { formatNGN } from "@shared/utils";

export interface PaymentFailureData {
    title: string;
    serviceName: string;
    serviceProvider: string;
    amount: number;
    bchAmount: number;
    transactionReference?: string;
    failureReason?: string;
    paidAt?: string;
}

interface PaymentFailureProps {
    data: PaymentFailureData;
    onContactSupport?: () => void;
    onRetry?: () => void;
    onClose?: () => void;
}

export const PaymentFailure = ({ data, onContactSupport, onRetry, onClose }: PaymentFailureProps) => {
    const { serviceProvider, amount, bchAmount, title, failureReason, transactionReference } = data;

    const handleSupportClick = () => {
        if (onContactSupport) {
            onContactSupport();
        } else {
            // Default support link logic
            const message = `Hello Paysats Support, my transaction ${transactionReference} failed but I have already paid. Please help!`;
            window.open(`https://wa.me/2348068375557?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    return (
        <MotionDiv
            className="h-full flex flex-col items-center justify-center gap-6 max-w-md mx-auto min-h-[60vh]"
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
        >
            <MotionDiv
                variants={staggerItemVariants}
                className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center"
            >
                <div className="w-20 h-20 rounded-full bg-destructive flex items-center justify-center">
                    <AlertTriangle className="text-white" size={48} strokeWidth={3} />
                </div>
            </MotionDiv>

            {/* title + message */}
            <MotionDiv
                variants={staggerItemVariants}
                className="flex flex-col items-center gap-2"
            >
                <h2 className="text-3xl font-bold text-foreground text-center">
                    {title}
                </h2>
                <p className="text-destructive font-medium text-center">
                    Payment Received, but Fulfillment Failed
                </p>
                <p className="text-muted-foreground text-sm text-center px-4">
                    Your BCH has been confirmed, but there was an issue delivering the service. Our team has been notified.
                </p>
            </MotionDiv>

            {/* trx details... */}
            <MotionDiv
                variants={staggerItemVariants}
                className="w-full bg-secondary/30 rounded-lg py-6 px-4 flex flex-col gap-4 border border-destructive/20"
            >
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-foreground">{transactionReference}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-semibold text-foreground">{serviceProvider}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-semibold text-foreground">{bchAmount?.toFixed(6)} BCH ({formatNGN(amount)})</span>
                </div>
                {failureReason && (
                    <div className="mt-2 pt-2 border-t border-destructive/10">
                        <p className="text-xs text-muted-foreground mb-1">Reason:</p>
                        <p className="text-xs text-destructive font-medium line-clamp-2">{failureReason}</p>
                    </div>
                )}
            </MotionDiv>

            <MotionDiv
                variants={staggerItemVariants}
                className="flex flex-col gap-3 w-full"
            >
                <Button
                    fullWidth
                    size="lg"
                    onClick={handleSupportClick}
                    icon={<MessageCircle size={20} />}
                    className="rounded-xl! bg-primary!"
                >
                    Contact Support
                </Button>

                {onRetry && (
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onRetry}
                        icon={<RefreshCw size={18} className="text-primary!" />}
                        className="rounded-xl!"
                    >
                        Try Fulfilling Again
                    </Button>
                )}
            </MotionDiv>

            <MotionDiv variants={staggerItemVariants} className="mt-4">
                <p className="text-xs text-muted-foreground">
                    Don't worry, your funds are safe with <span className="text-primary font-semibold">Paysats</span>
                </p>
            </MotionDiv>

            {onClose && (
                <MotionDiv variants={staggerItemVariants} className="w-full">
                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </MotionDiv>
            )}
        </MotionDiv>
    );
};
