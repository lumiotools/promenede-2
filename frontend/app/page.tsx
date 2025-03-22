"use client";

import { useState } from "react";
import Sections from "@/components/sections";
import { Sidebar } from "@/components/sidebar";
import { CompanyData } from "@/types/apiResponse";

export default function Home() {
  const [searchResults, setSearchResults] = useState<CompanyData>({
    executive_summary: {
      industry: null,
      topic_tags: null,
      valuation: null,
      equity_funding_total: null,
      funding_total: null,
      description: null,
      financial_highlights: {
        operating_revenue: null,
        operating_profit: null,
        ebitda: null,
        net_income: null,
        per: null,
      },
    },
    strategic_development: null,
    strategic_alliances: null,
    organization: {
      leadership_executives: null,
      employee_reviews2: {
        count: null,
        score: null,
        breakdown: {
          business_outlook: null,
          career_opportunities: null,
          ceo_approval: null,
          compensation_benefits: null,
          culture_values: null,
          diversity_inclusion: null,
          recommend: null,
          senior_management: null,
          work_life_balance: null,
        },
        distribution: {
          "1": null,
          "2": null,
          "3": null,
          "4": null,
          "5": null,
        },
        by_category: {
          business_outlook: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
          career_opportunities: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
          ceo_approval: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
          compensation_benefits: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
          culture_values: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
          diversity_inclusion: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
          recommend: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
          senior_management: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
          work_life_balance: {
            current: null,
            change: { monthly: null, quarterly: null, yearly: null },
            trend: null,
          },
        },
      },
      employees_trend: {
        count_by_month: null,
        count_change: null,
        breakdown_by_department: null,
        breakdown_by_department_by_month: null,
        breakdown_by_country: null,
        breakdown_by_region: null,
        breakdown_by_seniority: null,
      },
      key_members: null,
      employee_reviews: null,
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
    company_overview: {
      business_model: null,
      products_brands: null,
      customers: null,
      description_enriched: null,
    },
    company_profile: {
      firmographic: null,
      key_financials: null,
      shareholders: null,
    },
    company_timeline: {
      date: null,
      event: null,
      description: null,
    },
    web_traffic: {
      monthly_visits: null,
      visits_by_country: [],
      visits_by_month: [],
      visits_change: null,
      bounce_rate: null,
      pages_per_visit: null,
      average_visit_duration: null,
    },

    products_services: {
      services: null,
      details: [],
      launch_timeline: null,
      pricing_available: null,
      free_trial_available: null,
      demo_available: null,
      product_reviews: null,
    },
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
