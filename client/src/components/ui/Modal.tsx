import React from 'react';
import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

type ModalVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface ModalProps extends Omit<AntModalProps, 'open' | 'onCancel' | 'footer' | 'closable' | 'centered' | 'width' | 'maskClosable' | 'mask' | 'destroyOnClose'> {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  width?: number | string;
  showCloseButton?: boolean;
  className?: string;
  footer?: React.ReactNode;
  centered?: boolean;
  variant?: ModalVariant;
  maskClosable?: boolean;
  destroyOnHidden?: boolean;
}
const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 400,
    } as Transition,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    } as Transition,
  },
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 520,
  showCloseButton = true,
  className,
  footer,
  centered = true,
  variant = 'default',
  maskClosable = true,
  ...antModalProps
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-primary';
      case 'warning':
        return 'border-secondary';
      case 'danger':
        return 'border-destructive';
      case 'info':
        return 'border-secondary';
      default:
        return 'border-border';
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <AntModal
          {...antModalProps}
          open={isOpen}
          onCancel={onClose}
          footer={null}
          closable={false}
          centered={centered}
          width={width}
          maskClosable={maskClosable}
          mask={true}
          styles={{ mask: { backdropFilter: 'blur(2px)' } }}
          wrapClassName="bg-transparent!"
          className="[&_.ant-modal-content]:p-0.5! md:p-0!"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className={cn(
              'bg-card py-2 rounded-2xl shadow',
              'border',
              getVariantStyles(),
              className
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-3 md:px-4 py-4 border-b border-border">
                {title && (
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X size={20} />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-2 md:px-4 py-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2 px-3 md:px-4 py-4 border-t border-border"
              >
                {footer}
              </div>
            )}
          </motion.div>
        </AntModal>
      )}
    </AnimatePresence>
  );
}; 