import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTickerNews } from "@/hooks/useTickerNews";
import { useTopMovers } from "@/hooks/useTopMovers";
import { formatDate, formatPercent } from "@/lib/format";
import type { NewsArticle, SnapshotTicker } from "@/services/schemas";

type Tab = "news" | "tickers";

/**
 * Tabbed insights section. Shows real live data so visitors see the API is
 * connected. Two tabs per landing.md — no filler third.
 */
export function InsightsSection() {
  const [tab, setTab] = useState<Tab>("news");

  return (
    <section id="insights" className="border-b">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Live insights
        </div>
        <h2 className="mt-1 text-2xl font-semibold">What's moving right now</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pulled live from the same data source the workbench uses.
        </p>

        <div className="mt-6 flex gap-2">
          <Button
            variant={tab === "news" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("news")}
          >
            Latest news
          </Button>
          <Button
            variant={tab === "tickers" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("tickers")}
          >
            Top tickers
          </Button>
        </div>

        <div className="mt-6">
          {tab === "news" ? <NewsList /> : <TickersList />}
        </div>
      </div>
    </section>
  );
}

function NewsList() {
  const { data, isLoading, isError } = useTickerNews();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (isError)
    return <p className="text-sm text-muted-foreground">News is taking a minute.</p>;
  if (!data?.length)
    return <p className="text-sm text-muted-foreground">No market news right now.</p>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {data.slice(0, 4).map((a) => (
        <NewsRow key={a.id} article={a} />
      ))}
    </div>
  );
}

function NewsRow({ article }: { article: NewsArticle }) {
  const sentiment = article.insights?.[0]?.sentiment;
  return (
    <a href={article.article_url} target="_blank" rel="noreferrer">
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{article.publisher.name}</span>
          <span>{formatDate(article.published_utc)}</span>
        </div>
        <div className="mt-1 text-sm font-medium">{article.title}</div>
        {sentiment && (
          <span className="mt-2 inline-block text-[10px] uppercase tracking-wide text-muted-foreground">
            [{sentiment}]
          </span>
        )}
      </Card>
    </a>
  );
}

function TickersList() {
  const { data, isLoading, isError } = useTopMovers();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (isError)
    return <p className="text-sm text-muted-foreground">Tickers taking a minute.</p>;
  if (!data?.length)
    return <p className="text-sm text-muted-foreground">No movers right now.</p>;

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {data.slice(0, 6).map((snap) => (
        <TickerRow key={snap.ticker} snap={snap} />
      ))}
    </div>
  );
}

function TickerRow({ snap }: { snap: SnapshotTicker }) {
  if (!snap.ticker) return null;
  return (
    <Link to={`/workbench?ticker=${snap.ticker}`}>
      <Card className="flex items-center justify-between p-3">
        <span className="font-mono font-semibold text-sm">{snap.ticker}</span>
        <span className="text-sm">{formatPercent(snap.todaysChangePerc)}</span>
      </Card>
    </Link>
  );
}
