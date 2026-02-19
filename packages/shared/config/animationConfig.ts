import type { Variants, Transition } from 'framer-motion';

/**
 * framer motion animations (various configs)
 */

// ============================================
// SPRING CONFIGURATIONS
// ============================================

export const springConfigs = {
    // Smooth, natural spring for most interactions
    smooth: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 30,
    },
    // Bouncy spring for playful interactions
    bouncy: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 25,
    },
    // Gentle spring for subtle movements
    gentle: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 35,
    },
    // Snappy spring for quick interactions
    snappy: {
        type: 'spring' as const,
        stiffness: 600,
        damping: 28,
    },
} as const;

// ============================================
// EASING FUNCTIONS
// ============================================

export const easings = {
    easeOut: [0.16, 1, 0.3, 1],
    easeIn: [0.7, 0, 0.84, 0],
    easeInOut: [0.87, 0, 0.13, 1],
    smooth: [0.25, 0.1, 0.25, 1],
} as const;

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================

export const pageTransitionVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: easings.easeOut,
        } as Transition,
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: easings.easeIn,
        } as Transition,
    },
};

export const fadeInVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: easings.easeOut,
        } as Transition,
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: easings.easeIn,
        } as Transition,
    },
};

export const slideUpVariants: Variants = {
    initial: {
        opacity: 0,
        y: 40,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: springConfigs.smooth as Transition,
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
            ease: easings.easeIn,
        } as Transition,
    },
};

export const slideDownVariants: Variants = {
    initial: {
        opacity: 0,
        y: -40,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: springConfigs.smooth as Transition,
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.2,
            ease: easings.easeIn,
        } as Transition,
    },
};

// STAGGER VARIANTS
// ============================================
export const staggerContainerVariants: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        } as Transition,
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        } as Transition,
    },
};

export const staggerItemVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: springConfigs.smooth as Transition,
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2,
        } as Transition,
    },
};

// HOVER & INTERACTION VARIANTS
// ============================================

export const scaleHoverVariants: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.05,
        transition: springConfigs.snappy as Transition,
    },
    tap: {
        scale: 0.98,
        transition: springConfigs.snappy as Transition,
    },
};

export const liftHoverVariants: Variants = {
    initial: {
        y: 0,
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    },
    hover: {
        y: -4,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        transition: springConfigs.smooth as Transition,
    },
};

export const glowHoverVariants: Variants = {
    initial: {
        boxShadow: '0 0 0 rgba(var(--primary-rgb), 0)',
    },
    hover: {
        boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.5)',
        transition: {
            duration: 0.3,
        } as Transition,
    },
};

// ============================================
// BUTTON VARIANTS
// ============================================

export const buttonVariants: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.02,
        transition: springConfigs.snappy as Transition,
    },
    tap: {
        scale: 0.98,
        transition: springConfigs.snappy as Transition,
    },
};

export const buttonGlowVariants: Variants = {
    initial: {
        boxShadow: '0 0 0 rgba(var(--primary-rgb), 0)',
    },
    hover: {
        boxShadow: '0 0 25px rgba(var(--primary-rgb), 0.6), 0 0 50px rgba(var(--primary-rgb), 0.3)',
        transition: {
            duration: 0.3,
        } as Transition,
    },
};

export const pulseVariants: Variants = {
    initial: {
        scale: 1,
        opacity: 1,
    },
    pulse: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        } as Transition,
    },
};

// ============================================
// FLOATING ANIMATION
// ============================================

export const floatingVariants: Variants = {
    initial: {
        y: 0,
    },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
        } as Transition,
    },
};

export const floatingRotateVariants: Variants = {
    initial: {
        y: 0,
        rotate: 0,
    },
    animate: {
        y: [-10, 10, -10],
        rotate: [-5, 5, -5],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
        } as Transition,
    },
};

// ============================================
// INPUT VARIANTS
// ============================================

export const inputFocusVariants: Variants = {
    initial: {
        boxShadow: '0 0 0 0 rgba(var(--primary-rgb), 0)',
        borderColor: 'rgba(209, 213, 219, 1)', // gray-300
    },
    focus: {
        boxShadow: '0 0 0 3px rgba(var(--primary-rgb), 0.1)',
        borderColor: 'rgba(var(--primary-rgb), 1)',
        transition: {
            duration: 0.2,
        } as Transition,
    },
};

export const shakeVariants: Variants = {
    initial: {
        x: 0,
    },
    shake: {
        x: [-10, 10, -10, 10, 0],
        transition: {
            duration: 0.4,
        } as Transition,
    },
};

// ============================================
// CARD VARIANTS
// ============================================

export const cardHoverVariants: Variants = {
    initial: {
        y: 0,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    hover: {
        y: -8,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        transition: springConfigs.smooth as Transition,
    },
};

// ============================================
// MODAL VARIANTS
// ============================================

export const modalBackdropVariants: Variants = {
    initial: {
        opacity: 0,
        backdropFilter: 'blur(0px)',
    },
    animate: {
        opacity: 1,
        backdropFilter: 'blur(8px)',
        transition: {
            duration: 0.3,
        } as Transition,
    },
    exit: {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        transition: {
            duration: 0.2,
        } as Transition,
    },
};

export const modalContentVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: springConfigs.smooth as Transition,
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        y: 10,
        transition: {
            duration: 0.2,
            ease: easings.easeIn,
        } as Transition,
    },
};

// ============================================
// TAB VARIANTS
// ============================================

export const tabIndicatorVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: springConfigs.smooth as Transition,
    },
};

// ============================================
// LOADING VARIANTS
// ============================================

export const spinVariants: Variants = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        } as Transition,
    },
};

export const dotBounceVariants: Variants = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
        } as Transition,
    },
};

// ============================================
// SHIMMER EFFECT
// ============================================

export const shimmerVariants: Variants = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
        } as Transition,
    },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get transition with reduced motion support
 */
export const getTransition = (transition: Transition): Transition => {
    if (prefersReducedMotion()) {
        return { duration: 0.01 } as Transition;
    }
    return transition;
};

/**
 * Get variants with reduced motion support
 */
export const getVariants = (variants: Variants): Variants => {
    if (prefersReducedMotion()) {
        return {
            initial: variants.initial,
            animate: { ...variants.initial, transition: { duration: 0.01 } as Transition },
            exit: { ...variants.initial, transition: { duration: 0.01 } as Transition },
        };
    }
    return variants;
};
