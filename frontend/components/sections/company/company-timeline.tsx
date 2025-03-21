"use client"

import { useEffect, useState } from "react"

interface TimelineEvent {
  date: string
  event: string
  description: string
  position?: number // Position in percentage from left
}

export function CompanyTimeline() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TimelineEvent[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulate API fetch or use actual fetch if available
        // const response = await fetch("/data.json")
        // const jsonData = await response.json()
        // const timelineData = jsonData.company_timeline || []

        // For now, use the sample data provided by the user
        const timelineData = [
          {
            date: "1981-09-01",
            event: "Raised 1000000 $ in Venture Round - Microsoft",
            description: "Led by Microsoft, Technology Venture Investors",
          },
          {
            date: "1983-04-15",
            event: "Series B Funding",
            description: "Secured additional capital for expansion",
          },
          {
            date: "1986-03-13",
            event: "Initial Public Offering (IPO)",
            description: "Successfully went public on NASDAQ",
          },
          {
            date: "1987-07-30",
            event: "Acquired Forethought",
            description: "Strategic acquisition to expand product portfolio",
          },
        ]

        // Assign positions to each event
        const eventsWithPositions = timelineData.map((event, index, array) => ({
          ...event,
          position: 10 + (80 * index) / (array.length - 1 || 1), // Distribute between 10% and 90%
        }))

        setData(eventsWithPositions)
      } catch (error) {
        console.error("Error fetching timeline data:", error)
        setError("Failed to load timeline data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format date from YYYY-MM-DD to YYYY.MM.DD
  const formatDate = (dateString: string) => {
    return dateString.replace(/-/g, ".")
  }

  if (loading) {
    return <div className="p-6">Loading company timeline data...</div>
  }

  if (error || data.length === 0) {
    return <div className="p-6 text-red-500">{error || "No timeline data available"}</div>
  }

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Company Timeline</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      {/* Timeline */}
      <div className="relative py-16 px-4 h-[220px]">
        {/* Horizontal line */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#d1d5db]"></div>

        {/* Timeline points */}
        <div className="relative h-full w-full">
          {data.map((event, index) => (
            <div
              key={index}
              className="absolute flex flex-col items-center"
              style={{
                left: `${event.position}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Date */}
              <div className="absolute top-[-40px] text-sm text-[#4b5563] font-medium">{formatDate(event.date)}</div>

              {/* Point */}
              <div className="w-3 h-3 rounded-full bg-[#1f2937]"></div>

              {/* Event */}
              <div className="absolute top-[20px] text-xs text-[#4b5563] text-center max-w-[250px]">{event.event}</div>

              {/* Description (if available) */}
              {/* {event.description && (
                <div className="absolute top-[45px] text-xs text-[#6b7280] text-center max-w-[180px]">
                  {event.description}
                </div>
              )} */}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-[#8097a2]">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

