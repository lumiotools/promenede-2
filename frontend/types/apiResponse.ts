import { CompetitiveAnalysis } from "./competitor";
import { MAActivity } from "./maActivity";
import { MarketInfo } from "./market";
import { OpportunitiesRisks } from "./opportunitiesRisks";
import { QAItem } from "./qa";
import { RegulationItem } from "./regulation";

export type ApiResponse<T> = {
  success: boolean;
  company_name: string;
  data?: T;
};

export type CompanyData = {
  ma_activity: MAActivity;
  market_info: MarketInfo;
  competitive_analysis: CompetitiveAnalysis;
  regulation: RegulationItem[];
  opportunities_risks: OpportunitiesRisks;
  qa: QAItem[];
};
export type CompanyApiResponse = ApiResponse<CompanyData | null>;
