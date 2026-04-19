import { useLocalStorage, writeLocalStorage } from "@/lib/useLocalStorage";

const KEY = "recently-viewed";
const MAX = 5;

/**
 * Reactive reader for the recently-viewed ticker list. Newest first.
 * Writes happen via `pushRecentlyViewed` below — typically from
 * useSelectedTicker's URL-change effect, not from components directly.
 */
export function useRecentlyViewed() {
  const [tickers] = useLocalStorage<string[]>(KEY, []);
  return tickers;
}

/**
 * Non-reactive write — move `ticker` to the front, de-dupe, cap at MAX.
 * Broadcast-friendly: all useRecentlyViewed consumers in the tab refresh.
 */
export function pushRecentlyViewed(ticker: string) {
  writeLocalStorage<string[]>(KEY, (prev) => {
    const current = prev ?? [];
    return [ticker, ...current.filter((t) => t !== ticker)].slice(0, MAX);
  });
}
