"use client";

import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { CompanyData } from "@/types/apiResponse";

// Define the structure for our section categories
interface SectionCategory {
  title: string;
  sections: {
    id: string;
    label: string;
  }[];
}

export function Sidebar({
  onSearchResults,
}: {
  onSearchResults?: (data: CompanyData) => void;
}) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "Executive & Company": true,
    "Financial & Performance": false,
    "Products & Timeline": false,
    "Strategy & Leadership": false,
    "Market Analysis": false,
    "Competitive Landscape": false,
    "M&A & Partnerships": false,
    "Risks & Opportunities": false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define all sections based on your sections.tsx file
  const sectionCategories: SectionCategory[] = [
    {
      title: "Executive & Company",
      sections: [
        { id: "executive-summary", label: "Executive Summary" },
        { id: "company-profile", label: "Company Profile" },
        { id: "company-overview", label: "Company Overview" },
        { id: "company-timeline", label: "Company Timeline" },
        { id: "company-timeline-table", label: "Timeline Details" },
      ],
    },
    {
      title: "Financial & Performance",
      sections: [
        { id: "financial-summary", label: "Financial Summary" },
        { id: "web-traffic", label: "Web Traffic" },
        {
          id: "financial-comparables-component",
          label: "Financial Comparables",
        },
      ],
    },
    {
      title: "Products & Timeline",
      sections: [
        { id: "product-services", label: "Products & Services" },
        { id: "product-launch-timeline", label: "Product Launches" },
        { id: "product-timeline-table", label: "Product Timeline" },
      ],
    },
    {
      title: "Strategy & Leadership",
      sections: [
        { id: "strategy-component", label: "Strategy" },
        {
          id: "strategic-development-component",
          label: "Strategic Development",
        },
        { id: "employee-breakdown", label: "Employee Breakdown" },
        { id: "employee-trend-chart", label: "Employee Trends" },
        { id: "employee-keymembers", label: "Key Members" },
        { id: "employee-leadership", label: "Leadership & Executives" },
      ],
    },
    {
      title: "Market Analysis",
      sections: [
        { id: "market-size-component", label: "Market Size" },
        { id: "market-map-component", label: "Market Map" },
        { id: "value-chain-component", label: "Value Chain" },
        { id: "market-leadership-component", label: "Market Leadership" },
      ],
    },
    {
      title: "Competitive Landscape",
      sections: [
        {
          id: "competitor-landscape-component",
          label: "Competitive Landscape",
        },
        { id: "competitor-analysis-component", label: "Competitor Analysis" },
        { id: "peer-developments-component", label: "Peer Developments" },
      ],
    },
    {
      title: "M&A & Partnerships",
      sections: [
        { id: "ma-activity-component", label: "M&A Activity" },
        {
          id: "strategic-partnership-component",
          label: "Strategic Partnerships",
        },
      ],
    },
    {
      title: "Risks & Opportunities",
      sections: [
        { id: "technology-component", label: "Key Technology" },
        { id: "customer-success-component", label: "Customer Success" },
        { id: "regulation-component", label: "Regulation" },
        { id: "opportunities-component", label: "Opportunities" },
        { id: "risks-component", label: "Risks" },
        { id: "qa-component", label: "Q&A" },
      ],
    },
  ];

  const toggleItem = (item: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Function to handle search
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        "https://promenede-2.onrender.com/company/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_name: searchQuery }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Pass the data to the parent component
      if (onSearchResults) {
        console.log("add to search results", data.data);
        onSearchResults(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
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
        <form onSubmit={handleSearch} className="relative">
          <div className="bg-[#151517] border border-[#38383A] rounded-md flex items-center px-3 py-2">
            <div className="flex-1 flex items-center">
              {isSearching ? (
                <Loader2 className="h-5 w-5 text-[#777] animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-[#777]" />
              )}
              <input
                type="text"
                placeholder="Search Company"
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-[#ccc] placeholder:text-[#777]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={isSearching || !searchQuery.trim()}
              className={`ml-2 text-xs rounded px-3 py-1 ${
                isSearching || !searchQuery.trim()
                  ? "bg-[#2a2a2c] text-[#777] cursor-not-allowed"
                  : "bg-[#2a2a2c] hover:bg-[#3a3a3c] text-white cursor-pointer"
              }`}
            >
              Search
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1 px-1">{error}</p>}
        </form>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <h3 className="text-xs font-bold mb-4 text-[#aaa]">INDEX</h3>

        <div className="space-y-1">
          {sectionCategories.map((category) => (
            <div key={category.title}>
              <button
                onClick={() => toggleItem(category.title)}
                className="w-full flex items-center py-1.5 text-sm font-medium hover:bg-[#1e1e1e] rounded px-2"
              >
                <div className="w-4 mr-2">
                  {expandedItems[category.title] ? (
                    <div className="h-4 w-0.5 bg-white mx-auto"></div>
                  ) : (
                    <div className="h-0.5 w-4 bg-white"></div>
                  )}
                </div>
                {category.title}
              </button>

              {expandedItems[category.title] && (
                <div className="ml-6 space-y-1 mt-1">
                  {category.sections.map((section) => (
                    <SidebarLink
                      key={section.id}
                      href={`#${section.id}`}
                      label={section.label}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
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
  // Extract the ID from the href
  const id = href.replace("#", "");

  // Function to handle smooth scrolling
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`block py-1 px-2 text-sm ${
        active ? "text-white" : "text-[#aaa]"
      } hover:text-white hover:bg-[#1e1e1e] rounded cursor-pointer`}
    >
      {label}
    </a>
  );
}
