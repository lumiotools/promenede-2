import { CompetitiveAnalysis } from "./competitor";
import { EmployeesTrend, KeyMember } from "./employeeTrend";
import { MAActivity } from "./maActivity";
import { MarketInfo } from "./market";
import { MarketLeadership } from "./market_leadership";
import { OpportunitiesRisks } from "./opportunitiesRisks";
import { QAItem } from "./qa";
import { RegulationItem } from "./regulation";
import { KeyTechnology } from "./technology";

export type ApiResponse<T> = {
  success: boolean;
  company_name: string;
  data?: T;
};

export type CompanyData = {
  organization: {
    employees_trend: EmployeesTrend;
    key_members: KeyMember[] | null;
  };
  market_leadership: MarketLeadership;
  key_technology: KeyTechnology;
  ma_activity: MAActivity;
  market_info: MarketInfo;
  competitive_analysis: CompetitiveAnalysis;
  regulation: RegulationItem[];
  opportunities_risks: OpportunitiesRisks;
  qa: QAItem[];
};
export type CompanyApiResponse = ApiResponse<CompanyData | null>;
