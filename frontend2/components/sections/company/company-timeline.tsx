"use client"

import { useState, useEffect } from "react"
import type { TimelineEvent } from "@/types/company"
import { SectionLayout } from "@/components/ui/section-layout"

type CompanyTimelineProps = {
  initialData?: TimelineEvent | TimelineEvent[] | null
}

export function CompanyTimeline({ initialData }: CompanyTimelineProps) {
  // More robust conversion that handles null values
  const getInitialDataArray = () => {
    if (!initialData) return []
    if (Array.isArray(initialData)) return initialData
    // Handle the case where initialData is an object but might be empty
    if (typeof initialData === "object") {
      // Check if the object has the required properties
      if ("date" in initialData && "description" in initialData) {
        return [initialData]
      }
    }
    console.log("Couldn't convert initialData to array, using empty array")
    return []
  }

  const [data, setData] = useState<TimelineEvent[]>(getInitialDataArray())
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  // Update data when initialData changes
  useEffect(() => {
    const newDataArray = getInitialDataArray()
    console.log("useEffect updating data:", newDataArray)
    setData(newDataArray)
  }, [initialData])

  // Format date from YYYY-MM-DD to YYYY.MM.DD
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return dateString.replace(/-/g, ".")
  }

  // Sort events by date (newest first) and limit to 5
  const sortedEvents = [...data]
    .filter((event) => event.date)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 5)

  if (sortedEvents.length === 0) {
    return (
      <SectionLayout title="Company Timeline" sourceText={sourceText} initialData={initialData}>
        <div className="p-6 text-center text-[#8097a2]">No timeline data available</div>
      </SectionLayout>
    )
  }

  return (
    <SectionLayout title="Company Timeline" sourceText={sourceText} initialData={initialData}>
      {/* Timeline */}
      <div className="relative py-16 px-4 h-[220px]">
        {/* Horizontal line */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#d1d5db]"></div>

        {/* Timeline points */}
        <div className="relative h-full w-full">
          {sortedEvents.map((event, index) => (
            <div
              key={index}
              className="absolute flex flex-col items-center"
              style={{
                left: `${10 + (80 * index) / (sortedEvents.length - 1 || 1)}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Date */}
              <div className="absolute top-[-40px] text-sm text-[#4b5563] font-medium">
                {formatDate(event.date || "")}
              </div>

              {/* Point */}
              <div className="w-3 h-3 rounded-full bg-[#1f2937]"></div>

              {/* Event */}
              <div className="absolute top-[20px] text-xs text-[#4b5563] text-center max-w-[250px]">
                {event.event || event.description || "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}

