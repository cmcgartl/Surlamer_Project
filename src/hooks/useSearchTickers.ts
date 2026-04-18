import { useQuery } from "@tanstack/react-query";
import { ListTickersMarketEnum } from "@massive.com/client-js";
import { massive } from "@/services/massive";
import { TickerListResponseSchema } from "@/services/schemas";

/**
 * Fetch ticker search results for a query string.
 * Disabled when query is empty; the SearchBar owns debouncing at the input level.
 * Scoped to US-listed equities via the SDK's market filter.
 */
export function useSearchTickers(query: string) {
  return useQuery({
    queryKey: ["search-tickers", query],
    queryFn: async () => {
      const raw = await massive.listTickers({
        search: query,
        market: ListTickersMarketEnum.Stocks,
        active: true,
        limit: 10,
      });
      const parsed = TickerListResponseSchema.parse(raw);
      return parsed.results ?? [];
    },
    enabled: query.trim().length > 0,
    staleTime: 30_000,
  });
}
