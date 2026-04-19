import { useCallback, useEffect, useState } from "react";

/**
 * Reactive bridge to window.localStorage.
 * Acts like useState, but the value is mirrored to localStorage under the given key.
 *
 * Same-tab sync uses a module-level pub-sub (the native `storage` event only
 * fires cross-tab). Cross-tab sync uses the native `storage` event. Together,
 * any write — in any tab — reaches every subscribed hook.
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
    const unsubscribe = subscribe(key, (raw) =>
      setLocalValue(parse(raw, initial))
    );
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setLocalValue(parse(e.newValue, initial));
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
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

/**
 * Non-reactive write. Same pub-sub as useLocalStorage so all subscribed hooks
 * in the current tab refresh. Use from side-effect code that shouldn't
 * subscribe to the value itself (e.g., useSelectedTicker recording the latest
 * ticker into recently-viewed without re-rendering on every list change).
 */
export function writeLocalStorage<T>(
  key: string,
  updater: T | ((prev: T | null) => T)
) {
  try {
    const rawPrev = localStorage.getItem(key);
    const prev = rawPrev == null ? null : (JSON.parse(rawPrev) as T);
    const next =
      typeof updater === "function"
        ? (updater as (p: T | null) => T)(prev)
        : updater;
    const rawNext = JSON.stringify(next);
    localStorage.setItem(key, rawNext);
    notify(key, rawNext);
  } catch {
    /* quota exceeded or private mode — silent */
  }
}
