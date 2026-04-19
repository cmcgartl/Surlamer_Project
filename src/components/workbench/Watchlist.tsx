import { useWatchlist } from "@/hooks/useWatchlist";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { useTickerSnapshot } from "@/hooks/useTickerSnapshot";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { snapshotChangePct, snapshotPrice } from "@/lib/snapshot";

export function Watchlist() {
  const { tickers, remove } = useWatchlist();
  const { ticker: selected, setTicker } = useSelectedTicker();

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className="bg-card-header border-b border-border p-4">
        <h2 className="text-base font-semibold">Your watchlist</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Keep track of your equities here.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tickers.length === 0 ? (
          <p className="px-2 py-4 text-base font-semibold leading-relaxed text-muted-foreground">
            Your watchlist is empty. Add equities from the detail view to start
            tracking.
          </p>
        ) : (
          <ul className="space-y-1">
            {tickers.map((t) => (
              <WatchlistRow
                key={t}
                ticker={t}
                active={t === selected}
                onSelect={() => setTicker(t)}
                onRemove={() => remove(t)}
              />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

function WatchlistRow({
  ticker,
  active,
  onSelect,
  onRemove,
}: {
  ticker: string;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const { data: snapshot } = useTickerSnapshot(ticker);
  const price = snapshotPrice(snapshot);
  const change = snapshotChangePct(snapshot);
  const tone =
    change == null
      ? "text-muted-foreground"
      : change >= 0
        ? "text-positive"
        : "text-negative";

  return (
    <li
      className={`flex items-center gap-1 rounded-md transition-colors ${
        active ? "bg-primary/10" : "hover:bg-accent"
      }`}
    >
      <button
        onClick={onSelect}
        className="flex flex-1 items-center justify-between gap-2 px-2 py-1.5 text-left"
      >
        <span
          className={`font-mono text-sm font-semibold ${active ? "text-primary" : ""}`}
        >
          {ticker}
        </span>
        <div className="flex items-center gap-2 text-xs tabular-nums">
          <span className="text-muted-foreground">{formatCurrency(price)}</span>
          <span className={tone}>{formatPercent(change)}</span>
        </div>
      </button>
      <button
        onClick={onRemove}
        aria-label={`Remove ${ticker} from watchlist`}
        className="mr-1 rounded p-1 text-xs text-muted-foreground hover:bg-background hover:text-negative"
      >
        ✕
      </button>
    </li>
  );
}
