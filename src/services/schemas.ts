import { z } from "zod";

/**
 * Zod schemas for validating Massive API responses at the boundary.
 * Pattern: each endpoint's response has a schema here. Query hooks call
 * .parse() on raw responses so unexpected shapes surface at the edge.
 */

// ---- Ticker Detail (GET /v3/reference/tickers/{T}) ----

export const TickerDetailSchema = z.object({
  ticker: z.string(),
  name: z.string(),
  market: z.string(),
  locale: z.string(),
  primary_exchange: z.string().optional(),
  type: z.string().optional(),
  active: z.boolean(),
  currency_name: z.string().optional(),
  description: z.string().optional(),
  market_cap: z.number().nullable().optional(),
  total_employees: z.number().nullable().optional(),
  sic_description: z.string().optional(),
  homepage_url: z.string().optional(),
  list_date: z.string().optional(),
  share_class_shares_outstanding: z.number().nullable().optional(),
  branding: z
    .object({
      logo_url: z.string().optional(),
      icon_url: z.string().optional(),
    })
    .optional(),
});

export type TickerDetail = z.infer<typeof TickerDetailSchema>;

export const TickerDetailResponseSchema = z.object({
  status: z.string(),
  request_id: z.string().optional(),
  results: TickerDetailSchema,
});

// ---- Ticker Summary + List (GET /v3/reference/tickers) ----

export const TickerSummarySchema = z.object({
  ticker: z.string(),
  name: z.string(),
  market: z.string(),
  type: z.string().optional(),
  active: z.boolean(),
  primary_exchange: z.string().optional(),
  currency_name: z.string().optional(),
  last_updated_utc: z.string().optional(),
});

export type TickerSummary = z.infer<typeof TickerSummarySchema>;

export const TickerListResponseSchema = z.object({
  status: z.string(),
  request_id: z.string().optional(),
  count: z.number().optional(),
  results: z.array(TickerSummarySchema).optional(),
  next_url: z.string().optional(),
});

// ---- Snapshot (GET /v2/snapshot/locale/us/markets/stocks/tickers/{T}) ----

const BarSchema = z.object({
  c: z.number().optional(),
  o: z.number().optional(),
  h: z.number().optional(),
  l: z.number().optional(),
  v: z.number().optional(),
  vw: z.number().optional(),
});

export const SnapshotTickerSchema = z.object({
  ticker: z.string().optional(),
  todaysChange: z.number().optional(),
  todaysChangePerc: z.number().optional(),
  updated: z.number().optional(),
  day: BarSchema.optional(),
  prevDay: BarSchema.optional(),
});

export type SnapshotTicker = z.infer<typeof SnapshotTickerSchema>;

export const SnapshotResponseSchema = z.object({
  status: z.string(),
  request_id: z.string().optional(),
  ticker: SnapshotTickerSchema.optional(),
});

// ---- Aggregates (GET /v2/aggs/ticker/{T}/range/{mult}/{timespan}/{from}/{to}) ----

export const AggregateBarSchema = z.object({
  c: z.number(),
  h: z.number(),
  l: z.number(),
  o: z.number(),
  t: z.number(),
  v: z.number(),
  vw: z.number().optional(),
  n: z.number().optional(),
});

export type AggregateBar = z.infer<typeof AggregateBarSchema>;

export const AggregatesResponseSchema = z.object({
  ticker: z.string(),
  status: z.string(),
  queryCount: z.number().optional(),
  resultsCount: z.number().optional(),
  adjusted: z.boolean().optional(),
  results: z.array(AggregateBarSchema).optional(),
});

// ---- News (GET /v2/reference/news) ----

export const NewsSentimentSchema = z.enum([
  "positive",
  "neutral",
  "negative",
]);

export type NewsSentiment = z.infer<typeof NewsSentimentSchema>;

export const NewsInsightSchema = z.object({
  sentiment: NewsSentimentSchema,
  sentiment_reasoning: z.string().optional(),
  ticker: z.string(),
});

export const NewsPublisherSchema = z.object({
  name: z.string(),
  logo_url: z.string().optional(),
  homepage_url: z.string().optional(),
  favicon_url: z.string().optional(),
});

export const NewsArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  article_url: z.string(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  published_utc: z.string(),
  author: z.string().optional(),
  publisher: NewsPublisherSchema,
  tickers: z.array(z.string()).optional(),
  insights: z.array(NewsInsightSchema).optional(),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;

export const NewsResponseSchema = z.object({
  status: z.string().optional(),
  count: z.number().optional(),
  request_id: z.string().optional(),
  results: z.array(NewsArticleSchema).optional(),
  next_url: z.string().optional(),
});

// ---- Related Companies (GET /v1/related-companies/{T}) ----

export const RelatedCompanyEntrySchema = z.object({
  ticker: z.string(),
});

export const RelatedCompaniesResponseSchema = z.object({
  status: z.string().optional(),
  ticker: z.string().optional(),
  request_id: z.string().optional(),
  results: z.array(RelatedCompanyEntrySchema).optional(),
});

// ---- Bulk Snapshots + Direction (gainers/losers) ----
// Same response shape: { status, tickers: [SnapshotTicker, ...] }

export const SnapshotTickersResponseSchema = z.object({
  status: z.string(),
  count: z.number().optional(),
  tickers: z.array(SnapshotTickerSchema).optional(),
});
