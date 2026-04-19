import { AreaChart } from "@tremor/react";
import { useTickerAggregates } from "@/hooks/useTickerAggregates";
import { formatCurrency } from "@/lib/format";

const DEMO_TICKER = "AAPL";

/**
 * Hero carousel slide 3 — price history preview.
 * Uses the same Tremor AreaChart + useTickerAggregates the workbench uses,
 * so the marketing surface actually reflects the product. Fetches real 30d
 * AAPL data (one extra call on landing load; Tanstack Query caches it for
 * the workbench if the user clicks through).
 */
export function ChartCard() {
  const { data: bars, isLoading, isError } = useTickerAggregates(
    DEMO_TICKER,
    "30d"
  );

  const hasData = !isLoading && !isError && bars && bars.length >= 2;
  const first = hasData ? bars[0].c : null;
  const last = hasData ? bars[bars.length - 1].c : null;
  const isUp = hasData ? last! >= first! : true;
  const pct = hasData ? ((last! - first!) / first!) * 100 : 0;
  const color = isUp ? "emerald" : "rose";
  const tone = isUp ? "text-positive" : "text-negative";

  const chartData = hasData
    ? bars.map((b) => ({
        date: new Date(b.t).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        Close: b.c,
      }))
    : [];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Price · 30 days
          </div>
          <div className="mt-0.5 font-semibold">{DEMO_TICKER}</div>
        </div>
        {hasData && (
          <div className="text-right">
            <div className="text-lg font-semibold tabular-nums">
              {formatCurrency(last)}
            </div>
            <div className={`text-xs tabular-nums ${tone}`}>
              {pct >= 0 ? "+" : ""}
              {pct.toFixed(2)}% mo.
            </div>
          </div>
        )}
      </div>

      {!hasData && (
        <div className="h-40 animate-pulse rounded bg-muted/60" />
      )}

      {hasData && (
        <AreaChart
          data={chartData}
          index="date"
          categories={["Close"]}
          colors={[color]}
          valueFormatter={(v) => formatCurrency(v)}
          showLegend={false}
          showAnimation
          yAxisWidth={96}
          className="h-40"
        />
      )}
    </div>
  );
}
