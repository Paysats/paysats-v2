import { cn } from "@/lib/utils";
import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import { cva, type VariantProps } from "class-variance-authority";
import React from 'react';
import { forwardRef } from "react";
import { motion } from 'framer-motion';
import { buttonVariants, buttonGlowVariants, springConfigs } from "@/config/animationConfig";

const MotionAntButton = motion(AntButton) as any;

const buttonStyles = cva(
  "bg-transparent !shadow-none !flex !items-center !rounded-md !justify-center !gap-2 !font-medium !transition-colors focus:!outline-none focus:!ring-2 focus:ring-ring focus-visible:outline-hidden focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "!bg-primary [&_svg]:w-5 [&_svg]:h-5 !text-primary-foreground hover:!bg-primary/85 !rounded-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "!bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "!text-primary !border-none !shadow-none underline-offset-4 hover:underline",
        filled: "!bg-accent !text-accent-foreground hover:!bg-accent/90",
      },
      size: {
        default: "!h-10 !px-3 !py-0",
        sm: "!h-8 !px-3 !py-0 text-sm",
        lg: "!h-12 !px-4 !py-0 text-lg",
        icon: "!h-10 !w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

interface ButtonProps
  extends Omit<AntButtonProps, 'size' | 'variant'>,
  VariantProps<typeof buttonStyles> {
  className?: string;
  icon?: React.ReactNode;
  htmlType?: "button" | "submit" | "reset";
  animate?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      icon,
      htmlType = "button",
      children,
      animate = true,
      ...props
    },
    ref,
  ) => {
    const antSize = size === "sm" ? "small" : size === "lg" ? "large" : "middle";

    // Only animate if enabled and not disabled
    const shouldAnimate = animate && !props.disabled && !props.loading;

    return (
      <MotionAntButton
        className={cn(
          buttonStyles({ variant, size, fullWidth, className }),
        )}
        size={antSize}
        icon={icon}
        htmlType={htmlType}
        ref={ref}
        {...props}
        whileHover={shouldAnimate ? "hover" : undefined}
        whileTap={shouldAnimate ? "tap" : undefined}
        variants={buttonVariants}
        // Add glow effect for default variant
        style={variant === 'default' && shouldAnimate ? { position: 'relative', overflow: 'hidden' } : {}}
      >
        {children}
      </MotionAntButton>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonStyles as buttonVariants };