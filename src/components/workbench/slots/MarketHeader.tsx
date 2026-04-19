import { useTickerSnapshot } from "@/hooks/useTickerSnapshot";
import { formatCurrency, formatPercent } from "@/lib/format";

/**
 * Exploration-mode header. Uses SPY (S&P 500 ETF) as a market proxy so we get
 * live aggregate direction without a dedicated market-wide endpoint.
 */
export function MarketHeader() {
  const { data: snapshot, isLoading } = useTickerSnapshot("SPY");

  const price = snapshot?.day?.c ?? snapshot?.prevDay?.c;
  const change = snapshot?.todaysChangePerc;
  const tone =
    change == null
      ? "text-muted-foreground"
      : change >= 0
        ? "text-emerald-600"
        : "text-red-600";

  return (
    <div className="space-y-3">
      <div>
        <div className="font-mono text-xs text-muted-foreground">
          U.S. Equities · SPY
        </div>
        <h2 className="text-lg font-semibold leading-tight">S&amp;P 500</h2>
      </div>

      {isLoading ? (
        <div className="h-6 w-32 animate-pulse rounded bg-muted/60" />
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tabular-nums">
            {formatCurrency(price)}
          </span>
          <span className={`text-sm font-medium tabular-nums ${tone}`}>
            {formatPercent(change)}
          </span>
        </div>
      )}
    </div>
  );
}
