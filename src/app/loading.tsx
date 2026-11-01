/**
 * Concept: Global Loading Indicator in Next.js App Router.
 * Why: Provides instant visual feedback during page transitions and server-side navigation.
 * How: Next.js automatically mounts this React component wrapped in Suspense at the route boundary.
 * Example: Navigating between /events and /profile immediately renders this smooth spinner.
 */

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-sm animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          Loading CommunityConnect...
        </p>
      </div>
    </div>
  );
}
