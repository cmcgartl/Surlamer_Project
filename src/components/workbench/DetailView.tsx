import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FEATURED = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL", "AMZN"];

/**
 * Mode-aware detail area.
 * - Exploration (no ticker): exploration prompt + featured ticker buttons
 * - Research (ticker set): ← Explore button + ticker placeholder
 * Real metrics / description / etc. wired in the next commit.
 */
export function DetailView() {
  const { ticker, setTicker } = useSelectedTicker();

  if (!ticker) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-1">Pick an equity to start researching</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Search above or pick one of these to jump in.
        </p>
        <div className="flex flex-wrap gap-2">
          {FEATURED.map((t) => (
            <Button
              key={t}
              variant="outline"
              size="sm"
              onClick={() => setTicker(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setTicker(null)}>
          ← Explore
        </Button>
        <div className="text-sm text-muted-foreground">Research mode</div>
      </div>
      <h2 className="text-2xl font-semibold">{ticker}</h2>
      <p className="text-sm text-muted-foreground mt-2">
        (ticker detail — header, metrics, description — wired next commit)
      </p>
    </Card>
  );
}
