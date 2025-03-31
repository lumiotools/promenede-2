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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState(initialData);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, Perplexity"
  );

  // Update data when initialData changes
  useEffect(() => {
    const newDataArray = getInitialDataArray();
    console.log("useEffect updating data:", newDataArray);
    setData(newDataArray);
  }, [initialData]);

  // Update editData when initialData changes
  useEffect(() => {
    if (initialData && !isEditing) {
      setEditData(initialData);
    }
  }, [initialData, isEditing]);

  // Helper function to check if a string is empty or null
  const isValidString = (str: string | null | undefined): boolean => {
    return str !== null && str !== undefined && str.trim() !== "";
  };

  // Filter events where date AND event are not null/empty
  // Sort by date (newest first)
  const sortedEvents = [...data]
    .filter((event) => {
      return isValidString(event.date) && isValidString(event.event);
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 10); // Show up to 10 events

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

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <SectionLayout
      title="Company Timeline"
      sourceText={sourceText}
      initialData={initialData}
    >
      <div className="py-16 px-4 relative">
        {/* Container for the timeline */}
        <div className="relative w-full mt-32">
          {/* Horizontal line in the middle */}
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#d1d5db] w-full"></div>

          {/* Container for the events */}
          <div className="relative w-full flex justify-between">
            {sortedEvents.map((event, index) => (
              <div
                key={index}
                className="relative"
                style={{ width: `${100 / sortedEvents.length}%` }}
              >
                {/* Circle point on the line */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1e40af] z-10"></div>

                {index % 2 === 0 ? (
                  // Bottom position: dot → downward vertical line → text
                  <div className="absolute left-1/2 top-1/2 pt-4">
                    {/* Vertical line going down from dot */}
                    <div className="absolute left-0 top-0 h-16 w-[1px] bg-[#d1d5db]"></div>
                    {/* Date and Event below the line */}
                    <div className="absolute -left-4 top-16 text-left max-w-[400px]">
                      <div className="text-sm font-medium text-[#4b5563]">
                        {formatDate(event.date || "")}
                      </div>
                      <div className="text-xs text-[#4b5563] font-medium mt-1">
                        {event.event || ""}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Top position: dot → upward vertical line → text
                  <div className="absolute left-1/2 top-1/2 -translate-y-full">
                    {/* Vertical line going up from dot */}
                    <div className="absolute left-0 bottom-0 h-16 w-[1px] bg-[#d1d5db]"></div>
                    {/* Date and Event above the line */}
                    <div className="absolute -left-4 bottom-16 text-left max-w-[400px]">
                      <div className="text-sm font-medium text-[#4b5563]">
                        {formatDate(event.date || "")}
                      </div>
                      <div className="text-xs text-[#4b5563] font-medium mt-1">
                        {event.event || ""}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
