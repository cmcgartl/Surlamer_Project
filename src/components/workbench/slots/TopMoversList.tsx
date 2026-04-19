/**
 * Exploration-mode info panel. Placeholder for now — will render the day's
 * top movers once useTopMovers lands (wires /v2/snapshot/.../gainers).
 */
export function TopMoversList() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Top movers will appear here. In exploration mode this slot lists the
        day's biggest gainers — click one to research it.
      </p>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded border border-dashed border-muted-foreground/20 px-3 py-2 text-xs text-muted-foreground"
          >
            <span>—</span>
            <span>—</span>
          </div>
        ))}
      </div>
    </div>
  );
}
