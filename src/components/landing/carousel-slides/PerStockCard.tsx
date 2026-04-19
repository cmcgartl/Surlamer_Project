import { Card } from "@/components/ui/card";

/**
 * Hero carousel slide 1 — per-stock research preview.
 * Static mock content; this is a marketing surface, not live data.
 * Styling pass comes after layout verification; dotted-underline terms
 * will hook into the Jargon component in a later commit.
 */
export function PerStockCard() {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-xs text-muted-foreground">
            AAPL · NASDAQ
          </div>
          <div className="mt-0.5 font-semibold">Apple Inc.</div>
        </div>
        <span className="text-xs">+1.31%</span>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-semibold">$189.23</div>
        <div className="text-sm text-muted-foreground">+$2.45 today</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Row label="Market cap" value="$2.97T" />
        <Row label="Volume" value="42.3M" />
        <Row label="Employees" value="164,000" />
        <Row label="Listed" value="1980-12-12" />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Apple designs, makes, and sells hardware and software products for
        consumers and businesses, with iPhone as its flagship.
      </p>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
