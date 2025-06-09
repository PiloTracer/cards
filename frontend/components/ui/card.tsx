// components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils"; // if you already have one, otherwise you can inline the helper below

/**
 * Simple `cn()` fallback if you don't have one in @/lib/utils.
 * Comment this out if you're importing your own.
 */
// function cn(...classes: (string | undefined | false | null)[]) {
//   return classes.filter(Boolean).join(" ");
// }

/**
 * Card: a simple container with rounded border, shadow, and themeable background.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * Header: padded top section, for title/description
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-4 border-b dark:border-gray-700", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/**
 * Title: rendered inside the header, bold.
 */
export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold leading-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/**
 * Description: small subtitle under the title.
 */
export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-1 text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Content: the main body of the card, padded.
 */
export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

/**
 * Footer: bottom section, e.g. for buttons
 */
export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 py-4 border-t dark:border-gray-700", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

// Named exports for convenience:
export {
  CardHeader as Header,
  CardDescription as Description,
  CardContent as Content,
  CardFooter as Footer,
};
