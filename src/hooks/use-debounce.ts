"use client";

import { useState, useEffect } from "react";

/**
 * Concept: Debounced Value Hook (useDebounce)
 * Why:
 * When a user types into a search input (e.g., "clean water drive"), querying the database
 * on every single keystroke causes dozens of unnecessary network requests and lags the UI.
 *
 * How:
 * We set a timer that delays updating the returned value until the user stops typing
 * for `delay` milliseconds (default 300ms). If the user types another character before the timer
 * expires, the cleanup function cancels the previous timer and starts a fresh one.
 *
 * Example:
 * const debouncedSearch = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
