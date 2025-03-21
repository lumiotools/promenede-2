import { CompetitiveAnalysis } from "./competitor";
import { OpportunitiesRisks } from "./opportunitiesRisks";
import { QAItem } from "./qa";
import { RegulationItem } from "./regulation";

export type ApiResponse<T> = {
  success: boolean;
  company_name: string;
  data?: T;
};

export type CompanyData = {
  competitive_analysis: CompetitiveAnalysis;
  regulation: RegulationItem[];
  opportunities_risks: OpportunitiesRisks;
  qa: QAItem[];
};
export type CompanyApiResponse = ApiResponse<CompanyData | null>;
