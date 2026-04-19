import { Link } from "react-router-dom";
import { useState } from "react";
import { useTickerNews } from "@/hooks/useTickerNews";
import { useFeaturedTickers } from "@/hooks/useFeaturedTickers";
import { formatCurrency, formatDate, formatPercent, formatVolume } from "@/lib/format";
import type { NewsArticle, SnapshotTicker } from "@/services/schemas";

type Tab = "news" | "tickers";

/**
 * Tabbed insights section. Shows real live data so visitors see the API is
 * connected. Two tabs per landing.md — no filler third.
 */
export function InsightsSection() {
  const [tab, setTab] = useState<Tab>("news");

  return (
    <section id="insights" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-[72px]">
        <div className="text-sm font-medium uppercase tracking-wide text-primary">
          Live insights
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          What's moving right now
        </h2>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Pulled live from the same data source the workbench uses. Click
          through to research any of these tickers.
        </p>

        <div className="mt-8 flex gap-2">
          <TabButton active={tab === "news"} onClick={() => setTab("news")}>
            Latest news
          </TabButton>
          <TabButton
            active={tab === "tickers"}
            onClick={() => setTab("tickers")}
          >
            Top tickers
          </TabButton>
        </div>

        <div className="mt-6">
          {tab === "news" ? <NewsList /> : <TickersList />}
        </div>
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-foreground text-background"
          : "bg-secondary text-muted-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function NewsList() {
  const { data, isLoading, isError } = useTickerNews();

  if (isLoading) return <ListSkeleton rows={4} />;
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
  const tone =
    sentiment === "positive"
      ? "bg-positive-soft text-positive"
      : sentiment === "negative"
        ? "bg-negative-soft text-negative"
        : "bg-signal-neutral-soft text-signal-neutral";

  return (
    <a
      href={article.article_url}
      target="_blank"
      rel="noreferrer"
      className="hover-lift group flex flex-col overflow-hidden rounded-lg border border-border bg-card"
    >
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{article.publisher.name}</span>
          <span className="shrink-0 tabular-nums">
            {formatDate(article.published_utc)}
          </span>
        </div>
        <div className="line-clamp-2 text-sm font-medium group-hover:underline">
          {article.title}
        </div>
        {sentiment && (
          <span
            className={`inline-flex w-fit rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tone}`}
          >
            {sentiment}
          </span>
        )}
      </div>
    </a>
  );
}

function TickersList() {
  const { data, isLoading, isError } = useFeaturedTickers();

  if (isLoading) return <ListSkeleton rows={6} />;
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
  const ticker = snap.ticker;
  if (!ticker) return null;

  const price = snap.day?.c ?? snap.prevDay?.c;
  const volume = snap.day?.v;
  const change = snap.todaysChangePerc;
  const isUp = change != null && change >= 0;
  const tone =
    change == null
      ? "text-muted-foreground"
      : isUp
        ? "text-positive"
        : "text-negative";

  return (
    <Link
      to={`/workbench?ticker=${ticker}`}
      className="hover-lift group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
    >
      <DirectionArrow tone={tone}>{isUp ? "▲" : "▼"}</DirectionArrow>
      <span className="font-mono text-sm font-semibold">{ticker}</span>
      <div className="ml-auto flex items-center gap-3 tabular-nums">
        <span className="text-xs text-muted-foreground">
          {formatCurrency(price)}
        </span>
        {volume != null && (
          <span className="text-xs text-muted-foreground">
            {formatVolume(volume)}
          </span>
        )}
        <span className={`text-sm font-medium ${tone}`}>
          {formatPercent(change)}
        </span>
      </div>
    </Link>
  );
}

function DirectionArrow({
  tone,
  children,
}: {
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center text-xs ${tone}`}
      aria-hidden
    >
      {children}
    </span>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-lg border border-border bg-muted"
        />
      ))}
    </div>
  );
}
