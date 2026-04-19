import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";

/**
 * Pattern B — parameter-driven. With a ticker: ticker-filtered news; without:
 * general market news. Full-width bottom row in the V3 grid.
 *
 * Data wiring (useTickerNews) lands in a later commit.
 */
export function SlotNews({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  const title = ticker ? `News · ${ticker}` : "Market news";

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded border border-dashed border-muted-foreground/20 p-3"
          >
            <div className="h-3 w-24 bg-muted/60 rounded" />
            <div className="h-4 w-full bg-muted/60 rounded" />
            <div className="h-3 w-3/4 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    </Card>
  );
}
