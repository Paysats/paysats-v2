import { Copy, X, Loader2 } from "lucide-react";
import { Button } from "@shared-ui/Button";
import { MotionDiv } from "@shared-ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants, fadeInVariants } from "@/config/animationConfig";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-next-toast";

export interface PaymentQRData {
    bchAddress: string;
    bchAmount: number;
    amountUSD: number;
    paymentFor: string;
}

interface PaymentQRProps {
    data: PaymentQRData;
    qrUrl?: string; // QR code URL from API
    paymentLink?: string; // Payment link from API
    onCancel?: () => void;
    onManualCheck?: () => Promise<void>; // Manual status check callback
    loading?: boolean;
}

export const PaymentQR = ({ data, qrUrl, paymentLink, onCancel, onManualCheck, loading = false }: PaymentQRProps) => {
    const { bchAddress, bchAmount, amountUSD, paymentFor } = data;
    const [copied, setCopied] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bchAddress);
            setCopied(true);
            toast.success('Address copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy address');
        }
    };

    const handleManualCheck = async () => {
        if (!onManualCheck) return;
        
        setChecking(true);
        try {
            await onManualCheck();
        } catch (error) {
            toast.error('Failed to check payment status');
        } finally {
            setChecking(false);
        }
    };

    // truncating address for display
    const truncatedAddress = `${bchAddress.slice(0, 10)}...${bchAddress.slice(-8)}`;

    return (
        <MotionDiv
            className="h-full flex flex-col items-center justify-center gap-6 py-8 px-4 max-w-md mx-auto"
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
        >
            <MotionDiv variants={staggerItemVariants} className="text-center">
                <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                    Paying <span className="font-semibold text-foreground">{paymentFor}</span>
                </p>
            </MotionDiv>

            {/* QR Code */}
            <MotionDiv 
                variants={fadeInVariants}
                className="p-6 bg-white rounded-2xl shadow-lg border-4 border-primary"
            >
                <div className="bg-primary/5 p-4 rounded-xl">
                    {qrUrl ? (
                        // Use QR image from Prompt.cash API
                        <img 
                            src={qrUrl} 
                            alt="Payment QR Code" 
                            className="w-50 h-50"
                        />
                    ) : (
                        // Fallback to generated QR code
                        <QRCode
                            value={`bitcoincash:${bchAddress}?amount=${bchAmount}`}
                            size={200}
                            level="H"
                            className="w-full h-auto"
                        />
                    )}
                </div>
            </MotionDiv>

            <MotionDiv 
                variants={staggerItemVariants}
                className="flex flex-col items-center gap-1"
            >
                <h2 className="text-4xl font-bold text-foreground">
                    {bchAmount.toFixed(4)} BCH
                </h2>
                <p className="text-muted-foreground">
                    ≈ ${amountUSD.toFixed(2)} USD
                </p>
            </MotionDiv>

            <MotionDiv 
                variants={staggerItemVariants}
                className="flex items-center gap-2 bg-secondary/50 px-4 py-3 rounded-lg w-full justify-between"
            >
                <span className="text-sm font-mono text-foreground truncate">
                    {truncatedAddress}
                </span>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className="shrink-0"
                    icon={<Copy size={16} />}
                >
                    {copied ? 'Copied!' : ''}
                </Button>
            </MotionDiv>

            {/* waiting stats */}
            <MotionDiv 
                variants={staggerItemVariants}
                className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-lg"
            >
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm font-medium">
                    WAITING FOR PAYMENT...
                </span>
            </MotionDiv>

            {/* Payment Link Button */}
            <MotionDiv variants={staggerItemVariants} className="w-full">
                <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                        // Create proper BCH URI with amount
                        const bchUri = `bitcoincash:${bchAddress}?amount=${bchAmount}`;
                        window.location.href = bchUri;
                    }}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                    Open in Bitcoin Wallet
                </Button>
            </MotionDiv>

            {/* Manual Check Button */}
            {onManualCheck && (
                <MotionDiv variants={staggerItemVariants} className="w-full">
                    <Button
                        fullWidth
                        variant="ghost"
                        onClick={handleManualCheck}
                        disabled={checking}
                        className="text-sm"
                        loading={checking}
                    >
                        {checking ? (
                            'Checking...'
                        ) : (
                            'Already Paid? Check Status'
                        )}
                    </Button>
                </MotionDiv>
            )}

            {onCancel && (
                <MotionDiv variants={staggerItemVariants} className="mt-2">
                    <Button 
                        variant="ghost"
                        onClick={onCancel}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                        icon={<X size={16} />}
                    >
                        Cancel Transaction
                    </Button>
                </MotionDiv>
            )}
        </MotionDiv>
    );
};
