import React from 'react';
import { SERVICES } from '@shared/constants';
import * as LucideIcons from 'lucide-react';
import { BiTv } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { Button } from '@shared-ui/Button';
import { AppLayout } from '@/layouts/AppLayout';
import { MotionDiv } from '@shared-ui/MotionComponents';
import { GlowEffect } from '@shared-ui/GlowEffect';
import { staggerContainerVariants, staggerItemVariants } from '@shared/config/animationConfig';

interface IComingSoonServiceProps {
    serviceName: string;
    mainText: string;
    subText: string;
}

const ComingSoonService: React.FC<IComingSoonServiceProps> = ({ serviceName, mainText, subText }) => {
    return (
        <AppLayout serviceTabs={false}>
            <MotionDiv
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
                className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 text-center py-20"
            >
                <MotionDiv variants={staggerItemVariants} className="relative mb-12">
                    <GlowEffect intensity="high" pulse={true} className="rounded-full">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-primary/5 flex items-center justify-center relative z-10 border border-primary/20 backdrop-blur-sm shadow-2xl shadow-primary/20">
                            {
                                (() => {
                                    const service = SERVICES.find(item => item.route === serviceName.toLowerCase() || item.id === serviceName.toLowerCase());
                                    if (!service) return null;

                                    let Icon: any = (LucideIcons as any)[service.icon] || LucideIcons.HelpCircle;
                                    if (service.id === 'cable') Icon = BiTv;

                                    return Icon ? <Icon className="w-16 h-16 md:w-20 md:h-20 text-primary stroke-[1.5] drop-shadow-[0_0_8px_rgba(51,194,121,0.4)]" /> : null;
                                })()
                            }
                        </div>
                    </GlowEffect>

                </MotionDiv>

                <MotionDiv variants={staggerItemVariants}>
                    <Button size="sm" variant="secondary" className="bg-primary/20! text-primary! font-black tracking-[0.2em] mb-4 px-6! py-0! rounded-full border border-primary/20">
                        COMING SOON
                    </Button>
                </MotionDiv>

                <MotionDiv variants={staggerItemVariants}>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
                        {serviceName.toLowerCase() === "electricity" ? "Electricity Bills" : serviceName}
                    </h2>
                </MotionDiv>

                <MotionDiv variants={staggerItemVariants} className="max-w-md space-y-4 mb-12">
                    <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
                        {mainText || `Decentralized infrastructure for ${serviceName} is currently being optimized for mainnet deployment.`}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                        {subText || `Estimated Block Height: Phase 2 Arrival`}
                    </p>
                </MotionDiv>

                <MotionDiv variants={staggerItemVariants}>
                    <Link
                        to="/"
                    >
                        <Button
                            className="h-14 md:h-16 px-8 md:px-12 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 group"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            <span className="ml-3">Return to Signal Hub</span>
                        </Button>
                    </Link>
                </MotionDiv>
            </MotionDiv>
        </AppLayout>
    )
}

export default ComingSoonService