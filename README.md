# Equity Research Workbench

Demo Video: https://www.loom.com/share/e1c6f780b2a944348d901b025a71d964

I made an equity research app that includes a landing page highlighting key features and a quick look into current stories and featured equities, as well as a workbench allowing users to browse, search, and track equities through an informative and intuitive layout. 
  
**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · Tanstack Query · Zod · Tremor · Vitest

---
## Running it
### Prerequisites

- Node 18+

- A Massive API key in `.env.local` — see `.env.example`:

```bash

VITE_MASSIVE_KEY=your_key_here

```
### Install + run

```bash

npm install --legacy-peer-deps # Tremor peer-dep conflict with React 19

npm run dev # localhost:5173

npm run build # production build

npm test # one-shot test run

npm run test:watch # watch mode

```

---
## Key decisions

### State architecture

Every piece of state is stored distinctly depending on how the data needs to persist across navigation/reloads and whether it comes from an API.

| State                                       | Tier                 | Mechanism                                 | Why this tier                                           |
| ------------------------------------------- | -------------------- | ----------------------------------------- | ------------------------------------------------------- |
| Selected ticker                             | URL                  | `useSelectedTicker` via `useSearchParams` | Shareable, bookmarkable, reload-safe; back button works |
| Watchlist                                   | localStorage         | `useWatchlist` via `useLocalStorage`      | Must survive reload, per-device, no auth in scope       |
| Recently viewed                             | localStorage         | `useRecentlyViewed` via `useLocalStorage` | Must survive reload, per-device, no auth in scope       |
| Search query                                | React state          | `useState` in `SearchBar`                 | Resets on page reload/navigation                        |
| Remote data                                 | Tanstack Query cache | Query hooks                               | Shared across components, time-bounded via staleTime    |
| Workbench Mode: "exploration" or "research" | Derived              | `useMode()` — pure function of URL        | Nothing stored; computed each render                    |

Data is persisted via URL and localStorage, with no global state like Redux or Zustand. On the workbench, the URL handles the shareable session state (which ticker is currently being viewed), localStorage handles persistence, React state handles ephemeral UI, and Tanstack Query's cache handles remote data. 

The only instance in which state needed to be shared across components was in adding/removing equities from the user's watchlist (the watchlist component needed to stay in sync with the add/remove-to-watchlist button). Because of this, I felt that introducing global state via Redux or Zustand would be overkill for only one piece of data sync, and decided to use a module-level `Map<key, Set<listener>>` inside `useLocalStorage` to broadcast writes to all subscribed hook instances in the current tab.

### Asynchronous data

All asynchronous data via the Massive API flows through **Tanstack Query**.

**Caching.** 
Each hook has a `staleTime` based on how fast the underlying data moves: 10 min
for ticker details, 5 min for aggregates/news/related, 60s for featured
tickers, 30s for snapshots and search.

**Zod at the boundary.** 
Every `queryFn` parses the API response before
returning. This provides a runtime check so schema drift or a malformed payload surfaces as a query error instead of trusting the API to match the compile-time types.

**Error handling.** 
Each slot (equity info, equity price graph, per-equity news, etc.) is rendered from its Tanstack Query state — `{ data, isLoading, isError, refetch }` — so healthy data renders normally, and loading or error states show dedicated UI with a retry option.

**Deduplication.**  
Tanstack ensures that two components making the same API query both get the data they need with only one network call. 

### Composition patterns

The main layout design decision I made was to have the workbench be composed of modular slot components that were populated differently depending on whether the user was in explore mode or specific equity research mode. In viewing other equity portfolio apps as examples, I felt that they did not do a good job of providing both a broad range of equities to browse from and specific relevant info about each equity. Often both goals were attempted within the same view, creating a flood of information that was hard to navigate.

To solve this, I separated the workbench into two primary concerns. 1) Exploration mode, where a user is trying to get a sense of what stocks are available and some quick surface-level info about each. 2) Specific equity research mode, where a user wants to look more in depth into a specific stock they just came across or are currently tracking.

To achieve this, I had the workbench be comprised of modular slots that have distinct behaviors per mode. For example, in explore mode the slots provide general market data, such as featured equities in the info slot and S&P 500 price fluctuations in the graph slot. In research mode, the info slot provides a grid of key metrics specific to the currently viewed equity, and the graph slot shows the price fluctuations of that specific equity. 

