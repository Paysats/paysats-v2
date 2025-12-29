import { SERVICES } from "@shared/constants"
import { Smartphone, Wifi, Zap, Monitor, Plane, type LucideIcon, Hotel } from "lucide-react"
import type { FC } from "react"
import { ServiceCard } from "./ServiceCard"
import { Link } from "react-router-dom"
import { Tooltip } from "antd"

const ICON_MAP: Record<string, LucideIcon> = {
    "airtime": Smartphone,
    "data": Wifi,
    "electricity bill": Zap,
    "cable TV": Monitor,
    "flight booking": Plane,
    "hotel booking": Hotel,
}

export const ServiceGrid: FC = () => {
    return (
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 py-12">
            {SERVICES.map((service) => {
                const Icon = ICON_MAP[service.name.toLowerCase()] || Wifi
                return (
                    <Tooltip title={service.isActive ? "" : "Coming Soon"} placement="top">
                    <Link to={service.isActive ? `/${service.route}` : "#"} >
                        <ServiceCard
                            key={service.name}
                            title={service.name}
                            icon={Icon}
                            isActive={service.isActive}
                        />
                    </Link>
                    </Tooltip>
                )
            })}
        </div>
    )
}
