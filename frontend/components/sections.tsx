/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import QAComponent from "./sections/qa/qa-component";
import OpportunitiesPage from "./sections/opportunities-risks/opportunities";
import RisksPage from "./sections/opportunities-risks/risks";
import RegulationPage from "./sections/regulation/regulation";
import CompetitorAnalysisPage from "./sections/competitor/competitorAnalysis";
import PeerDevelopmentsPage from "./sections/competitor/peerDevelopments";
import FinancialComparablesPage from "./sections/competitor/financialComparables";
import CompetitiveLandscapePage from "./sections/competitor/landscape";
import MarketMapPage from "./sections/market/marketMap";
import ValueChainPage from "./sections/market/valueChain";
import MarketSizePage from "./sections/market/marketSize";
import MAStrategyPage from "./sections/maActivity/maActivity";
import MAMapPage from "./sections/maActivity/maMap";
import CustomerSuccessPage from "./sections/customer-success/customerSuccess";
import StrategyPage from "./sections/strategy/strategy";
import StrategicDevelopmentTimeline from "./sections/strategy/strategicDevelopment";
import KeyTechnologyPage from "./sections/technology/technology";
import MarketLeadershipPage from "./sections/market-leadership/marketLeadership";
import StrategicAlliancePage from "./sections/strategic-partnership/strategicPartnership";
import ReportHeader from "./reportheader";
import { CompanyProfile } from "./sections/company/company-profile";
import { CompanyOverview } from "./sections/company/company-overview";
import { FinancialSummary } from "./sections/financial/financial-summary";
import { WebTraffic } from "./sections/webtraffic/web-traffic";
import { CompanyTimeline } from "./sections/company/company-timeline";
import { CompanyTimelineTable } from "./sections/company/company-timeline-table";
import { ProductsServices } from "./sections/product/product-services";
import { ProductLaunchesTimeline } from "./sections/product/product-launch-timeline";
import { ProductTimelineTable } from "./sections/product/product-timeline-table";
import { ExecutiveSummary } from "./sections/executive/executive-summary";
import { EmployeeTrendChart } from "./sections/employee/employee-trend-chart";
import { EmployeeKeyMembers } from "./sections/employee/employee-keymember";
import { LeadershipExecutives } from "./sections/employee/employee-leadership";
import { CompanyData } from "@/types/apiResponse";
import EmployeeBreakdown from "./sections/employee/employee-breakdown";
// import { CompanyProfile } from "./sections/company-profile"
// import { CompanyOverview } from "./sections/company-overview"
// import { FinancialSummary } from "./sections/financial-summary"
type SectionsProps = {
  searchResults?: CompanyData;
};
export function Sections({ searchResults }: SectionsProps) {
  return (
    <div className="flex flex-col w-full">
      <ReportHeader
        title="Report A"
        date={new Date("2024-05-20")}
        searchCriteria="www.paypal.com"
        pagesViewed={10000}
        manHoursSaved={20}
      />

      <section id="executive-summary" className="p-6">
        <ExecutiveSummary />
      </section>

      <section id="company-profile" className="p-6">
        <CompanyProfile />
      </section>

      <section id="company-overview" className="p-6">
        <CompanyOverview />
      </section>

      <section id="financial-summary" className="p-6">
        <FinancialSummary />
      </section>

      <section id="web-traffic" className="p-6">
        <WebTraffic />
      </section>

      <section id="company-timeline" className="p-6">
        <CompanyTimeline />
      </section>
      <section id="company-timeline-table" className="p-6">
        <CompanyTimelineTable />
      </section>
      <section id="product-services" className="p-6">
        <ProductsServices />
      </section>
      <section id="product-launch-timeline" className="p-6">
        <ProductLaunchesTimeline />
      </section>

      <section id="product-timeline-table" className="p-6">
        <ProductTimelineTable />
      </section>
      <section id="employee-breakdown" className="p-6">
        <EmployeeBreakdown
          initialData={searchResults?.organization.employees_trend}
        />
      </section>
      <section id="employee-trend-chart" className="p-6">
        <EmployeeTrendChart
          initialData={searchResults?.organization.employees_trend}
        />
      </section>
      <section id="employee-keymembers" className="p-6">
        <EmployeeKeyMembers
          initialData={searchResults?.organization.key_members}
        />
      </section>
      <section id="employee-leadership" className="p-6">
        <LeadershipExecutives />
      </section>
      <section id="strategic-development-component" className="p-6">
        <StrategicDevelopmentTimeline />
      </section>
      <section id="strategic-partnership-component" className="p-6">
        <StrategicAlliancePage />
      </section>
      <section id="market-leadership-component" className="p-6">
        <MarketLeadershipPage initialData={searchResults?.market_leadership} />
      </section>
      <section id="technology-component" className="p-6">
        <KeyTechnologyPage initialData={searchResults?.key_technology} />
      </section>
      <section id="strategy-component" className="p-6">
        <StrategyPage />
      </section>
      <section id="customer-success-component" className="p-6">
        <CustomerSuccessPage />
      </section>
      {/* <section id="ma-map-component" className="p-6">
        <MAMapPage />
      </section> */}
      <section id="ma-activity-component" className="p-6">
        <MAStrategyPage initialData={searchResults?.ma_activity} />
      </section>
      <section id="market-size-component" className="p-6">
        <MarketSizePage />
      </section>
      <section id="value-chain-component" className="p-6">
        <ValueChainPage />
      </section>
      <section id="market-map-component" className="p-6">
        <MarketMapPage initialData={searchResults?.market_info} />
      </section>
      <section id="competitor-landscape-component" className="p-6">
        <CompetitiveLandscapePage
          initialData={searchResults?.competitive_analysis}
        />
      </section>
      <section id="financial-comparables-component" className="p-6">
        <FinancialComparablesPage
          initialData={searchResults?.competitive_analysis}
        />
      </section>
      <section id="peer-developments-component" className="p-6">
        <PeerDevelopmentsPage
          initialData={searchResults?.competitive_analysis}
        />
      </section>
      <section id="competitor-analysis-component" className="p-6">
        <CompetitorAnalysisPage
          initialData={searchResults?.competitive_analysis}
        />
      </section>
      <section id="regulation-component" className="p-6">
        <RegulationPage initialData={searchResults?.regulation} />
      </section>
      <section id="opportunities-component" className="p-6">
        <OpportunitiesPage initialData={searchResults?.opportunities_risks} />
      </section>
      <section id="risks-component" className="p-6">
        <RisksPage initialData={searchResults?.opportunities_risks} />
      </section>
      <section id="qa-component" className="p-6">
        <QAComponent initialData={searchResults?.qa} />
      </section>
    </div>
  );
}

export default Sections;
