/**
 * Financial value formatters. Pure functions — safe to test in isolation.
 * Every formatter tolerates null/undefined and returns an em-dash placeholder
 * so display code never has to null-check.
 */

const EMDASH = "—";

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return EMDASH;
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return EMDASH;
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatVolume(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return EMDASH;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return EMDASH;
  return value.toLocaleString();
}

export function formatDate(value: string | number | null | undefined): string {
  if (value == null) return EMDASH;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return EMDASH;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
