// Define shared types for our components
export interface Opportunity {
  area: string;
  detail: string;
  rationale: string;
}

export interface Risk {
  area: string;
  detail: string;
  rationale: string;
}

export interface OpportunitiesRisks {
  opportunities: Opportunity[];
  risks: Risk[];
}
