import React, { useState, useEffect } from 'react';
import { MotionDiv, MotionButton } from '../ui/MotionComponents';
import { usePWA } from '@/hooks/usePWA';
import { Logo } from '../ui/Logo';
import { X, Download, Smartphone } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const PWAInstallPrompt: React.FC = () => {
    const { isInstallable, installApp } = usePWA();
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (isInstallable) {
            const timer = setTimeout(() => setShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [isInstallable]);

    const handleDismiss = () => {
        setShow(false);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    const handleInstall = async () => {
        await installApp();
        setShow(false);
    };

    // checking if prompt for install was dismissed recently...
    useEffect(() => {
        const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissedAt) {
            const dayInMs = 24 * 60 * 60 * 1000; // 24hrs
            if (Date.now() - parseInt(dismissedAt) < dayInMs) {
                setShow(false);
            }
        }
    }, [isInstallable]);

    return (
        <AnimatePresence>
            {show && (
                <MotionDiv
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
                >
                    <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-95 p-5 relative">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-xl">
                                <Logo size="medium" />
                            </div>
                            <div className="flex-1 pr-6">
                                <h3 className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
                                    Install PaySats
                                </h3>
                                <p className="text-sm text-secondary-text leading-relaxed">
                                    Get the best experience by installing PaySats to your home screen. It's fast, secure, and works offline.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex gap-3">
                            <MotionButton
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleInstall}
                                className="flex-1 bg-primary text-primary-foreground font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-600 transition-colors"
                            >
                                <Download size={18} />
                                Install Now
                            </MotionButton>
                            <MotionButton
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDismiss}
                                className="bg-secondary text-secondary-foreground font-semibold py-3 px-4 rounded-xl hover:bg-muted transition-colors"
                            >
                                Later
                            </MotionButton>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            <span className="flex items-center gap-1">
                                <Smartphone size={10} />
                                Supports iOS & Android
                            </span>
                        </div>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};
