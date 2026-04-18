import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useDebounce } from "@/lib/useDebounce";
import { useSearchTickers } from "@/hooks/useSearchTickers";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { setTicker } = useSelectedTicker();

  const { data: results, isLoading, isError } = useSearchTickers(debouncedQuery);

  const showPanel = query.trim().length > 0;

  const handleSelect = (ticker: string) => {
    setTicker(ticker);
    setQuery("");
  };

  return (
    <div className="space-y-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tickers (e.g., AAPL)"
      />

      {showPanel && (
        <Card className="p-2 text-sm">
          {isLoading && (
            <div className="px-2 py-1.5 text-muted-foreground">Searching…</div>
          )}

          {isError && (
            <div className="px-2 py-1.5 text-destructive">
              Search failed. Try again.
            </div>
          )}

          {!isLoading && !isError && results && results.length === 0 && (
            <div className="px-2 py-1.5 text-muted-foreground">
              No matches for "{debouncedQuery}".
            </div>
          )}

          {!isLoading && !isError && results && results.length > 0 && (
            <ul>
              {results.map((r) => (
                <li key={r.ticker}>
                  <button
                    onClick={() => handleSelect(r.ticker)}
                    className="w-full grid grid-cols-[80px_1fr_auto] items-center gap-3 rounded px-2 py-1.5 text-left hover:bg-accent"
                  >
                    <span className="font-mono font-semibold">{r.ticker}</span>
                    <span className="truncate text-muted-foreground">
                      {r.name}
                    </span>
                    {r.type && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {r.type}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
