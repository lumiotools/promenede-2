"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExportPDFButton } from "./export-pdf-button";
import { ExportDialog } from "./export-dialog";
import type { CompanyData } from "@/types/apiResponse";
import { ExportExcelButton } from "./export-excel-button";

interface ReportHeaderProps {
  title: string;
  date: Date;
  searchCriteria: string;
  pagesViewed: number;
  manHoursSaved: number;
  initialData?: CompanyData | null;
}

export default function ReportHeader({
  title,
  date,
  searchCriteria,
  pagesViewed,
  manHoursSaved,
  initialData,
}: ReportHeaderProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const sections = [
    { id: "executive-summary", title: "Executive Summary" },
    { id: "company-profile", title: "Company Profile" },
    { id: "company-overview", title: "Company Overview" },
    { id: "financial-summary", title: "Financial Summary" },
    { id: "financial-detail", title: "Financial Details" },
    { id: "web-traffic", title: "Web Traffic" },
    { id: "company-timeline", title: "Company Timeline" },
    { id: "company-timeline-table", title: "Company Timeline Table" },
    { id: "product-services", title: "Products & Services" },
    { id: "product-timeline-table", title: "Product Timeline" },
    { id: "employee-trend-chart", title: "Employee Trend" },
    { id: "employee-keymembers", title: "Key Members" },
    { id: "employee-leadership", title: "Leadership" },
    { id: "employee-review", title: "Employee Reviews" },
    { id: "employee-review-distribution", title: "Review Distribution" },
    { id: "employee-improvement-areas", title: "Improvement Areas" },
    { id: "strategic-development-component", title: "Strategic Development" },
    { id: "strategic-partnership-component", title: "Strategic Partnerships" },
    { id: "market-leadership-component", title: "Market Leadership" },
    { id: "technology-component", title: "Key Technology" },
    { id: "strategy-component", title: "Strategy" },
    { id: "ma-activity-component", title: "M&A Activity" },
    { id: "market-size-component", title: "Market Size" },
    { id: "value-chain-component", title: "Value Chain" },
    { id: "market-map-component", title: "Market Map" },
    { id: "competitor-landscape-component", title: "Competitive Landscape" },
    { id: "financial-comparables-component", title: "Financial Comparables" },
    { id: "peer-developments-component", title: "Peer Developments" },
    { id: "competitor-analysis-component", title: "Competitor Analysis" },
    { id: "regulation-component", title: "Regulations" },
    { id: "opportunities-component", title: "Opportunities" },
    { id: "risks-component", title: "Risks" },
    { id: "qa-component", title: "Q&A" },
  ];

  const companyName =
    initialData?.company_profile?.firmographic?.name || "Company";

  return (
    <div className="w-full lg:max-w-6xl lg:mx-auto">
      <Card className="rounded-none border-x-0 border-t-0 shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#35454c]">{title}</h1>
              <p className="text-[#57727e] mt-1">
                {date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ExportExcelButton
                companyName={companyName}
                data={initialData || undefined}
              />
              <ExportPDFButton onClick={() => setIsExportDialogOpen(true)} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="bg-[#f0f4f6] rounded-lg p-4 flex-1">
              <p className="text-[#57727e] text-sm">Pages Viewed</p>
              <p className="text-[#35454c] text-xl font-semibold mt-1">
                {pagesViewed.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#f0f4f6] rounded-lg p-4 flex-1">
              <p className="text-[#57727e] text-sm">Man-hours Saved</p>
              <p className="text-[#35454c] text-xl font-semibold mt-1">
                {manHoursSaved} hours
              </p>
            </div>
            <div className="bg-[#f0f4f6] rounded-lg p-4 flex-1">
              <p className="text-[#57727e] text-sm">Company</p>
              <p className="text-[#35454c] text-xl font-semibold mt-1">
                {companyName}
              </p>
            </div>
          </div>
        </CardContent>

        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          sections={sections}
          companyName={companyName}
        />
      </Card>
    </div>
  );
}
