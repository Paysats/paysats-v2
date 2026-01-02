import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const loaderVariants = cva('inline-block border-solid rounded-full animate-spin', {
  variants: {
    size: {
      xs: 'h-3 w-3 border-2',
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-[3px]',
      lg: 'h-8 w-8 border-[3px]',
      xl: 'h-12 w-12 border-4',
      '2xl': 'h-16 w-16 border-4',
    },
    variant: {
      primary: 'border-primary/30 border-t-primary',
      accent: 'border-accent/30 border-t-foreground',
      white: 'border-white/30 border-t-white',
      muted: 'border-muted/50 border-t-muted-foreground',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

export interface LoaderProps extends VariantProps<typeof loaderVariants> {
  className?: string;
  label?: string;
  showLabel?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  label,
  showLabel = false,
}) => {
  return (
    <div className="inline-flex flex-col items-center justify-center gap-2">
      <motion.div
        className={cn(loaderVariants({ size, variant }), className)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        aria-label={label || 'Loading'}
        role="status"
      />
      {showLabel && label && (
        <motion.span
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
};

Loader.displayName = 'Loader';
