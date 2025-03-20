// Define types for competitive analysis data
export interface Competitor {
  companyName: string;
  similarityScore: number;
}

export interface CompetitorWebsite {
  website: string;
  similarityScore: number;
  totalWebsiteVisitsMonthly: number;
  category: string;
  rankCategory: number;
}

export interface LandscapeCompetitor {
  name: string;
  similarityScore: number;
  website: string;
  monthlyVisits: number;
  rankCategory: number;
}

export interface FinancialComparable {
  name: string;
  similarityScore: number;
  financialData: {
    revenue: string;
    profit: string;
    employees: string;
  };
}

export interface CompanyData {
  name: string;
  foundedYear: string;
  totalFunding: number | string;
}

export interface CompanyTrafficData {
  name: string;
  foundedYear: string;
  monthlyTraffic: number | string;
}

export interface PeerDevelopments {
  fundingVsFounded: {
    companyData: CompanyData;
    competitorsData: CompanyData[];
  };
  webtrafficVsFounded: {
    companyData: CompanyTrafficData;
    competitorsData: CompanyTrafficData[];
  };
}

export interface CompetitiveAnalysis {
  landscape: LandscapeCompetitor[];
  competitors: Competitor[];
  competitorsWebsites: CompetitorWebsite[];
  financialComparables: FinancialComparable[];
  peerDevelopments: PeerDevelopments;
}
