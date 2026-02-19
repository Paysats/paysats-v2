import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export const usePWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(ios);

        // check if app is already installed
        const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsInstalled(standalone);

        // if iOS and not standalone, it's "installable" (manually)
        if (ios && !standalone) {
            setIsInstallable(true);
        }

        // check if there's already a captured prompt (for non-iOS)
        if ((window as any).deferredPrompt) {
            setDeferredPrompt((window as any).deferredPrompt);
            setIsInstallable(true);
        }

        const handler = (e: Event) => {
            // prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
            (window as any).deferredPrompt = e;
        };

        window.addEventListener('beforeinstallprompt', handler);

        const installedHandler = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            (window as any).deferredPrompt = null;
        };

        window.addEventListener('appinstalled', installedHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installedHandler);
        };
    }, []);



    const installApp = async () => {
        // iOS doesn't support the automated prompt
        if (isIOS) return;

        if (!deferredPrompt) return;

        // show the install prompt
        await deferredPrompt.prompt();

        // wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('user accepted the install prompt');
        } else {
            console.log('user dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return { isInstallable, isInstalled, installApp, isIOS };
};

