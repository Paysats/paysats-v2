import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    Save,
    Shield,
    Zap,
    TrendingUp,
    AlertCircle,
    Activity
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { SERVICES } from '@shared/constants';
import { Button } from '@shared/ui/Button';
import { toast } from 'react-next-toast';
import { MotionDiv } from '@shared/ui/MotionComponents';
import { staggerContainerVariants, staggerItemVariants } from '@shared/config/animationConfig';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@shared/utils/cn';
import { Card } from '@shared/ui/Card';
import { dashService } from '@/api/services/dash.service';

const ServiceToggle: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}> = ({ title, description, icon: Icon, enabled, onToggle }) => (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/10 border border-border/20 hover:bg-secondary/20 transition-all group">
        <div className="flex items-center gap-6">
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                enabled ? "bg-primary text-background shadow-lg shadow-primary/20 scale-105" : "bg-card text-muted-foreground"
            )}>
                <Icon size={24} />
            </div>
            <div className="space-y-1">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">{title}</h3>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.05em]">{description}</p>
            </div>
        </div>

        <button
            onClick={() => onToggle(!enabled)}
            className={cn(
                "w-16 h-8 rounded-full transition-all duration-500 relative p-1",
                enabled ? "bg-primary" : "bg-muted/20"
            )}
        >
            <div className={cn(
                "absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-xl flex items-center justify-center",
                enabled ? "translate-x-7" : "translate-x-0"
            )}>
                {enabled && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
            </div>
        </button>
    </div>
);

const ControlCenter: React.FC = () => {
    const { settings, isLoading, fetchSettings, updateServiceStatus } = useSettingsStore();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [rateInput, setRateInput] = useState<string>('0');
    const [marketRate, setMarketRate] = useState<number | null>(null);

    useEffect(() => {
        fetchSettings();
        fetchMarketRate();
    }, []);

    const fetchMarketRate = async () => {
        try {
            const data = await dashService.getMarketRate();
            setMarketRate(data.rate);
        } catch (err) {
            console.error("Failed to fetch market rate", err);
        }
    };

    useEffect(() => {
        if (settings) {
            setRateInput(settings.rates.bchNgn.toString());
        }
    }, [settings]);

    const handleToggle = async (service: string, enabled: boolean) => {
        try {
            await updateServiceStatus(service, enabled);
            toast.success(`Protocol Updated: ${service.toUpperCase()} ${enabled ? 'ENABLED' : 'DISABLED'}`);
        } catch (error) {
            toast.error('Override Failed: Handshake rejected by server');
        }
    };

    const broadcastRate = async (rate?: number) => {
        setIsSaving(true);
        try {
            await dashService.updateRate(rate);
            await fetchSettings();
            await fetchMarketRate();
            if (!rate) {
                toast.success('Market Synced: Platform rate aligned with CoinGecko');
            } else {
                toast.success('Market Sync Successful: Global exchange rate updated');
            }
        } catch (error) {
            toast.error('Sync Error: Failed to broadcast new exchange rate');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveRate = async () => {
        const cleanRate = Number(rateInput.replace(/,/g, ''));
        if (isNaN(cleanRate) || cleanRate <= 0) {
            toast.error('Invalid Rate: Protocol requires positive numeric value');
            return;
        }
        await broadcastRate(cleanRate);
    };

    const handleAutoSync = async () => {
        await broadcastRate();
    }

    if (isLoading && !settings) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 opacity-50">
            <RefreshCw size={32} className="animate-spin text-primary" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Accessing System Settings...</p>
        </div>
    );

    if (!settings) return null;

    return (
        <MotionDiv
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
            className="space-y-16 md:space-y-24 pb-20 pt-8"
        >
            <div className="space-y-4 px-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Executive Override</p>
                <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tightest">
                    Control Matrix
                </h1>
                <p className="text-muted-foreground/60 text-[10px] md:text-sm font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
                    Central authority for platform-wide infrastructure parameters.
                    Broadcasts immediately across all active transaction nodes.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 px-4">
                <div className="space-y-10 md:space-y-12">
                    <div className="space-y-3">
                        <h2 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Operational Modules</h2>
                        <div className="w-12 h-1 bg-primary/20 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {SERVICES.map((service) => {
                            const Icon = (LucideIcons as any)[service.icon] || LucideIcons.HelpCircle;
                            const isEnabled = (settings.services as any)[service.id];

                            return (
                                <ServiceToggle
                                    key={service.id}
                                    title={service.name}
                                    description={service.description}
                                    icon={Icon}
                                    enabled={isEnabled}
                                    onToggle={(v) => handleToggle(service.id, v)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-10 md:space-y-12">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <h2 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Economic Constraints</h2>
                            {marketRate && (
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                                    <Activity size={12} className="text-primary animate-pulse" />
                                    <span className="text-[9px] font-black text-primary tracking-[0.1em] uppercase">CoinGecko: ₦{marketRate.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div className="w-12 h-1 bg-primary/20 rounded-full" />
                    </div>

                    <Card variant="default" className="p-8 md:p-10 space-y-10 bg-secondary/5 border-border/10!">
                        <div className="space-y-6">
                            <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.25em]">
                                Global Settlement Rate (BCH-NGN)
                            </label>
                            <div className="relative group">
                                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-light text-muted-foreground/40 group-focus-within:text-primary transition-colors">₦</span>
                                <input
                                    type="text"
                                    value={rateInput}
                                    onChange={(e) => setRateInput(e.target.value)}
                                    className="w-full h-24 md:h-32 bg-card border border-border/20 rounded-3xl pl-20 pr-10 text-4xl md:text-6xl font-light text-foreground outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <Button
                                variant="outline"
                                onClick={handleAutoSync}
                                loading={isSaving}
                                icon={<TrendingUp size={18} />}
                                className="h-16 md:h-20 font-black text-[10px] uppercase tracking-[0.25em] bg-secondary/10 border-border/20! hover:bg-primary/5!"
                            >
                                Auto Market Sync
                            </Button>
                            <Button
                                onClick={handleSaveRate}
                                loading={isSaving}
                                icon={<Save size={18} />}
                                className="h-16 md:h-20 font-black text-[10px] uppercase tracking-[0.25em] shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                            >
                                Manual Override
                            </Button>
                        </div>

                        <div className="flex items-center gap-5 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <AlertCircle size={20} className="text-primary" />
                            </div>
                            <div className="space-y-1.5 min-w-0">
                                <p className="text-[10px] font-black text-primary uppercase tracking-wider">Historical Marker</p>
                                <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-tight font-mono truncate">
                                    Broadcast Epoch: {new Date(settings.rates.lastUpdated).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="p-10 rounded-3xl bg-secondary/5 border border-border/20 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />
                        <div className="flex items-center gap-4 relative">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield size={16} className="text-primary" />
                            </div>
                            <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">Cryptographic Guard</h3>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 font-bold leading-relaxed uppercase tracking-widest relative">
                            This node is restricted to authorized operators. All override signatures are hashed
                            and logged to the immutable system audit trail.
                        </p>
                    </div>
                </div>
            </div>
        </MotionDiv>
    );
};

export default ControlCenter;
