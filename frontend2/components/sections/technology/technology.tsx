"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type { KeyTechnology } from "@/types/technology";

interface TechnologyProps {
  initialData?: KeyTechnology | null;
}

export default function TechnologyComponent({ initialData }: TechnologyProps) {
  const [data, setData] = useState<KeyTechnology | null>(null);
  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Company Reports"
  );

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleSave = (editedData: KeyTechnology) => {
    setData(editedData);
    // Here you would typically send the data to an API
  };

  // Extract year from date string
  const extractYear = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).getFullYear().toString();
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <SectionLayout
      title="Key Technology"
      sourceText={sourceText}
      initialData={data}
      onSave={handleSave}
    >
      {!data ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No technology data available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Total Technologies Count */}
          <div className="mb-6">
            <p className="text-sm text-[#445963]">
              There are total{" "}
              <span className="font-semibold">
                {data.num_technologies || 0}
              </span>{" "}
              technologies.
            </p>
          </div>

          {/* Technology Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#002169] text-white">
                  <th className="py-3 px-4 text-left font-medium text-sm">
                    Technology
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-sm">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-sm">
                    First Verified
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-sm">
                    Last Verified
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.technologies_used && data.technologies_used.length > 0 ? (
                  data.technologies_used.slice(0, 10).map((tech, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-3 px-4 border-t border-gray-200 text-sm capitalize">
                        {tech.technology || "N/A"}
                      </td>
                      <td className="py-3 px-4 border-t border-gray-200 text-sm text-gray-600">
                        {/* Placeholder description since it's not in our data structure */}
                        {tech.technology
                          ? `${tech.technology} is used for development and operations.`
                          : "No description available"}
                      </td>
                      <td className="py-3 px-4 border-t border-gray-200 text-sm">
                        {tech.first_verified_at
                          ? new Date(
                              tech.first_verified_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 border-t border-gray-200 text-sm">
                        {tech.last_verified_at
                          ? new Date(tech.last_verified_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      No technology data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Show more technologies indicator */}
          {data.technologies_used && data.technologies_used.length > 5 && (
            <div className="text-center mt-2">
              <p className="text-sm text-gray-500">
                Showing 10 of {data.technologies_used.length} technologies
              </p>
            </div>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
