import { describe, it, expect } from "vitest";
import { TickerDetailResponseSchema } from "@/services/schemas";
import fixture from "@/test/fixtures/ticker-detail-AAPL.json";

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
