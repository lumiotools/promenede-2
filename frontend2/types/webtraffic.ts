export interface VisitsByCountry {
  country: string | null;
  percentage: number | null;
  percentage_monthly_change: number | null;
}

export interface VisitsByMonth {
  total_website_visits: number | null;
  date: string | null;
}

export interface VisitsChange {
  current: number | null;
  change_monthly: number | null;
  change_monthly_percentage: number | null;
  change_quarterly: number | null;
  change_quarterly_percentage: number | null;
  change_yearly: number | null;
  change_yearly_percentage: number | null;
}

export interface WebTraffic {
  monthly_visits: number | null;
  visits_by_country: VisitsByCountry[] | null;
  visits_by_month: VisitsByMonth[] | null;
  visits_change: VisitsChange | null;
  bounce_rate: number | null;
  pages_per_visit: number | null;
  average_visit_duration: number | null;
}
