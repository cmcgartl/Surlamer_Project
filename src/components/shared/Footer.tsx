/**
 * Site footer. Quiet — copyright + data attribution.
 */
export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>© 2026 Equity Research Workbench</div>
        <div>Market data via the Massive API</div>
      </div>
    </footer>
  );
}
