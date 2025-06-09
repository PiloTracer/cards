// components/ui/button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

/** Tailwind class strings for each variant */
export const VARIANTS = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-input",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link: "text-primary hover:underline p-0",
} as const;

/** Tailwind class strings for each size */
export const SIZES = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3",
} as const;

/** Narrow the variant & size props to the keys of the above objects */
export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual preset – maps to one of VARIANTS */
  variant?: ButtonVariant;
  /** Padding / font-size preset – one of SIZES */
  size?: ButtonSize;
  /**
   * if provided, renders an `<a>` instead of `<button>` (for external
   * or `<Link>`-style usage) with the same styling.
   */
  href?: string;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ 
    variant = "default", 
    size = "md", 
    className, 
    href, 
    children, 
    ...props 
  }, ref) => {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  if (href) {
    return (
      <a
        ref={ref as any}
        href={href}
        className={classes}
        {...(props as any)}
      >
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});
Button.displayName = "Button";
