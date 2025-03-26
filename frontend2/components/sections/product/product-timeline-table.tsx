"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type { ProductLaunch } from "@/types/company";

interface ProductTimelineTableProps {
  initialData?: ProductLaunch[] | null;
}

export default function ProductTimelineTable({
  initialData,
}: ProductTimelineTableProps) {
  const [data, setData] = useState<ProductLaunch[]>([]);
  const [sourceText, setSourceText] = useState<string>("Source: Perplexity");

  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      // Sort by date if available
      const sortedData = [...initialData].sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setData(sortedData);
    } else {
      // Handle the case when initialData is not an array
      setData([]);
    }
  }, [initialData]);

  // Limit to top 5 product launches
  const displayLaunches = data.slice(0, 5);

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <SectionLayout title="Product Timeline" sourceText={sourceText}>
      {displayLaunches.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">
            No product timeline data available
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="p-4 text-left font-medium">Date</th>
                <th className="p-4 text-left font-medium">Product</th>
                <th className="p-4 text-left font-medium">Description</th>
                <th className="p-4 text-left font-medium">Key Features</th>
              </tr>
            </thead>
            <tbody>
              {displayLaunches.map((launch, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-4 border-t border-gray-200">
                    {formatDate(launch.date)}
                  </td>
                  <td className="p-4 border-t border-gray-200 font-medium">
                    {launch.product_name || "Unnamed Product"}
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    {launch.description || "No description available"}
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    {launch.key_features && launch.key_features.length > 0
                      ? launch.key_features.join(", ")
                      : "No features available"}
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
