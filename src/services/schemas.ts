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