The modular slots were implemented using two distinct patterns, A and B.

Pattern A slots have different internal components per mode. For example, in explore mode the info slot shows many different tickers with a few pieces of highlighted information, while in research mode this slot shows a grid with many more data points per one specific equity.

Pattern B slots render the same internal component in each mode, so these were built to simply take in a ticker parameter to generate the internal component with the mode-specific information.
  
### Reliability / Testing 

| File                                           | Tests | Defends                                                           |
| ---------------------------------------------- | ----- | ----------------------------------------------------------------- |
| `src/services/schemas.test.ts`                 | 8     | Zod parses at the vendor boundary (happy + malformed)             |
| `src/lib/format.test.ts`                       | 15    | Pure formatter edge cases (null, NaN, huge values, sign handling) |
| `src/hooks/useWatchlist.test.ts`               | 4     | Persistent state hook + cross-instance pub-sub sync               |
| `src/test/integration/watchlist-flow.test.tsx` | 1     | Integration: click featured ticker → add → remount → persists     |

In addition to using Zod for API response validation and error-aware rendering based on the Tanstack Query state, I implemented a number of test cases to ensure reliability in the error-prone/critical parts of the app.

Due to the limited time, I prioritized the most critical areas for test coverage rather than attempting fully comprehensive coverage. Data request and response handling is the most error-prone and reliability-critical aspect of the app — if missing or malformed equity data isn't properly handled, that would be a critical failure and significantly harm the perceived trustworthiness of the app.

I also tested the watchlist data synchronization with a dedicated unit test, and wrote one integration test that exercises the expected user flow end-to-end — covering overall reliability and proper rendering in a single scenario.

Component/chart rendering and Tanstack Query wrapper hooks are indirectly covered by the integration test, but did not get dedicated test cases as this would mostly cover library logic.

### Error/loading states

The watchlist and slots that display lists/data that may be empty have dedicated empty messages, either prompting the user to add to the watchlist or telling the user what data will appear there when available.

Each slot has a "couldn't load" message and a retry button wired to `refetch()` on missing-data errors, and slots render a skeleton shimmer block when loading.

## What I cut, and what I'd do with another 4 hours

Improvements to what is currently implemented:

1. Page-level error boundaries: Each slot reads `isError` from the Tanstack Query hook and renders data or error state accordingly; however, page-level error boundaries still need to be implemented. I prioritized validation of async data as that is much more likely to cause an issue compared to page rendering itself.

2. Add more explore categories: Currently the info slot in explore mode shows "featured equities". I would add more categories such as biggest gainers/losers, different sectors, different company sizes, etc.

Features I was planning to add but got cut (for next 4 hours):

1. Jargon translation: I planned to support 1-2 sentence explanations of key terms that beginner users may be unfamiliar with. This would allow a user to hover over a term they are unfamiliar with, and a pop-up would display a hard-coded explanation and example of the term.

2. AI summaries of "about" sections: The about section on a stock returned by Massive tends to be a large amount of text that I felt was too much to include on my current workbench display. To solve this, I would integrate an LLM API to provide an AI summary section for each stock. I feel this is a way to make sure the summary is short enough while still preserving its meaning, and hallucinations are much less of a concern for company summaries than for company metrics.

3. Dynamically populated slot fields: I added fallbacks for rendering missing data in each slot, but I could add a feature that would dynamically choose from a set of data/fields to present in each slot — selecting a preferred set if available, but choosing a less preferred piece of information that is present over a non-existent desired field.

---
## Known issues

**Tremor colors require a Tailwind v4 safelist**
Tremor v3 composes class names at runtime that Tailwind v4's JIT can't detect. I added a workaround with `@source inline()` in `index.css` but it is not a clean fix.

**No default thumbnails for missing news images**
Missing thumbnails for news data are checked for and handled, but missing thumbnails are just skipped, and if an image load fails the browser's default broken-image icon is shown. This should be handled by creating a default thumbnail to fall back to.

**Workbench search is ticker-prefix only**
The search functionality currently only supports ticker-based searching. Because of this, searching for "apple" will not provide any results.

---