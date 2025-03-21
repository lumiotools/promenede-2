/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Sections from "@/components/sections";
import { Sidebar } from "@/components/sidebar";
import { CompanyData } from "@/types/apiResponse";

export default function Home() {
  const [searchResults, setSearchResults] = useState<CompanyData>({
    organization: {
      employees_trend: {
        count_by_month: null,
        count_change: null,
        breakdown_by_department: null,
        breakdown_by_department_by_month: null,
        breakdown_by_country: null,
        breakdown_by_region: null,
        breakdown_by_seniority: null,
      },
    },
    market_leadership: {
      industry: null,
      rank_category: 0,
      rank_global: 0,
    },
    key_technology: {
      technologies_used: [],
      num_technologies: 0,
    },
    ma_activity: {
      acquisitions: [],
      acquired_by: {
        acquirer_name: null,
        announced_date: null,
        price: 0,
        currency: null,
      },
    },
    market_info: {
      size: null,
      valueChain: null,
      market_map: null,
    },
    competitive_analysis: {
      landscape: [],
      competitors: [],
      competitors_websites: [],
      financial_comparables: [],
      peer_developments: {
        funding_vs_founded: {
          company_data: null,
          competitors_data: [],
        },
        webtraffic_vs_founded: {
          company_data: null,
          competitors_data: [],
        },
      },
    },
    regulation: [],
    opportunities_risks: {
      opportunities: [],
      risks: [],
    },
    qa: [],
  });

  const handleSearchResults = (data: CompanyData) => {
    console.log("page.tsx search results", data);

    setSearchResults(data);
  };

  return (
    <div className="flex h-screen bg-[#f7f9f9]">
      <Sidebar onSearchResults={handleSearchResults} />
      <main className="flex-1 overflow-y-auto w-full">
        <Sections searchResults={searchResults} />{" "}
      </main>
    </div>
  );
}
