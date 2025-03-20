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
