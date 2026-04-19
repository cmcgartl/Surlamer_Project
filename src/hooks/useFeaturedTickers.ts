import { useQuery } from "@tanstack/react-query";
import { massive } from "@/services/massive";
import { POPULAR_TICKERS } from "@/lib/popular-tickers";
import {
  SnapshotResponseSchema,
  type SnapshotTicker,
} from "@/services/schemas";

/**
 * Fetch snapshots for a curated list of popular large-caps (see
 * lib/popular-tickers.ts). Replaces the earlier gainers-endpoint approach —
 * gainers surfaced illiquid small-caps whose missing fields made the UI look
 * broken. Parallel per-ticker fetches with Promise.all; one bad ticker can't
 * collapse the whole list (each call has its own catch).
 */
export function useFeaturedTickers({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["featured-tickers"],
    queryFn: async () => {
      const snapshots = await Promise.all(
        POPULAR_TICKERS.map((t) =>
          massive
            .getStocksSnapshotTicker({ stocksTicker: t })
            .then((raw) => SnapshotResponseSchema.parse(raw).ticker ?? null)
            .catch(() => null)
        )
      );
      return snapshots.filter((s): s is SnapshotTicker => s !== null);
    },
    enabled,
    staleTime: 60_000,
  });
}
