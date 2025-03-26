"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Loader2,
  ChevronRight,
  LayoutDashboard,
  Globe,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompanyData } from "@/types/apiResponse";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

// Define the structure for our section categories
interface SectionCategory {
  title: string;
  sections: {
    id: string;
    label: string;
  }[];
}
// Define the brand suggestion interface
interface BrandSuggestion {
  name: string;
  domain: string;
  logo?: string;
}

export function CompanySidebar({
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
  // State for brand suggestions
  const [brandSuggestions, setBrandSuggestions] = React.useState<
    BrandSuggestion[]
  >([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] =
    React.useState(false);
  const [selectedBrand, setSelectedBrand] =
    React.useState<BrandSuggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Ref for the search input to position the dropdown
  const searchInputRef = React.useRef<HTMLDivElement>(null);

  // Fetch brand suggestions as user types
  useEffect(() => {
    const fetchBrandSuggestions = async () => {
      if (searchQuery.length < 2) {
        setBrandSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsFetchingSuggestions(true);
      console.log("Fetching brand suggestions for:", searchQuery);

      try {
        // Now using our Next.js API route instead of directly calling the Brandfetch API
        const response = await fetch(
          `/api/brand-search?query=${encodeURIComponent(searchQuery)}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        // The data is already processed in our API route
        setBrandSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        console.error("Error fetching brand suggestions:", err);
        setBrandSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsFetchingSuggestions(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchBrandSuggestions();
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle search with company URL
  const handleSearch = async (e?: React.FormEvent, brandDomain?: string) => {
    if (e) {
      e.preventDefault();
    }

    const query = selectedBrand?.name || searchQuery;
    const domain = brandDomain || selectedBrand?.domain || "";

    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: query,
            company_url: domain, // Send the company URL to the backend
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(` ${data.message}`);
      }
      // Pass the data to the parent component
      if (onSearchResults) {
        console.log("add to search results", data.data);
        onSearchResults(data.data);
      }

      // Clear selection after successful search
      setSelectedBrand(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to handle brand selection
  const handleSelectBrand = (brand: BrandSuggestion) => {
    setSelectedBrand(brand);
    setSearchQuery(brand.name);
    setShowSuggestions(false);
  };

  // Function to clear selected brand
  const clearSelectedBrand = () => {
    setSelectedBrand(null);
    setSearchQuery("");
    setShowSuggestions(false);
  };

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
        <form onSubmit={handleSearch} className="px-4 pb-3">
          <div className="relative" ref={searchInputRef}>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              {isFetchingSuggestions ? (
                <Loader2 className="h-4 w-4 text-zinc-500 animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-zinc-500" />
              )}
            </div>
            <Input
              type="text"
              placeholder="Search Company"
              className="pl-9 pr-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (brandSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {selectedBrand && (
              <button
                type="button"
                onClick={clearSelectedBrand}
                className="absolute inset-y-0 right-12 flex items-center pr-2 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <Button
              type="submit"
              size="sm"
              variant="secondary"
              className="absolute inset-y-0 right-0 px-3 rounded-l-none bg-zinc-800 hover:bg-zinc-700 text-white"
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>

            {/* Brand suggestions dropdown */}
            {showSuggestions && brandSuggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-md shadow-lg overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto py-1">
                  {brandSuggestions.map((brand, index) => (
                    <button
                      key={`${brand.domain}-${index}`}
                      type="button"
                      onClick={() => handleSelectBrand(brand)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-white hover:bg-zinc-800"
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo || "/placeholder.svg"}
                          alt={brand.name}
                          className="w-5 h-5 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg?height=20&width=20";
                          }}
                        />
                      ) : (
                        <Globe className="w-4 h-4 text-zinc-400" />
                      )}
                      <span className="flex-1 truncate">{brand.name}</span>
                      <span className="text-xs text-zinc-500">
                        {brand.domain}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedBrand && (
            <div className="mt-2 flex items-center gap-2 px-2 py-1.5 bg-zinc-800 rounded-md text-sm text-white">
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <span className="flex-1 truncate">{selectedBrand.domain}</span>
            </div>
          )}

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
