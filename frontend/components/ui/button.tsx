// components/ui/button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  link:    "text-primary hover:underline p-0",
};
const SIZES = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "md", className, href, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors",
      VARIANTS[variant],
      SIZES[size],
      className
    );

    if (href) {
      return (
        <a ref={ref as any} href={href} className={classes} {...(props as any)}>
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
