/**
 * Exploration-mode header. Placeholder for now — will render market-wide
 * context (e.g., "U.S. Equities · S&P 500 · +0.42%") once the market snapshot
 * hook lands in a later commit.
 */
export function MarketHeader() {
  return (
    <div className="space-y-1">
      <div className="font-mono text-xs text-muted-foreground">
        U.S. Equities
      </div>
      <h2 className="text-lg font-semibold leading-tight">Explore the market</h2>
      <p className="text-sm text-muted-foreground">
        Search a ticker or pick one from Highlighted Today.
      </p>
    </div>
  );
}
