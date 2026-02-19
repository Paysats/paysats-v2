import { motion } from 'framer-motion';
import { prefersReducedMotion } from '@shared/config/animationConfig';
import type { ReactNode } from 'react';

interface GlowEffectProps {
    children: ReactNode;
    color?: string;
    intensity?: 'low' | 'medium' | 'high';
    pulse?: boolean;
    className?: string;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
    children,
    color = 'var(--primary)',
    intensity = 'medium',
    pulse = false,
    className = '',
}) => {
    const getGlowIntensity = () => {
        switch (intensity) {
            case 'low':
                return `0 0 10px ${color}30, 0 0 20px ${color}20`;
            case 'medium':
                return `0 0 20px ${color}40, 0 0 40px ${color}20`;
            case 'high':
                return `0 0 30px ${color}60, 0 0 60px ${color}30, 0 0 90px ${color}20`;
            default:
                return `0 0 20px ${color}40, 0 0 40px ${color}20`;
        }
    };

    if (prefersReducedMotion()) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            animate={
                pulse
                    ? {
                        boxShadow: [
                            '0 0 0 transparent',
                            getGlowIntensity(),
                            '0 0 0 transparent',
                        ],
                    }
                    : {}
            }
            transition={
                pulse
                    ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }
                    : undefined
            }
            whileHover={{
                boxShadow: getGlowIntensity(),
            }}
        >
            {children}
        </motion.div>
    );
};
