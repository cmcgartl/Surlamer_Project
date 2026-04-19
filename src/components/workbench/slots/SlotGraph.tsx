import { AreaChart } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import {
  useTickerAggregates,
  type TimeRange,
} from "@/hooks/useTickerAggregates";
import { formatCurrency, formatDate } from "@/lib/format";
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
    <Card className={`flex flex-col overflow-hidden p-0 ${className}`}>
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
    <>
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-base font-semibold">Price</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {ticker} · {range}
        </span>
      </div>

      <div className="p-4">
        {isLoading && (
          <div className="h-48 animate-pulse rounded bg-muted/60" />
        )}

        {isError && (
          <div className="space-y-2 py-4">
            <p className="text-sm text-destructive">
              Couldn't load chart data.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && data && data.length < 2 && (
          <InsufficientDataFallback ticker={ticker} bars={data} />
        )}

        {!isLoading && !isError && data && data.length >= 2 && (
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
    </>
  );
}

function InsufficientDataFallback({
  ticker,
  bars,
}: {
  ticker: string;
  bars: AggregateBar[];
}) {
  const only = bars[0];
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-1.5 rounded border border-dashed border-muted-foreground/20 p-4 text-center">
      <p className="text-sm font-medium">Limited trading history</p>
      <p className="text-xs text-muted-foreground">
        {bars.length === 0
          ? `No trading days for ${ticker} in the last 30 days.`
          : `Only 1 day of data in the last 30 days — ${ticker} trades infrequently.`}
      </p>
      {only && (
        <p className="mt-1 text-xs tabular-nums text-muted-foreground">
          Last close: {formatCurrency(only.c)} on {formatDate(only.t)}
        </p>
      )}
    </div>
  );
}

function toChartData(bars: AggregateBar[]) {
  return bars.map((bar) => ({
    date: formatTick(bar.t),
    Close: bar.c,
  }));
}

function formatTick(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
