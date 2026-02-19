import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashSidebar } from '../components/DashSidebar';
import { pageTransitionVariants } from '@shared/config/animationConfig';
import { AnimatePresence } from 'framer-motion';
import { MotionMain } from '@shared/ui/MotionComponents';
import { useDashAuthStore } from '../store/dashAuthStore';
import { useUIStore } from '../store/useUIStore';
import { Navigate, useLocation } from 'react-router-dom';
import { RefreshCw, Menu } from 'lucide-react';
import { Button } from '@shared/ui/Button';

const DashLayout: React.FC = () => {
    const { isAuthenticated, isLoading, initialize } = useDashAuthStore();
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const location = useLocation();

    React.useEffect(() => {
        initialize();
    }, [initialize]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 opacity-50">
                <RefreshCw size={32} className="animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Verifying Dash Credentials...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-background flex overflow-x-hidden">
            <DashSidebar />

            {/* Mobile Header Toggle */}
            <div className="fixed top-6 right-6 z-[60] md:hidden">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleSidebar}
                    className="rounded-xl shadow-xl border border-border/40 backdrop-blur-md bg-card/80"
                >
                    <Menu size={20} />
                </Button>
            </div>

            <div
                className={`flex-1 flex flex-col transition-all duration-500 ease-in-out min-w-0 ${isSidebarOpen ? 'md:pl-72' : 'md:pl-20'
                    }`}
            >
                <AnimatePresence mode="wait">
                    <MotionMain
                        className="flex-1 p-6 md:p-12 w-full max-w-[1400px] mx-auto"
                        variants={pageTransitionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={location.pathname}
                    >
                        <Outlet />
                    </MotionMain>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DashLayout;
