import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { StockInfoGrid } from "./StockInfoGrid";
import { TopMoversList } from "./TopMoversList";

/**
 * Pattern A — mode-conditional slot. Research: one entity, many metrics.
 * Exploration: many entities, few metrics. Incompatible shapes → two subs.
 */
export function SlotInfo({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  return (
    <Card className={`p-4 ${className}`}>
      {ticker ? <StockInfoGrid ticker={ticker} /> : <TopMoversList />}
    </Card>
  );
}
