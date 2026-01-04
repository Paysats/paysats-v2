import { Tooltip } from "antd"
import { Lock, type LucideIcon } from "lucide-react"
import type { FC } from "react"
import { MotionDiv } from "../ui/MotionComponents"
import { scaleHoverVariants, pulseVariants } from "@/config/animationConfig"
import { FloatingIcon } from "../effects/FloatingIcon"
import { GlowEffect } from "../effects/GlowEffect"
import type { IconType } from "react-icons/lib";

interface IServiceCard {
    title: string
    icon: LucideIcon | IconType
    isActive: boolean
}

export const ServiceCard: FC<IServiceCard> = ({ title, icon: Icon, isActive }) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <GlowEffect
                intensity="medium"
                pulse={isActive}
                className={isActive ? "" : "opacity-60"}
            >
                <MotionDiv
                    className={`
                        w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center relative
                        ${isActive ? 'bg-white transition-transform cursor-pointer' : 'bg-[#E3EEE9]/50 pointer-events-none'}
                    `}
                    variants={isActive ? scaleHoverVariants : {}}
                    initial="initial"
                    whileHover={isActive ? "hover" : undefined}
                    whileTap={isActive ? "tap" : undefined}
                >
                    {isActive ? (
                        <FloatingIcon duration={3}>
                            <Icon
                                size={32}
                                className="text-primary stroke-[2.5]"
                            />
                        </FloatingIcon>
                    ) : (
                        <Icon
                            size={32}
                            className="text-[#B5C7C0] stroke-2"
                        />
                    )}
                    {!isActive && (
                        <MotionDiv
                            className="absolute top-2 right-2"
                            variants={pulseVariants}
                            initial="initial"
                            animate="pulse"
                        >
                            <Lock size={14} className="text-[#B5C7C0]" />
                        </MotionDiv>
                    )}
                </MotionDiv>
            </GlowEffect>
            <span className={`text-sm font-semibold tracking-tight ${isActive ? 'text-foreground' : 'text-[#A0B9B6]'}`}>
                {title.charAt(0).toUpperCase() + title.slice(1)}
            </span>
        </div>
    )
}