import { Link } from "react-router-dom";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/workbench/SearchBar";
import { Watchlist } from "@/components/workbench/Watchlist";
import { SlotHeader } from "@/components/workbench/slots/SlotHeader";
import { SlotInfo } from "@/components/workbench/slots/SlotInfo";
import { SlotGraph } from "@/components/workbench/slots/SlotGraph";
import { SlotRelated } from "@/components/workbench/slots/SlotRelated";
import { SlotNews } from "@/components/workbench/slots/SlotNews";

/**
 * Workbench composition (V4).
 *
 *   Row 1:  [← Back to Explore | Search ========]   (back button only when researching)
 *   Row 2:  [Identity band across full width ——————————————————————]
 *   Row 3:  [Info (tall)        | Graph    ]
 *                                [ Related ]
 *   Row 4:  [News full width]
 *
 * Slots read state through hooks (useSelectedTicker) — no prop drilling.
 * Workbench stays pure composition.
 */
export function Workbench() {
  const { ticker, setTicker } = useSelectedTicker();

  return (
    <div className="bg-page-gradient flex min-h-screen flex-col">
      <header className="bg-card-header sticky top-0 z-40 border-b border-border">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span aria-hidden className="text-lg leading-none">
              ←
            </span>
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-[280px_1fr] gap-4 p-4">
        <aside>
          <Watchlist />
        </aside>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {ticker && (
              <Button
                size="sm"
                onClick={() => setTicker(null)}
                className="shrink-0"
              >
                ← Back to Explore
              </Button>
            )}
            <div className="flex-1">
              <SearchBar />
            </div>
          </div>

          <SlotHeader />

          <div className="grid grid-cols-[0.5fr_0.5fr_1.15fr] gap-4">
            <SlotInfo className="col-start-1 col-end-3 row-start-1 row-span-2" />
            <SlotGraph className="col-start-3 row-start-1" />
            <SlotRelated className="col-start-3 row-start-2" />
          </div>

          <SlotNews />
        </section>
      </main>
    </div>
  );
}
