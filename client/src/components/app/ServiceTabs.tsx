import React, { useState } from 'react'
import { Smartphone, Wifi, Zap, Monitor, Plane, Hotel, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MotionDiv } from '../ui/MotionComponents';
import { springConfigs } from '@/config/animationConfig';

export const SERVICE_ITEMS: { name: string; icon: LucideIcon; route: string }[] = [
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
        icon: Monitor,
        route: "cable-tv",
    },
    {
        name: "Flight Booking",
        icon: Plane,
        route: "flight-booking",
    },
    {
        name: "Hotel Booking",
        icon: Hotel,
        route: "hotel-booking",
    },
]

const ServiceTabs = () => {

    const location = useLocation();
    const currentRoute = location.pathname.split("/")[1];
    const activeRoute = currentRoute || "airtime";
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    return (
        <div className="w-full md:max-w-5xl mx-auto flex items-center gap-4 overflow-x-auto pb-2 px-4 no-scrollbar">
            <div className="flex items-center gap-2 md:gap-4 mx-auto">
                {
                    SERVICE_ITEMS.map((item) => {
                        const isActive = activeRoute === item.route;
                        return (
                            <Link
                                to={`/${item.route}`}
                                key={item.name}
                                className="relative flex flex-col items-center gap-2 font-medium py-3 px-4 md:px-6 rounded-md transition-colors"
                                onMouseEnter={() => setHoveredTab(item.route)}
                                onMouseLeave={() => setHoveredTab(null)}
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

                                <span className={cn("relative z-10 flex flex-col items-center gap-2", isActive ? "text-primary font-bold" : "text-muted-foreground")}>
                                    <item.icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-2"} />
                                    <span className="text-xs md:text-sm whitespace-nowrap">{item.name}</span>
                                </span>

                                {isActive && (
                                    <MotionDiv
                                        layoutId="activeIndicator"
                                        className="absolute bottom-0 w-8 h-1 bg-primary rounded-full"
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