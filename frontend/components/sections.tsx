/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import ReportHeader from "./reportheader";
import { ExecutiveSummary } from "./sections/executive-summary";
import { CompanyProfile } from "./sections/company-profile";
import { CompanyOverview } from "./sections/company-overview";
import { FinancialSummary } from "./sections/financial-summary";
import { WebTraffic } from "./sections/web-traffic";
import CompanyTimeline from "./sections/company-timeline";
import { CompanyTimelineTable } from "./sections/company-timeline-table";
import { ProductsServices } from "./sections/product-services";
import { ProductLaunchesTimeline } from "./sections/product-launch-timeline";
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
// import { CompanyProfile } from "./sections/company-profile"
// import { CompanyOverview } from "./sections/company-overview"
// import { FinancialSummary } from "./sections/financial-summary"

export function Sections() {
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
      <section id="strategic-development-component" className="p-6">
        <StrategicDevelopmentTimeline />
      </section>
      <section id="strategic-partnership-component" className="p-6">
        <StrategicAlliancePage />
      </section>
      <section id="market-leadership-component" className="p-6">
        <MarketLeadershipPage />
      </section>
      <section id="technology-component" className="p-6">
        <KeyTechnologyPage />
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
        <MAStrategyPage />
      </section>
      <section id="market-size-component" className="p-6">
        <MarketSizePage />
      </section>
      <section id="value-chain-component" className="p-6">
        <ValueChainPage />
      </section>
      <section id="market-map-component" className="p-6">
        <MarketMapPage />
      </section>
      <section id="competitor-landscape-component" className="p-6">
        <CompetitiveLandscapePage />
      </section>
      <section id="financial-comparables-component" className="p-6">
        <FinancialComparablesPage />
      </section>
      <section id="peer-developments-component" className="p-6">
        <PeerDevelopmentsPage />
      </section>
      <section id="competitor-analysis-component" className="p-6">
        <CompetitorAnalysisPage />
      </section>
      <section id="regulation-component" className="p-6">
        <RegulationPage />
      </section>
      <section id="opportunities-component" className="p-6">
        <OpportunitiesPage />
      </section>
      <section id="risks-component" className="p-6">
        <RisksPage />
      </section>
      <section id="qa-component" className="p-6">
        <QAComponent />
      </section>
    </div>
  );
}

export default Sections;
