import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { pushRecentlyViewed } from "./useRecentlyViewed";

/**
 * Read and write the currently-selected ticker via the URL (?ticker=X).
 * URL is the source of truth — the ticker persists across reloads,
 * is shareable as a link, and the browser back button works naturally.
 *
 * Side effect: any observed ticker is pushed to recently-viewed. This
 * captures selections regardless of whether they came from setTicker inside
 * the app or a direct URL (e.g., landing → /workbench?ticker=AAPL).
 */
export function useSelectedTicker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ticker = searchParams.get("ticker");

  useEffect(() => {
    if (ticker) pushRecentlyViewed(ticker);
  }, [ticker]);

  const setTicker = (next: string | null) => {
    setSearchParams(
      (prev) => {
        if (next) prev.set("ticker", next);
        else prev.delete("ticker");
        return prev;
      },
      { replace: false }
    );
  };

  return { ticker, setTicker };
}
