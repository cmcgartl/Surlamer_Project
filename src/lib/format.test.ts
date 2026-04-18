import { describe, it, expect } from "vitest";
import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("returns em-dash for null and undefined", () => {
    expect(formatCurrency(null)).toBe("—");
    expect(formatCurrency(undefined)).toBe("—");
  });

  it("returns em-dash for NaN and Infinity", () => {
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
