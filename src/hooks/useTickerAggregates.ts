import { useQuery } from "@tanstack/react-query";
import { GetStocksAggregatesTimespanEnum } from "@massive.com/client-js";
import { massive } from "@/services/massive";
import { AggregatesResponseSchema } from "@/services/schemas";

export type TimeRange = "30d" | "3m" | "1y";

const RANGE_DEFS: Record<
  TimeRange,
  { days: number; multiplier: number; timespan: GetStocksAggregatesTimespanEnum }
> = {
  "30d": {
    days: 30,
    multiplier: 1,
    timespan: GetStocksAggregatesTimespanEnum.Day,
  },
  "3m": {
    days: 90,
    multiplier: 1,
    timespan: GetStocksAggregatesTimespanEnum.Day,
  },
  "1y": {
    days: 365,
    multiplier: 1,
    timespan: GetStocksAggregatesTimespanEnum.Day,
  },
};

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Fetch aggregate bars for a ticker over the given time range.
 * Range prop makes a time-range selector a wiring change, not a refactor.
 * Disabled when ticker is null.
 */
export function useTickerAggregates(
  ticker: string | null,
  range: TimeRange = "30d"
) {
  const def = RANGE_DEFS[range];
  return useQuery({
    queryKey: ["ticker-aggregates", ticker, range],
    queryFn: async () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - def.days);
      const raw = await massive.getStocksAggregates({
        stocksTicker: ticker!,
        multiplier: def.multiplier,
        timespan: def.timespan,
        from: isoDate(from),
        to: isoDate(to),
      });
      const parsed = AggregatesResponseSchema.parse(raw);
      return parsed.results ?? [];
    },
    enabled: !!ticker,
    staleTime: 5 * 60_000,
  });
}
