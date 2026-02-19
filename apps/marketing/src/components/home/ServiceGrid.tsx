import { SERVICES } from "@shared/constants"
import { Smartphone, Wifi, Zap, Monitor, Plane, type LucideIcon, Hotel } from "lucide-react"
import { BiTv } from "react-icons/bi";
import type { FC } from "react"
import { ServiceCard } from "./ServiceCard"
import { Link } from "react-router-dom"
import { Tooltip } from "antd"
import { MotionDiv } from "@shared/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig"
import type { IconType } from "react-icons/lib";

const ICON_MAP: Record<string, LucideIcon | IconType> = {
    "airtime": Smartphone,
    "data": Wifi,
    "electricity bill": Zap,
    "cable tv": BiTv,
    "flight booking": Plane,
    "hotel booking": Hotel,
}

export const ServiceGrid: FC = () => {
    return (
        <MotionDiv
            className="flex flex-wrap justify-center gap-6 md:gap-10 pt-8 md:py-12"
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
        >
            {SERVICES.map((service) => {
                const Icon = ICON_MAP[service.name.toLowerCase()] || Wifi;
                return (
                    <MotionDiv
                        key={service.name}
                        variants={staggerItemVariants}
                    >
                        <Tooltip title={service.isActive ? "" : "Coming Soon"} placement="top">
                            <Link to={service.isActive ? `/${service.route}` : "#"} >
                                <ServiceCard
                                    title={service.name}
                                    icon={Icon}
                                    isActive={service.isActive}
                                />
                            </Link>
                        </Tooltip>
                    </MotionDiv>
                )
            })}
        </MotionDiv>
    )
}

