import { useTickerSnapshot } from "@/hooks/useTickerSnapshot";
import { formatCurrency, formatPercent } from "@/lib/format";

/**
 * Exploration-mode identity band. Horizontal strip mirroring TickerHeader's
 * shape so the two modes feel symmetric. SPY serves as the S&P 500 proxy.
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
      <div className="flex min-w-0 items-baseline gap-3">
        <h2 className="text-xl font-semibold">S&amp;P 500</h2>
        <span className="shrink-0 font-mono text-sm text-muted-foreground">
          SPY
        </span>
        <span className="hidden text-xs uppercase tracking-wide text-muted-foreground md:inline">
          U.S. Equities
        </span>
      </div>
      {isLoading ? (
        <div className="h-5 w-36 animate-pulse rounded bg-muted" />
      ) : (
        <div className="flex shrink-0 items-baseline gap-2 tabular-nums">
          <span className="text-lg font-semibold">{formatCurrency(price)}</span>
          <span className={`text-sm font-medium ${tone}`}>
            {formatPercent(change)}
          </span>
        </div>
      )}
    </div>
  );
}
