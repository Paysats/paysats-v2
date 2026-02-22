import type { FC } from "react"
import { Link } from "react-router-dom"
import { MotionFooter, MotionDiv } from "@shared/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants } from "@shared/config/animationConfig"
import { config } from "@shared/config/config"
import { DOMAIN_URLS } from "@shared/constants"

export const AppFooter: FC = () => {
    return (
        <MotionFooter
            className="w-full py-20 relative overflow-hidden bg-background flex flex-col items-center justify-center border-t border-white/5"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
        >
            {/* Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                <span className="text-[15vw] font-black text-foreground/[0.02] select-none tracking-tighter uppercase leading-none">
                    Paysats
                </span>
            </div>

            <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center text-center">

                {/* Secure Branding */}
                <MotionDiv variants={staggerItemVariants} className="flex flex-col md:flex-row md:gap-6 items-center mb-2">
                    <h2 className="text-4xl md:text-6xl font-semibold text-primary leading-none tracking-tighter opacity-80 uppercase">
                        Stateless.
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-semibold text-primary leading-none tracking-tighter opacity-80 uppercase">
                        Secure.
                    </h2>
                </MotionDiv>

                <MotionDiv
                    variants={staggerItemVariants}
                    className="flex items-center gap-4 w-full justify-center opacity-40 mb-16"
                >
                    <div className="h-px bg-zinc-800 flex-grow max-w-[60px]" />
                    <span className="text-[9px] font-black tracking-[0.5em] uppercase text-zinc-500">
                        Scaling Global Utility
                    </span>
                    <div className="h-px bg-zinc-800 flex-grow max-w-[60px]" />
                </MotionDiv>


                <MotionDiv
                    variants={staggerItemVariants}
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-16"
                >
                    <a href={`${DOMAIN_URLS.LANDING}/support`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">Support</a>
                    <a href={`${DOMAIN_URLS.LANDING}/faq`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">FAQ</a>
                    <a href={`https://x.com/${config.app.X_HANDLE}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">X</a>
                    <a href="https://t.me/+X0aDT1Gy2dM3OWU8" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">Telegram</a>
                </MotionDiv>


                <MotionDiv
                    variants={staggerItemVariants}
                    className="mt-6 text-[8px] font-bold uppercase tracking-widest text-zinc-700 select-none"
                >
                    &copy; {new Date().getFullYear()} PaySats Ecosystem
                </MotionDiv>
            </div>
        </MotionFooter>
    )
}