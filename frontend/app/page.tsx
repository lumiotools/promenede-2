/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Sections from "@/components/sections";
import { Sidebar } from "@/components/sidebar";
import { CompanyData } from "@/types/apiResponse";

export default function Home() {
  const [searchResults, setSearchResults] = useState<CompanyData>({
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
