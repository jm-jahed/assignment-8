"use client";

/**
 * Concept: Interactive Category Filter Bar Component.
 * Why: Allows users to quickly toggle between social cause categories (Environment, Healthcare, Education, etc.).
 * How: Renders pill buttons with active selection styles, keyboard accessibility, and counts.
 * Example: Selecting "Environment" updates the query filter and highlights the pill in emerald green.
 */

import React from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: CategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter events by category"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border",
              isActive
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 scale-105"
                : "bg-muted/60 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
