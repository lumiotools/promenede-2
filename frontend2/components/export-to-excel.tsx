"use client";

import ExcelJS from "exceljs";
import FileSaver from "file-saver";
import type { CompanyData } from "@/types/apiResponse";
import { FinancialComparable, PeerDevelopments } from "@/types/competitor";
import {
  MarketInfo,
  MarketMap,
  SizeData,
  ValueChain,
  YearData,
} from "@/types/market";
import { ProductLaunch, Service } from "@/types/company";
import { QAItem } from "@/types/qa";
import {
  OpportunitiesRisks,
  Opportunity,
  OpportunityRisk,
  Risk,
} from "@/types/opportunitiesRisks";

// Helper function to sanitize sheet names (Excel has a 31 character limit and restrictions on special characters)
const sanitizeSheetName = (name: string): string => {
  // Remove invalid characters and truncate to 31 characters
  return name.replace(/[\\/*[\]?:]/g, "").substring(0, 31);
};

// Helper function to ensure sheet names are unique
const getUniqueSheetName = (
  workbook: ExcelJS.Workbook,
  name: string
): string => {
  const sanitized = sanitizeSheetName(name);
  let sheetName = sanitized;
  let counter = 1;

  // Check if sheet name already exists, if so, append a number
  while (workbook.getWorksheet(sheetName)) {
    sheetName = `${sanitized.substring(0, 27)}_${counter}`;
    counter++;
  }

  return sheetName;
};

// Helper function to add metadata to the workbook
const addWorkbookMetadata = (
  workbook: ExcelJS.Workbook,
  companyName: string
): void => {
  workbook.creator = "Promenade";
  workbook.lastModifiedBy = "Promenade Export Tool";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.properties.date1904 = false;
  workbook.title = `${companyName} Report`;
  workbook.subject = "Company Analysis";
  workbook.keywords = "promenade,company,analysis,report";
  workbook.category = "Report";
  workbook.company = "Promenade";
  workbook.manager = "Promenade";
};

// Helper function to format a cell value for Excel
const formatCellValue = (value: any): string | number | Date | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "object") {
    if (value instanceof Date) {
      return value;
    }
    return JSON.stringify(value);
  }

  return value;
};

// Helper function to add data to a worksheet
// Helper function to add data to a worksheet
const addDataToWorksheet = (
  worksheet: ExcelJS.Worksheet,
  data: Record<string, any>[],
  title: string
): void => {
  // Add title row
  const titleRow = worksheet.addRow([title]);
  titleRow.font = { bold: true, size: 16 };
  worksheet.addRow([]); // Empty row after title

  if (!data || data.length === 0) {
    worksheet.addRow(["No data available"]);
    return;
  }

  // Get all unique keys from all objects
  const allKeys = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  );

  // Add header row
  const headerRow = worksheet.addRow(allKeys);
  headerRow.font = { bold: true };

  // Style the header row
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Add data rows
  data.forEach((item) => {
    const rowData = allKeys.map((key) => formatCellValue(item[key]));
    worksheet.addRow(rowData);
  });

  // Auto-fit columns
  worksheet.columns.forEach((column) => {
    if (column && typeof column.eachCell === "function") {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(maxLength + 2, 50); // Cap width at 50 characters
    }
  });
};

// Format financial details
const formatFinancialDetails = (data?: CompanyData): Record<string, any>[] => {
  // If no data or no key_financials, return an empty array
  if (!data?.company_profile?.key_financials) return [];

  const keyFinancials = data.company_profile.key_financials;
  const result: Record<string, any>[] = [];

  // Format income statements (if available)
  if (
    keyFinancials.income_statements &&
    keyFinancials.income_statements.length > 0
  ) {
    keyFinancials.income_statements.forEach((incomeStatement) => {
      result.push({
        "Cost of Goods Sold": incomeStatement.cost_of_goods_sold
          ? `${incomeStatement.cost_of_goods_sold} ${
              incomeStatement.cost_of_goods_sold_currency || "Not specified"
            }`
          : "Not specified",
        EBIT: incomeStatement.ebit || "Not specified",
        EBITDA: incomeStatement.ebitda || "Not specified",
        "EBITDA Margin": incomeStatement.ebitda_margin || "Not specified",
        "EBIT Margin": incomeStatement.ebit_margin || "Not specified",
        "Earnings Per Share":
          incomeStatement.earnings_per_share || "Not specified",
        "Gross Profit": incomeStatement.gross_profit || "Not specified",
        "Gross Profit Margin":
          incomeStatement.gross_profit_margin || "Not specified",
        "Income Tax Expense":
          incomeStatement.income_tax_expense || "Not specified",
        "Interest Expense": incomeStatement.interest_expense || "Not specified",
        "Interest Income": incomeStatement.interest_income || "Not specified",
        "Net Income": incomeStatement.net_income || "Not specified",
        "Period Display End Date":
          incomeStatement.period_display_end_date || "Not specified",
        "Period End Date": incomeStatement.period_end_date || "Not specified",
        "Period Type": incomeStatement.period_type || "Not specified",
        "Pre-Tax Profit": incomeStatement.pre_tax_profit || "Not specified",
        Revenue: incomeStatement.revenue || "Not specified",
        "Total Operating Expense":
          incomeStatement.total_operating_expense || "Not specified",
      });
    });
  }

  // Format operating revenue (if available)
  if (
    keyFinancials.operating_revenue &&
    keyFinancials.operating_revenue.length > 0
  ) {
    keyFinancials.operating_revenue.forEach((revenue) => {
      result.push({
        "Operating Revenue": revenue.value
          ? `${revenue.value} ${revenue.currency}`
          : "Not specified",
        Date: revenue.date || "Not specified",
      });
    });
  }

  // Format operating profit (if available)
  if (
    keyFinancials.operating_profit &&
    keyFinancials.operating_profit.length > 0
  ) {
    keyFinancials.operating_profit.forEach((profit) => {
      result.push({
        "Operating Profit": profit.value
          ? `${profit.value} ${profit.currency}`
          : "Not specified",
        Date: profit.date || "Not specified",
      });
    });
  }

  // Format EBITDA (if available)
  if (keyFinancials.ebitda && keyFinancials.ebitda.length > 0) {
    keyFinancials.ebitda.forEach((ebitda) => {
      result.push({
        EBITDA: ebitda.value
          ? `${ebitda.value} ${ebitda.currency}`
          : "Not specified",
        Date: ebitda.date || "Not specified",
      });
    });
  }

  // Format net income (if available)
  if (keyFinancials.net_income && keyFinancials.net_income.length > 0) {
    keyFinancials.net_income.forEach((netIncome) => {
      result.push({
        "Net Income": netIncome.value
          ? `${netIncome.value} ${netIncome.currency}`
          : "Not specified",
        Date: netIncome.date || "Not specified",
      });
    });
  }

  // Format PER (if available)
  if (keyFinancials.per) {
    result.push({
      "PER Value": keyFinancials.per.value || "Not specified",
      "Closing Price": keyFinancials.per.closing_price || "Not specified",
      EPS: keyFinancials.per.eps || "Not specified",
      Date: keyFinancials.per.date || "Not specified",
    });
  }

  // Format revenue growth (if available)
  if (keyFinancials.revenue_growth && keyFinancials.revenue_growth.length > 0) {
    keyFinancials.revenue_growth.forEach((growth) => {
      result.push({
        "Revenue Growth": growth.value || "Not specified",
        "Previous Period": growth.previous_period || "Not specified",
        "Current Period": growth.current_period || "Not specified",
      });
    });
  }

  return result;
};

// Format company timeline
const formatCompanyTimeline = (data?: CompanyData): Record<string, any>[] => {
  if (!data?.company_timeline) return [];

  // Check if company_timeline is an array
  if (!Array.isArray(data.company_timeline)) {
    // If it's an object with properties, convert it to an array with one item
    if (
      typeof data.company_timeline === "object" &&
      data.company_timeline !== null
    ) {
      return [
        {
          Date: data.company_timeline.date || "",
          Event: data.company_timeline.event || "",
          Description: data.company_timeline.description || "",
        },
      ];
    }
    return []; // If it's not an object or array, return empty array
  }

  return data.company_timeline.map((item) => ({
    Date: item.date || "",
    Event: item.event || "",
    Description: item.description || "",
  }));
};

// Format products and services
const formatProductsServices = (data?: CompanyData): Service[] => {
  // If no data or no products_services or no services, return empty array
  if (!data?.products_services?.services) {
    return [];
  }

  // Map services to the correct format that matches the Service type
  return data.products_services.services.map((service) => ({
    name: service.name || "", // Ensure 'name' matches the Service type
    description: service.description || "", // Ensure 'description' matches the Service type
  }));
};
// Format product timeline
const formatProductTimeline = (
  data?: CompanyData
): {
  products: Array<Record<string, any>>;
} => {
  // Initialize result with just products data
  const result = {
    products: [] as Array<Record<string, any>>, // Ensure products is always an array of ProductLaunch
  };

  // Extract product launch data from company data
  const productLaunches: ProductLaunch[] =
    data?.products_services?.launch_timeline || []; // Default to empty array if null or undefined

  // Handle case where there are no product launches
  if (productLaunches.length === 0) {
    console.warn("No product launch data found");

    // Add empty data indicator if no launches
    result.products.push({
      product_name: "No data available",
      description: "",
      key_features: [], // Key features will be empty for placeholder
      date: "",
    });

    return result;
  }

  // Format each product launch for the result array
  productLaunches.forEach((launch) => {
    result.products.push({
      product_name: launch.product_name || "Unnamed Product", // Fallback for missing product name
      description: launch.description || "", // Fallback for missing description
      key_features: launch.key_features ? launch.key_features.join(", ") : "", // Join key features as a single string for Excel
      date: launch.date || "", // Fallback for missing date
    });
  });

  return result;
};
const formatKeyTechnology = (
  data?: CompanyData
): {
  technologies: Array<Record<string, any>>;
} => {
  // Initialize result with just technologies data
  const result = {
    technologies: [] as Array<Record<string, any>>,
  };

  // Extract key technology data from company data
  const techData = data?.key_technology;

  if (!techData || techData.length === 0) {
    console.warn("No key technology data found");

    // Add empty data indicator if no key technology data is found
    result.technologies.push({
      Technology: "No data available",
      Description: "",
      Date: "",
    });

    return result;
  }

  // Format each technology for Excel using only the fields in the interface
  techData.forEach((tech) => {
    result.technologies.push({
      Technology: tech.technology || "Unnamed Technology", // Fallback to "Unnamed Technology" if null
      Description: tech.description || "No description available", // Fallback to a default description if null
      Date: tech.date || "", // Fallback to an empty string if date is null
    });
  });

  return result;
};

const formatMAActivity = (
  data?: CompanyData
): {
  deals: Array<Record<string, any>>;
} => {
  // Initialize result with just deals data
  const result = {
    deals: [] as Array<Record<string, any>>,
  };

  // Extract M&A activity data from company data
  const maDeals = data?.ma_activity?.ma_deals;

  if (!maDeals || maDeals.length === 0) {
    console.warn("No M&A deals found");

    // Add empty data indicator if no M&A deals are found
    result.deals.push({
      "Deal Name": "No data available",
      Description: "",
      "Deal Type": "",
      "Deal Date": "",
      "Deal Value": "",
    });

    return result;
  }

  // Format each deal for Excel
  maDeals.forEach((deal) => {
    result.deals.push({
      "Deal Name": deal.deal_name || "Unnamed Deal", // Fallback to "Unnamed Deal"
      Description: deal.description || "", // Fallback to empty string if no description
      "Deal Type": deal.deal_type || "", // Fallback to empty string if no deal type
      "Deal Date": deal.deal_date || "", // Fallback to empty string if no deal date
      "Deal Value": deal.deal_value || "Not specified", // Fallback to "Not specified"
    });
  });

  return result;
};

// Format market size
const formatMarketSize = (
  data?: CompanyData
): {
  overview: Array<Record<string, any>>;
  marketData: Array<Record<string, any>>;
  trends: Array<Record<string, any>>;
} => {
  // Initialize empty result structure
  const result = {
    overview: [] as Array<Record<string, any>>,
    marketData: [] as Array<Record<string, any>>,
    trends: [] as Array<Record<string, any>>,
  };

  // Extract size data from the proper location in CompanyData
  const sizeData = data?.market_info?.size;

  // Check if we have any data
  if (!sizeData || typeof sizeData !== "object") {
    console.warn("No market size data found in the provided structure");

    // Add empty data indicators if no size data is found
    result.overview.push({
      Property: "Data Status",
      Value: "No market size data available",
    });

    result.marketData.push({
      "Year Type": "No data available",
      "Market Size": "",
      CAGR: "",
      "Key Excerpt": "",
      Explanation: "",
    });

    result.trends.push({
      "Year Type": "No data available",
      Trend: "No trends available",
    });

    return result;
  }

  // Log what data we found for debugging
  console.log("Processing market size data:", sizeData.industryName);

  // 1. Overview data
  result.overview.push({
    Property: "Industry Name",
    Value: sizeData.industryName || "Not specified",
  });

  // Count how many year data points we have
  let yearDataPoints = 0;
  if (sizeData.pastYearData) yearDataPoints++;
  if (sizeData.yearBeforeData) yearDataPoints++;
  if (sizeData.projectionFor2030) yearDataPoints++;

  result.overview.push({
    Property: "Years of Data Available",
    Value: yearDataPoints,
  });

  if (sizeData.pastYearData?.marketSize) {
    result.overview.push({
      Property: "Latest Market Size",
      Value: sizeData.pastYearData.marketSize,
    });
  }

  if (sizeData.projectionFor2030?.marketSize) {
    result.overview.push({
      Property: "2030 Projected Market Size",
      Value: sizeData.projectionFor2030.marketSize,
    });
  }

  // Calculate growth if we have both data points
  if (
    sizeData.pastYearData?.marketSize &&
    sizeData.projectionFor2030?.marketSize
  ) {
    result.overview.push({
      Property: "Projected Growth",
      Value:
        "From " +
        sizeData.pastYearData.marketSize +
        " to " +
        sizeData.projectionFor2030.marketSize,
    });
  }

  // 2. Year data - one row per year with all relevant fields
  const addYearData = (yearType: string, yearData: YearData | null) => {
    if (!yearData) return;

    result.marketData.push({
      "Year Type": yearType,
      "Market Size": yearData.marketSize || "Not specified",
      CAGR: yearData.cagr || "Not specified",
      "Key Excerpt": yearData.keyExcerpt || "None provided",
      Explanation: yearData.explanation || "None provided",
    });
  };

  addYearData("Past Year", sizeData.pastYearData);
  addYearData("Year Before", sizeData.yearBeforeData);
  addYearData("Projection for 2030", sizeData.projectionFor2030);

  // If we have no data at all, add a placeholder row
  if (result.marketData.length === 0) {
    result.marketData.push({
      "Year Type": "No data available",
      "Market Size": "",
      CAGR: "",
      "Key Excerpt": "",
      Explanation: "",
    });
  }

  // 3. Trends data - one row per trend per year
  const addTrends = (yearType: string, yearData: YearData | null) => {
    if (
      !yearData ||
      !yearData.keyIndustryTrends ||
      yearData.keyIndustryTrends.length === 0
    ) {
      // Add a placeholder row for years with no trends
      result.trends.push({
        "Year Type": yearType,
        Trend: "No trends available",
      });
      return;
    }

    yearData.keyIndustryTrends.forEach((trend: string) => {
      result.trends.push({
        "Year Type": yearType,
        Trend: trend,
      });
    });
  };

  addTrends("Past Year", sizeData.pastYearData);
  addTrends("Year Before", sizeData.yearBeforeData);
  addTrends("Projection for 2030", sizeData.projectionFor2030);

  // If we have no trends at all, add a placeholder row
  if (result.trends.length === 0) {
    result.trends.push({
      "Year Type": "No data available",
      Trend: "No trends available",
    });
  }

  return result;
};

// Format market map
const formatMarketMap = (data?: CompanyData): Record<string, any>[] => {
  // Get the market information from the company data
  if (!data?.market_info) return [];

  const marketInfo: MarketInfo = data.market_info;

  // Safely access market_map data
  const marketMap: MarketMap = marketInfo.market_map || {
    industry: "",
    segments: [],
    related_industries: [],
    segments_new: [],
  };

  // Use segments field (as per your component logic)
  const segments = marketMap.segments || [];

  if (segments.length === 0) return [];

  // Create an array to hold all the company entries
  const result: Record<string, any>[] = [];

  // For each segment, add entries for each company
  segments.forEach((segment) => {
    // Add companies from this segment
    segment.companies.forEach((company, index) => {
      const companyLogo =
        segment.companyLogos && segment.companyLogos[index]
          ? segment.companyLogos[index]
          : "";

      result.push({
        // Industry: marketMap.industry,
        Segment: segment.segment,
        Company: company,
        "Logo URL": companyLogo,
      });
    });
  });

  return result;
};

// Format financial comparables
const formatFinancialComparables = (
  data?: CompanyData
): Record<string, any>[] => {
  // Try to find financial comparables in the company data structure
  let financialComparables: FinancialComparable[] = [];

  if (
    data?.competitive_analysis?.financial_comparables &&
    Array.isArray(data.competitive_analysis.financial_comparables)
  ) {
    financialComparables = data.competitive_analysis.financial_comparables;
  }

  // Format the financial comparables data for Excel
  return financialComparables.map((financial) => {
    // Format the data for Excel export
    return {
      Date: financial.date || "N/A",
      Revenue: financial.revenue || "N/A",
      "Revenue (Formatted)": financial.revenue || "",
      "Last Valuation": financial.last_valuation || "N/A",
      "Last Valuation (Formatted)": financial.last_valuation || "",
      "Last Funding": financial.last_funding || "N/A",
      "Last Funding (Formatted)": financial.last_funding || "",
      Description: financial.description || "N/A",
    };
  });
};

// Format peer developments
const formatPeerDevelopments = (data?: CompanyData): Record<string, any>[] => {
  // Check if the company data structure contains peer developments
  // This assumes the peer developments are stored somewhere in the CompanyData structure
  // Adjust the path based on your actual data structure
  let peerDevelopments: PeerDevelopments[] = [];

  // Try to find peer developments in various possible locations
  if (
    data?.competitive_analysis?.peer_developments &&
    Array.isArray(data.competitive_analysis.peer_developments)
  ) {
    peerDevelopments = data.competitive_analysis.peer_developments;
  }

  if (peerDevelopments.length === 0) return [];

  // Format the peer development data for Excel
  return peerDevelopments.map((peer) => {
    // Format currency values consistently

    return {
      "Company Name": peer.name || "",
      "Founded Year": peer.founded_year || "",
      "Total Funding": peer.total_funding || "",
      Currency: peer.currency || "",
      "Web Traffic": peer.web_traffic || "",
      "Logo URL": peer.logo || "",
    };
  });
};

// Format competitor analysis
const formatCompetitorAnalysis = (
  data?: CompanyData
): Record<string, any>[] => {
  if (!data?.competitive_analysis) {
    // Try to access direct array if competitive_analysis is an array itself
    if (Array.isArray(data?.competitive_analysis.competitive_analysis)) {
      return data.competitive_analysis.competitive_analysis.map((item) => ({
        Company: item.company_name || "",
        Field: item.field || "",
        Description: item.description || "",
        Score: item.score || "",
        "Logo URL": item.logo_url || "",
      }));
    }
    return [];
  }

  // If competitive_analysis has an items property that is an array
  const items = data.competitive_analysis.competitive_analysis;
  if (Array.isArray(items)) {
    return items.map((item) => ({
      Company: item.company_name || "",
      Field: item.field || "",
      Description: item.description || "",
      Score: item.score || "",
      "Logo URL": item.logo_url || "",
    }));
  }

  return [];
};

// Format regulations
export interface RegulationItem {
  regulation: string | null;
  description: string | null;
}

// Format Regulations
const formatRegulations = (data?: CompanyData): Record<string, any>[] => {
  if (!data?.regulations) return []; // Return empty array if no regulations data

  const regulations = data.regulations;

  // Check if regulations is an array
  if (Array.isArray(regulations)) {
    // If it's an array, map each item to the desired format
    return regulations.map((item) => ({
      Regulation: item.regulation || "", // Default to empty string if regulation is null
      Description: item.description || "", // Default to empty string if description is null
    }));
  }

  // If it's neither an array nor an object, return an empty array
  return [];
};

// Format opportunities
const formatOpportunities = (data?: CompanyData): Record<string, any>[] => {
  if (!data?.opportunities_risks?.opportunities) return []; // Return empty array if no opportunities data

  const opportunities: Opportunity[] = data.opportunities_risks.opportunities; // Use Opportunity type here

  // Check if opportunities is an array
  if (Array.isArray(opportunities)) {
    // If it's an array, map each item to the desired format
    return opportunities.map((item) => ({
      "Opportunity Area": item.area || "", // Default to empty string if area is null
      Detail: item.detail || "", // Default to empty string if detail is null
      Rationale: item.rationale || "", // Default to empty string if rationale is null
    }));
  }

  // If it's neither an array nor an object, return an empty array
  return [];
};
// Format risks
const formatRisks = (data?: CompanyData): Record<string, any>[] => {
  if (!data?.opportunities_risks?.risks) return []; // Return empty array if no risks data

  const risks: Risk[] = data.opportunities_risks.risks; // Use Opportunity type here

  // Check if risks is an array
  if (Array.isArray(risks)) {
    // If it's an array, map each item to the desired format
    return risks.map((item) => ({
      "Risk Area": item.area || "", // Default to empty string if area is null
      Detail: item.detail || "", // Default to empty string if detail is null
      Rationale: item.rationale || "", // Default to empty string if rationale is null
    }));
  }

  // If it's neither an array nor an object, return an empty array
  return [];
};

const formatQA = (data?: CompanyData): Record<string, any>[] => {
  if (!data?.qa) return []; // Return empty array if no qa data

  // Initialize qadata as an empty array
  let qadata: QAItem[] = [];

  // Check if qa is an array
  if (Array.isArray(data.qa)) {
    // If it's an array, assign it directly
    qadata = data.qa;
  }

  // If qa is a single object, convert it to an array with one item
  else if (typeof data.qa === "object" && data.qa !== null) {
    qadata = [data.qa];
  }

  // Map the qadata array to the desired format
  return qadata.map((item) => ({
    Question: item.question || "", // Default to empty string if question is null
    Answer: item.answer || "", // Default to empty string if answer is null
  }));
};

// Define all available sections
export const availableSections = [
  {
    id: "financial-detail",
    title: "Financial Details",
    formatter: formatFinancialDetails,
  },
  {
    id: "company-timeline",
    title: "Company Timeline",
    formatter: formatCompanyTimeline,
  },
  {
    id: "product-services",
    title: "Products & Services",
    formatter: formatProductsServices,
  },
  {
    id: "product-timeline",
    title: "Product Timeline",
    formatter: formatProductTimeline,
  },

  { id: "technology", title: "Key Technology", formatter: formatKeyTechnology },
  { id: "ma-activity", title: "M&A Activity", formatter: formatMAActivity },
  { id: "market-size", title: "Market Size", formatter: formatMarketSize },
  { id: "market-map", title: "Market Map", formatter: formatMarketMap },
  {
    id: "competitor-landscape",
    title: "Competitive Landscape",
    formatter: formatCompetitorAnalysis,
  },
  {
    id: "financial-comparables",
    title: "Financial Comparables",
    formatter: formatFinancialComparables,
  },
  {
    id: "peer-developments",
    title: "Peer Developments",
    formatter: formatPeerDevelopments,
  },
  {
    id: "competitor-analysis",
    title: "Competitor Analysis",
    formatter: formatCompetitorAnalysis,
  },
  { id: "regulations", title: "Regulations", formatter: formatRegulations },
  {
    id: "opportunities",
    title: "Opportunities",
    formatter: formatOpportunities,
  },
  { id: "risks", title: "Risks", formatter: formatRisks },
  { id: "qa", title: "Q&A", formatter: formatQA },
];

// Main export function
export const exportToExcel = async (
  companyName: string,
  data?: CompanyData,
  selectedSections?: string[]
): Promise<void> => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Add metadata
    addWorkbookMetadata(workbook, companyName);

    // Filter sections based on selection or use all sections
    const sectionsToProcess =
      selectedSections && selectedSections.length > 0
        ? availableSections.filter((section) =>
            selectedSections.includes(section.id)
          )
        : availableSections;

    // Process each section
    for (const section of sectionsToProcess) {
      try {
        // Create a worksheet for this section even if there's no data
        const sheetName = getUniqueSheetName(workbook, section.title);
        const worksheet = workbook.addWorksheet(sheetName);

        // Get formatted data if available
        const formattedData = data ? section.formatter(data) : [];

        // Check if formattedData is an array and has data
        if (Array.isArray(formattedData) && formattedData.length > 0) {
          addDataToWorksheet(worksheet, formattedData, section.title);
        } else {
          // Add title and empty data message
          const titleRow = worksheet.addRow([section.title]);
          titleRow.font = { bold: true, size: 16 };
          worksheet.addRow([]); // Empty row after title
          worksheet.addRow(["No data available"]);
        }
      } catch (error) {
        console.error(`Error processing section ${section.id}:`, error);
        // Continue with other sections even if one fails
      }
    }

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Use the default export function from file-saver
    FileSaver(
      blob,
      `Promenade-${companyName.replace(/[^a-zA-Z0-9]/g, "")}-Report.xlsx`
    );
  } catch (error) {
    console.error("Error generating Excel file:", error);
    throw error;
  }
};
