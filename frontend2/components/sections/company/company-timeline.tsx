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
  // Sort by date (newest first) and limit to 6
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
    .slice(0, 6);

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

  // Group events into 3 columns with 2 events each
  const columns = [
    sortedEvents.slice(0, 2),
    sortedEvents.slice(2, 4),
    sortedEvents.slice(4, 6),
  ];

  return (
    <SectionLayout
      title="Company Timeline"
      sourceText={sourceText}
      initialData={initialData}
    >
      <div className="flex justify-between h-full py-4 px-2">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="relative flex-1 mx-2">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#d1d5db] transform -translate-x-1/2"></div>

            {/* Timeline events */}
            {column.map((event, eventIndex) => (
              <div
                key={eventIndex}
                className="relative"
                style={{
                  top: eventIndex === 0 ? "25%" : "75%",
                  position: "absolute",
                  width: "100%",
                }}
              >
                {/* Point */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-[#1e40af]"></div>

                {/* Date and Event on the left */}
                <div className="absolute left-0 right-1/2 pr-4 text-center">
                  <div className="text-sm text-[#4b5563] font-medium">
                    {event.date || "N/A"}
                  </div>
                  <div className="text-xs text-[#4b5563]">
                    {event.event || "N/A"}
                  </div>
                </div>

                {/* Description on the right */}
                <div className="absolute left-1/2 right-0 pl-4 text-xs text-[#4b5563] text-left">
                  {event.description || ""}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
