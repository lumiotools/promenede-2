"use client";

import { useState, useEffect } from "react";
import type { TimelineEvent } from "@/types/company";
import { SectionLayout } from "@/components/ui/section-layout";

type CompanyTimelineProps = {
  initialData?: TimelineEvent | TimelineEvent[] | null;
};

export function CompanyTimeline({ initialData }: CompanyTimelineProps) {
  // More robust conversion that handles null values
  const getInitialDataArray = () => {
    if (!initialData) return [];
    if (Array.isArray(initialData)) return initialData;
    // Handle the case where initialData is an object but might be empty
    if (typeof initialData === "object") {
      // Check if the object has the required properties
      if (
        "date" in initialData &&
        ("description" in initialData || "event" in initialData)
      ) {
        return [initialData];
      }
    }
    console.log("Couldn't convert initialData to array, using empty array");
    return [];
  };

  const [data, setData] = useState<TimelineEvent[]>(getInitialDataArray());
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, Perplexity"
  );

  // Update data when initialData changes
  useEffect(() => {
    const newDataArray = getInitialDataArray();
    console.log("useEffect updating data:", newDataArray);
    setData(newDataArray);
  }, [initialData]);

  // Helper function to check if a string is empty or null
  const isValidString = (str: string | null | undefined): boolean => {
    return str !== null && str !== undefined && str.trim() !== "";
  };

  // Filter events where date AND (event OR description) are not null/empty
  // Sort by date (newest first) and limit to 3
  const sortedEvents = [...data]
    .filter((event) => {
      return (
        isValidString(event.date) &&
        (isValidString(event.event) || isValidString(event.description))
      );
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 4);

  if (sortedEvents.length === 0) {
    return (
      <SectionLayout
        title="Company Timeline"
        sourceText={sourceText}
        initialData={initialData}
      >
        <div className="p-6 text-center text-[#8097a2]">
          No timeline data available
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout
      title="Company Timeline"
      sourceText={sourceText}
      initialData={initialData}
    >
      <div className="py-6 px-4 relative">
        {/* Horizontal timeline line */}
        <div className="relative w-full">
          {/* Horizontal line across the entire width */}
          <div className="absolute left-0 right-0 top-20 h-[1px] bg-[#d1d5db] w-full"></div>

          {/* Container for the events */}
          <div className="flex justify-between w-full">
            {sortedEvents.map((event, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center"
                style={{ width: "33%" }}
              >
                {/* Date and Event above the line */}
                <div className="mb-2 text-center">
                  <div className="text-sm text-[#4b5563] font-medium mb-1">
                    {event.date || "N/A"}
                  </div>
                  <div className="text-xs text-[#4b5563]">
                    {event.event || "N/A"}
                  </div>
                </div>

                {/* Circle point on the line */}
                <div className="w-3 h-3 rounded-full bg-[#1e40af] relative z-10 mt-8"></div>

                {/* Description below the line */}
                <div className="text-xs text-[#4b5563] text-center mt-4 px-2 max-w-xs">
                  {event.description || ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
