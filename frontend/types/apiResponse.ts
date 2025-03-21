import type {
  CompanyOverviewItem,
  CompanyProfiles,
  TimelineEvent,
  WebTrafficItem,
  ProductsServices,
} from "./company";
import { CompetitiveAnalysis } from "./competitor";
import {
  EmployeesTrend,
  KeyMember,
  EmployeeReviewsData,
} from "./employeeTrend";
import { ExecutiveSummaryTitle } from "./executive";
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
    employee_reviews: EmployeeReviewsData | null;
  };
  executive_summary: ExecutiveSummaryTitle;
  market_leadership: MarketLeadership;
  key_technology: KeyTechnology;
  ma_activity: MAActivity;
  market_info: MarketInfo;
  competitive_analysis: CompetitiveAnalysis;
  regulation: RegulationItem[];
  opportunities_risks: OpportunitiesRisks;
  qa: QAItem[];
  company_overview: CompanyOverviewItem;
  company_profile: CompanyProfiles;
  company_timeline: TimelineEvent;
  web_traffic: WebTrafficItem;
  products_services: ProductsServices;
};

export type CompanyApiResponse = ApiResponse<CompanyData | null>;
