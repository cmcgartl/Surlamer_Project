import { Button } from "@/components/ui/button";
import { useTickerDetails } from "@/hooks/useTickerDetails";
import { useTickerSnapshot } from "@/hooks/useTickerSnapshot";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatVolume,
} from "@/lib/format";
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

  if (details.isLoading) return <InfoSkeleton />;

  if (details.isError) {
    return (
      <div className="space-y-2">
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
    <div className="space-y-6">
      <PriceBlock
        snapshot={snapshot.data ?? null}
        loading={snapshot.isLoading}
      />
      <TodaySection
        snapshot={snapshot.data ?? null}
        loading={snapshot.isLoading}
      />
      <CompanySection detail={details.data} />
      <SectorAbout detail={details.data} />
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
    <div>
      <div className="text-4xl font-semibold tabular-nums">
        {formatCurrency(price)}
      </div>
      <div className={`mt-1 text-sm font-medium tabular-nums ${tone}`}>
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
  if (loading) return <GridSkeleton rows={3} />;
  if (!snapshot) return null;

  const day = snapshot.day;
  const prevClose = snapshot.prevDay?.c;

  return (
    <Section title="Today">
      <Metric label="Open" value={formatCurrency(day?.o)} />
      <Metric label="High" value={formatCurrency(day?.h)} />
      <Metric label="Low" value={formatCurrency(day?.l)} />
      <Metric label="Volume" value={formatVolume(day?.v)} />
      <Metric label="Prev close" value={formatCurrency(prevClose)} />
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
      <Metric label="Employees" value={formatNumber(detail.total_employees)} />
      <Metric label="Listed" value={detail.list_date ?? "—"} />
      <Metric label="Exchange" value={detail.primary_exchange ?? "—"} />
      <Metric label="Type" value={detail.type ?? "—"} />
    </Section>
  );
}

function SectorAbout({ detail }: { detail: TickerDetail }) {
  return (
    <div className="space-y-3">
      {detail.sic_description && (
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {detail.sic_description}
        </p>
      )}
      {detail.description && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
            About
          </h3>
          <p className="text-sm leading-relaxed">{detail.description}</p>
        </div>
      )}
      {detail.homepage_url && (
        <a
          href={detail.homepage_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
        >
          {cleanUrl(detail.homepage_url)} ↗
        </a>
      )}
    </div>
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
    <div className="space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">{children}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
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
      <GridSkeleton rows={3} />
      <GridSkeleton rows={3} />
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-[95%] bg-muted rounded animate-pulse" />
        <div className="h-3 w-[88%] bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

function GridSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-2">
      <div className="h-3 w-16 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {Array.from({ length: rows * 2 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
