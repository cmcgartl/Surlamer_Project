import { Button } from "@/components/ui/button";
import { useTickerDetails } from "@/hooks/useTickerDetails";
import { useWatchlist } from "@/hooks/useWatchlist";
import { formatCompanyName } from "@/lib/format";

/**
 * Research-mode identity band. Horizontal strip across the workbench body.
 * Left: company name + ticker/exchange + sector. Right: Add/Remove watchlist.
 * The ← Back to Explore control lives one row up in the page layout alongside
 * the search bar, not in this component.
 */
export function TickerHeader({ ticker }: { ticker: string }) {
  const { data: detail, isLoading } = useTickerDetails(ticker);
  const { has, add, remove } = useWatchlist();
  const inWatchlist = has(ticker);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-baseline gap-3">
        {isLoading ? (
          <div className="h-6 w-44 animate-pulse rounded bg-muted" />
        ) : (
          <h2 className="truncate text-xl font-semibold">
            {detail?.name ? formatCompanyName(detail.name) : ticker}
          </h2>
        )}
        <span className="shrink-0 font-mono text-sm text-muted-foreground">
          {ticker}
        </span>
        {detail?.sic_description && (
          <span className="hidden truncate text-xs uppercase tracking-wide text-muted-foreground md:inline">
            {detail.sic_description}
          </span>
        )}
      </div>
      <Button
        variant={inWatchlist ? "outline" : "default"}
        size="sm"
        onClick={() => (inWatchlist ? remove(ticker) : add(ticker))}
        className="shrink-0"
      >
        {inWatchlist ? "Remove" : "+ Watchlist"}
      </Button>
    </div>
  );
}
