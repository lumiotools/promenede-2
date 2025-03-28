"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { ExportDialog } from "./export-dialog";

// Define the section mapping to match sidebar structure
const sectionMapping = [
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
  { id: "employee-breakdown", title: "Employee Breakdown" },
  { id: "employee-trend-chart", title: "Employee Trend" },
  { id: "employee-keymembers", title: "Key Members" },
  { id: "employee-leadership", title: "Leadership" },
  { id: "employee-review", title: "Employee Reviews" },
  { id: "strategic-development-component", title: "Strategic Development" },
  { id: "strategic-partnership-component", title: "Strategic Partnership" },
  { id: "market-leadership-component", title: "Market Leadership" },
  { id: "technology-component", title: "Technology" },
  { id: "strategy-component", title: "Strategy" },
  { id: "ma-activity-component", title: "M&A Activity" },
  { id: "market-size-component", title: "Market Size" },
  // { id: "value-chain-component", title: "Value Chain" },
  // { id: "market-map-component", title: "Market Map" },
  { id: "competitor-landscape-component", title: "Competitive Landscape" },
  { id: "financial-comparables-component", title: "Financial Comparables" },
  { id: "peer-developments-component", title: "Peer Developments" },
  { id: "competitor-analysis-component", title: "Competitor Analysis" },
  { id: "regulation-component", title: "Regulation" },
  { id: "opportunities-component", title: "Opportunities" },
  { id: "risks-component", title: "Risks" },
  { id: "qa-component", title: "Q&A" },
];

export function ExportPDFButton({ onClick }: { onClick?: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setIsDialogOpen(true);
          onClick?.();
        }}
        className="flex items-center gap-2 text-sm bg-white border border-[#D0D5DD] px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
      >
        <FileText className="h-4 w-4 text-red-500" />
        <span className="text-[#344054]">Export</span>
      </button>

      <ExportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        sections={sectionMapping}
      />
    </>
  );
}
