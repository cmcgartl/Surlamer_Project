import { Button } from "@/components/ui/button";
import { useTickerDetails } from "@/hooks/useTickerDetails";
import { useTickerSnapshot } from "@/hooks/useTickerSnapshot";
import {
  formatCurrency,
  formatPercent,
  formatVolume,
} from "@/lib/format";
import {
  snapshotChange,
  snapshotChangePct,
  snapshotPrice,
  snapshotVolume,
} from "@/lib/snapshot";
import type { SnapshotTicker, TickerDetail } from "@/services/schemas";

/**
 * Research-mode info panel. The primary research surface.
 *
 * Sections (top → bottom):
 *   1. Price block — large current price + colored day change
 *   2. Today — open / high / low / volume / prev close (from snapshot)
 *   3. Company — market cap / shares out / employees / listed / exchange / type
 *   4. Sector + description + homepage
 *
 * Uses both useTickerDetails and useTickerSnapshot. Tanstack Query dedupes
 * these across siblings — TickerHeader reuses the same details cache.
 */
export function StockInfoGrid({ ticker }: { ticker: string }) {
  const details = useTickerDetails(ticker);
  const snapshot = useTickerSnapshot(ticker);

  if (details.isLoading) {
    return (
      <div className="p-6">
        <InfoSkeleton />
      </div>
    );
  }

  if (details.isError) {
    return (
      <div className="space-y-2 p-6">
        <p className="text-sm text-destructive">
          Couldn't load details for {ticker}.
        </p>
        <Button variant="outline" size="sm" onClick={() => details.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!details.data) return null;

  return (
    <div className="space-y-7 p-6">
      <PriceBlock
        snapshot={snapshot.data ?? null}
        loading={snapshot.isLoading}
      />
      <TodaySection
        snapshot={snapshot.data ?? null}
        loading={snapshot.isLoading}
      />
      <CompanySection detail={details.data} />
      {details.data.homepage_url && (
        <HomepageLink url={details.data.homepage_url} />
      )}
    </div>
  );
}

function PriceBlock({
  snapshot,
  loading,
}: {
  snapshot: SnapshotTicker | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }
  if (!snapshot) return null;

  const price = snapshotPrice(snapshot);
  const change = snapshotChange(snapshot);
  const changePct = snapshotChangePct(snapshot);

  const tone =
    change == null
      ? "text-muted-foreground"
      : change >= 0
        ? "text-positive"
        : "text-negative";

  const changeStr =
    change == null
      ? "—"
      : `${change >= 0 ? "+" : "−"}${formatCurrency(Math.abs(change))}`;

  return (
    <div>
      <div className="text-4xl font-semibold tabular-nums">
        {formatCurrency(price)}
      </div>
      <div className={`mt-1.5 text-xl font-medium tabular-nums ${tone}`}>
        {changeStr} ({formatPercent(changePct)})
      </div>
    </div>
  );
}

function TodaySection({
  snapshot,
  loading,
}: {
  snapshot: SnapshotTicker | null;
  loading: boolean;
}) {
  if (loading) return <GridSkeleton rows={1} />;
  if (!snapshot) return null;

  const marketClosed = !snapshot.day?.c;
  const low = snapshot.day?.l || snapshot.prevDay?.l;
  const high = snapshot.day?.h || snapshot.prevDay?.h;
  const rangeValue =
    low != null && high != null
      ? `${formatCurrency(low)} – ${formatCurrency(high)}`
      : "—";
  const volume = snapshotVolume(snapshot);

  return (
    <Section title={marketClosed ? "Most recent" : "Today"}>
      <Metric label="Day range" value={rangeValue} />
      <Metric label="Volume" value={formatVolume(volume)} />
    </Section>
  );
}

function CompanySection({ detail }: { detail: TickerDetail }) {
  return (
    <Section title="Company">
      <Metric label="Market cap" value={formatCurrency(detail.market_cap)} />
      <Metric
        label="Shares out"
        value={formatVolume(detail.share_class_shares_outstanding)}
      />
      <Metric label="Sector" value={detail.sic_description ?? "—"} />
      <Metric label="Listed" value={detail.list_date ?? "—"} />
      <Metric label="Exchange" value={detail.primary_exchange ?? "—"} />
      <Metric label="Type" value={detail.type ?? "—"} />
    </Section>
  );
}

function HomepageLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
    >
      {cleanUrl(url)} ↗
    </a>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">{children}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function cleanUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function InfoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      </div>
      <GridSkeleton rows={1} />
      <GridSkeleton rows={3} />
    </div>
  );
}

function GridSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        {Array.from({ length: rows * 2 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-6 w-28 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
