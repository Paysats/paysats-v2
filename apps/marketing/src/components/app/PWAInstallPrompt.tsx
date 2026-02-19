import React, { useState, useEffect } from 'react';
import { MotionDiv, MotionButton } from "@shared/ui/MotionComponents";
import { usePWA } from '@/hooks/usePWA';
import { Logo } from '@shared/ui/Logo';
import { X, Download, Smartphone } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const PWAInstallPrompt: React.FC = () => {
    const { isInstallable, installApp, isIOS } = usePWA();
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
        if (isIOS) {
            // For iOS, just show instructions
            return;
        }
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
                                    {isIOS
                                        ? "To install, tap the Share icon below and select 'Add to Home Screen'."
                                        : "Get the best experience by installing PaySats to your home screen. It's fast, secure, and works offline."}
                                </p>
                            </div>
                        </div>

                        {!isIOS ? (
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
                        ) : (
                            <div className="mt-5 p-3 bg-secondary/50 rounded-xl flex items-center justify-center gap-4 border border-border/30">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="p-2 bg-card rounded-lg shadow-sm">
                                        <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor" className="text-blue-500">
                                            <path d="M288 192V66.75l63.58 63.58a16 16 0 0022.62-22.62l-90.49-90.49a16 16 0 00-22.62 0l-90.49 90.49a16 16 0 0022.62 22.62L224 66.75V192h64zM400 160h-64v64h64v224H112V224h64v-64H112c-26.51 0-48 21.49-48 48v224c0 26.51 21.49 48 48 48h288c26.51 0 48-21.49 48-48V208c0-26.51-21.49-48-48-48z" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Share</span>
                                </div>
                                <div className="h-8 w-px bg-border/50" />
                                <div className="flex flex-col items-center gap-1">
                                    <div className="p-2 bg-card rounded-lg shadow-sm">
                                        <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
                                            <path d="M448 224h-128v-128c0-17.67-14.33-32-32-32s-32 14.33-32 32v128h-128c-17.67 0-32 14.33-32 32s14.33 32 32 32h128v128c0 17.67 14.33 32 32 32s32-14.33 32-32v-128h128c17.67 0 32-14.33 32-32s-14.33-32-32-32z" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Add to home</span>
                                </div>
                            </div>
                        )}

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

