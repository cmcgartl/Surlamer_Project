import { useEffect, useState } from "react";

export interface CarouselItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * Auto-rotating feature carousel.
 * - Rotates on a timer; clicking a tab sets the active slide and keeps it.
 * - Pauses rotation while the user is hovering or keyboard-focused inside.
 * - Honors `prefers-reduced-motion` — no rotation when reduced motion is set.
 * Adding/removing slides is a one-array edit in Hero.tsx.
 */
export function HeroCarousel({
  items,
  intervalMs = 6000,
}: {
  items: CarouselItem[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [paused, reducedMotion, items.length, intervalMs]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mb-3 flex gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(i)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              i === active
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* Fixed min-height prevents the hero layout from jumping as slides
          with different content heights rotate in. */}
      <div className="min-h-[420px]">{items[active].content}</div>
    </div>
  );
}
