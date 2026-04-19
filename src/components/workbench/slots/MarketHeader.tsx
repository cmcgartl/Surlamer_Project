import { useTickerSnapshot } from "@/hooks/useTickerSnapshot";
import { formatCurrency, formatPercent } from "@/lib/format";

/**
 * Exploration-mode identity band. Mirrors TickerHeader's horizontal shape.
 * The SPY snapshot sits in the corner as market context — the primary copy
 * makes it clear this is a generic explore surface, not a dedicated
 * S&P 500 page.
 */
export function MarketHeader() {
  const { data: snapshot, isLoading } = useTickerSnapshot("SPY");

  const price = snapshot?.day?.c ?? snapshot?.prevDay?.c;
  const change = snapshot?.todaysChangePerc;
  const tone =
    change == null
      ? "text-muted-foreground"
      : change >= 0
        ? "text-positive"
        : "text-negative";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold">Explore</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Browse new equities and track them in your watchlist!
        </p>
      </div>

      {isLoading ? (
        <div className="h-12 w-36 shrink-0 animate-pulse rounded bg-muted" />
      ) : (
        <div className="flex shrink-0 flex-col items-end">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-lg font-semibold">
              {formatCurrency(price)}
            </span>
            <span className={`text-sm font-medium ${tone}`}>
              {formatPercent(change)}
            </span>
          </div>
          <span className="mt-0.5 text-xs text-muted-foreground">
            S&amp;P 500 close price
          </span>
        </div>
      )}
    </div>
  );
}
