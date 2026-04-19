/**
 * Hero carousel slide 1 — per-stock research preview.
 * Static mock content; this is a marketing surface, not live data.
 * Dotted underlines are where the Jargon tooltip component will attach
 * in a follow-up commit.
 */
export function PerStockCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-xs text-muted-foreground">
            AAPL · NASDAQ
          </div>
          <div className="mt-0.5 text-base font-semibold">Apple Inc.</div>
        </div>
        <span className="rounded-full bg-positive-soft px-2 py-0.5 text-xs font-medium text-positive">
          +1.31%
        </span>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-semibold tabular-nums">$189.23</div>
        <div className="text-sm text-positive tabular-nums">+$2.45 today</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
        <Row label="Market cap" value="$2.97T" jargon />
        <Row label="Volume" value="42.3M" jargon />
        <Row label="Employees" value="164,000" />
        <Row label="Listed" value="1980-12-12" />
      </div>

      <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        Apple designs, makes, and sells hardware and software products for
        consumers and businesses, with iPhone as its flagship.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  jargon,
}: {
  label: string;
  value: string;
  jargon?: boolean;
}) {
  return (
    <div>
      <span
        className={`text-xs text-muted-foreground ${
          jargon ? "border-b border-dotted border-muted-foreground/60" : ""
        }`}
      >
        {label}
      </span>
      <div className="mt-0.5 font-medium tabular-nums">{value}</div>
    </div>
  );
}
