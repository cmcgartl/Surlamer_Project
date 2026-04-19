import { useQuery } from "@tanstack/react-query";
import { ListNewsOrderEnum } from "@massive.com/client-js";
import { massive } from "@/services/massive";
import { NewsResponseSchema } from "@/services/schemas";

/**
 * Fetch recent news articles. Pass a ticker for ticker-filtered news;
 * omit for general market news. Articles come with Massive-computed sentiment
 * insights (positive/neutral/negative) — no LLM involved on our side.
 */
export function useTickerNews(ticker?: string) {
  return useQuery({
    queryKey: ["ticker-news", ticker ?? "general"],
    queryFn: async () => {
      const raw = await massive.listNews({
        ticker,
        limit: 6,
        order: ListNewsOrderEnum.Desc,
      });
      const parsed = NewsResponseSchema.parse(raw);
      return parsed.results ?? [];
    },
    staleTime: 5 * 60_000,
  });
}
