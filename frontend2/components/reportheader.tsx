"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExportPDFButton } from "./export-pdf-button";
import { ExportDialog } from "./export-dialog";
import type { CompanyData } from "@/types/apiResponse";
import { ExportExcelButton } from "./export-excel-button";
import Image from "next/image";

interface ReportHeaderProps {
  date: Date;
  initialData?: CompanyData | null;
}

export default function ReportHeader({ date, initialData }: ReportHeaderProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [companyData, setCompanyData] = useState<
    CompanyData | null | undefined
  >(initialData);
  const [imageError, setImageError] = useState(false);

  // Keep track of changing initialData
  useEffect(() => {
    setCompanyData(initialData);
    setImageError(false);
  }, [initialData]);

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

  const companyName = companyData?.company_profile?.firmographic?.name;
  const title = companyName
    ? `Company Report for ${companyName}`
    : "Company Report";
  const searchCriteria = companyData?.urls?.company_url || "";
  const logoUrl = companyData?.urls?.image_url || "";

  // Helper function to convert URL to string
  const getUrlString = (
    url: string | string[] | null | undefined
  ): string | undefined => {
    if (!url) return undefined;
    if (typeof url === "string") return url;
    if (Array.isArray(url) && url.length > 0) return url[0];
    return undefined;
  };

  // List of social media links to display
  const socialLinks = [
    { name: "LinkedIn", url: getUrlString(companyData?.urls?.linkedin_url) },
    { name: "Facebook", url: getUrlString(companyData?.urls?.facebook_url) },
    { name: "Twitter", url: getUrlString(companyData?.urls?.twitter_url) },
    { name: "YouTube", url: getUrlString(companyData?.urls?.youtube_url) },
    { name: "Instagram", url: getUrlString(companyData?.urls?.instagram_url) },
    { name: "GitHub", url: getUrlString(companyData?.urls?.github_url) },
    { name: "Discord", url: getUrlString(companyData?.urls?.discord_url) },
  ].filter((link) => !!link.url); // Only include links that have a valid URL

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-full lg:max-w-6xl lg:mx-auto">
      <Card className="rounded-none border-x-0 border-t-0 shadow-none">
        <CardContent className="p-4">
          {companyData ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-3">
                  {logoUrl && !imageError && (
                    <div className="relative w-12 h-12 overflow-hidden rounded-md border border-gray-200 flex-shrink-0">
                      <img
                        src={logoUrl}
                        alt={`${companyName || "Company"} logo`}
                        className="object-contain w-full h-full"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-semibold text-[#35454c]">
                      {title}
                    </h1>
                    <p className="text-[#57727e] text-sm mt-1">
                      {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ExportExcelButton
                    companyName={companyName || "Company"}
                    data={companyData}
                  />
                  <ExportPDFButton
                    onClick={() => setIsExportDialogOpen(true)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {searchCriteria && (
                  <div className="bg-[#f0f4f6] rounded p-3 flex-1">
                    <p className="text-[#57727e] text-xs">Company URL</p>
                    <a
                      href={searchCriteria}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563eb] hover:underline text-sm font-medium mt-0.5 truncate block"
                    >
                      {searchCriteria}
                    </a>
                  </div>
                )}

                {companyName && (
                  <div className="bg-[#f0f4f6] rounded p-3 flex-1">
                    <p className="text-[#57727e] text-xs">Company</p>
                    <p className="text-[#35454c] text-sm font-medium mt-0.5">
                      {companyName}
                    </p>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-3">
                  <p className="text-[#57727e] text-xs mb-1">Social Media</p>
                  <div className="flex flex-wrap gap-1.5">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-2 py-0.5 bg-[#f0f4f6] rounded text-xs text-[#35454c] hover:bg-[#e0e7ea] transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <h1 className="text-2xl font-semibold text-[#35454c]">
              Company Report
            </h1>
          )}
        </CardContent>

        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          sections={sections}
          companyName={companyName || "Company"}
        />
      </Card>
    </div>
  );
}
