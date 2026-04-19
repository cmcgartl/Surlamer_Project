import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroCarousel, type CarouselItem } from "./HeroCarousel";
import { PerStockCard } from "./carousel-slides/PerStockCard";
import { TickerNewsCard } from "./carousel-slides/TickerNewsCard";
import { ChartCard } from "./carousel-slides/ChartCard";

const CAROUSEL_ITEMS: CarouselItem[] = [
  { id: "per-stock", label: "Per-stock view", content: <PerStockCard /> },
  { id: "news", label: "News + sentiment", content: <TickerNewsCard /> },
  { id: "chart", label: "Price history", content: <ChartCard /> },
];

/**
 * Split hero. Left: badge · headline · subhead · CTAs · proof.
 * Right: feature carousel.
 */
export function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div className="space-y-5">
          <span className="inline-block rounded-full border px-3 py-1 text-xs">
            Plain English, built in
          </span>

          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Equity research, without the jargon barrier.
          </h1>

          <p className="text-lg text-muted-foreground">
            A workbench for exploring stocks and building a research watchlist.
            Designed to be readable whether or not you've done this before.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/workbench">Open the workbench →</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="#features">See how it works</a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Real-time market data · Sentiment-tagged news · No signup
          </p>
        </div>

        <div>
          <HeroCarousel items={CAROUSEL_ITEMS} />
        </div>
      </div>
    </section>
  );
}
