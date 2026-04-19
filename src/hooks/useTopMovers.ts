import { useQuery } from "@tanstack/react-query";
import { GetStocksSnapshotDirectionDirectionEnum } from "@massive.com/client-js";
import { massive } from "@/services/massive";
import { SnapshotTickersResponseSchema } from "@/services/schemas";

/**
 * Fetch today's top gainers. Surfaces both on the workbench (SlotRelated
 * "Highlighted Today" in exploration mode) and in SlotInfo's TopMoversList.
 * `enabled` lets a composing slot opt out when not in its mode.
 */
export function useTopMovers({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["top-movers", "gainers"],
    queryFn: async () => {
      const raw = await massive.getStocksSnapshotDirection({
        direction: GetStocksSnapshotDirectionDirectionEnum.Gainers,
      });
      const parsed = SnapshotTickersResponseSchema.parse(raw);
      return parsed.tickers ?? [];
    },
    enabled,
    staleTime: 60_000,
  });
}
