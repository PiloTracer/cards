/* ------------------------------------------------------------------ */
/* components/ui/card.tsx                                             */
/* A very small, Tailwind-powered Card primitive                      */
/* ------------------------------------------------------------------ */
import * as React from "react";

/**
 * Utility: merge Tailwind class strings.
 * If you already have a `cn()` helper in `@/lib/utils`, remove this one
 * and re-export that instead to avoid duplication.
 */
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- */
/*  Root `Card` container                                          */
/* --------------------------------------------------------------- */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/* --------------------------------------------------------------- */
/*  Header – typically holds title & optional description           */
/* --------------------------------------------------------------- */
export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/* --------------------------------------------------------------- */
/*  Title                                                           */
/* --------------------------------------------------------------- */
export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/* --------------------------------------------------------------- */
/*  Optional description                                            */
/* --------------------------------------------------------------- */
export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* --------------------------------------------------------------- */
/*  Main content area                                               */
/* --------------------------------------------------------------- */
export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

/* --------------------------------------------------------------- */
/*  Optional footer (e.g. buttons)                                  */
/* --------------------------------------------------------------- */
export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

/* --------------------------------------------------------------- */
/*  Convenient named exports                                        */
/* --------------------------------------------------------------- */
export {
  CardDescription as Description,
  CardHeader as Header,
  CardContent as Content,
  CardFooter as Footer,
};
