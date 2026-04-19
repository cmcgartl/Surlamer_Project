import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { useTickerNews } from "@/hooks/useTickerNews";
import { formatDate } from "@/lib/format";
import type { NewsArticle, NewsSentiment } from "@/services/schemas";

/**
 * Pattern B — parameter-driven. Same inner NewsFeed, different ticker arg.
 * Research: ticker-filtered news. Exploration: general market news.
 * Full-width bottom row in the V3 grid.
 */
export function SlotNews({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  const title = ticker ? `News · ${ticker}` : "News";

  return (
    <Card className={`flex flex-col overflow-hidden p-0 ${className}`}>
      <div className="bg-card-header border-b border-border p-4">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        <NewsFeed ticker={ticker ?? undefined} />
      </div>
    </Card>
  );
}

function NewsFeed({ ticker }: { ticker?: string }) {
  const { data, isLoading, isError, refetch } = useTickerNews(ticker);

  if (isLoading) return <NewsSkeleton />;

  if (isError) {
    return (
      <div className="space-y-2 py-2">
        <p className="text-sm text-destructive">Couldn't load news.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        {ticker
          ? `No recent news for ${ticker}.`
          : "No market news right now."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {data.slice(0, 6).map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          focusTicker={ticker}
        />
      ))}
    </div>
  );
}

function ArticleCard({
  article,
  focusTicker,
}: {
  article: NewsArticle;
  focusTicker?: string;
}) {
  const sentiment = pickSentiment(article, focusTicker);

  return (
    <a
      href={article.article_url}
      target="_blank"
      rel="noreferrer"
      className="hover-lift group flex flex-col overflow-hidden rounded-md border border-border bg-card"
    >
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{article.publisher.name}</span>
          <span className="shrink-0 tabular-nums">
            {formatDate(article.published_utc)}
          </span>
        </div>
        <h4 className="line-clamp-2 text-sm font-medium leading-snug group-hover:underline">
          {article.title}
        </h4>
        {article.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {article.description}
          </p>
        )}
        {sentiment && <SentimentBadge sentiment={sentiment} />}
      </div>
    </a>
  );
}

function SentimentBadge({ sentiment }: { sentiment: NewsSentiment }) {
  const label = sentiment[0].toUpperCase() + sentiment.slice(1);
  const tone =
    sentiment === "positive"
      ? "bg-positive-soft text-positive"
      : sentiment === "negative"
        ? "bg-negative-soft text-negative"
        : "bg-signal-neutral-soft text-signal-neutral";
  return (
    <span
      className={`inline-flex w-fit items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tone}`}
    >
      {label}
    </span>
  );
}

function pickSentiment(
  article: NewsArticle,
  focusTicker?: string
): NewsSentiment | null {
  const insights = article.insights;
  if (!insights?.length) return null;
  if (focusTicker) {
    const match = insights.find((i) => i.ticker === focusTicker);
    if (match) return match.sentiment;
  }
  return insights[0].sentiment;
}

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-md border p-3">
          <div className="aspect-[16/9] w-full animate-pulse rounded bg-muted/60" />
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 animate-pulse rounded bg-muted/60" />
            <div className="h-3 w-14 animate-pulse rounded bg-muted/60" />
          </div>
          <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted/60" />
        </div>
      ))}
    </div>
  );
}
