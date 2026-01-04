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
        <div className="flex flex-col gap-4 mx-auto h-screen py-2 overflow-y-hidden">
            <AppHeader />
            {serviceTabs &&
                <div className="mx-auto mt-6">
                    <ServiceTabs />
                </div>
            }
            <AnimatePresence mode="wait">
                <MotionMain
                    className="w-full md:max-w-3xl mx-auto flex-grow flex flex-col gap-8 p-4 overflow-y-auto"
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