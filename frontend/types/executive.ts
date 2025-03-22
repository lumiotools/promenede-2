export interface ExecutiveSummary {
  industry?: string | null;
  topic_tags?: string[] | null;
  valuation?: {
    value?: number | null;
    currency?: string | null;
    value_usd?: number | null;
  } | null;
  equity_funding_total?: {
    value?: number | null;
    currency?: string | null;
    value_usd?: number | null;
  } | null;
  funding_total?: {
    value?: number | null;
    currency?: string | null;
    value_usd?: number | null;
  } | null;
  description?: string | null;
  financial_highlights?: {
    operating_revenue?:
      | {
          value?: number | null;
          currency?: string | null;
          date?: string | null;
        }[]
      | null;
    operating_profit?:
      | {
          value?: number | null;
          currency?: string | null;
          date?: string | null;
        }[]
      | null;
    ebitda?:
      | {
          value?: number | null;
          currency?: string | null;
          date?: string | null;
        }[]
      | null;
    net_income?:
      | {
          value?: number | null;
          currency?: string | null;
          date?: string | null;
        }[]
      | null;
    per?: {
      value?: number | null;
      closing_price?: number | null;
      eps?: number | null;
      date?: string | null;
    } | null;
  } | null;
}
