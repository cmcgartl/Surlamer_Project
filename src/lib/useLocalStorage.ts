import { useEffect, useState } from "react";

/**
 * Reactive bridge to window.localStorage.
 * Acts like useState, but the value is mirrored to localStorage under the given key.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded or private mode — silent */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
