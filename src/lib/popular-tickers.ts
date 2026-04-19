/**
 * Hand-picked list of familiar large-caps across sectors.
 *
 * Used for:
 *   - Featured tickers on the workbench exploration surface + landing insights
 *   - (planned) fallback dropdown when the search combobox is empty
 *
 * Picked for reliable data quality — every ticker here has the full set of
 * fields (logo, description, market cap, active news, etc.) populated. The
 * gainers endpoint surfaces illiquid small-caps that broke error states.
 */
export const POPULAR_TICKERS = [
  "AAPL", // Apple
  "MSFT", // Microsoft
  "NVDA", // Nvidia
  "GOOGL", // Alphabet
  "AMZN", // Amazon
  "META", // Meta
  "TSLA", // Tesla
  "JPM", // JPMorgan Chase
  "JNJ", // Johnson & Johnson
  "XOM", // Exxon Mobil
] as const;
