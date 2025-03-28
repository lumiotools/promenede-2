export interface Competitor {
  name?: string;
  website?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  company_name?: string;
  similarity_score?: number | null;
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
  date: string | null; // The date the information is for (in yyyy-Month-Day format)
  revenue: string | null; // The revenue for the company
  last_valuation: string | null; // The last valuation of the company
  last_funding: string | null; // The last funding round amount and date
  description: string | null; // A brief description of the company's financial performance
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
  name: string | null;
  founded_year: number | string | null;
  total_funding: number | string | null;
  currency: string | null;
  web_traffic: number | string | null;
  logo: string | null;
}

export type CompetitiveAnalysisItem = {
  company_name: string;
  logo_url: string;
  field: string;
  score: number;
  description: string;
};

export interface CompetitiveAnalysis {
  landscape: LandscapeCompetitor[] | null;
  competitors: Competitor[] | null;
  competitors_websites: CompetitorWebsite[] | null;
  financial_comparables: FinancialComparable[] | null;
  peer_developments: PeerDevelopments[] | null;
  competitive_analysis?: CompetitiveAnalysisItem[] | null;
}
