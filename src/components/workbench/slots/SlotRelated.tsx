import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { useRelatedTickers } from "@/hooks/useRelatedTickers";
import { useFeaturedTickers } from "@/hooks/useFeaturedTickers";
import { formatPercent } from "@/lib/format";
import type { SnapshotTicker } from "@/services/schemas";

/**
 * Pattern B — parameter-driven. Same inner RelatedList in both modes,
 * fed by different data:
 *   Research:    useRelatedTickers (related companies + their snapshots)
 *   Exploration: useFeaturedTickers (curated popular tickers)
 * Each hook is gated by `enabled` so only the relevant fetch fires.
 */
export function SlotRelated({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  const related = useRelatedTickers(ticker);
  const featured = useFeaturedTickers({ enabled: !ticker });

  const query = ticker ? related : featured;
  const title = ticker ? "Related" : "Featured";

  return (
    <Card className={`flex flex-col overflow-hidden p-0 ${className}`}>
      <div className="border-b border-border p-4">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        <RelatedList
          data={query.data}
          isLoading={query.isLoading}
          isError={query.isError}
          refetch={query.refetch}
        />
      </div>
    </Card>
  );
}

function RelatedList({
  data,
  isLoading,
  isError,
  refetch,
}: {
  data: SnapshotTicker[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const { setTicker } = useSelectedTicker();

  if (isLoading) return <ListSkeleton rows={5} />;

  if (isError) {
    return (
      <div className="space-y-2 py-2">
        <p className="text-xs text-destructive">Couldn't load.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-xs text-muted-foreground">Nothing to show.</p>;
  }

  return (
    <ul className="space-y-1">
      {data.slice(0, 5).map((snap) => {
        if (!snap.ticker) return null;
        const change = snap.todaysChangePerc;
        const tone =
          change == null
            ? "text-muted-foreground"
            : change >= 0
              ? "text-positive"
              : "text-negative";
        return (
          <li key={snap.ticker}>
            <button
              onClick={() => setTicker(snap.ticker!)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent"
            >
              <span className="font-mono font-medium">{snap.ticker}</span>
              <span className={`tabular-nums text-xs ${tone}`}>
                {formatPercent(change)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-2 py-1.5"
        >
          <div className="h-3 w-12 animate-pulse rounded bg-muted/60" />
          <div className="h-3 w-10 animate-pulse rounded bg-muted/60" />
        </div>
      ))}
    </div>
  );
}
