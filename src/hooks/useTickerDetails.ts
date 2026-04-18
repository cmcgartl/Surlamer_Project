import { useQuery } from "@tanstack/react-query";
import { massive } from "@/services/massive";
import { TickerDetailResponseSchema } from "@/services/schemas";

/**
 * Fetch detail for a single ticker. Validates response via Zod at the boundary.
 * Disabled (no fetch fires) when ticker is null.
 */
export function useTickerDetails(ticker: string | null) {
  return useQuery({
    queryKey: ["ticker-details", ticker],
    queryFn: async () => {
      const raw = await massive.getTicker({ ticker: ticker! });
      const parsed = TickerDetailResponseSchema.parse(raw);
      return parsed.results;
    },
    enabled: !!ticker,
    staleTime: 10 * 60_000, // 10 min — description/metrics don't change often
  });
}
