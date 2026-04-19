import { Link } from "react-router-dom";
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
 * Split hero. Left: badge · gradient headline · subhead · CTAs · proof.
 * Right: feature carousel.
 */
export function Hero() {
  return (
    <section className="bg-page-gradient border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-16 pb-20 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Equity research{" "}
            <span className="text-gradient-accent">
              Made Intuitive.
            </span>
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground">
            A workbench for exploring stocks and building a research watchlist.
            Designed to be readable whether or not you've done this before.
          </p>

          <div>
            <Link
              to="/workbench"
              className="shadow-cta hover-lift inline-flex rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground"
            >
              Open the workbench →
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Real-time market data · Per Equity News Tracking · Intuitive Layout
          </p>
        </div>

        <div>
          <HeroCarousel items={CAROUSEL_ITEMS} />
        </div>
      </div>
    </section>
  );
}
