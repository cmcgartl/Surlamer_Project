import { Link } from "react-router-dom";
import { useMode } from "@/hooks/useMode";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { SearchBar } from "@/components/workbench/SearchBar";
import { Watchlist } from "@/components/workbench/Watchlist";
import { SlotHeader } from "@/components/workbench/slots/SlotHeader";
import { SlotInfo } from "@/components/workbench/slots/SlotInfo";
import { SlotGraph } from "@/components/workbench/slots/SlotGraph";
import { SlotRelated } from "@/components/workbench/slots/SlotRelated";
import { SlotNews } from "@/components/workbench/slots/SlotNews";

/**
 * V3 workbench grid.
 *
 *   watchlist │  Header(0.5fr) │  Search (spans 2 cols)
 *             │  ──────────────┼──────────────┬──────────
 *             │                │  Graph       │
 *             │  Info          │──────────────│
 *             │  (col-span 2,  │  Related     │
 *             │   row-span 2)  │              │
 *             │  ──────────────┴──────────────┘
 *             │  News (spans all 3 cols)
 *
 * Slots read state through hooks (useSelectedTicker / useMode) — no prop
 * drilling. Workbench is pure composition.
 */
export function Workbench() {
  const { ticker } = useSelectedTicker();
  const mode = useMode();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-semibold hover:underline">
            ← Home
          </Link>
          <div className="font-mono text-xs text-muted-foreground">
            mode: {mode}
            {ticker ? ` · ${ticker}` : ""}
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-[280px_1fr] gap-4 p-4 max-w-[1400px] mx-auto w-full">
        <aside>
          <Watchlist />
        </aside>

        <section className="grid gap-4 grid-cols-[0.5fr_0.5fr_1.15fr] grid-rows-[auto_auto_auto_auto]">
          <SlotHeader className="col-start-1 row-start-1" />
          <div className="col-start-2 col-end-4 row-start-1">
            <SearchBar />
          </div>
          <SlotInfo className="col-start-1 col-end-3 row-start-2 row-end-4" />
          <SlotGraph className="col-start-3 row-start-2" />
          <SlotRelated className="col-start-3 row-start-3" />
          <SlotNews className="col-start-1 col-end-4 row-start-4" />
        </section>
      </main>
    </div>
  );
}
