import { useSelectedTicker } from "@/hooks/useSelectedTicker";

export type Mode = "exploration" | "research";

/**
 * Derived workbench mode. Exploration when no ticker is selected, research
 * when one is. Computed from URL — no stored state.
 */
export function useMode(): Mode {
  const { ticker } = useSelectedTicker();
  return ticker ? "research" : "exploration";
}
