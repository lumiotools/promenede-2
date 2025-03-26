import type {
  CompanyOverviewItem,
  CompanyProfiles,
  TimelineEvent,
  WebTrafficItem,
  ProductsServices,
  CompanyUrls,
} from "./company";
import type { CompetitiveAnalysis } from "./competitor";
import type { EmployeeReviews } from "./employee_reviews";
import type {
  EmployeesTrend,
  KeyMember,
  EmployeeReviewsData,
} from "./employeeTrend";
import type { ExecutiveSummary } from "./executive";
import type { LeadershipExecutive } from "./leadership_executives";
import type { MAActivity } from "./maActivity";
import type { MarketInfo } from "./market";
import type { MarketLeadership } from "./market_leadership";
import type { OpportunitiesRisks } from "./opportunitiesRisks";
import type { QAItem } from "./qa";
import type { RegulationItem } from "./regulation";
import type { StrategicAlliance } from "./strategicAlliance";
import type { StrategicDevelopment } from "./strategicDevelopment";
import type { Strategy } from "./strategy";
import type { KeyTechnology } from "./technology";
import { WebTraffic } from "./webtraffic";

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
  market_leadership: MarketLeadership[] | null;
  key_technology: KeyTechnology[] | null;
  ma_activity: MAActivity;
  market_info: MarketInfo;
  competitive_analysis: CompetitiveAnalysis;
  regulations: RegulationItem[];
  opportunities_risks: OpportunitiesRisks;
  qa: QAItem[];
  company_overview: CompanyOverviewItem;
  company_profile: CompanyProfiles;
  company_timeline: TimelineEvent;
  web_traffic: WebTraffic;
  products_services: ProductsServices;
  strategic_development: StrategicDevelopment | null;
  strategic_alliances: StrategicAlliance[] | null;
  strategy: Strategy | null;
  urls: CompanyUrls | null;
};

export type CompanyApiResponse = ApiResponse<CompanyData | null>;
