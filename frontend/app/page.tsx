/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Sections from "@/components/sections";
import { Sidebar } from "@/components/sidebar";
import { CompanyData } from "@/types/apiResponse";

export default function Home() {
  const [searchResults, setSearchResults] = useState<CompanyData>({
    qa: [],
    company_overview:{
      business_model:null,
      products_brands:null,
      customers:null,
      description_enriched:null,
    },
    company_profile:{
      firmographic: null,
      key_financials:null,
      shareholders:null,
    },
    company_timeline:[],
    web_traffic:{
      monthly_visits: null,
      visits_by_country:[],
      visits_by_month:[],
      visits_change:null,
      bounce_rate:null,
      pages_per_visit:null,
      average_visit_duration:null,
    },
    products_services:{
      details:[],
      launch_timeline:[],
      pricing_available:null,
      free_trial_available:null,
      demo_available:null,
      product_reviews:null,
    }
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
