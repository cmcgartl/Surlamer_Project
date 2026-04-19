import { Button } from "@/components/ui/button";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { useFeaturedTickers } from "@/hooks/useFeaturedTickers";
import { formatCurrency, formatPercent, formatVolume } from "@/lib/format";
import type { SnapshotTicker } from "@/services/schemas";

/**
 * Exploration-mode info panel. Featured large-caps as a dense, clickable list.
 * Each row jumps to research mode on click.
 */
export function TopMoversList() {
  const { data, isLoading, isError, refetch } = useFeaturedTickers();

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Featured companies
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Click a row to research a stock.
        </p>
      </div>

      {isLoading && <MoversSkeleton rows={10} />}

      {isError && (
        <div className="space-y-2 py-2">
          <p className="text-sm text-destructive">
            Couldn't load featured tickers.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <p className="py-4 text-sm text-muted-foreground">
          No tickers available right now.
        </p>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="divide-y">
          {data.slice(0, 10).map((snap: SnapshotTicker) => (
            <MoverRow key={snap.ticker ?? Math.random()} snap={snap} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MoverRow({ snap }: { snap: SnapshotTicker }) {
  const { setTicker } = useSelectedTicker();
  if (!snap.ticker) return null;

  const price = snap.day?.c ?? snap.prevDay?.c;
  const change = snap.todaysChangePerc;
  const volume = snap.day?.v;
  const tone =
    change == null
      ? "text-muted-foreground"
      : change >= 0
        ? "text-positive"
        : "text-negative";

  return (
    <li>
      <button
        onClick={() => setTicker(snap.ticker!)}
        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded px-2 py-2 text-left hover:bg-accent"
      >
        <span className="font-mono text-sm font-semibold">{snap.ticker}</span>
        <span className="tabular-nums text-right text-xs text-muted-foreground">
          {formatCurrency(price)}
          {volume != null && <> · {formatVolume(volume)} vol</>}
        </span>
        <span className={`text-sm font-medium tabular-nums ${tone}`}>
          {formatPercent(change)}
        </span>
      </button>
    </li>
  );
}

function MoversSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-0 divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-2 py-2"
        >
          <div className="h-3 w-12 animate-pulse rounded bg-muted/60" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted/60 justify-self-end" />
          <div className="h-3 w-10 animate-pulse rounded bg-muted/60" />
        </div>
      ))}
    </div>
  );
}
