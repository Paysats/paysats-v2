import { Check, Download, Share2 } from "lucide-react";
import { Button } from "@shared-ui/Button";
import { MotionDiv } from "@shared-ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";
import { formatNGN } from "@shared/utils";

export interface PaymentSuccessData {
    title: string;
    serviceName: string;
    serviceProvider: string;
    amount: number;
    bchAmount: number;
    transactionId?: string;
    transactionReference?: string;
    date?: string;
}

interface PaymentSuccessProps {
    data: PaymentSuccessData;
    onShare?: () => void;
    onDownload?: () => void;
    onClose?: () => void;
}

export const PaymentSuccess = ({ data, onShare, onDownload, onClose }: PaymentSuccessProps) => {
    const { serviceProvider, amount, bchAmount, title } = data;

    return (
        <MotionDiv
            className="h-full flex flex-col items-center justify-center gap-6 max-w-md mx-auto min-h-[60vh]"
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
        >
            <MotionDiv
                variants={staggerItemVariants}
                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
            >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <Check className="text-white" size={48} strokeWidth={3} />
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
                <p className="text-muted-foreground text-center">
                    Paid with Bitcoin Cash in seconds
                </p>
            </MotionDiv>

            {/* trx details... */}
            <MotionDiv
                variants={staggerItemVariants}
                className="w-full bg-secondary/30 rounded-lg py-6 px-4 flex flex-col gap-4"
            >
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-semibold text-foreground">{serviceProvider}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold text-foreground">
                        {formatNGN(amount)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Crypto</span>
                    <span className="font-semibold text-foreground">
                        {bchAmount.toFixed(4)} BCH
                    </span>
                </div>
            </MotionDiv>

            <MotionDiv
                variants={staggerItemVariants}
                className="flex gap-3 w-full"
            >
                {onShare && (
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onShare}
                        icon={<Share2 size={18} className="text-primary!" />}
                        className="flex-1"
                    >
                        Share receipt
                    </Button>
                )}
                {onDownload && (
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onDownload}
                        icon={<Download size={18} className="text-primary!" />}
                        className="flex-1"
                    >
                        Download receipt
                    </Button>
                )}
            </MotionDiv>

            <MotionDiv variants={staggerItemVariants} className="mt-4">
                <p className="text-xs text-muted-foreground">
                    Powered by <span className="text-primary font-semibold">Paysats</span>
                </p>
            </MotionDiv>

            {onClose && (
                <MotionDiv variants={staggerItemVariants} className="w-full">
                    <Button
                        fullWidth
                        size="lg"
                        onClick={onClose}
                        className="rounded-xl!"
                    >
                        Done
                    </Button>
                </MotionDiv>
            )}
        </MotionDiv>
    );
};
