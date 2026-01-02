import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps, InputRef } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';


const { TextArea, Password, Search } = AntInput;

type InputVariant = 'default' | 'filled' | 'borderless';
type InputSize = 'sm' | 'md' | 'lg';

const inputVariants = cva(
  'w-full transition-all !border !text-base !rounded-xl',
  {
    variants: {
      variant: {
        default: 'hover:!border-ring',
        filled: '!bg-muted !border-border focus:!border-ring hover:!border-ring',
        borderless: '!border-transparent !bg-transparent hover:!border-transparent',
      },
      size: {
        sm: 'h-8 !text-sm px-3',
        md: 'h-12 md:!text-base px-4',
        lg: 'min-h-12 md:!text-base px-4',
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

interface BaseInputProps {
  variant?: InputVariant;
  size?: InputSize;
  status?: 'error' | 'warning' | 'success';
  fullWidth?: boolean;
  className?: string;
}

export const Input = React.forwardRef<InputRef, BaseInputProps & Omit<AntInputProps, 'size'>>(({
  className,
  variant,
  status,
  disabled,
  size,
  ...props
}, ref) => {
  const antStatus = status as AntInputProps['status'];

  return (
    <AntInput
      className={cn(inputVariants({ variant, status, disabled, size }), className)}
      status={antStatus}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef<InputRef, BaseInputProps & Omit<TextAreaProps, 'size'>>(({
  className,
  variant,
  status,
  disabled,
  size,
  rows = 4,
  ...props
}, ref) => {
  const antStatus = status as AntInputProps['status'];

  return (
    <TextArea
      className={cn(inputVariants({ variant, status, disabled, size }), className)}
      status={antStatus}
      disabled={disabled}
      rows={rows}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export const PasswordInput = React.forwardRef<InputRef, BaseInputProps & Omit<AntInputProps, 'size'>>(({
  className,
  variant,
  status,
  disabled,
  size,
  ...props
}, ref) => {
  const antStatus = status as AntInputProps['status'];

  return (
    <Password
      className={cn(inputVariants({ variant, status, disabled, size }), className)}
      status={antStatus}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export const SearchInput = React.forwardRef<InputRef, BaseInputProps & Omit<AntInputProps, 'size'> & { onSearch?: (value: string) => void }>(({
  className,
  variant,
  status,
  disabled,
  size,
  onSearch,
  ...props
}, ref) => {
  const antStatus = status as AntInputProps['status'];

  return (
    <Search
      className={cn(inputVariants({ variant, status, disabled, size }), className)}
      status={antStatus}
      disabled={disabled}
      onSearch={onSearch}
      ref={ref}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';