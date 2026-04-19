import { Card } from "@/components/ui/card";

/**
 * Hero carousel slide 3 — chart preview. Bare SVG sparkline for the
 * skeleton; styling + polish in the theming commit.
 */
export function ChartCard() {
  const points = SYNTHETIC_POINTS;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const w = 320;
  const h = 120;
  const stepX = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Price · 30 days
          </div>
          <div className="mt-0.5 font-semibold">AAPL</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">$189.23</div>
          <div className="text-xs text-muted-foreground">+3.4% mo.</div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-32 w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
        <span>30d ago</span>
        <span>today</span>
      </div>
    </Card>
  );
}

const SYNTHETIC_POINTS = [
  182, 183, 181, 184, 186, 185, 187, 188, 186, 184, 183, 185, 187, 188, 190,
  189, 187, 186, 188, 189, 191, 190, 188, 189, 192, 191, 190, 188, 189, 189.23,
];
