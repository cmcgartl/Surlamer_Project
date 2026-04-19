import { Card } from "@/components/ui/card";

/**
 * Hero carousel slide 2 — per-ticker news preview with sentiment tags.
 * Static mock content.
 */
export function TickerNewsCard() {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          News · AAPL
        </div>
        <div className="font-mono text-xs text-muted-foreground">3 headlines</div>
      </div>

      <div className="space-y-3">
        <Article
          title="Apple's services revenue hits record high in Q2"
          publisher="Reuters"
          time="2h ago"
          sentiment="positive"
        />
        <Article
          title="Analysts see mixed signals in Apple's supply chain report"
          publisher="Bloomberg"
          time="6h ago"
          sentiment="neutral"
        />
        <Article
          title="Regulator reopens antitrust probe into App Store rules"
          publisher="WSJ"
          time="yesterday"
          sentiment="negative"
        />
      </div>
    </Card>
  );
}

function Article({
  title,
  publisher,
  time,
  sentiment,
}: {
  title: string;
  publisher: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 text-[10px] uppercase tracking-wide">
        [{sentiment}]
      </span>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {publisher} · {time}
        </div>
      </div>
    </div>
  );
}
