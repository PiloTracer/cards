/* ------------------------------------------------------------------ *
 * lib/utils.ts – misc one-liners shared across the front-end
 * ------------------------------------------------------------------ */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatenate conditional class-names *and* de-dupe conflicting
 * Tailwind utilities (e.g. `p-4` vs `p-6`) in one go.
 *
 * ```tsx
 * <div className={cn(
 *   "rounded-lg p-4",
 *   isActive && "bg-primary text-white",
 *   className                      // ← optional prop
 * )}/>
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
