import { useCallback, useEffect, useState } from "react";

/**
 * Reactive bridge to window.localStorage.
 * Acts like useState, but the value is mirrored to localStorage under the given key.
 *
 * Writes are broadcast to all useLocalStorage callers with the same key in the
 * current tab (tiny pub-sub below), so sibling components stay in sync without
 * a Context provider. The native `storage` event only fires cross-tab, not
 * same-tab, which is why the manual broadcast is needed.
 */

type Listener = (raw: string | null) => void;
const listeners = new Map<string, Set<Listener>>();

function subscribe(key: string, cb: Listener): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(cb);
  return () => {
    set!.delete(cb);
  };
}

function notify(key: string, raw: string | null) {
  listeners.get(key)?.forEach((cb) => cb(raw));
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setLocalValue] = useState<T>(() => {
    try {
      return parse(localStorage.getItem(key), initial);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    return subscribe(key, (raw) => setLocalValue(parse(raw, initial)));
    // `initial` is a fallback for malformed JSON; caller should pass a stable value.

  }, [key]);

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setLocalValue((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (p: T) => T)(prev)
            : updater;
        try {
          const raw = JSON.stringify(next);
          localStorage.setItem(key, raw);
          notify(key, raw);
        } catch {
          /* quota exceeded or private mode — silent */
        }
        return next;
      });
    },
    [key]
  );

  return [value, setValue] as const;
}
