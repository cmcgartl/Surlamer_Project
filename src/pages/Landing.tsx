import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/landing/Hero";
import { InsightsSection } from "@/components/landing/InsightsSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ClosingCTA } from "@/components/landing/ClosingCTA";

/**
 * Landing page composition.
 *
 * Deviations from landing.md (product-level choices, not architecture):
 * - No site header — the app is two pages, so a dedicated nav is overhead.
 *   CTAs in the hero and the closing block cover "get into the workbench."
 * - No stats strip — the hero + live insights already do the proof work;
 *   a stats band read as filler.
 */
export function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <InsightsSection />
        <FeatureGrid />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
