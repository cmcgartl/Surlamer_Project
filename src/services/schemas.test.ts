import { describe, it, expect } from "vitest";
import {
  AggregatesResponseSchema,
  NewsResponseSchema,
  SnapshotResponseSchema,
  TickerDetailResponseSchema,
} from "@/services/schemas";
import fixture from "@/test/fixtures/ticker-detail-AAPL.json";

// The Zod layer is our contract with Polygon. If these tests go red, either
// the vendor changed response shapes or our schema drifted — both worth a
// hard stop at the boundary.

describe("TickerDetailResponseSchema", () => {
  it("parses a recorded AAPL response and exposes the expected fields", () => {
    const parsed = TickerDetailResponseSchema.parse(fixture);

    expect(parsed.status).toBe("OK");
    expect(parsed.results.ticker).toBe("AAPL");
    expect(parsed.results.name).toBe("Apple Inc.");
    expect(parsed.results.market).toBe("stocks");
    expect(parsed.results.active).toBe(true);
    expect(parsed.results.market_cap).toBeGreaterThan(0);
    expect(parsed.results.total_employees).toBeGreaterThan(0);
  });

  it("throws on a malformed response (missing required field)", () => {
    const broken = {
      status: "OK",
      results: { ticker: "AAPL" /* missing name, market, locale, active */ },
    };
    expect(() => TickerDetailResponseSchema.parse(broken)).toThrow();
  });
});

describe("SnapshotResponseSchema", () => {
  it("parses a fully populated snapshot", () => {
    const parsed = SnapshotResponseSchema.parse({
      status: "OK",
      request_id: "abc",
      ticker: {
        ticker: "AAPL",
        todaysChange: 2.45,
        todaysChangePerc: 1.31,
        updated: 1_713_800_000_000,
        day: { c: 189.23, o: 187.5, h: 190.05, l: 186.1, v: 42_300_000, vw: 188.5 },
        prevDay: { c: 186.78, o: 185, h: 188, l: 184, v: 40_000_000, vw: 186.3 },
      },
    });

    expect(parsed.ticker?.ticker).toBe("AAPL");
    expect(parsed.ticker?.day?.c).toBe(189.23);
    expect(parsed.ticker?.todaysChangePerc).toBe(1.31);
  });

  it("accepts a status-only response (some tickers return no ticker object pre-market)", () => {
    const parsed = SnapshotResponseSchema.parse({ status: "OK" });
    expect(parsed.ticker).toBeUndefined();
  });
});

describe("NewsResponseSchema", () => {
  it("parses an article with insights", () => {
    const parsed = NewsResponseSchema.parse({
      status: "OK",
      count: 1,
      results: [
        {
          id: "art-1",
          title: "Apple posts record revenue",
          article_url: "https://example.com/a",
          published_utc: "2026-04-19T12:00:00Z",
          author: "Jane Doe",
          description: "Strong services quarter.",
          publisher: {
            name: "Reuters",
            homepage_url: "https://reuters.com",
            logo_url: "https://reuters.com/logo.svg",
          },
          tickers: ["AAPL"],
          insights: [
            {
              sentiment: "positive",
              sentiment_reasoning: "Beat consensus",
              ticker: "AAPL",
            },
          ],
        },
      ],
    });

    expect(parsed.results?.[0]?.insights?.[0]?.sentiment).toBe("positive");
    expect(parsed.results?.[0]?.publisher.name).toBe("Reuters");
  });

  it("rejects an article missing a publisher", () => {
    const broken = {
      status: "OK",
      results: [
        {
          id: "art-1",
          title: "...",
          article_url: "https://example.com/a",
          published_utc: "2026-04-19T12:00:00Z",
          /* publisher missing */
        },
      ],
    };
    expect(() => NewsResponseSchema.parse(broken)).toThrow();
  });
});

describe("AggregatesResponseSchema", () => {
  it("parses a daily-bar response", () => {
    const parsed = AggregatesResponseSchema.parse({
      ticker: "AAPL",
      status: "OK",
      queryCount: 2,
      resultsCount: 2,
      adjusted: true,
      results: [
        { c: 187, o: 186, h: 188, l: 185, v: 40_000_000, t: 1_713_600_000_000 },
        {
          c: 189.23,
          o: 187.5,
          h: 190.05,
          l: 186.1,
          v: 42_300_000,
          vw: 188.5,
          t: 1_713_686_400_000,
        },
      ],
    });

    expect(parsed.results).toHaveLength(2);
    expect(parsed.results?.[1].c).toBe(189.23);
  });

  it("accepts an empty results array (illiquid ticker)", () => {
    const parsed = AggregatesResponseSchema.parse({
      ticker: "DEAD",
      status: "OK",
      results: [],
    });
    expect(parsed.results).toEqual([]);
  });
});
