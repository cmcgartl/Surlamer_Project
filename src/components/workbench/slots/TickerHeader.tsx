import { Button } from "@/components/ui/button";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { useTickerDetails } from "@/hooks/useTickerDetails";
import { useWatchlist } from "@/hooks/useWatchlist";

/**
 * Research-mode header. Compact nav + identity + action row.
 * Price, change, and the rest of the research surface live in SlotInfo.
 */
export function TickerHeader({ ticker }: { ticker: string }) {
  const { setTicker } = useSelectedTicker();
  const { data: detail, isLoading } = useTickerDetails(ticker);
  const { has, add, remove } = useWatchlist();
  const inWatchlist = has(ticker);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => setTicker(null)}>
          ← Explore
        </Button>
        <Button
          variant={inWatchlist ? "outline" : "default"}
          size="sm"
          onClick={() => (inWatchlist ? remove(ticker) : add(ticker))}
        >
          {inWatchlist ? "Remove" : "+ Watchlist"}
        </Button>
      </div>
      <div>
        {isLoading ? (
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
        ) : (
          <h2 className="text-lg font-semibold leading-tight">
            {detail?.name ?? ticker}
          </h2>
        )}
        <div className="font-mono text-xs text-muted-foreground mt-0.5">
          {ticker}
          {detail?.primary_exchange ? ` · ${detail.primary_exchange}` : ""}
        </div>
      </div>
    </div>
  );
}
