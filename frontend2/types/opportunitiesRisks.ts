export interface OpportunityRisk {
  area: string | null
  detail: string | null
  rationale: string | null
}

export interface OpportunitiesRisks {
  opportunities: OpportunityRisk[] | null
  risks: OpportunityRisk[] | null
}

export type Opportunity = OpportunityRisk
export type Risk = OpportunityRisk

