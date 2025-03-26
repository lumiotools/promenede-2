"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type { CompetitiveAnalysisItem } from "@/types/competitor";
import Image from "next/image";

interface CompetitorAnalysisProps {
  initialData?: CompetitiveAnalysisItem[] | null;
}

export default function CompetitorAnalysis({
  initialData,
}: CompetitorAnalysisProps) {
  const [data, setData] = useState<CompetitiveAnalysisItem[]>([]);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, OpenAI"
  );

  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      setData(initialData);
    }
  }, [initialData]);

  // Group by unique company names to get list of competitors
  const uniqueCompanies = Array.from(
    new Set(data.map((item) => item.company_name))
  );

  // Get unique fields
  const uniqueFields = Array.from(new Set(data.map((item) => item.field)));

  // Take top 5 fields for display
  const displayFields = uniqueFields.slice(0, 5);

  if (data.length === 0) {
    return (
      <SectionLayout title="Competitor Analysis" sourceText={sourceText}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No competitor data available</p>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout title="Competitor Analysis" sourceText={sourceText}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 bg-[#092a38] text-white text-left font-medium text-sm">
                Field
              </th>
              {uniqueCompanies.slice(0, 3).map((company, index) => (
                <th
                  key={index}
                  className="p-3 bg-[#092a38] text-white text-left font-medium text-sm"
                >
                  <div className="flex items-center space-x-2">
                    {data.find((item) => item.company_name === company)
                      ?.logo_url && (
                      <div className="relative h-6 w-6 flex-shrink-0">
                        <Image
                          src={
                            data.find((item) => item.company_name === company)
                              ?.logo_url ||
                            "/placeholder.svg?height=24&width=24"
                          }
                          alt={company}
                          width={24}
                          height={24}
                          className="rounded-sm"
                        />
                      </div>
                    )}
                    <span>{company}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayFields.map((field, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-3 border border-gray-200 font-medium">
                  {field}
                </td>
                {uniqueCompanies.slice(0, 3).map((company, colIndex) => {
                  // Find the item that matches this company and field
                  const item = data.find(
                    (d) => d.company_name === company && d.field === field
                  );

                  return (
                    <td key={colIndex} className="p-3 border border-gray-200">
                      {item ? (
                        <div className="flex justify-between items-start">
                          <div className="pr-8 text-sm">{item.description}</div>
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300">
                            <span className="text-xs font-semibold">
                              {item.score}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="pr-8 text-sm text-gray-400 italic">
                            No data available
                          </div>
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300">
                            <span className="text-xs font-semibold text-gray-300">
                              -
                            </span>
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  );
}
