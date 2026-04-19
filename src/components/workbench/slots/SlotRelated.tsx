import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { useRelatedTickers } from "@/hooks/useRelatedTickers";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useTickerSnapshot } from "@/hooks/useTickerSnapshot";
import { formatCurrency, formatPercent, formatVolume } from "@/lib/format";
import {
  snapshotChangePct,
  snapshotPrice,
  snapshotVolume,
} from "@/lib/snapshot";
import type { SnapshotTicker } from "@/services/schemas";

/**
 * Pattern B — parameter-driven.
 *   Research:    related companies (useRelatedTickers, snapshots embedded)
 *   Exploration: recently-viewed tickers (useRecentlyViewed, per-row snapshot)
 *
 * Row format matches TopMoversList (ticker · price/volume · change) with
 * dividers between entries for visual consistency with the Featured list.
 */
export function SlotRelated({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  const title = ticker ? "Related" : "Recently viewed";

  return (
    <Card className={`flex flex-col overflow-hidden p-0 ${className}`}>
      <div className="bg-card-header border-b border-border p-4">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        {ticker ? <RelatedList ticker={ticker} /> : <RecentlyViewedList />}
      </div>
    </Card>
  );
}

function RelatedList({ ticker }: { ticker: string }) {
  const { data, isLoading, isError, refetch } = useRelatedTickers(ticker);

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
    <ul className="divide-y">
      {data.slice(0, 5).map((snap) => {
        if (!snap.ticker) return null;
        return <TickerRow key={snap.ticker} snap={snap} />;
      })}
    </ul>
  );
}

function RecentlyViewedList() {
  const tickers = useRecentlyViewed();
  const { ticker: selected } = useSelectedTicker();

  const list = tickers.filter((t) => t !== selected);

  if (list.length === 0) {
    return (
      <p className="px-1 py-2 text-sm leading-relaxed text-muted-foreground">
        Equities you recently viewed will appear here.
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {list.slice(0, 5).map((t) => (
        <RecentTickerRow key={t} ticker={t} />
      ))}
    </ul>
  );
}

function RecentTickerRow({ ticker }: { ticker: string }) {
  const { data: snap } = useTickerSnapshot(ticker);
  return (
    <TickerRow
      snap={{
        ticker,
        todaysChangePerc: snap?.todaysChangePerc,
        day: snap?.day,
        prevDay: snap?.prevDay,
      }}
    />
  );
}

function TickerRow({ snap }: { snap: SnapshotTicker }) {
  const { setTicker } = useSelectedTicker();
  if (!snap.ticker) return null;

  const price = snapshotPrice(snap);
  const change = snapshotChangePct(snap);
  const volume = snapshotVolume(snap);
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
        <span className="text-right text-xs tabular-nums text-muted-foreground">
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

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <ul className="divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-2 py-2"
        >
          <div className="h-3 w-12 animate-pulse rounded bg-muted/60" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted/60 justify-self-end" />
          <div className="h-3 w-10 animate-pulse rounded bg-muted/60" />
        </li>
      ))}
    </ul>
  );
}
