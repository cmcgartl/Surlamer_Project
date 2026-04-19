import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
          <Button
            key={item.id}
            variant={i === active ? "default" : "outline"}
            size="sm"
            onClick={() => setActive(i)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div>{items[active].content}</div>
    </div>
  );
}
