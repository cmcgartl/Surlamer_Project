import { useQuery } from "@tanstack/react-query";
import { ListTickersMarketEnum } from "@massive.com/client-js";
import { massive } from "@/services/massive";
import {
  TickerListResponseSchema,
  type TickerSummary,
} from "@/services/schemas";

/**
 * Ticker prefix search.
 *
 * Uses ticker.gte + ticker.lt as an alphabetical range rather than the `search`
 * parameter, because `search` does substring-match-anywhere on both ticker and
 * name — which returns irrelevant results for short queries (e.g., "t" returns
 * a long list of A-tickers whose names happen to contain "t").
 *
 * Prefix matching means: query "aap" returns AAP, AAPB, AAPD, AAPL, AAPR, ...
 * (all tickers starting with "AAP"), ranked by type so common stocks come first.
 *
 * Known tradeoff: pure name searches like "apple" return nothing because no
 * ticker starts with the letters "apple". Name-based search is a Stage 2 add
 * (merge a second call to `search=` for longer queries).
 */
export function useSearchTickers(query: string) {
  const q = query.trim().toUpperCase();
  return useQuery({
    queryKey: ["search-tickers", q],
    queryFn: async () => {
      const raw = await massive.listTickers({
        tickerGte: q,
        tickerLt: nextPrefix(q),
        market: ListTickersMarketEnum.Stocks,
        active: true,
        limit: 20,
      });
      const parsed = TickerListResponseSchema.parse(raw);
      const results = parsed.results ?? [];
      return rankResults(results, q);
    },
    enabled: q.length > 0,
    staleTime: 30_000,
  });
}

/**
 * The next-prefix string for a given prefix — the smallest string strictly
 * greater than any string starting with the prefix. Increment the last char.
 * e.g., "AAP" → "AAQ", "T" → "U", "Z" → "[" (ASCII 91, higher than any letter).
 */
function nextPrefix(prefix: string): string {
  if (prefix.length === 0) return "";
  const last = prefix.charCodeAt(prefix.length - 1);
  return prefix.slice(0, -1) + String.fromCharCode(last + 1);
}

/**
 * Rank prefix-matched results. All results already start with the query, so
 * we only need to prioritize exact-ticker-match first, then type (CS > ETF).
 * API returns alphabetical within each bucket, which is a sensible tiebreak.
 */
function rankResults(results: TickerSummary[], q: string): TickerSummary[] {
  return [...results].sort((a, b) => score(a, q) - score(b, q));
}

function score(r: TickerSummary, q: string): number {
  if (r.ticker === q) return 0;
  const type = r.type ?? "";
  if (type === "CS") return 1;
  if (type === "ETF") return 2;
  return 3;
}
