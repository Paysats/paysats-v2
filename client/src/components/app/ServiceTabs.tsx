import React, { useState } from 'react'
import { Smartphone, Wifi, Zap, Plane, Hotel, type LucideIcon } from 'lucide-react'
import { BiTv } from "react-icons/bi";

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MotionDiv } from '../ui/MotionComponents';
import { springConfigs } from '@/config/animationConfig';
import type { IconType } from 'react-icons/lib';

export const SERVICE_ITEMS: { name: string; icon: LucideIcon | IconType; route: string }[] = [
    {
        name: "Airtime",
        icon: Smartphone,
        route: "airtime",
    },
    {
        name: "Data",
        icon: Wifi,
        route: "data",
    },
    {
        name: "Electricity",
        icon: Zap,
        route: "electricity",
    },
    {
        name: "Cable TV",
        icon: BiTv,
        route: "cable-tv",
    },
    {
        name: "Flight Booking",
        icon: Plane,
        route: "flights",
    },
    {
        name: "Hotels",
        icon: Hotel,
        route: "hotels",
    },
]

const ServiceTabs = () => {

    const location = useLocation();
    const currentRoute = location.pathname.split("/")[1];
    const activeRoute = currentRoute || "airtime";
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    return (
        <div className="w-full mx-auto flex items-center overflow-x-auto py-2 px-4 no-scrollbar scroll-smooth">
            <div className="grid grid-cols-3 md:flex items-center gap-3 mx-auto md:gap-4">
                {
                    SERVICE_ITEMS.map((item) => {
                        const isActive = activeRoute === item.route;
                        return (
                            <Link
                                to={`/${item.route}`}
                                key={item.name}
                                className={cn(
                                    "relative flex flex-col items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl transition-all duration-300 min-w-[72px] md:min-w-[96px]",
                                    "hover:bg-primary/5 active:scale-95",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                )}
                                onMouseEnter={() => setHoveredTab(item.route)}
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

                                {hoveredTab === item.route && !isActive && (
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
                                    <item.icon size={22} className={cn("transition-all duration-300", isActive ? "stroke-[2.5] scale-110" : "stroke-2")} />
                                    <span className="text-[10px] md:text-xs whitespace-nowrap text-center tracking-tight">{item.name}</span>
                                </span>

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