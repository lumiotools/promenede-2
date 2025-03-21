import { OpportunitiesRisks } from "./opportunitiesRisks";
import { QAItem } from "./qa";

export type ApiResponse<T> = {
  success: boolean;
  company_name: string;
  data?: T;
};

export type CompanyData = {
  opportunities_risks: OpportunitiesRisks;
  qa: QAItem[];
};
export type CompanyApiResponse = ApiResponse<CompanyData | null>;
