import { AreaChart } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import {
  useTickerAggregates,
  type TimeRange,
} from "@/hooks/useTickerAggregates";
import { formatCurrency } from "@/lib/format";
import type { AggregateBar } from "@/services/schemas";

/**
 * Pattern B — parameter-driven. Same inner Graph, different ticker.
 * Exploration: SPY (S&P 500 ETF, used as a market proxy).
 * Research: the selected ticker.
 *
 * Range is hardcoded to "30d" here; swap to local state for the stretch goal
 * time-range selector (the hook is already parameterized).
 */
export function SlotGraph({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  const chartTicker = ticker ?? "SPY";

  return (
    <Card className={`p-4 ${className}`}>
      <Graph ticker={chartTicker} range="30d" />
    </Card>
  );
}

function Graph({ ticker, range }: { ticker: string; range: TimeRange }) {
  const { data, isLoading, isError, refetch } = useTickerAggregates(
    ticker,
    range
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Price</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {ticker} · {range}
        </span>
      </div>

      {isLoading && (
        <div className="h-48 animate-pulse rounded bg-muted/60" />
      )}

      {isError && (
        <div className="space-y-2 py-4">
          <p className="text-sm text-destructive">Couldn't load chart data.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
          No price data for this range.
        </div>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <AreaChart
          data={toChartData(data)}
          index="date"
          categories={["Close"]}
          colors={["indigo"]}
          valueFormatter={(v) => formatCurrency(v)}
          showLegend={false}
          showAnimation
          yAxisWidth={64}
          className="h-48"
        />
      )}
    </div>
  );
}

function toChartData(bars: AggregateBar[]) {
  return bars.map((bar) => ({
    date: formatDate(bar.t),
    Close: bar.c,
  }));
}

function formatDate(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
