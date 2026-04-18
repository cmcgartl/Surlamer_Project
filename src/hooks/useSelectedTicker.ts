import { useSearchParams } from "react-router-dom";

/**
 * Read and write the currently-selected ticker via the URL (?ticker=X).
 * URL is the source of truth — the ticker persists across reloads,
 * is shareable as a link, and the browser back button works naturally.
 */
export function useSelectedTicker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ticker = searchParams.get("ticker");

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
