import { useWatchlist } from "@/hooks/useWatchlist";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { Card } from "@/components/ui/card";

export function Watchlist() {
  const { tickers, remove } = useWatchlist();
  const { ticker: selected, setTicker } = useSelectedTicker();

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-3">Watchlist</h2>

      {tickers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Your watchlist is empty. Add equities from the detail view to start tracking.
        </p>
      ) : (
        <ul className="space-y-2">
          {tickers.map((t) => (
            <li
              key={t}
              className={`flex items-center justify-between rounded px-2 py-1 ${
                t === selected ? "bg-accent" : ""
              }`}
            >
              <button
                onClick={() => setTicker(t)}
                className="text-sm font-medium hover:underline"
              >
                {t}
              </button>
              <button
                onClick={() => remove(t)}
                className="text-xs text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${t} from watchlist`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
