"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * Concept: Dark / Light Mode Provider
 * Why:
 * Modern web applications support dark mode for accessibility and user comfort.
 * Directly toggling the `.dark` class in client components can cause React hydration
 * mismatches if the server renders light mode while the user's browser prefers dark mode.
 *
 * How:
 * `next-themes` handles client-side synchronization and injects an inline script
 * to set the appropriate class before React mounts, eliminating flashes of unstyled content (FOUC).
 *
 * Example:
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *   {children}
 * </ThemeProvider>
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
