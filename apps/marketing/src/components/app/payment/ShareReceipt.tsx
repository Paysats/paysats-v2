import { Download, Copy, Zap } from "lucide-react";
import { Button } from "@shared-ui/Button";
import { MotionDiv } from "@shared-ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";
import { useState } from "react";
import { Divider } from "antd";
import { formatNGN } from "@shared/utils";
import { toast } from "react-next-toast";

export interface ShareReceiptData {
    title: string;
    serviceProvider: string;
    amount: number;
    bchAmount: number;
    icon?: React.ReactNode;
    transactionReference?: string;
    date?: string;
    phoneNumber?: string;
}

interface ShareReceiptProps {
    data: ShareReceiptData;
    onDownload?: () => void | Promise<void>;
}

export const ShareReceipt = ({ data, onDownload }: ShareReceiptProps) => {
    const { title, serviceProvider, amount, bchAmount } = data;
    const [copied, setCopied] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const handleDownload = async () => {
        if (!onDownload) return;

        setDownloading(true);
        try {
            await onDownload();
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <MotionDiv
            className="flex h-full flex-col items-center justify-center gap-6 py-8 px-6 max-w-md mx-auto bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-2xl"
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
        >
            <MotionDiv
                variants={staggerItemVariants}
                className="flex flex-col items-center gap-3"
            >
                <h1 className="text-4xl font-bold text-foreground">
                    {title}
                </h1>
            </MotionDiv>

            <MotionDiv
                variants={staggerItemVariants}
                className="flex flex-col items-start gap-2 w-full"
            >
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">
                        {formatNGN(amount)}
                    </span>
                </div>
            </MotionDiv>

            {/* Details */}
            <MotionDiv
                variants={staggerItemVariants}
                className="flex flex-col gap-2 w-full text-left"
            >
                <div className="flex justify-between">
                    <span className="text-foreground font-semibold">{serviceProvider}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">{bchAmount.toFixed(4)} BCH</span>
                </div>
            </MotionDiv>


            <MotionDiv
                variants={staggerItemVariants}
            >

                <Divider />
                <div
                    className="flex flex-wrap items-center gap-2 mt-4"

                >

                    <span className="text-primary font-bold text-lg">paysats.io</span>
                    <span className="text-muted-foreground text-sm">
                        Your everyday with Bitcoin Cash
                    </span>
                </div>
            </MotionDiv>

            <MotionDiv
                variants={staggerItemVariants}
                className="flex gap-3 w-full mt-2"
            >
                {onDownload && (
                    <Button
                        variant="default"
                        fullWidth
                        onClick={handleDownload}
                        loading={downloading}
                        icon={<Download size={18} />}
                        className="flex-1"
                    >
                        {downloading ? 'Generating...' : 'Download Image'}
                    </Button>
                )}
                <Button
                    variant="secondary"
                    fullWidth
                    onClick={copyLink}
                    icon={<Copy size={18} />}
                    className="flex-1"
                >
                    {copied ? 'Copied!' : 'Copy Link'}
                </Button>
            </MotionDiv>
            <MotionDiv variants={staggerItemVariants} className="w-full">
                <a href="/app">
                    <Button
                        fullWidth
                        size="sm"
                        className="rounded-xl!"
                    >
                        Done
                    </Button>
                </a>
            </MotionDiv>
        </MotionDiv>
    );
};
