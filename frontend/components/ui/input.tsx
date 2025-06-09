// components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
