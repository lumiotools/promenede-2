import { ShareholderData } from "./shareholder";

export interface RevenueRange {
  annual_revenue_range_from: number | null;
  annual_revenue_range_to: number | null;
  annual_revenue_range_currency: string | null;
}

export interface ProductService {
  uuid: string | null;
  value: string | null;
  image_id?: string | null;
  permalink?: string | null;
  entity_def_id?: string | null;
}

export interface Firmographic {
  name: string | null;
  legal_name: string | null;
  incorporation_date: string | null;
  hq_address: string | null;
  hq_city: string | null;
  hq_state: string | null;
  hq_country: string | null;
  industry: string | null;
  type: string | null;
  revenue_range: {
    source_4_annual_revenue_range: RevenueRange | null;
    source_6_annual_revenue_range: RevenueRange | null;
  } | null;
  employees_count: number | null;
  products_services: ProductService[] | null;
  description: string | null;
}

export interface IncomeStatement {
  cost_of_goods_sold: number | null;
  cost_of_goods_sold_currency: string | null;
  ebit: number | null;
  ebitda: null | number | null;
  ebitda_margin: null | number | null;
  ebit_margin: number | null;
  earnings_per_share: number | null;
  gross_profit: number | null;
  gross_profit_margin: number | null;
  income_tax_expense: number | null;
  interest_expense: null | number | null;
  interest_income: null | number | null;
  net_income: number | null;
  period_display_end_date: string | null;
  period_end_date: string | null;
  period_type: string | null;
  pre_tax_profit: number | null;
  revenue: number | null;
  total_operating_expense: number | null;
}

export interface RevenueGrowth {
  value: number | null;
  previous_period: string | null;
  current_period: string | null;
}

export interface KeyFinancials {
  income_statements: IncomeStatement[] | null;
  operating_revenue: Array<{
    value: number | null;
    currency: string | null;
    date: string | null;
  }> | null;
  operating_profit: Array<{
    value: number | null;
    currency: string | null;
    date: string | null;
  }> | null;
  ebitda: Array<{
    value: number | null;
    currency: string | null;
    date: string | null;
  }> | null;
  net_income: Array<{
    value: number | null;
    currency: string | null;
    date: string | null;
  }> | null;
  per?: {
    value: number | null;
    closing_price: number | null;
    eps: number | null;
    date: string | null;
  } | null;
  revenue_growth: Array<{
    value: number | null;
    previous_period: string | null;
    current_period: string | null;
  }> | null;
}

export interface CompanyOverviewItem {
  business_model: string | null;
  products_brands: ProductService[] | null;
  customers: string[] | null;
  description_enriched?: string | null;
}

export interface CompanyProfiles {
  firmographic?: Firmographic | null;
  key_financials?: KeyFinancials | null;
  shareholders?: ShareholderData | null;
}

export interface TimelineEvent {
  date: string | null;
  event: string | null;
  description: string | null;
}

export interface CountryVisit {
  country: string | null;
  percentage: number;
  percentage_monthly_change: number;
}

export interface MonthlyVisit {
  total_website_visits: number;
  date: string;
}

export interface VisitsChange {
  current: number;
  change_monthly: number;
  change_monthly_percentage: number;
  change_quarterly: number;
  change_quarterly_percentage: number;
  change_yearly: number | null;
  change_yearly_percentage: number | null;
}

export interface WebTrafficItem {
  monthly_visits: number | null;
  visits_by_country: CountryVisit[];
  visits_by_month: MonthlyVisit[];
  visits_change: VisitsChange | null;
  bounce_rate: number | null;
  pages_per_visit: number | null;
  average_visit_duration: number | null;
}

export interface PricingPlan {
  type: string;
  price: string;
  details: string;
}

export interface ProductDetail {
  name: string;
  description: string;
  pricing?: PricingPlan[];
}

export interface ProductReviewByMonth {
  product_reviews_score: number;
  date: string;
}

export interface ProductReviews {
  count: number;
  score: number;
  by_month: ProductReviewByMonth[];
  distribution: {
    [key: string]: number;
  };
}
export interface LaunchTimelineItem {
  productName: string | null;
  description: string | null;
  referenceLink: string | null;
  date: string | null;
}
export interface ProductsServices {
  services: Service[] | null;
  details: ProductDetail[];
  launch_timeline: LaunchTimelineItem[] | null; // You might want to define a more specific type here
  pricing_available: boolean | null;
  free_trial_available: boolean | null;
  demo_available: boolean | null;
  product_reviews: ProductReviews | null;
}
export interface Service {
  uuid: string | null; // Unique identifier for the service (can be null)
  value: string | null; // Name or description of the service (can be null)
  image_id: string | null; // Image ID associated with the service (can be null)
  permalink: string | null; // URL-friendly identifier (slug) for the service (can be null)
  entity_def_id: string | null; // Defines the type of entity (e
}
export interface Company {
  company_overview: CompanyOverviewItem | null;
  company_profile: CompanyProfiles | null;
  company_timeline: TimelineEvent | null;
  web_traffic: WebTrafficItem | null;
  products_services: ProductsServices | null;
}
