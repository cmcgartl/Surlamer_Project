import { useLocalStorage } from "@/lib/useLocalStorage";

/**
 * Watchlist state, persisted to localStorage under the 'watchlist' key.
 * Survives reloads. Per-device (no server sync).
 */
export function useWatchlist() {
  const [tickers, setTickers] = useLocalStorage<string[]>("watchlist", []);

  return {
    tickers,
    add: (ticker: string) =>
      setTickers((prev) => (prev.includes(ticker) ? prev : [...prev, ticker])),
    remove: (ticker: string) =>
      setTickers((prev) => prev.filter((t) => t !== ticker)),
    has: (ticker: string) => tickers.includes(ticker),
  };
}
