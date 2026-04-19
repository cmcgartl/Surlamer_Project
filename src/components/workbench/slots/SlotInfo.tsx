import { Card } from "@/components/ui/card";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { StockInfoGrid } from "./StockInfoGrid";
import { TopMoversList } from "./TopMoversList";

/**
 * Pattern A — mode-conditional slot. Research: one entity, many metrics.
 * Exploration: many entities, few metrics. Incompatible shapes → two subs.
 *
 * Card has p-0 so each sub can render its own bordered header band
 * (matching SlotGraph / SlotRelated / SlotNews).
 */
export function SlotInfo({ className = "" }: { className?: string }) {
  const { ticker } = useSelectedTicker();
  return (
    <Card className={`flex flex-col overflow-hidden p-0 ${className}`}>
      {ticker ? <StockInfoGrid ticker={ticker} /> : <TopMoversList />}
    </Card>
  );
}
