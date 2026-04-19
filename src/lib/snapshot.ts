import type { SnapshotTicker } from "@/services/schemas";

/**
 * Helpers for reading snapshot fields safely across market-closed states.
 *
 * Polygon's snapshot returns day.c = 0 and day.v = 0 outside market hours
 * rather than omitting the fields, so a plain `??` fallback lets 0 through
 * and renders as "$0.00" / "0 vol". `||` collapses undefined/null/0 into a
 * single "no current session" case.
 *
 * All four helpers fall back to prevDay when the current session hasn't
 * produced data yet. For price and volume this is a direct lookup. For
 * change, the snapshot only exposes `day` and `prevDay`, so a true
 * day-over-day fallback (Fri close − Thu close) isn't available without an
 * extra request — we use last session's intraday move (prevDay.c − prevDay.o)
 * instead. Typically within a fraction of a percent of the day-over-day
 * number, and avoids an em-dash showing up on every weekend view.
 */

export function snapshotPrice(
  snap: SnapshotTicker | null | undefined
): number | undefined {
  if (!snap) return undefined;
  return snap.day?.c || snap.prevDay?.c || undefined;
}

export function snapshotVolume(
  snap: SnapshotTicker | null | undefined
): number | undefined {
  if (!snap) return undefined;
  return snap.day?.v || snap.prevDay?.v || undefined;
}

export function snapshotChange(
  snap: SnapshotTicker | null | undefined
): number | undefined {
  if (!snap) return undefined;
  if (snap.day?.c) return snap.todaysChange;
  const prev = snap.prevDay;
  if (prev?.c != null && prev?.o != null) return prev.c - prev.o;
  return undefined;
}

export function snapshotChangePct(
  snap: SnapshotTicker | null | undefined
): number | undefined {
  if (!snap) return undefined;
  if (snap.day?.c) return snap.todaysChangePerc;
  const prev = snap.prevDay;
  if (prev?.c != null && prev?.o != null && prev.o !== 0) {
    return ((prev.c - prev.o) / prev.o) * 100;
  }
  return undefined;
}
