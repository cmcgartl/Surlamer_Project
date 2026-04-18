import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { useTickerDetails } from "@/hooks/useTickerDetails";
import { useTickerSnapshot } from "@/hooks/useTickerSnapshot";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { SnapshotTicker, TickerDetail } from "@/services/schemas";

const FEATURED = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL", "AMZN"];

/**
 * Mode-aware detail area.
 * - Exploration (no ticker): exploration prompt + featured ticker buttons
 * - Research (ticker set): ← Explore + Add/Remove watchlist + company info
 *
 * Stage 1 keeps everything in a single Card. The V3 grid layout (separate
 * header / info / graph / news / related slots) is a Stage 2 rework.
 */
export function DetailView() {
  const { ticker, setTicker } = useSelectedTicker();

  if (!ticker) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-1">
          Pick an equity to start researching
        </h2>
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

  return <ResearchDetail ticker={ticker} onBack={() => setTicker(null)} />;
}

function ResearchDetail({
  ticker,
  onBack,
}: {
  ticker: string;
  onBack: () => void;
}) {
  const { data, isLoading, isError, refetch } = useTickerDetails(ticker);
  const { data: snapshot, isLoading: snapshotLoading } =
    useTickerSnapshot(ticker);
  const { has, add, remove } = useWatchlist();
  const inWatchlist = has(ticker);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Explore
        </Button>
        <Button
          variant={inWatchlist ? "outline" : "default"}
          size="sm"
          onClick={() => (inWatchlist ? remove(ticker) : add(ticker))}
        >
          {inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        </Button>
      </div>

      {isLoading && <DetailSkeleton ticker={ticker} />}

      {isError && (
        <div className="space-y-2">
          <p className="text-sm text-destructive">
            Couldn't load details for {ticker}.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {data && (
        <DetailBody
          detail={data}
          snapshot={snapshot ?? null}
          snapshotLoading={snapshotLoading}
        />
      )}
    </Card>
  );
}

function DetailBody({
  detail,
  snapshot,
  snapshotLoading,
}: {
  detail: TickerDetail;
  snapshot: SnapshotTicker | null;
  snapshotLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="font-mono text-xs text-muted-foreground">
          {detail.ticker}
          {detail.primary_exchange ? ` · ${detail.primary_exchange}` : ""}
        </div>
        <h2 className="text-2xl font-semibold">{detail.name}</h2>
        <PriceLine snapshot={snapshot} loading={snapshotLoading} />
        {detail.sic_description && (
          <p className="text-sm text-muted-foreground">
            {detail.sic_description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Metric label="Market cap" value={formatCurrency(detail.market_cap)} />
        <Metric
          label="Employees"
          value={formatNumber(detail.total_employees)}
        />
        <Metric label="Listed" value={detail.list_date ?? "—"} />
        <Metric label="Type" value={detail.type ?? "—"} />
      </div>

      {detail.description && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            About
          </div>
          <p className="text-sm leading-relaxed">{detail.description}</p>
        </div>
      )}
    </div>
  );
}

function PriceLine({
  snapshot,
  loading,
}: {
  snapshot: SnapshotTicker | null;
  loading: boolean;
}) {
  if (loading) {
    return <div className="mt-1 h-6 w-44 bg-muted rounded animate-pulse" />;
  }
  if (!snapshot) return null;

  const price = snapshot.day?.c ?? snapshot.prevDay?.c;
  const change = snapshot.todaysChange;
  const changePct = snapshot.todaysChangePerc;

  const tone =
    change == null
      ? "text-muted-foreground"
      : change >= 0
        ? "text-emerald-600"
        : "text-red-600";

  const changeStr =
    change == null
      ? "—"
      : `${change >= 0 ? "+" : "−"}${formatCurrency(Math.abs(change))}`;

  return (
    <div className="mt-1 flex items-baseline gap-3">
      <span className="text-2xl font-semibold tabular-nums">
        {formatCurrency(price)}
      </span>
      <span className={`text-sm font-medium tabular-nums ${tone}`}>
        {changeStr} ({formatPercent(changePct)})
      </span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function DetailSkeleton({ ticker }: { ticker: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="font-mono text-xs text-muted-foreground">{ticker}</div>
        <div className="h-7 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-5 w-28 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-[95%] bg-muted rounded animate-pulse" />
        <div className="h-3 w-[88%] bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
