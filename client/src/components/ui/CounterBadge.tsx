import React from 'react';
import { cn } from '@/lib/utils';
import { MotionDiv } from './MotionComponents';

interface CounterBadgeProps {
  count: number;
  className?: string;
  label?: string;
}

export const CounterBadge: React.FC<CounterBadgeProps> = ({ 
  count, 
  className,
  label
}) => {
  return (
    <div className="flex flex-col items-center">
      <MotionDiv 
        className={cn(
          'relative bg-linear-to-r from-secondary to-primary p-1 rounded-lg',
          className
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.1
        }}
      >
        <div className="bg-card rounded-md px-4 py-2 flex items-center justify-center">
          <span className="text-2xl font-bold bg-linear-to-r from-secondary to-primary text-transparent bg-clip-text">
            {count.toLocaleString()}
          </span>
        </div>
      </MotionDiv>
      {label && (
        <span className="mt-2 text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
};