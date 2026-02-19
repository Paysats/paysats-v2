import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    RefreshCw,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    Layers,
    Bitcoin
} from 'lucide-react';
import { dashService } from '@/api/services/dash.service'
import type { IDashboardStats } from '@/api/services/dash.service'
import { Button } from '@shared/ui/Button';
import { MotionDiv } from '@shared/ui/MotionComponents';
import { cn } from '@shared/utils/cn';
import { staggerContainerVariants, staggerItemVariants } from '@shared/config/animationConfig';

const StatCard: React.FC<{
    title: string;
    value: string | number;
    description: string;
    unit?: string;
    showDot?: boolean;
    index: number;
}> = ({ title, value, description, unit, showDot, index }) => (
    <MotionDiv
        variants={staggerItemVariants}
        className="flex flex-col space-y-4 group"
    >
        <div className="space-y-1">
            <h3 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.25em] group-hover:text-primary transition-colors duration-500">{title}</h3>
            <div className="flex items-baseline gap-2 flex-wrap min-h-[80px]">
                <span className="text-5xl md:text-7xl font-light text-foreground leading-none tracking-tightest">
                    {value}
                </span>
                {unit && (
                    <span className="text-xl md:text-2xl font-black text-primary/80 mb-1 tracking-tighter">
                        {unit}
                    </span>
                )}
                {showDot && (
                    <div className="w-3 h-3 rounded-full bg-primary mb-3 ml-1 animate-pulse shadow-[0_0_12px_rgba(51,194,121,0.4)]" />
                )}
            </div>
        </div>
        <div className="w-8 h-0.5 bg-border/20 rounded-full group-hover:w-12 group-hover:bg-primary/40 transition-all duration-700" />
        <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">
            {description}
        </p>
    </MotionDiv>
);

const DashDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<IDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('today');

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await dashService.getStats(range);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [range]);

    const ranges = [
        { id: 'today', label: 'TODAY' },
        { id: 'week', label: 'THIS WEEK' },
        { id: 'month', label: 'MONTH' },
        { id: 'year', label: 'YEAR' },
        { id: 'all', label: 'CUSTOM' }
    ];

    return (
        <MotionDiv
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
            className="min-h-screen flex flex-col pt-8 md:pt-12"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 px-4">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Operational Oversight</p>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tightest">
                        Intelligence Hub
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="flex bg-secondary/10 p-1.5 rounded-2xl border border-border/20 backdrop-blur-sm w-full sm:w-auto">
                        {ranges.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRange(r.id)}
                                className={cn(
                                    "flex-1 px-4 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all duration-500",
                                    range === r.id
                                        ? "bg-primary text-background shadow-lg shadow-primary/20 scale-105"
                                        : "text-muted-foreground/50 hover:text-foreground"
                                )}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 md:gap-y-32 grow px-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-6 animate-pulse">
                            <div className="space-y-2">
                                <div className="h-2 bg-secondary/50 rounded-full w-24"></div>
                                <div className="h-16 bg-secondary/20 rounded-2xl w-full"></div>
                            </div>
                            <div className="h-1 bg-secondary/10 rounded-full w-8"></div>
                            <div className="h-2 bg-secondary/10 rounded-full w-48"></div>
                        </div>
                    ))
                ) : (
                    <>
                        <StatCard
                            index={0}
                            title="Capital Throughput"
                            value={(stats?.totalBchVolume || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: (stats?.totalBchVolume && stats.totalBchVolume < 1) ? 8 : 2
                            })}
                            unit="BCH"
                            description="Real-time settlement volume across the ledger"
                        />
                        <StatCard
                            index={1}
                            title="Signal Confirmation"
                            value={(stats?.successfulTransactions || 0).toLocaleString()}
                            description="Successful cryptographic service execution signals"
                        />
                        <StatCard
                            index={2}
                            title="System Nodes"
                            value={stats?.activeServices || 0}
                            showDot
                            description="Operational infrastructure modules online"
                        />
                        <StatCard
                            index={3}
                            title="Fiat Conversion"
                            value={`₦${(stats?.revenueNgn || 0).toLocaleString()}`}
                            description="Aggregated NGN equivalency value protocol"
                        />
                    </>
                )}
            </div>

            <Button
                variant="outline"
                className="mt-20 mx-4 py-8 border-dashed border-2 hover:bg-primary/5 group"
                onClick={() => navigate('/ledger')}
            >
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Full Audit Sequence</span>
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
            </Button>

            {/* Minimalist Footer */}
            <footer className="mt-32 pb-12 px-4 border-t border-border/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">System Secure: Auth Protocol v2.4</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 font-mono tracking-tightest">
                        Runtime Signature: {stats ? 'LIVE_STREAM_ACTIVE' : 'FETCHING_DATA...'}
                    </span>
                </div>

                <div className="flex items-center gap-8">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20">
                        PAYSATS VAULT &copy; 2024
                    </span>
                </div>
            </footer>
        </MotionDiv>
    );
};

export default DashDashboard;
