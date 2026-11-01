"use client";

/**
 * Concept: Global Client-Side Error Boundary in Next.js App Router.
 * Why: Catches unhandled client-side runtime errors gracefully without crashing the whole browser tab.
 * How: Next.js injects error and reset props into this boundary to enable seamless retry without a hard reload.
 * Example: A network disconnect during data parsing shows a friendly alert with a "Try Again" trigger.
 */

import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring or console in development
    console.error("Client runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto border border-red-500/20 shadow-sm">
            <AlertOctagon className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              Application Notice
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Something Went Wrong
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We encountered an unexpected issue while rendering this page. You can try refreshing the component.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button onClick={() => reset()} className="w-full sm:w-auto gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" /> Return Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
