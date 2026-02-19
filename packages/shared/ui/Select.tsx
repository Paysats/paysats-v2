import React from 'react';
import { Select as AntSelect } from 'antd';
import type { SelectProps as AntSelectProps, RefSelectProps } from 'antd';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';

type SelectVariant = 'default' | 'filled' | 'borderless';
type SelectSize = 'sm' | 'md' | 'lg';

const selectVariants = cva(
  'w-full transition-all !border !text-sm',
  {
    variants: {
      variant: {
        default: '!border-input !bg-background focus:!border-ring hover:!border-ring',
        filled: '!bg-muted !border-border focus:!border-ring hover:!border-ring',
        borderless: '!border-transparent !bg-transparent hover:!border-transparent',
      },
      size: {
        sm: 'h-8 !text-sm',
        md: 'h-10 md:!text-base',
        lg: 'h-11 md:!text-base',
      },
      status: {
        error: '!border-destructive hover:!border-destructive focus:!border-destructive',
        warning: '!border-secondary hover:!border-secondary focus:!border-secondary',
        success: '!border-primary hover:!border-primary focus:!border-primary',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed !bg-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BaseSelectProps {
  variant?: SelectVariant;
  size?: SelectSize;
  status?: 'error' | 'warning' | 'success';
  fullWidth?: boolean;
  className?: string;
}

export const Select = React.forwardRef<RefSelectProps, BaseSelectProps & Omit<AntSelectProps, 'size'>>(({
  className,
  variant,
  status,
  disabled,
  size,
  ...props
}, ref) => {
  const antStatus = status as AntSelectProps['status'];

  return (
    <AntSelect
      className={cn(selectVariants({ variant, status, disabled, size }), className)}
      status={antStatus}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

Select.displayName = 'Select';


export const { Option, OptGroup } = AntSelect;