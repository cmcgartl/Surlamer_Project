import { useQuery } from "@tanstack/react-query";
import { massive } from "@/services/massive";
import { SnapshotResponseSchema } from "@/services/schemas";

/**
 * Fetch the live snapshot (price + day change) for a ticker.
 * Shorter staleTime than details — price moves during the session.
 * Disabled (no fetch fires) when ticker is null.
 */
export function useTickerSnapshot(ticker: string | null) {
  return useQuery({
    queryKey: ["ticker-snapshot", ticker],
    queryFn: async () => {
      const raw = await massive.getStocksSnapshotTicker({
        stocksTicker: ticker!,
      });
      const parsed = SnapshotResponseSchema.parse(raw);
      return parsed.ticker ?? null;
    },
    enabled: !!ticker,
    staleTime: 30_000,
  });
}
