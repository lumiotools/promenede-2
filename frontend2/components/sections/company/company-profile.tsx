"use client";

import { useEffect, useState } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type {
  CompanyProfiles,
  Firmographic,
  KeyFinancials,
} from "@/types/company";
import type { InstitutionalHolder, ShareholderData } from "@/types/shareholder";

// Define consistent data structure to be used in the component
interface NormalizedCompanyData {
  firmographic: Firmographic;
  key_financials: KeyFinancials;
  shareholder_data?: ShareholderData;
}

type CompanyProfileProps = {
  initialData?: CompanyProfiles;
};

export default function CompanyProfile({ initialData }: CompanyProfileProps) {
  // Transform the data to ensure consistent structure
  const transformData = (
    data: CompanyProfiles | undefined | null
  ): NormalizedCompanyData => {
    if (!data) return createEmptyCompanyProfile();

    // Check if data already has the expected structure
    if (data.firmographic || data.key_financials) {
      return {
        firmographic: data.firmographic || createEmptyFirmographic(),
        key_financials: data.key_financials || createEmptyKeyFinancials(),
        shareholder_data: data.shareholders,
      };
    }

    // Handle other data formats or create empty data
    return createEmptyCompanyProfile();
  };

  // Helper functions to create empty data structures
  const createEmptyFirmographic = (): Firmographic => ({
    name: null,
    ceo: null,
    tags: null,
    legal_name: null,
    incorporation_date: null,
    hq_address: null,
    hq_city: null,
    hq_state: null,
    hq_country: null,
    industry: null,
    type: null,
    revenue_range: null,
    employees_count: null,
    products_services: [],
    description: null,
  });

  const createEmptyKeyFinancials = (): KeyFinancials => ({
    income_statements: [],
    operating_revenue: [],
    operating_profit: [],
    ebitda: [],
    net_income: [],
    revenue_growth: [],
    per: null,
  });

  const createEmptyCompanyProfile = (): NormalizedCompanyData => ({
    firmographic: createEmptyFirmographic(),
    key_financials: createEmptyKeyFinancials(),
  });

  // Initialize state with transformed initialData if provided
  const [data, setData] = useState<NormalizedCompanyData>(
    transformData(initialData)
  );

  // Update data when initialData changes
  useEffect(() => {
    if (initialData) {
      const transformed = transformData(initialData);
      setData(transformed);
    }
  }, [initialData]);

  // Format date with null check
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format currency with null check
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };

  // Get fiscal year statements
  const fiscalYearStatements = (data.key_financials?.income_statements || [])
    .filter((statement) => statement.period_display_end_date?.includes("FY"))
    .sort((a, b) => {
      if (!a?.period_end_date || !b?.period_end_date) return 0;
      return (
        new Date(a.period_end_date).getTime() -
        new Date(b.period_end_date).getTime()
      );
    });

  // Calculate revenue growth
  const calculateRevenueGrowth = (currentIndex: number): string => {
    if (
      currentIndex <= 0 ||
      !fiscalYearStatements[currentIndex] ||
      !fiscalYearStatements[currentIndex - 1]
    ) {
      return "N/A";
    }

    const currentRevenue = fiscalYearStatements[currentIndex].revenue;
    const previousRevenue = fiscalYearStatements[currentIndex - 1].revenue;

    if (
      currentRevenue === null ||
      previousRevenue === null ||
      previousRevenue === 0
    ) {
      return "N/A";
    }

    const growthRate =
      ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    return `${growthRate.toFixed(1)}%`;
  };

  // Check if data exists for each section
  const hasFirmographicData =
    data.firmographic?.legal_name ||
    data.firmographic?.incorporation_date ||
    data.firmographic?.hq_address ||
    data.firmographic?.employees_count;

  const hasFinancialData = fiscalYearStatements.length > 0;

  const hasShareholderData =
    data.shareholder_data?.institutional_holders &&
    data.shareholder_data.institutional_holders.length > 0;

  return (
    <SectionLayout
      title="Company Profile"
      sourceText="Source: Coresignal, Yahoo Finance"
    >
      <div className="w-full space-y-4 overflow-hidden">
        {/* Top row: Firmographic and Key Financials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Firmographic */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="p-2 bg-gray-50">
              <h2 className="text-sm font-medium text-[#475467]">
                Firmographic
              </h2>
            </div>

            {!hasFirmographicData ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No data available for Firmographic
              </div>
            ) : (
              <table className="w-full border-collapse text-xs">
                <tbody>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 w-[120px] border-t border-[#e5e7eb]">
                      Company Name
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {data.firmographic?.legal_name || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      Incorporation
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {formatDate(data.firmographic?.incorporation_date)}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      HQ Address
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {data.firmographic?.hq_address || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      CEO
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {data.firmographic.ceo || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      Revenue
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {fiscalYearStatements.length > 0
                        ? `${formatCurrency(
                            fiscalYearStatements[
                              fiscalYearStatements.length - 1
                            ].revenue
                          )} (${
                            fiscalYearStatements[
                              fiscalYearStatements.length - 1
                            ].period_display_end_date || "N/A"
                          })`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      FTE#
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {(
                        data.firmographic?.employees_count || 0
                      ).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      Industry
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {data.firmographic.industry || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      Tags
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {data.firmographic.tags || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Key Financials */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="p-2 bg-gray-50">
              <h2 className="text-sm font-medium text-[#475467]">
                Key Financials
              </h2>
            </div>

            {!hasFinancialData ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No data available for Key Financials
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#002169] text-white">
                      <th className="py-1 px-2 text-left font-medium">
                        (&apos;000)
                      </th>
                      {/* Display up to 3 most recent fiscal years */}
                      {fiscalYearStatements
                        .slice(-3)
                        .map((statement, index) => (
                          <th
                            key={index}
                            className="py-1 px-2 text-center font-medium"
                          >
                            {statement.period_display_end_date || "N/A"}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        Operating Revenue
                      </td>
                      {fiscalYearStatements
                        .slice(-3)
                        .map((statement, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {formatCurrency(statement.revenue)}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        Operating Profit
                      </td>
                      {fiscalYearStatements
                        .slice(-3)
                        .map((statement, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {formatCurrency(statement.ebit)}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        EBITDA
                      </td>
                      {fiscalYearStatements
                        .slice(-3)
                        .map((statement, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {formatCurrency(statement.ebit)}{" "}
                            {/* Using ebit value as requested */}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        PAT
                      </td>
                      {fiscalYearStatements
                        .slice(-3)
                        .map((statement, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {formatCurrency(statement.net_income)}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        Revenue Growth
                      </td>
                      {fiscalYearStatements.slice(-3).map((_, index) => {
                        const actualIndex =
                          fiscalYearStatements.length - 3 + index;
                        return (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {calculateRevenueGrowth(actualIndex)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        PER
                      </td>
                      {fiscalYearStatements
                        .slice(-3)
                        .map((statement, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {data.key_financials?.per?.value
                              ? data.key_financials.per.value.toFixed(2)
                              : "N/A"}
                          </td>
                        ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Bottom row: Shareholders (only if data exists) */}
        {hasShareholderData && (
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="p-2 bg-gray-50">
              <h2 className="text-sm font-medium text-[#475467]">
                Shareholders
              </h2>
            </div>

            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#002169] text-white">
                  <th className="py-1 px-2 text-left font-medium">Name</th>
                  <th className="py-1 px-2 text-right font-medium">
                    # of Shares
                  </th>
                  <th className="py-1 px-2 text-right font-medium">%</th>
                  <th className="py-1 px-2 text-center font-medium">Types</th>
                </tr>
              </thead>
              <tbody>
                {/* Limit to top 5 shareholders */}
                {data.shareholder_data?.institutional_holders
                  ?.slice(0, 5)
                  .map((holder, index) => (
                    <tr key={index}>
                      <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-black">
                        {holder.Holder || "N/A"}
                      </td>
                      <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-right text-black">
                        {(holder.Shares || 0).toLocaleString()}
                      </td>
                      <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-right text-black">
                        {`${holder.pctHeld?.toFixed(2) || 0}%`}
                      </td>
                      <td className="py-1 px-2 border-t border-[#e5e7eb] text-center text-black">
                        Institutional
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td className="py-1 px-2 font-medium border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    Total
                  </td>
                  <td className="py-1 px-2 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-right text-black">
                    {data.shareholder_data?.institutional_holders
                      ?.slice(0, 5)
                      .reduce((sum, h) => sum + (h.Shares || 0), 0)
                      .toLocaleString() || "0"}
                  </td>
                  <td className="py-1 px-2 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-right text-black">
                    {data.shareholder_data?.institutional_holders
                      ?.slice(0, 5)
                      .reduce((sum, h) => sum + (h.pctHeld || 0), 0)
                      .toFixed(2) + "%" || "0%"}
                  </td>
                  <td className="py-1 px-2 border-t-2 border-t-[#002169] text-center text-black"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionLayout>
  );
}
