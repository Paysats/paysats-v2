import { SERVICES } from '@shared/constants';
import { usePublicSettings, useSettingsStore } from '@shared/hooks/usePublicSettings';
import * as LucideIcons from 'lucide-react';
import { BiTv } from "react-icons/bi";
import { type FC, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@shared/utils/cn';
import { MotionDiv } from "@shared/ui/MotionComponents"
import { springConfigs } from '@shared/config/animationConfig';
import { Lock, type LucideIcon } from "lucide-react"

import { config } from '@shared/config/config';

const API_URL = config.app.API_URL || "http://localhost:8000";

const ServiceTabs = () => {
    const { settings, fetchSettings } = usePublicSettings(API_URL);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const location = useLocation();
    const currentRoute = location.pathname.split("/")[1];
    const activeRoute = currentRoute || "airtime";
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    return (
        <div className="w-full mx-auto flex items-center overflow-x-auto py-2 px-4 no-scrollbar scroll-smooth">
            <div className="grid grid-cols-3 md:flex items-center gap-3 mx-auto md:gap-4">
                {
                    SERVICES.map((service) => {
                        const isActive = activeRoute === service.route;
                        const isBackendActive = settings?.services ? (settings.services as any)[service.id] : service.isActive;

                        // icon mapping
                        let Icon: any = (LucideIcons as any)[service.icon] || LucideIcons.HelpCircle;
                        if (service.id === 'cable') Icon = BiTv;

                        return (
                            <Link
                                to={`/${service.route}`}
                                key={service.id}
                                className={cn(
                                    "relative flex flex-col items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl transition-all duration-300 min-w-[72px] md:min-w-[96px]",
                                    "hover:bg-primary/5 active:scale-95",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                    !isBackendActive && "opacity-60 grayscale-[0.5]"
                                )}
                                onMouseEnter={() => setHoveredTab(service.route)}
                                onMouseLeave={() => setHoveredTab(null)}
                                tabIndex={0}
                            >
                                {isActive && (
                                    <MotionDiv
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/10 rounded-2xl shadow-sm"
                                        transition={springConfigs.smooth}
                                    />
                                )}

                                {hoveredTab === service.route && !isActive && (
                                    <MotionDiv
                                        layoutId="hoverTab"
                                        className="absolute inset-0 bg-secondary/50 rounded-2xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}

                                <span className={cn(
                                    "relative z-10 flex flex-col items-center gap-1.5 transition-colors duration-300",
                                    isActive ? "text-primary font-bold" : "text-muted-foreground/80 font-medium group-hover:text-foreground"
                                )}>
                                    <Icon size={22} className={cn("transition-all duration-300", isActive ? "stroke-[2.5] scale-110" : "stroke-2")} />
                                    <span className="text-[10px] md:text-xs whitespace-nowrap text-center tracking-tight">{service.name}</span>
                                </span>

                                {!isBackendActive && (
                                    <div className="absolute -top-1 -right-1">
                                        <Lock
                                            size={15}
                                            className="text-[#B5C7C0] stroke-2"
                                        />
                                    </div>
                                )}

                                {isActive && (
                                    <MotionDiv
                                        layoutId="activeIndicator"
                                        className="absolute bottom-1 w-1 h-1 bg-primary rounded-full opacity-80"
                                        transition={springConfigs.smooth}
                                    />
                                )}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ServiceTabs