import { useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * MVP stub — controlled input. Wiring to useSearchTickers + result dropdown
 * comes in the next commit.
 */
export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tickers (e.g., AAPL)"
      />
    </div>
  );
}
