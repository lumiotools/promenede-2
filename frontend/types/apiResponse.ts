import type {
  CompanyOverviewItem,
  CompanyProfiles,
  TimelineEvent,
  WebTrafficItem,
  ProductsServices,
} from "./company";
import { CompetitiveAnalysis } from "./competitor";
import { EmployeeReviews } from "./employee_reviews";
import {
  EmployeesTrend,
  KeyMember,
  EmployeeReviewsData,
} from "./employeeTrend";
import { ExecutiveSummary } from "./executive";
import { LeadershipExecutive } from "./leadership_executives";
import { MAActivity } from "./maActivity";
import { MarketInfo } from "./market";
import { MarketLeadership } from "./market_leadership";
import { OpportunitiesRisks } from "./opportunitiesRisks";
import { QAItem } from "./qa";
import { RegulationItem } from "./regulation";
import { StrategicAlliance } from "./strategicAlliance";
import { StrategicDevelopment } from "./strategicDevelopment";
import { Strategy } from "./strategy";
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
    leadership_executives: LeadershipExecutive[] | null;
    employee_reviews2: EmployeeReviews;
  };
  executive_summary: ExecutiveSummary;
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
  strategic_development: StrategicDevelopment | null;
  strategic_alliances: StrategicAlliance[] | null;
  strategy: Strategy | null;
};

export type CompanyApiResponse = ApiResponse<CompanyData | null>;
