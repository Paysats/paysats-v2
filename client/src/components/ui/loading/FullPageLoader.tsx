import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FullPageLoaderProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = 'Loading...',
  showProgress = false,
  progress = 0,
  className,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (showProgress && progress > 0) {
      setDisplayProgress(progress);
    } else if (showProgress) {
      const interval = setInterval(() => {
        setDisplayProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [progress, showProgress]);

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background',
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col items-center justify-center gap-6 px-4">
          {/* Modern Spinner */}
          <motion.div
            className="relative h-16 w-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Spinning ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            {/* Inner glow */}
            <motion.div
              className="absolute inset-2 rounded-full bg-primary/10"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Loading Message */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <p className="text-base font-medium text-foreground">{message}</p>

            {/* Progress Bar */}
            {showProgress && (
              <div className="w-64 overflow-hidden rounded-full bg-muted/50">
                <motion.div
                  className="h-1.5 rounded-full bg-linear-to-r from-primary/80 to-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    boxShadow: '0 0 10px rgba(248, 196, 220, 0.5)',
                  }}
                />
              </div>
            )}
          </motion.div>

          {/* Optional subtle text */}
          <motion.p
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Please wait...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

FullPageLoader.displayName = 'FullPageLoader';
