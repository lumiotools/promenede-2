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
      comparable.description !== null &&
      comparable.description !== undefined &&
      comparable.description.trim() !== ""
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

  // Format currency function
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

  // Format date
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "N/A";

    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "N/A";
    }
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
                <th className="p-4 text-left font-medium">Date</th>
                <th className="p-4 text-right font-medium">Revenue</th>
                <th className="p-4 text-right font-medium">Last Valuation</th>
                <th className="p-4 text-right font-medium">Last Funding</th>
                <th className="p-4 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {displayComparables.map((financial, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-4 border border-gray-200">
                    {formatDate(financial.date)}
                  </td>
                  <td className="p-4 border border-gray-200 text-right">
                    {financial.revenue}
                  </td>
                  <td className="p-4 border border-gray-200 text-right">
                    {financial.last_valuation}
                  </td>
                  <td className="p-4 border border-gray-200 text-right">
                    {financial.last_funding}
                  </td>
                  <td className="p-4 border border-gray-200">
                    {financial.description || "N/A"}
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
