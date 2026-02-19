import React from 'react';
import { MotionDiv } from "@shared/ui/MotionComponents"
import { useFloating } from '@shared/hooks/useAnimations';
import { cn } from '@shared/utils/cn';

interface FloatingIconProps {
    icon: React.ReactNode;
    className?: string;
    duration?: number;
    delay?: number;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
    icon,
    className,
    duration = 4,
    delay = 0,
}) => {
    const floatingVariants = useFloating(duration);

    return (
        <MotionDiv
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            transition={{ delay }}
            className={cn('inline-flex items-center justify-center', className)}
        >
            {icon}
        </MotionDiv>
    );
};
