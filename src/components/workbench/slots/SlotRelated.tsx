import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";

/**
 * Pattern B — parameter-driven. In exploration mode shows today's highlighted
 * tickers (biggest movers); in research mode shows related companies for the
 * selected ticker. Compact list, narrow column.
 *
 * Data wiring (useRelatedTickers + useTopMovers) lands in a later commit.
 */
export function SlotRelated({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  const title = ticker ? "Related" : "Highlighted Today";

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="space-y-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded border border-dashed border-muted-foreground/20 px-2 py-1.5 text-xs text-muted-foreground"
          >
            <span>—</span>
            <span>—</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
