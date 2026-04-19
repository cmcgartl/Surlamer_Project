import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type TickerParam = { stocksTicker?: string; ticker?: string };

// Mocks must be declared before the App import so services/massive never
// reads VITE_MASSIVE_KEY at module load. vi.mock is hoisted.
vi.mock("@/services/massive", () => ({
  massive: {
    getTicker: vi.fn().mockImplementation(({ ticker }: TickerParam) =>
      Promise.resolve({
        status: "OK",
        results: {
          ticker,
          name: `${ticker} Inc.`,
          market: "stocks",
          locale: "us",
          active: true,
          primary_exchange: "XNAS",
          type: "CS",
          market_cap: 1_000_000_000_000,
          total_employees: 50_000,
          sic_description: "ELECTRONICS",
          list_date: "1990-01-01",
          description: `${ticker} does things.`,
        },
      })
    ),
    getStocksSnapshotTicker: vi
      .fn()
      .mockImplementation(({ stocksTicker }: TickerParam) =>
        Promise.resolve({
          status: "OK",
          ticker: {
            ticker: stocksTicker,
            todaysChange: 1.5,
            todaysChangePerc: 0.85,
            day: {
              c: 150,
              o: 148,
              h: 151,
              l: 147,
              v: 40_000_000,
              vw: 149,
            },
            prevDay: { c: 148.5, o: 147, h: 149, l: 146, v: 39_000_000, vw: 148 },
          },
        })
      ),
    listTickers: vi.fn().mockResolvedValue({ status: "OK", results: [] }),
    getStocksAggregates: vi
      .fn()
      .mockResolvedValue({ ticker: "X", status: "OK", results: [] }),
    listNews: vi.fn().mockResolvedValue({ status: "OK", results: [] }),
    getRelatedCompanies: vi
      .fn()
      .mockResolvedValue({ status: "OK", results: [] }),
  },
}));

import App from "@/App";
import { queryClient } from "@/lib/queryClient";

beforeEach(() => {
  queryClient.clear();
  window.history.pushState({}, "", "/workbench");
});

describe("watchlist persistence flow", () => {
  it("adds a ticker from the featured list and retains it after remount", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    // Exploration mode — watchlist starts empty.
    expect(
      await screen.findByText(/your watchlist is empty/i)
    ).toBeInTheDocument();

    // Click the AAPL row in the Featured Companies list. The row button's
    // accessible name concatenates ticker/price/change, so match by prefix.
    const aaplRow = await screen.findByRole("button", { name: /^AAPL/ });
    await user.click(aaplRow);

    // Research mode — click Add to Watchlist in the identity band.
    const addBtn = await screen.findByRole("button", { name: "+ Watchlist" });
    await user.click(addBtn);

    // Button toggled → now says Remove.
    expect(
      await screen.findByRole("button", { name: "Remove" })
    ).toBeInTheDocument();

    // Watchlist panel now has an AAPL row. The select button's accessible
    // name is ticker + price + change concatenated, so match by prefix.
    expect(screen.getByRole("button", { name: /^AAPL/ })).toBeInTheDocument();

    // Full unmount — destroys all React state. localStorage should still hold
    // the watchlist; the fresh tree rehydrates from it.
    unmount();
    render(<App />);

    expect(
      screen.queryByText(/your watchlist is empty/i)
    ).not.toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /^AAPL/ })
    ).toBeInTheDocument();
  });
});
