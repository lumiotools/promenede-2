export interface Competitor {
  company_name: string | null;
  similarity_score: number | null;
}

export interface CompetitorWebsite {
  website: string | null;
  similarity_score: number | null;
  total_website_visits_monthly: number | null;
  category: string | null;
  rank_category: number | null;
}

export interface LandscapeCompetitor {
  name: string | null;
  similarity_score: number | null;
  website: string | null;
  monthly_visits: number | null;
  rank_category: number | null;
}

export interface FinancialComparable {
  name: string | null;
  similarity_score: number | null;
  financial_data: {
    revenue: string | null;
    profit: string | null;
    employees: string | null;
  } | null;
}

export interface CompanyData {
  monthly_traffic: number | string | null;
  name: string | null;
  founded_year: string | null;
  total_funding: number | string | null;
}

export interface CompanyTrafficData {
  name: string | null;
  founded_year: string | null;
  monthly_traffic: number | string | null;
}

export interface PeerDevelopments {
  funding_vs_founded: {
    company_data: CompanyData | null;
    competitors_data: CompanyData[] | null;
  } | null;
  webtraffic_vs_founded: {
    company_data: CompanyTrafficData | null;
    competitors_data: CompanyTrafficData[] | null;
  } | null;
}

export interface CompetitiveAnalysis {
  landscape: LandscapeCompetitor[] | null;
  competitors: Competitor[] | null;
  competitors_websites: CompetitorWebsite[] | null;
  financial_comparables: FinancialComparable[] | null;
  peer_developments: PeerDevelopments | null;
}
