import { Card } from "@/components/ui/card";

/**
 * Four capability tiles. Copy per landing.md — each feature described once
 * on the page.
 */
export function FeatureGrid() {
  return (
    <section id="features" className="border-b">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Capabilities
        </div>
        <h2 className="mt-1 text-2xl font-semibold">Everything on one surface</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile
            title="Explain on demand"
            description="Hover any financial term to see a plain-English definition. No tab-switching."
          />
          <Tile
            title="Live market data"
            description="Prices, day changes, and history pulled from the same feed the pros use."
          />
          <Tile
            title="Sentiment-aware news"
            description="Each headline arrives tagged positive, neutral, or negative — skim the signal."
          />
          <Tile
            title="Research, saved"
            description="Watchlist persists between visits. No account required."
          />
        </div>
      </div>
    </section>
  );
}

function Tile({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-4">
      <div className="font-medium">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
