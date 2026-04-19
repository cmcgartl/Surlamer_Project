import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useWatchlist } from "@/hooks/useWatchlist";

beforeEach(() => {
  localStorage.clear();
});

describe("useWatchlist", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useWatchlist());
    expect(result.current.tickers).toEqual([]);
    expect(result.current.has("AAPL")).toBe(false);
  });

  it("add dedupes same ticker", () => {
    const { result } = renderHook(() => useWatchlist());
    act(() => result.current.add("AAPL"));
    act(() => result.current.add("AAPL"));
    expect(result.current.tickers).toEqual(["AAPL"]);
  });

  it("remove drops the ticker", () => {
    const { result } = renderHook(() => useWatchlist());
    act(() => {
      result.current.add("AAPL");
      result.current.add("MSFT");
    });
    act(() => result.current.remove("AAPL"));
    expect(result.current.tickers).toEqual(["MSFT"]);
    expect(result.current.has("AAPL")).toBe(false);
  });

  // The pub-sub layer in useLocalStorage exists specifically so sibling
  // consumers of the same key stay in sync. Without it, clicking Add in
  // the detail view wouldn't light up the watchlist panel until a re-render.
  it("synchronizes across hook instances through the useLocalStorage pub-sub", () => {
    const a = renderHook(() => useWatchlist());
    const b = renderHook(() => useWatchlist());

    act(() => a.result.current.add("NVDA"));

    expect(a.result.current.tickers).toEqual(["NVDA"]);
    expect(b.result.current.tickers).toEqual(["NVDA"]);

    act(() => b.result.current.remove("NVDA"));

    expect(a.result.current.tickers).toEqual([]);
    expect(b.result.current.tickers).toEqual([]);
  });
});
