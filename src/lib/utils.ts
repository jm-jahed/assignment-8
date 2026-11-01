import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concept: Class Name Merge Utility (cn)
 * Why:
 * In React with Tailwind CSS, components often need dynamic classes (e.g. conditional colors,
 * hover states, or custom classes passed via props).
 * - `clsx` handles conditional class strings (e.g. `isActive && "bg-emerald-500"`).
 * - `twMerge` resolves Tailwind conflicts (e.g. if a component has default `p-4` and the caller passes `p-6`,
 *   twMerge ensures `p-6` wins instead of both competing in the CSS cascade).
 *
 * How:
 * We combine both into a single `cn(...inputs)` helper function used across all Shadcn UI components.
 *
 * Example:
 * <button className={cn("px-4 py-2 font-medium bg-emerald-600", disabled && "opacity-50 cursor-not-allowed", className)} />
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
