import { describe, it, expect } from "vitest";
import {
  formatCompanyName,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatVolume,
} from "./format";

describe("formatCurrency", () => {
  it("returns em-dash for null, undefined, NaN, Infinity", () => {
    expect(formatCurrency(null)).toBe("—");
    expect(formatCurrency(undefined)).toBe("—");
    expect(formatCurrency(Number.NaN)).toBe("—");
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe("—");
  });

  it("formats plain dollars below 1K", () => {
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(12.5)).toBe("$12.50");
    expect(formatCurrency(999.99)).toBe("$999.99");
  });

  it("abbreviates thousands, millions, billions, and trillions", () => {
    expect(formatCurrency(1_500)).toBe("$1.50K");
    expect(formatCurrency(2_000_000)).toBe("$2.00M");
    expect(formatCurrency(3_400_000_000)).toBe("$3.40B");
    expect(formatCurrency(1_250_000_000_000)).toBe("$1.25T");
  });
});

describe("formatPercent", () => {
  it("returns em-dash for null / undefined / NaN", () => {
    expect(formatPercent(null)).toBe("—");
    expect(formatPercent(undefined)).toBe("—");
    expect(formatPercent(Number.NaN)).toBe("—");
  });

  it("includes a sign and two decimals", () => {
    expect(formatPercent(1.234)).toBe("+1.23%");
    expect(formatPercent(-2.5)).toBe("-2.50%");
    expect(formatPercent(0)).toBe("+0.00%");
  });
});

describe("formatVolume", () => {
  it("returns em-dash for nullish", () => {
    expect(formatVolume(null)).toBe("—");
    expect(formatVolume(undefined)).toBe("—");
  });

  it("abbreviates K/M/B with one decimal", () => {
    expect(formatVolume(1_500)).toBe("1.5K");
    expect(formatVolume(42_300_000)).toBe("42.3M");
    expect(formatVolume(3_500_000_000)).toBe("3.5B");
  });

  it("uses toLocaleString below 1K", () => {
    expect(formatVolume(250)).toBe("250");
  });
});

describe("formatNumber", () => {
  it("returns em-dash for nullish", () => {
    expect(formatNumber(null)).toBe("—");
    expect(formatNumber(undefined)).toBe("—");
  });

  it("locale-formats integers with commas", () => {
    expect(formatNumber(164_000)).toBe("164,000");
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatDate", () => {
  it("returns em-dash for null / invalid input", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });

  it("formats an ISO string to Mon DD, YYYY", () => {
    expect(formatDate("2026-04-19T12:00:00Z")).toMatch(/Apr \d+, 2026/);
  });
});

describe("formatCompanyName", () => {
  it("strips share-class + common-stock suffixes", () => {
    expect(formatCompanyName("Alphabet Inc. Class A Common Stock")).toBe(
      "Alphabet Inc."
    );
    expect(formatCompanyName("Berkshire Hathaway Inc. Class B Common Stock")).toBe(
      "Berkshire Hathaway Inc."
    );
    expect(formatCompanyName("Microsoft Corporation Common Stock")).toBe(
      "Microsoft Corporation"
    );
  });

  it("leaves already-clean names alone", () => {
    expect(formatCompanyName("Apple Inc.")).toBe("Apple Inc.");
    expect(formatCompanyName("Microsoft Corporation")).toBe("Microsoft Corporation");
    expect(formatCompanyName("SPDR S&P 500 ETF Trust")).toBe("SPDR S&P 500 ETF Trust");
  });

  it("returns em-dash for nullish", () => {
    expect(formatCompanyName(null)).toBe("—");
    expect(formatCompanyName(undefined)).toBe("—");
  });
});
