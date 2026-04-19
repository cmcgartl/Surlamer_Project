/**
 * Hero carousel slide 2 — per-ticker news preview with sentiment tags.
 * Static mock content.
 */
export function TickerNewsCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
    </div>
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
  const toneMap = {
    positive: "bg-positive-soft text-positive",
    neutral: "bg-signal-neutral-soft text-signal-neutral",
    negative: "bg-negative-soft text-negative",
  } as const;

  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${toneMap[sentiment]}`}
      >
        {sentiment}
      </span>
      <div className="min-w-0">
        <div className="line-clamp-1 text-sm font-medium">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {publisher} · {time}
        </div>
      </div>
    </div>
  );
}
