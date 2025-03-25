export interface MonthlyVisit {
  total_website_visits: number | null
  date: string | null
}

export interface TrafficSources {
  [key: string]: number | null
}

export interface WebTraffic {
  monthlyVisits: MonthlyVisit[] | null
  trafficSources: TrafficSources | null
  avgVisitDuration: string | null
  pagesPerVisit: string | null
  bounceRate: string | null
  globalRank: string | null
}

