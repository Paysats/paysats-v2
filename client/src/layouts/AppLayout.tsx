import { AppFooter } from "@/components/app/AppFooter"
import { AppHeader } from "@/components/app/AppHeader"
import ServiceTabs from "@/components/app/ServiceTabs"
import type { ReactNode } from "react"
import { MotionMain } from "@/components/ui/MotionComponents"
import { pageTransitionVariants } from "@/config/animationConfig"
import { AnimatePresence } from "framer-motion"

interface AppLayoutProps {
    children: ReactNode;
    serviceTabs?: boolean;
}

export const AppLayout = ({ children, serviceTabs = true }: AppLayoutProps) => {
    return (
        <div className="flex flex-col min-h-dvh bg-background">
            <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/60 border-b border-border/40 transition-all duration-200">
                <div className="max-w-3xl mx-auto w-full">
                    <AppHeader />
                    {serviceTabs && (
                        <div className="pb-2">
                            <ServiceTabs />
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <MotionMain
                    className="flex-1 w-full max-w-3xl mx-auto flex flex-col gap-6 px-4 py-6 md:py-8"
                    variants={pageTransitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    key={typeof window !== 'undefined' ? window.location.pathname : 'key'}
                >
                    {children}
                </MotionMain>
            </AnimatePresence>
            <AppFooter />
        </div>
    )
}