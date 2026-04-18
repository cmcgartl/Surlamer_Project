import { Link } from "react-router-dom";
import { useSelectedTicker } from "@/hooks/useSelectedTicker";
import { SearchBar } from "@/components/workbench/SearchBar";
import { Watchlist } from "@/components/workbench/Watchlist";
import { DetailView } from "@/components/workbench/DetailView";

export function Workbench() {
  const { ticker } = useSelectedTicker();
  const mode = ticker ? "research" : "exploration";

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

      <main className="flex-1 grid grid-cols-[280px_1fr] gap-4 p-4 max-w-7xl mx-auto w-full">
        <aside>
          <Watchlist />
        </aside>
        <section className="space-y-4">
          <SearchBar />
          <DetailView />
        </section>
      </main>
    </div>
  );
}
