import { useQuery } from "@tanstack/react-query";
import { massive } from "@/services/massive";
import {
  RelatedCompaniesResponseSchema,
  SnapshotResponseSchema,
  type SnapshotTicker,
} from "@/services/schemas";

/**
 * Fetch related companies for a ticker, then grab a snapshot for each so the
 * list can show day change alongside the ticker. Snapshots are fetched
 * individually in parallel (Promise.all) — the SDK's bulk endpoint serializes
 * the `tickers` array as repeated query params, which Polygon collapses to
 * the last value and silently returns a single result.
 *
 * Capped at 10 related tickers to keep the fanout bounded.
 */
export function useRelatedTickers(ticker: string | null) {
  return useQuery({
    queryKey: ["related-tickers", ticker],
    queryFn: async () => {
      const relatedRaw = await massive.getRelatedCompanies({
        ticker: ticker!,
      });
      const related = RelatedCompaniesResponseSchema.parse(relatedRaw);
      const tickers = (related.results ?? [])
        .map((r) => r.ticker)
        .slice(0, 10);
      if (tickers.length === 0) return [];

      const snapshots = await Promise.all(
        tickers.map((t) =>
          massive
            .getStocksSnapshotTicker({ stocksTicker: t })
            .then((raw) => SnapshotResponseSchema.parse(raw).ticker ?? null)
            .catch(() => null)
        )
      );
      return snapshots.filter((s): s is SnapshotTicker => s !== null);
    },
    enabled: !!ticker,
    staleTime: 5 * 60_000,
  });
}
