import { Tooltip } from "antd"
import { Lock, type LucideIcon } from "lucide-react"
import type { FC } from "react"
import { MotionDiv } from "@shared/ui/MotionComponents"
import { scaleHoverVariants, pulseVariants } from "@shared/config/animationConfig"
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
        <div className="flex flex-col items-center gap-4 group">
            <GlowEffect
                intensity={isActive ? "medium" : "low"}
                pulse={isActive}
                className={isActive ? "" : "opacity-40 grayscale"}
            >
                <MotionDiv
                    className={`
                        w-20 h-20 md:w-28 md:h-28 rounded-3xl flex items-center justify-center relative
                        backdrop-blur-xl border transition-all duration-500
                        ${isActive
                            ? 'bg-white/80 dark:bg-zinc-900/80 border-white/20 dark:border-white/5 cursor-pointer shadow-xl group-hover:scale-105 group-hover:border-primary/50'
                            : 'bg-zinc-100/50 dark:bg-white/5 border-transparent pointer-events-none shadow-none'}
                    `}
                    variants={isActive ? scaleHoverVariants : {}}
                    initial="initial"
                    whileHover={isActive ? "hover" : undefined}
                    whileTap={isActive ? "tap" : undefined}
                >
                    <div className="relative">
                        {isActive ? (
                            <FloatingIcon duration={3}>
                                <Icon
                                    size={36}
                                    className="text-primary stroke-[2.5] drop-shadow-sm"
                                />
                            </FloatingIcon>
                        ) : (
                            <Icon
                                size={32}
                                className="text-zinc-400 stroke-2"
                            />
                        )}
                    </div>

                    {!isActive && (
                        <MotionDiv
                            className="absolute top-3 right-3"
                            variants={pulseVariants}
                            initial="initial"
                            animate="pulse"
                        >
                            <Lock size={12} className="text-zinc-400" />
                        </MotionDiv>
                    )}

                    {/* active indicator*/}
                    {isActive && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </MotionDiv>
            </GlowEffect>
            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.1em] transition-colors duration-300 ${isActive ? 'text-foreground/80 group-hover:text-primary' : 'text-zinc-500'}`}>
                {title}
            </span>
        </div>
    )
}