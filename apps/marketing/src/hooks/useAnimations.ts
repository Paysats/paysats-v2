import { useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Variants } from 'framer-motion';
import {
    pageTransitionVariants,
    staggerContainerVariants,
    floatingVariants,
    prefersReducedMotion,
    getVariants,
} from '@/config/animationConfig';

/**
 * Hook for page transition animations
 */
export const usePageTransition = () => {
    return getVariants(pageTransitionVariants);
};

/**
 * Hook for stagger animations
 */
export const useStaggerAnimation = (delay: number = 0.08) => {
    const containerVariants: Variants = {
        ...staggerContainerVariants,
        animate: {
            transition: {
                staggerChildren: delay,
                delayChildren: 0.1,
            },
        },
    };

    return getVariants(containerVariants);
};

/**
 * Hook for floating animations
 */
export const useFloating = (duration: number = 4) => {
    const variants: Variants = {
        ...floatingVariants,
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return getVariants(variants);
};

/**
 * Hook for scroll-triggered animations
 */
export const useScrollAnimation = () => {
    const controls = useAnimation();
    const [ref, setRef] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!ref || prefersReducedMotion()) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start('animate');
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px',
            }
        );

        observer.observe(ref);

        return () => {
            if (ref) observer.unobserve(ref);
        };
    }, [ref, controls]);

    return { ref: setRef, controls };
};

/**
 * Hook for hover glow effect
 */
export const useHoverGlow = (color: string = 'var(--primary)') => {
    const [isHovered, setIsHovered] = useState(false);

    const glowStyle = isHovered && !prefersReducedMotion()
        ? {
            boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}20`,
            transition: 'box-shadow 0.3s ease',
        }
        : {
            boxShadow: '0 0 0 transparent',
            transition: 'box-shadow 0.3s ease',
        };

    return {
        glowStyle,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };
};

/**
 * Hook for managing particle effects
 */
export const useParticles = (count: number = 20) => {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        size: number;
        duration: number;
        delay: number;
    }>>([]);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        const newParticles = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
        }));

        setParticles(newParticles);
    }, [count]);

    return particles;
};

/**
 * Hook for sequential animations
 */
export const useSequence = (steps: Array<() => Promise<void>>) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const play = async () => {
        if (prefersReducedMotion()) return;

        setIsPlaying(true);
        for (let i = 0; i < steps.length; i++) {
            setCurrentStep(i);
            await steps[i]();
        }
        setIsPlaying(false);
        setCurrentStep(0);
    };

    return { play, currentStep, isPlaying };
};

/**
 * Hook for ripple effect on click
 */
export const useRipple = () => {
    const [ripples, setRipples] = useState<Array<{
        id: number;
        x: number;
        y: number;
    }>>([]);

    const createRipple = (event: React.MouseEvent<HTMLElement>) => {
        if (prefersReducedMotion()) return;

        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newRipple = {
            id: Date.now(),
            x,
            y,
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);
    };

    return { ripples, createRipple };
};
