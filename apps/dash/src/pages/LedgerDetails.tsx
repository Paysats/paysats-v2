import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dashService } from '@/api/services/dash.service'
import type { IAdminTransaction } from '@/api/services/dash.service'
import { TransactionStatusEnum } from '@shared/types';
import { format } from 'date-fns';
import {
    ChevronLeft,
    Copy,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    ExternalLink,
    Terminal,
    Shield,
    Bitcoin
} from 'lucide-react';
import { toast } from 'react-next-toast';
import { Card } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { cn } from '@shared/utils/cn';
import { MotionDiv } from '@shared/ui/MotionComponents';
import { staggerContainerVariants } from '@shared/config/animationConfig';

const DetailRow: React.FC<{ label: string; value: React.ReactNode; subValue?: string; copyable?: boolean }> = ({ label, value, subValue, copyable }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between py-6 border-b border-border/10 last:border-0 hover:bg-primary/5 px-6 rounded-2xl transition-all group gap-2 sm:gap-4">
        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center shrink-0">{label}</span>
        <div className="flex items-center gap-3 sm:text-right">
            <div className="min-w-0 flex-1 sm:flex-initial text-left sm:text-right">
                <p className="text-sm md:text-base font-black text-foreground tracking-tight truncate">{value}</p>
                {subValue && <p className="text-[10px] text-primary/70 font-bold tracking-widest uppercase mt-1">{subValue}</p>}
            </div>
            {copyable && value && (
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(String(value));
                        toast.success('Dossier Reference Copied');
                    }}
                    className="p-2.5 bg-secondary/30 hover:bg-primary/10 rounded-xl text-muted-foreground hover:text-primary transition-all shrink-0"
                >
                    <Copy size={16} />
                </button>
            )}
        </div>
    </div>
);

