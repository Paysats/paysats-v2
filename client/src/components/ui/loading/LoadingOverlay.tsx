import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader, type LoaderProps } from './Loader';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  blur?: boolean;
  className?: string;
  loaderSize?: LoaderProps['size'];
  loaderVariant?: LoaderProps['variant'];
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message,
  blur = true,
  className,
  loaderSize = 'lg',
  loaderVariant = 'primary',
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={cn(
            'absolute inset-0 z-50 flex flex-col items-center justify-center',
            blur ? 'backdrop-blur-sm bg-background/60' : 'bg-background/80',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader size={loaderSize} variant={loaderVariant} />
            {message && (
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {message}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';
