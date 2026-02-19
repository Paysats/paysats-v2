import { motion } from 'framer-motion';
import { useFloating } from '@/hooks/useAnimations';
import { prefersReducedMotion } from '@/config/animationConfig';
import type { ReactNode } from 'react';

interface FloatingIconProps {
    children: ReactNode;
    duration?: number;
    rotate?: boolean;
    className?: string;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
    children,
    duration = 4,
    rotate = false,
    className = '',
}) => {
    const floatingVariants = useFloating(duration);

    if (prefersReducedMotion()) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            style={{
                display: 'inline-block',
            }}
            {...(rotate && {
                animate: {
                    y: [-10, 10, -10],
                    rotate: [-5, 5, -5],
                },
                transition: {
                    duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                },
            })}
        >
            {children}
        </motion.div>
    );
};