const LedgerDetails: React.FC = () => {
    const { reference } = useParams<{ reference: string }>();
    const [tx, setTx] = useState<IAdminTransaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRetrying, setIsRetrying] = useState(false);

    const fetchDetails = async () => {
        if (!reference) return;
        setLoading(true);
        try {
            const data = await dashService.getTransactionDetails(reference);
            setTx(data);
        } catch (error) {
            console.error('Failed to fetch transaction details:', error);
            toast.error('Could not load transaction dossier');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [reference]);

    const handleRetry = async () => {
        if (!reference) return;
        setIsRetrying(true);
        try {
            await dashService.retryFulfillment(reference);
            toast.success('Manual fulfillment triggered successfully');
            fetchDetails();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Manual bypass failed');
        } finally {
            setIsRetrying(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 opacity-50">
            <RefreshCw size={32} className="animate-spin text-primary" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Deciphering Matrix Record...</p>
        </div>
    );

    if (!tx) return (
        <div className="text-center py-32 bg-secondary/5 rounded-3xl border border-destructive/20 relative overflow-hidden px-4">
            <div className="absolute top-0 inset-x-0 h-1 bg-destructive/20" />
            <AlertCircle size={64} className="mx-auto text-destructive/40 mb-8 animate-pulse" />
            <h2 className="text-3xl font-black text-foreground tracking-tightest uppercase">Record Nullified</h2>
            <p className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest mt-4">The record dossier # {reference} does not exist in the centralized ledger.</p>
            <Link to="/ledger" className="inline-block mt-12">
                <Button variant="outline" className="px-12 py-8 border-destructive/20! hover:bg-destructive/5!">Return to Audit Log</Button>
            </Link>
        </div>
    );

    return (
        <MotionDiv
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
            className="max-w-7xl mx-auto space-y-16 md:space-y-24 pb-20 pt-8"
        >
            {/* Nav & Title */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 px-4">
                <div className="space-y-6">
                    <Link to="/ledger" className="inline-flex items-center gap-3 text-primary/60 hover:text-primary transition-all group">
                        <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
                            <ChevronLeft size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Auditor Portal</span>
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tightest leading-none">Record Dossier</h1>
                        <div className="flex items-center gap-3 pt-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-[10px] font-black font-mono text-muted-foreground/60 uppercase tracking-widest">{tx.reference}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {tx.paidAt && tx.status === TransactionStatusEnum.FAILED && (
                        <Button
                            variant="filled"
                            onClick={handleRetry}
                            loading={isRetrying}
                            icon={<RefreshCw size={18} />}
                            className="bg-primary hover:bg-primary/90 text-background h-16 px-8 rounded-2xl shadow-xl shadow-primary/20"
                        >
                            Trigger Protocol Bypass
                        </Button>
                    )}
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-border/20! hover:bg-secondary/10!">
                        Generate Receipt Archive
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 px-4">
                {/* Main Intel */}
                <div className="lg:col-span-8 space-y-12 md:space-y-16">
                    <Card variant="default" className="overflow-hidden p-0! bg-secondary/5 border-border/10!">
                        <div className="bg-secondary/10 px-8 py-6 border-b border-border/10 flex items-center justify-between flex-wrap gap-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary/40" />
                                Core Transaction Matrix
                            </h3>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                                tx.status === TransactionStatusEnum.SUCCESS
                                    ? "bg-primary/5 text-primary border-primary/20"
                                    : "bg-destructive/5 text-destructive border-destructive/20"
                            )}>
                                <Shield size={12} className="shrink-0" />
                                {tx.status === TransactionStatusEnum.SUCCESS ? 'VERIFIED_SETTLEMENT' : tx.status}
                            </div>
                        </div>
                        <div className="p-4 md:p-6 space-y-1">
                            <DetailRow label="System Node" value={tx.serviceType.toUpperCase().replace('_', ' ')} />
                            <DetailRow
                                label="Protocol Yield"
                                value={`₦${tx.amount.ngn.toLocaleString()}`}
                                subValue={`${tx.amount.bch.toFixed(8)} BCH`}
                            />
                            <DetailRow label="Conversion Anchor" value={`₦${tx.amount.rate.toLocaleString()} / BCH`} />
                            <DetailRow label="Epoch Initiation" value={format(new Date(tx.createdAt), 'MMM d, yyyy @ HH:mm:ss')} />
                            {tx.paidAt && <DetailRow label="Signal Detection" value={format(new Date(tx.paidAt), 'MMM d, yyyy @ HH:mm:ss')} />}
                            {tx.fulfilledAt && <DetailRow label="Fulfillment Exit" value={format(new Date(tx.fulfilledAt), 'MMM d, yyyy @ HH:mm:ss')} />}
                        </div>
                    </Card>

                    <Card variant="default" className="overflow-hidden p-0! bg-secondary/5 border-border/10!">
                        <div className="bg-secondary/10 px-8 py-6 border-b border-border/10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3">
                                <Terminal size={16} className="text-primary/70" />
                                Sequence Audit Trail
                            </h3>
                        </div>
                        <div className="p-8 md:p-12 space-y-10">
                            <div className="relative space-y-12">
                                {/* Vertical line */}
                                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-linear-to-b from-primary/30 via-border/10 to-transparent" />

                                <div className="flex gap-8 relative group">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 z-10 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <p className="text-[11px] font-black text-foreground uppercase tracking-wider">Handshake Initialized</p>
                                        <p className="text-xs text-muted-foreground/60 leading-relaxed font-medium">Socket server established immutable connection for real-time tracking sequence.</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-primary/40" />
                                            <p className="text-[10px] font-black text-primary/40 font-mono uppercase tracking-widest">{format(new Date(tx.createdAt), 'HH:mm:ss')}</p>
                                        </div>
                                    </div>
                                </div>

                                {tx.paidAt && (
                                    <div className="flex gap-8 relative group">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 z-10 group-hover:scale-110 transition-transform">
                                            <Bitcoin size={16} />
                                        </div>
                                        <div className="space-y-2 pt-1">
                                            <p className="text-[11px] font-black text-primary uppercase tracking-wider underline decoration-primary/20 underline-offset-4">Cryptographic Confirmation</p>
                                            <p className="text-xs text-muted-foreground/60 leading-relaxed font-medium">BCH detected at designated matrix address. System transitioned to automated fulfillment mode.</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary/40" />
                                                <p className="text-[10px] font-black text-primary/40 font-mono uppercase tracking-widest">{format(new Date(tx.paidAt), 'HH:mm:ss')}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {tx.status === TransactionStatusEnum.FAILED && tx.failureReason && (
                                    <div className="flex gap-8 relative group">
                                        <div className="w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shrink-0 z-10 group-hover:scale-110 transition-transform">
                                            <XCircle size={16} />
                                        </div>
                                        <div className="space-y-2 pt-1">
                                            <p className="text-[11px] font-black text-destructive uppercase tracking-wider">Protocol Breakdown</p>
                                            <Card className="bg-destructive/5 border-destructive/10! p-4">
                                                <p className="text-xs text-destructive/80 font-mono leading-relaxed">{tx.failureReason}</p>
                                            </Card>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-destructive/40" />
                                                <p className="text-[10px] font-black text-destructive/40 font-mono uppercase tracking-widest">{format(new Date(tx.updatedAt), 'HH:mm:ss')}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-12 md:space-y-16">
                    <Card className="space-y-10 p-8 md:p-10 bg-secondary/5 border-border/10!">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Network Context</h4>
                            <div className="w-12 h-1 bg-primary/20 rounded-full" />
                        </div>

                        <div className="space-y-10">
                            <div>
                                <label className="block text-[9px] font-black text-muted-foreground/40 uppercase mb-4 tracking-[0.2em]">Settlement Node</label>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black uppercase text-base shadow-xl shadow-primary/5 group-hover:bg-primary group-hover:text-background transition-all duration-500">
                                        {tx.serviceMeta?.network?.substring(0, 2) || 'UT'}
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-foreground uppercase tracking-tight leading-none mb-1">{tx.serviceMeta?.network || 'Utility Cluster'}</p>
                                        <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">Protocol Verified</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border/10">
                                <label className="block text-[9px] font-black text-muted-foreground/40 uppercase mb-4 tracking-[0.2em]">Target Intel</label>
                                <p className="text-xl md:text-2xl font-black text-foreground tracking-tight font-mono break-all">{tx.serviceMeta?.phone || tx.serviceMeta?.account || 'SYSTEM_INTERNAL'}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <Shield size={12} className="text-primary/60" />
                                    <p className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest">Verified Target Node</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="space-y-10 p-8 md:p-10 bg-primary/5 border-primary/10! relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />

                        <div className="space-y-3 relative">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Ledger Connectivity</h4>
                            <div className="w-12 h-1 bg-primary/40 rounded-full" />
                        </div>

                        <div className="space-y-8 relative">
                            <div className="p-6 rounded-2xl bg-background/50 border border-primary/10 backdrop-blur-md space-y-4">
                                <label className="block text-[9px] font-black text-primary uppercase tracking-widest opacity-60">Payment Hash</label>
                                <div className="flex items-center justify-between gap-4 min-w-0">
                                    <p className="text-[11px] font-mono text-muted-foreground truncate grow">{tx.paymentId || 'NO_HASH_RECORDED'}</p>
                                    <ExternalLink size={16} className="text-primary cursor-pointer hover:scale-120 transition-all shrink-0" />
                                </div>
                            </div>
                            <Button variant="outline" fullWidth className="h-16 rounded-2xl border-primary/20! bg-primary/5! hover:bg-primary! hover:text-background! font-black text-[10px] uppercase tracking-[0.3em] transition-all"
                                icon={<Bitcoin size={18} />}
                            >
                                Explorer Handshake
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </MotionDiv>
    );
};

export default LedgerDetails;
