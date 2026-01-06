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
        <div className="w-full md:max-w-5xl mx-auto flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 px-2 md:px-4 no-scrollbar">
            <div className="grid grid-cols-3 md:flex md:items-center gap-1 md:gap-4 mx-auto">
                {
                    SERVICE_ITEMS.map((item) => {
                        const isActive = activeRoute === item.route;
                        return (
                            <Link
                                to={`/${item.route}`}
                                key={item.name}
                                className={cn(
                                    "relative flex flex-col items-center gap-1 md:gap-2 font-medium py-2 md:py-3 px-2 md:px-6 rounded-md transition-colors min-w-[64px] md:min-w-[96px]",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                )}
                                onMouseEnter={() => setHoveredTab(item.route)}
                                onMouseLeave={() => setHoveredTab(null)}
                                tabIndex={0}
                            >
                                {isActive && (
                                    <MotionDiv
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/10 rounded-md"
                                        transition={springConfigs.smooth}
                                    />
                                )}

                                {hoveredTab === item.route && !isActive && (
                                    <MotionDiv
                                        layoutId="hoverTab"
                                        className="absolute inset-0 bg-primary/15 rounded-md"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}

                                <span className={cn(
                                    "relative z-10 flex flex-col items-center gap-1 md:gap-2",
                                    isActive ? "text-primary font-bold" : "text-muted-foreground"
                                )}>
                                    <item.icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-2"} />
                                    <span className="text-[10px] md:text-xs whitespace-nowrap text-center">{item.name}</span>
                                </span>

                                {isActive && (
                                    <MotionDiv
                                        layoutId="activeIndicator"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 md:w-8 h-1 bg-primary rounded-full"
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