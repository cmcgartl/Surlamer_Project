import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { useRelatedTickers } from "@/hooks/useRelatedTickers";
import { useTopMovers } from "@/hooks/useTopMovers";
import { formatPercent } from "@/lib/format";
import type { SnapshotTicker } from "@/services/schemas";

/**
 * Pattern B — parameter-driven. Same inner RelatedList in both modes,
 * fed by different data:
 *   Research:    useRelatedTickers (related companies + their snapshots)
 *   Exploration: useTopMovers      (today's gainers)
 * Each hook is gated by `enabled` so only the relevant fetch fires.
 */
export function SlotRelated({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  const related = useRelatedTickers(ticker);
  const movers = useTopMovers({ enabled: !ticker });

  const query = ticker ? related : movers;
  const title = ticker ? "Related" : "Highlighted Today";

  return (
    <Card className={`p-4 ${className}`}>
      <RelatedList
        title={title}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        refetch={query.refetch}
      />
    </Card>
  );
}

function RelatedList({
  title,
  data,
  isLoading,
  isError,
  refetch,
}: {
  title: string;
  data: SnapshotTicker[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const { setTicker } = useSelectedTicker();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>

      {isLoading && <ListSkeleton rows={5} />}

      {isError && (
        <div className="space-y-2 py-2">
          <p className="text-xs text-destructive">Couldn't load.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <p className="text-xs text-muted-foreground">Nothing to show.</p>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-1">
          {data.slice(0, 5).map((snap) => {
            if (!snap.ticker) return null;
            const change = snap.todaysChangePerc;
            const tone =
              change == null
                ? "text-muted-foreground"
                : change >= 0
                  ? "text-emerald-600"
                  : "text-red-600";
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
      )}
    </div>
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
