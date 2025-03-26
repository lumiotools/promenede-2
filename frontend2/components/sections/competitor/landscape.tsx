"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type {
  CompetitiveAnalysis,
  CompetitiveAnalysisItem,
} from "@/types/competitor";
import Image from "next/image";

interface CompetitiveLandscapeProps {
  initialData?: CompetitiveAnalysis | null;
}

interface ProcessedCompetitor {
  company_name: string;
  logo_url: string;
  fields: string[];
  scores: number[];
  descriptions: string[];
}

export default function CompetitiveLandscape({
  initialData,
}: CompetitiveLandscapeProps) {
  const [data, setData] = useState<ProcessedCompetitor[] | null>(null);
  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Crunchbase"
  );

  useEffect(() => {
    if (initialData?.competitive_analysis) {
      // Group by company name
      const companyGroups = new Map<string, ProcessedCompetitor>();

      initialData.competitive_analysis.forEach((item) => {
        if (!companyGroups.has(item.company_name)) {
          // First occurrence of this company
          companyGroups.set(item.company_name, {
            company_name: item.company_name,
            logo_url: item.logo_url,
            fields: [item.field],
            scores: [item.score],
            descriptions: [item.description],
          });
        } else {
          // Add to existing company
          const existing = companyGroups.get(item.company_name)!;
          existing.fields.push(item.field);
          existing.scores.push(item.score);
          existing.descriptions.push(item.description);
        }
      });

      // Convert map to array and sort by highest score
      const processedData = Array.from(companyGroups.values())
        .map((company) => {
          // Sort fields, scores, and descriptions by score (descending)
          const sortedIndices = company.scores
            .map((score, index) => ({ score, index }))
            .sort((a, b) => b.score - a.score)
            .map((item) => item.index);

          return {
            ...company,
            fields: sortedIndices.map((i) => company.fields[i]),
            scores: sortedIndices.map((i) => company.scores[i]),
            descriptions: sortedIndices.map((i) => company.descriptions[i]),
          };
        })
        .sort((a, b) => Math.max(...b.scores) - Math.max(...a.scores))
        .slice(0, 5);

      setData(processedData);
    }
  }, [initialData]);

  return (
    <SectionLayout title="Competitive Landscape" sourceText={sourceText}>
      {!data || data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">
            No competitive landscape data available
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="py-3 px-4 text-left font-medium">Company</th>
                <th className="py-3 px-4 text-left font-medium">Field</th>
                <th className="py-3 px-4 text-left font-medium">Score</th>
                <th className="py-3 px-4 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((competitor, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#eff2f3]"}
                >
                  <td className="py-3 px-4 border-t border-[#ced7db]">
                    <div className="flex items-center gap-2">
                      {competitor.logo_url && (
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            src={competitor.logo_url || "/placeholder.svg"}
                            alt={`${competitor.company_name} logo`}
                            width={24}
                            height={24}
                            className="object-contain"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <span className="font-medium text-[#445963]">
                        {competitor.company_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-t border-[#ced7db] text-[#445963]">
                    <div className="flex flex-col gap-2">
                      {competitor.fields.map((field, idx) => (
                        <div key={idx} className={idx > 0 ? "mt-3" : ""}>
                          {field}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 border-t border-[#ced7db]">
                    <div className="flex flex-col gap-2">
                      {competitor.scores.map((score, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center ${
                            idx > 0 ? "mt-3" : ""
                          }`}
                        >
                          <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-[#445963]">
                            {score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 border-t border-[#ced7db] text-[#445963] text-sm">
                    <div className="flex flex-col gap-2">
                      {competitor.descriptions.map((description, idx) => (
                        <div key={idx} className={idx > 0 ? "mt-3" : ""}>
                          {description}
                        </div>
                      ))}
                    </div>
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
