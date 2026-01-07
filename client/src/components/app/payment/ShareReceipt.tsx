import { Download, Copy, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MotionDiv } from "@/components/ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";
import { useState } from "react";
import { Divider } from "antd";
import { formatNGN } from "@/utils";
import { toast } from "react-next-toast";

export interface ShareReceiptData {
    title: string;
    serviceProvider: string;
    amount: number;
    bchAmount: number;
    icon?: React.ReactNode;
}

interface ShareReceiptProps {
    data: ShareReceiptData;
    onDownload?: () => void;
}

export const ShareReceipt = ({ data, onDownload }: ShareReceiptProps) => {
    const { title, serviceProvider, amount, bchAmount, icon } = data;
    const [copied, setCopied] = useState<boolean>(false);

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
                        onClick={onDownload}
                        icon={<Download size={18} />}
                        className="flex-1"
                    >
                        Download Image
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
