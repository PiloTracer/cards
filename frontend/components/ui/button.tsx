/* ------------------------------------------------------------------ *
 * components/ui/button.tsx                                           *
 * Polymorphic <Button/> – supports variants, sizes & links           *
 * ------------------------------------------------------------------ */

import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  variants & sizes (Tailwind)                                        */
/* ------------------------------------------------------------------ */
const VARIANTS = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border",
  destructive: "bg-destructive text-destructive-foreground hover:bg-red-600",
  link: "text-primary underline-offset-4 hover:underline p-0",
};

const SIZES = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm", // default
  lg: "h-11 px-6 text-base",
};

/* ------------------------------------------------------------------ */
/*  types                                                              */
/* ------------------------------------------------------------------ */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual preset – maps to Tailwind classes */
  variant?: keyof typeof VARIANTS;
  /** Height / padding preset */
  size?: keyof typeof SIZES;
  /**
   * If present the button renders an `<a>` tag (so you can pass `href`)  
   * while maintaining button styling.
   */
  href?: string;
}

/* ------------------------------------------------------------------ */
/*  component                                                          */
/* ------------------------------------------------------------------ */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      className,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      VARIANTS[variant],
      SIZES[size],
      className
    );

    // Render an <a> tag if href is supplied, otherwise <button>
    if (href) {
      return (
        <a ref={ref as any} className={classes} href={href} {...(props as any)}>
          {children}
        </a>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
