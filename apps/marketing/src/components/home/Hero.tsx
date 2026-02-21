import { Bitcoin, ArrowRight, Zap } from "lucide-react"
import type { FC } from "react"
import { MotionDiv, MotionH1, MotionP } from "@shared/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants } from "@shared/config/animationConfig"
import { FloatingIcon } from "../effects/FloatingIcon"
import { GlowEffect } from "../effects/GlowEffect"
import { ParticleEffect } from "../effects/ParticleEffect"
import { DOMAIN_URLS } from "@shared/constants"
import { ServiceGrid } from "./ServiceGrid";

export const Hero: FC = () => {
    return (
        <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center pb-24 px-4 overflow-hidden">
            <ParticleEffect count={75} color="#000" className="z-0" />

            <MotionDiv
                className="text-center relative z-10 max-w-4xl"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                

                <MotionH1
                    className="text-4xl md:text-7xl font-black text-foreground mb-4 tracking-tighter leading-[0.9]"
                    variants={staggerItemVariants}
                >
                    Your everyday with <br />
                    <span className="text-primary flex items-center justify-center gap-2">
                        <div className="relative inline-flex items-center justify-center">
                            <GlowEffect color="#0AC18E" intensity="high" pulse className="rounded-full">
                                <FloatingIcon duration={4}>
                                    <div className="bg-primary rounded-full p-2 md:p-3 shadow-2xl">
                                        <Bitcoin className="text-white" size={60} strokeWidth={2.5} />
                                    </div>
                                </FloatingIcon>
                            </GlowEffect>
                        </div>
                        itcoinCash
                    </span>
                </MotionH1>

                <MotionP
                    className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
                    variants={staggerItemVariants}
                >
                    Seamlessly pay for everyday services like airtime, internet subscription and utilities across Africa using the world's most efficient p2p electronic cash ($BCH).
                </MotionP>

                {/* cta Buttons */}
                {/* <MotionDiv variants={staggerItemVariants} className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <a
                        href={DOMAIN_URLS.PLATFORM}
                        className="group relative inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(10,193,142,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        <span>Launch App</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a
                        href="#services"
                        className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 text-foreground px-8 py-4 rounded-2xl font-black text-lg border border-border hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <Zap size={20} className="text-primary" />
                        <span>Explore Services</span>
                    </a>
                </MotionDiv> */}
            </MotionDiv>
            <ServiceGrid />

            {/* scroll indicator */}
            {/* <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hidden md:flex"
            >
                <div className="w-6 h-10 border-2 border-foreground rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-foreground rounded-full" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to Explore</span>
            </MotionDiv> */}
        </section>
    )
}

