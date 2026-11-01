import { cn } from "@/lib/utils";

/**
 * Concept: Loading Skeleton Component
 * Why:
 * Rather than showing a disruptive spinner or blank screen, skeletons mimic the exact
 * geometry of incoming content (e.g. event cards, titles, images) while data is fetching.
 * This prevents Cumulative Layout Shift (CLS) and provides a premium perceived speed.
 *
 * How:
 * A subtle pulsed background (`animate-pulse`) styled with the muted theme token.
 *
 * Example:
 * <Skeleton className="h-48 w-full rounded-xl" />
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted/80", className)} {...props} />;
}
