"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Company: true,
    "Market Size Summary": false,
    "Competitive Landscape": false,
  });

  const toggleItem = (item: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <div className="w-70 bg-[#000000] text-white overflow-y-auto h-screen flex-shrink-0 sidebar">
      {/* Header */}
      <div className="p-4 flex items-center gap-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-semibold text-lg tracking-wide">PROMENADE</span>
        <span className="text-xs bg-[#333] px-1.5 border py-0.5 rounded text-[#aaa]">
          BETA
        </span>
      </div>

      {/* New Button */}
      <div className="px-4 py-2">
        <button className="w-full rounded-full py-2 px-4 flex items-center gap-2 text-black font-medium gradient-button">
          <Plus className="h-4 w-4" />
          <span>New</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="bg-[#151517] border border-[#38383A] rounded-md flex items-center px-3 py-2">
          <Search className="h-6 w-6 text-[#777]" />
          <input
            type="text"
            placeholder="Search History"
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-[#ccc] placeholder:text-[#777]"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <h3 className="text-xs font-bold mb-4 text-[#aaa]">INDEX</h3>

        <div className="space-y-1">
          {/* Company Section */}
          <div>
            <button
              onClick={() => toggleItem("Company")}
              className="w-full flex items-center py-1.5 text-sm font-medium hover:bg-[#1e1e1e] rounded px-2"
            >
              <div className="w-4 mr-2">
                {expandedItems["Company"] ? (
                  <div className="h-4 w-0.5 bg-white mx-auto"></div>
                ) : (
                  <div className="h-0.5 w-4 bg-white"></div>
                )}
              </div>
              Company
            </button>

            {expandedItems["Company"] && (
              <div className="ml-6 space-y-1 mt-1">
                <SidebarLink href="#executive-summary" label="Overview" />
                <SidebarLink href="#company-profile" label="Firmographic" />
                <SidebarLink href="#business-model" label="Business Model" />
                <SidebarLink
                  href="#value-proposition"
                  label="Value Proposition"
                />
                <SidebarLink
                  href="#products-services"
                  label="Products & Services"
                />
                <SidebarLink
                  href="#geographic-presence"
                  label="Geographic Presence"
                />
                <SidebarLink href="#strategy" label="Strategy" />
                <SidebarLink
                  href="#financial-statement"
                  label="Financial Statement"
                />
                <SidebarLink href="#key-performance" label="Key Performance" />
                <SidebarLink
                  href="#latest-activities"
                  label="Latest Activities"
                />
                <SidebarLink href="#key-people" label="Key People" />
              </div>
            )}
          </div>

          {/* Market Size Summary Section */}
          <div>
            <button
              onClick={() => toggleItem("Market Size Summary")}
              className="w-full flex items-center py-1.5 text-sm font-medium hover:bg-[#1e1e1e] rounded px-2"
            >
              <div className="w-4 mr-2">
                {expandedItems["Market Size Summary"] ? (
                  <div className="h-4 w-0.5 bg-white mx-auto"></div>
                ) : (
                  <div className="h-0.5 w-4 bg-white"></div>
                )}
              </div>
              Market Size Summary
            </button>

            {expandedItems["Market Size Summary"] && (
              <div className="ml-6 space-y-1 mt-1">
                <SidebarLink
                  href="#current-market-size"
                  label="Current Market Size"
                />
                <SidebarLink
                  href="#projected-market-size"
                  label="Projected Market Size"
                />
                <SidebarLink
                  href="#key-drivers"
                  label="Key Drivers of Growth"
                />
                <SidebarLink href="#regional-trends" label="Regional Trends" />
                <SidebarLink
                  href="#market-size-growth"
                  label="Market Size Growth"
                />
                <SidebarLink href="#market-map" label="Market Map" />
              </div>
            )}
          </div>

          {/* Competitive Landscape Section */}
          <div>
            <button
              onClick={() => toggleItem("Competitive Landscape")}
              className="w-full flex items-center py-1.5 text-sm font-medium hover:bg-[#1e1e1e] rounded px-2"
            >
              <div className="w-4 mr-2">
                {expandedItems["Competitive Landscape"] ? (
                  <div className="h-4 w-0.5 bg-white mx-auto"></div>
                ) : (
                  <div className="h-0.5 w-4 bg-white"></div>
                )}
              </div>
              Competitive Landscape
            </button>

            {expandedItems["Competitive Landscape"] && (
              <div className="ml-6 space-y-1 mt-1">
                <SidebarLink
                  href="#landscape-insights"
                  label="Landscape Insights"
                />
                <SidebarLink
                  href="#competitors"
                  label="Competitors List By AI"
                />
                <SidebarLink
                  href="#competitor-analysis"
                  label="Competitor Analysis"
                />
                <SidebarLink href="#value-chain" label="Value Chain" />
                <SidebarLink href="#conclusion" label="Conclusion" />
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .gradient-button {
          background: linear-gradient(
            90deg,
            #f8f5b1,
            #c6a1fd,
            #89fdd6,
            #9294f0
          );
        }
      `}</style>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  active?: boolean;
}

function SidebarLink({ href, label, active = false }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`block py-1 px-2 text-sm ${
        active ? "text-white" : "text-[#aaa]"
      } hover:text-white hover:bg-[#1e1e1e] rounded`}
    >
      {label}
    </Link>
  );
}
