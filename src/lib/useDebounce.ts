import { useEffect, useState } from "react";

/**
 * Debounce a value. Returns the latest value after `delayMs` of no changes.
 * Useful for search inputs — typing shouldn't fire a query on every keystroke.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}
