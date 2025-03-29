"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type { KeyTechnology } from "@/types/technology";

interface TechnologyProps {
  initialData?: KeyTechnology[] | null;
}

export default function TechnologyComponent({ initialData }: TechnologyProps) {
  const [data, setData] = useState<KeyTechnology[] | null>(null);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, Perplexity"
  );

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleSave = (editedData: KeyTechnology[]) => {
    setData(editedData);
    // Here you would typically send the data to an API
  };

  // Format date in a readable format
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
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
      {!data || data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No technology data available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Total Technologies Count */}
          <div className="mb-6">
            <p className="text-sm text-[#445963]">
              There are total{" "}
              <span className="font-semibold">{data.length}</span> technologies.
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.slice(0, 5).map((tech, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-3 px-4 border-t border-gray-200 text-sm capitalize">
                        {tech.technology || "N/A"}
                      </td>
                      <td className="py-3 px-4 border-t border-gray-200 text-sm text-gray-600">
                        {tech.description || "No description available"}
                      </td>
                      <td className="py-3 px-4 border-t border-gray-200 text-sm">
                        {tech.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
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
          {data.length > 5 && (
            <div className="text-center mt-2">
              <p className="text-sm text-gray-500">
                Showing 5 of {data.length} technologies
              </p>
            </div>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
