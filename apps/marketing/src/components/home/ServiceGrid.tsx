import { DOMAIN_URLS, SERVICES } from "@shared/constants"
import { usePublicSettings } from "@shared/hooks/usePublicSettings"
import * as LucideIcons from "lucide-react"
import { BiTv } from "react-icons/bi";
import { type FC, useEffect } from "react"
import { ServiceCard } from "./ServiceCard"
import { Link } from "react-router-dom"
import { Tooltip } from "antd"
import { MotionDiv } from "@shared/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants } from "@shared/config/animationConfig"
import { config } from "@shared/config/config";


export const ServiceGrid: FC = () => {
    const { settings, fetchSettings } = usePublicSettings(`${config.app.API_URL}/config/public`);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return (
                <MotionDiv
                    className="flex flex-wrap justify-center gap-8 md:gap-12"
                    variants={staggerContainerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {SERVICES.map((service) => {
                        // determine active state from db , fallback to hardcoded isActive
                        const isBackendActive = settings?.services ? (settings.services as any)[service.id] : service.isActive;

                        // Get Icon
                        let Icon: any = (LucideIcons as any)[service.icon] || LucideIcons.Wifi;
                        if (service.id === 'cable') Icon = BiTv; // special case for react-icons

                        return (
                            <MotionDiv
                                key={service.id}
                                variants={staggerItemVariants}
                            >
                                <Tooltip title={(isBackendActive || service.isActive) ? "" : "Coming Soon"} placement="top">
                                    <Link to={isBackendActive ? `${DOMAIN_URLS.PLATFORM}/${service.route}` : "#"} >
                                        <ServiceCard
                                            title={service.name}
                                            icon={Icon}
                                            isActive={isBackendActive}
                                        />
                                    </Link>
                                </Tooltip>
                            </MotionDiv>
                        )
                    })}
                </MotionDiv>
    )
}

