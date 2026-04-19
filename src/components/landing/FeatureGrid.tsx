/**
 * Four capability tiles. Section sits on the tinted surface to break up
 * the page rhythm. Copy per landing.md.
 */
export function FeatureGrid() {
  return (
    <section id="features" className="border-b border-border bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-[72px]">
        <div className="text-xs font-medium uppercase tracking-wide text-primary">
          Capabilities
        </div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Everything on one surface
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Tile
            icon="⎙"
            title="Live market data"
            description="Prices, day changes, and history pulled from the same feed the pros use."
          />
          <Tile
            icon="◷"
            title="Sentiment-aware news"
            description="Each headline arrives tagged positive, neutral, or negative — skim the signal."
          />
          <Tile
            icon="★"
            title="Research, saved"
            description="Watchlist persists between visits. No account required."
          />
        </div>
      </div>
    </section>
  );
}

function Tile({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="hover-lift rounded-xl border border-border bg-card p-5">
      <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-lg font-semibold text-primary">
        {icon}
      </div>
      <div className="mt-3 font-medium">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
