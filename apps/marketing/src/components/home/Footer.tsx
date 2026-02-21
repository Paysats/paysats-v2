import type { FC } from "react"
import { Link } from "react-router-dom"
import { MotionFooter, MotionDiv } from "@shared/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants } from "@shared/config/animationConfig"
import { config } from "@shared/config/config"

export const Footer: FC = () => {
    return (
        <MotionFooter
            className="w-full py-32 relative overflow-hidden bg-background flex flex-col items-center justify-center border-t border-white/5"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                <span className="text-[20vw] font-black text-foreground/[0.03] select-none tracking-tighter uppercase leading-none">
                    Paysats
                </span>
            </div>

            <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center text-center">

                <MotionDiv
                    variants={staggerItemVariants}
                    className="grid grid-cols-3 gap-x-12 md:gap-x-24 gap-y-12 mb-24 max-w-2xl mx-auto"
                >
                    <Link to="/roadmap" className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">Roadmap</Link>
                    <Link to="/faq" className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">Faq</Link>
                    <Link to="/terms" className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">Terms</Link>
                    <Link to="/support" className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">Support</Link>
                    <a href={`https://x.com/${config.app.X_HANDLE}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">X</a>
                    <a href="https://t.me/+X0aDT1Gy2dM3OWU8" target="_blank" rel="noopener noreferrer" className="text-[11px] font-black tracking-[0.3em] uppercase text-zinc-500 hover:text-primary transition-colors">Telegram</a>
                </MotionDiv>

                <MotionDiv variants={staggerItemVariants} className="flex flex-col items-center mb-24">
                    <h2 className="text-5xl md:text-8xl font-black text-primary leading-none tracking-tighter">
                        STATELESS.
                    </h2>
                    <h2 className="text-5xl md:text-8xl font-black text-primary leading-none tracking-tighter">
                        SECURE.
                    </h2>
                </MotionDiv>

                <MotionDiv
                    variants={staggerItemVariants}
                    className="flex items-center gap-4 w-full justify-center"
                >
                    <div className="h-px bg-zinc-800 flex-grow max-w-[100px]" />
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-600">
                        Scaling Global Utility
                    </span>
                    <div className="h-px bg-zinc-800 flex-grow max-w-[100px]" />
                </MotionDiv>

                <MotionDiv
                    variants={staggerItemVariants}
                    className="mt-8 text-[9px] font-bold uppercase tracking-widest text-zinc-700"
                >
                    &copy; {new Date().getFullYear()} PaySats Ecosystem
                </MotionDiv>
            </div>
        </MotionFooter>
    )
}
