"use client";

/**
 * Concept: Accessible "Back to Top" Scroll Floating Action Button.
 * Why: Enhances mobile and desktop user experience when browsing long lists of initiatives.
 * How: Listens to scroll events (triggers after 300px), smoothly scrolls window to top on click.
 * Example: Used across the events directory and homepage.
 */

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className={cn(
        "fixed bottom-6 right-6 z-40 rounded-full shadow-lg border-emerald-500/30 bg-background/90 backdrop-blur-sm hover:bg-emerald-600 hover:text-white transition-all duration-300 h-10 w-10 animate-in fade-in slide-in-from-bottom-2"
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
}
