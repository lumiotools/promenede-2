"use client"

import { useEffect, useState } from "react"
import { Edit } from "lucide-react"

interface TimelineEvent {
  date: string
  event: string | null
  description: string
}

export function CompanyTimelineTable() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TimelineEvent[] | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching company timeline data...")
        const response = await fetch("/data.json")

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }

        const jsonData = await response.json()

        // Check if timeline data exists
        if (jsonData?.data?.company_timeline && Array.isArray(jsonData.data.company_timeline)) {
          // Filter out events with null event property
          const timelineEvents = jsonData.data.company_timeline
            .filter((item: any) => item.event !== null)
            .map((item: any) => ({
              date: item.date,
              event: item.event,
              description: item.description || "",
            }))

          setData(timelineEvents)
        } else {
          // Use fallback data if timeline data is not available
          setData([
            {
              date: "2020-12-07",
              event: "Incorporate",
              description: "Company was incorporated",
            },
            {
              date: "2022-06-15",
              event: "Acquired Blue Spurs",
              description: "Price: None None",
            },
            {
              date: "2023-05-22",
              event: "Acquired Optimal Design",
              description: "Price: None None",
            },
            {
              date: "2024-01-22",
              event: "Acquired Giant Machines",
              description: "Price: None None",
            },
            {
              date: "2024-06-03",
              event: "Acquired CasePointer",
              description: "Price: None None",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching timeline data:", error)
        setError("Failed to load timeline data")

        // Set fallback data
        setData([
          {
            date: "2020-12-07",
            event: "Incorporate",
            description: "Company was incorporated",
          },
          {
            date: "2022-06-15",
            event: "Acquired Blue Spurs",
            description: "Price: None None",
          },
          {
            date: "2023-05-22",
            event: "Acquired Optimal Design",
            description: "Price: None None",
          },
          {
            date: "2024-01-22",
            event: "Acquired Giant Machines",
            description: "Price: None None",
          },
          {
            date: "2024-06-03",
            event: "Acquired CasePointer",
            description: "Price: None None",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format date to MM/YY format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        // If date is invalid, try to parse it from different formats
        if (dateString.includes(".")) {
          const parts = dateString.split(".")
          if (parts.length >= 2) {
            return `${parts[1]}/${parts[0].substring(2)}`
          }
        }
        return dateString
      }

      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear().toString().substring(2)
      return `${month}/${year}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  if (loading) {
    return <div className="p-6">Loading company timeline data...</div>
  }

  if (error && !data) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  // Ensure data is available
  if (!data || data.length === 0) {
    return <div className="p-6">No company timeline data available</div>
  }

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Company Timeline (table)</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      {/* Timeline Table */}
      <div className="border border-[#e5e7eb] rounded-md overflow-hidden mx-10">
        <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb]">
          <h2 className="text-base font-medium text-[#475467]">Company Timeline</h2>
          <button className="text-[#8097a2]">
            <Edit className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="py-3 px-4 text-left font-medium border-r border-[#1a3573] w-16">#</th>
                <th className="py-3 px-4 text-left font-medium border-r border-[#1a3573] w-32">MM/YY</th>
                <th className="py-3 px-4 text-left font-medium border-r border-[#1a3573]">Partner</th>
                <th className="py-3 px-4 text-left font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {data.map((event, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}>
                  <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">{index + 1}</td>
                  <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">{formatDate(event.date)}</td>
                  <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">{event.event}</td>
                  <td className="py-3 px-4 text-[#475467]">{event.description}</td>
                </tr>
              ))}

              {/* Add empty rows to match the design if needed */}
              {data.length < 5 &&
                Array.from({ length: 5 - data.length }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className="py-3 px-4 border-r border-[#e5e7eb]"></td>
                    <td className="py-3 px-4 border-r border-[#e5e7eb]"></td>
                    <td className="py-3 px-4 border-r border-[#e5e7eb]"></td>
                    <td className="py-3 px-4"></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

