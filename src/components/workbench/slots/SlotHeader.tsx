import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { MarketHeader } from "./MarketHeader";
import { TickerHeader } from "./TickerHeader";

/**
 * Pattern A — mode-conditional slot. The two subs have fundamentally different
 * shapes (market-wide vs per-ticker) so a single component wouldn't fit.
 */
export function SlotHeader({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  return (
    <Card className={`p-4 ${className}`}>
      {ticker ? <TickerHeader ticker={ticker} /> : <MarketHeader />}
    </Card>
  );
}
