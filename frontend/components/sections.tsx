"use client"

import React from 'react'
import ReportHeader from './reportheader'
import { CompanyProfile } from './sections/company/company-profile'
import { CompanyOverview } from './sections/company/company-overview'
import { FinancialSummary } from './sections/financial/financial-summary'
import { WebTraffic } from './sections/webtraffic/web-traffic'
import CompanyTimeline from './sections/company/company-timeline'
import { CompanyTimelineTable } from './sections/company/company-timeline-table'
import { ProductsServices } from './sections/product/product-services'
import { ProductLaunchesTimeline } from './sections/product/product-launch-timeline'
import { ProductTimelineTable } from './sections/product/product-timeline-table'
import { EmployeeBreakdown } from './sections/employee/employee-breakdown'
import { ExecutiveSummary } from './sections/executive/executive-summary'
import { EmployeeTrendChart } from './sections/employee/employee-trend-chart'
import { EmployeeKeyMembers } from './sections/employee/employee-keymember'
import { LeadershipExecutives } from './sections/employee/employee-leadership'
// import { CompanyProfile } from "./sections/company-profile"
// import { CompanyOverview } from "./sections/company-overview"
// import { FinancialSummary } from "./sections/financial-summary"

export function Sections() {
  return (
    <div className="flex flex-col w-full">
      <ReportHeader
        title="Report A" 
        date={new Date('2024-05-20')}
        searchCriteria="www.paypal.com"
        pagesViewed={10000}
        manHoursSaved={20}
      />

      <section id="executive-summary" className="p-6">
        <ExecutiveSummary  />
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
        <CompanyTimeline/>
      </section>
      <section id="company-timeline-table" className="p-6">
        <CompanyTimelineTable/>
      </section>
      <section id="product-services" className="p-6">
        <ProductsServices/>
      </section>
      <section id="product-launch-timeline" className="p-6">
        <ProductLaunchesTimeline/>
      </section>

      <section id="product-timeline-table" className="p-6">
        <ProductTimelineTable/>
      </section>
      <section id="employee-breakdown" className="p-6">
        <EmployeeBreakdown/>
      </section>
      <section id="employee-trend-chart" className="p-6">
        <EmployeeTrendChart/>
      </section>
      <section id="employee-keymembers" className="p-6">
        <EmployeeKeyMembers/>
      </section>
      <section id="employee-leadership" className="p-6">
        <LeadershipExecutives/>
      </section>
      
    </div>
  )
}

export default Sections