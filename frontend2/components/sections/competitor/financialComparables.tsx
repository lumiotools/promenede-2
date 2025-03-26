"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type { FinancialComparable } from "@/types/competitor";

interface FinancialComparablesProps {
  initialData?: FinancialComparable[] | null;
}

export default function FinancialComparables({
  initialData,
}: FinancialComparablesProps) {
  const [data, setData] = useState<FinancialComparable[]>([]);
  const [sourceText, setSourceText] = useState<string>("Source: Coresignal");

  // Helper function to check if a comparable has valid data
  const isValidComparable = (comparable: FinancialComparable): boolean => {
    return (
      comparable.name !== null &&
      comparable.name !== undefined &&
      comparable.name.trim() !== "" &&
      comparable.financial_data !== null
    );
  };

  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      // Filter out invalid data
      const validData = initialData.filter(isValidComparable);
      setData(validData);
    }
  }, [initialData]);

  // Limit to top 5 valid financial comparables
  const displayComparables = Array.isArray(data) ? data.slice(0, 5) : [];

  // Format currency function - adjusted for string values
  const formatCurrency = (value: string | null) => {
    if (value === null || value === undefined || value === "") return "N/A";

    // Try to convert the string to a number
    const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numValue)) return "N/A";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(numValue);
  };

  // Format similarity score as percentage
  const formatSimilarityScore = (value: number | null) => {
    if (value === null || value === undefined) return "N/A";
    return `${(value * 100).toFixed(0)}%`;
  };

  return (
    <SectionLayout title="Financial Comparables" sourceText={sourceText}>
      {displayComparables.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">
            No financial comparables data available
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="p-4 text-left font-medium">Company</th>
                <th className="p-4 text-right font-medium">Similarity</th>
                <th className="p-4 text-right font-medium">Revenue</th>
                <th className="p-4 text-right font-medium">Profit</th>
                <th className="p-4 text-right font-medium">Employees</th>
              </tr>
            </thead>
            <tbody>
              {displayComparables.map((company, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-4 border-t border-gray-200 font-medium">
                    {company.name || "Unnamed Company"}
                  </td>
                  <td className="p-4 border-t border-gray-200 text-right">
                    {formatSimilarityScore(company.similarity_score)}
                  </td>
                  <td className="p-4 border-t border-gray-200 text-right">
                    {company.financial_data
                      ? formatCurrency(company.financial_data.revenue)
                      : "N/A"}
                  </td>
                  <td className="p-4 border-t border-gray-200 text-right">
                    {company.financial_data
                      ? formatCurrency(company.financial_data.profit)
                      : "N/A"}
                  </td>
                  <td className="p-4 border-t border-gray-200 text-right">
                    {company.financial_data && company.financial_data.employees
                      ? company.financial_data.employees
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionLayout>
  );
}
