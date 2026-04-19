import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// happy-dom doesn't ship ResizeObserver — Tremor/recharts need it at import time.
if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (window as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
    NoopResizeObserver as unknown as typeof ResizeObserver;
}

// matchMedia stub — HeroCarousel reads `prefers-reduced-motion`.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
