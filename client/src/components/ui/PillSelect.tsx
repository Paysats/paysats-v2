import React from 'react';
import { cn } from '@/lib/utils';

export interface PillOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface PillSelectProps {
  options: PillOption[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  pillClassName?: string;
  ariaLabel?: string;
}

const PillSelect: React.FC<PillSelectProps> = ({
  options,
  value,
  onChange,
  className,
  pillClassName,
  ariaLabel
}) => {
  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected ? 'true' : 'false'}
            tabIndex={0}
            onClick={() => onChange(option.value)}
            className={cn(
              'text-sm flex items-center gap-2 px-3 py-1 rounded-sm border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring',
              isSelected
                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                : 'bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary',
              pillClassName
            )}
          >
            {option.icon && <span className="text-lg">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PillSelect; 