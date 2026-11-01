"use client";

/**
 * Concept: Custom 404 Not Found Page for CommunityConnect.
 * Why: Provides clear, branded user recovery when a visitor navigates to a non-existent URL.
 * How: Next.js App Router automatically renders this file whenever notFound() is thrown
 *      or when an unknown path is visited.
 * Example: Visiting /events/invalid-path displays a friendly guide back to the events directory.
 */

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { MapPinOff, ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-sm">
            <MapPinOff className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              404 Error • Page Not Found
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Looks Like You Took a Detour
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page or initiative you are looking for doesn&apos;t exist, was moved, or is no longer active.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="default" className="w-full gap-2">
                <Home className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
            <Link href="/events" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <Compass className="w-4 h-4" /> Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
