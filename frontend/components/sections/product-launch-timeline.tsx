"use client"

import { useEffect, useState } from "react"
import { Timeline, TimelineEvent } from "../ui/timeline"

export function ProductLaunchesTimeline() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Try to fetch from the API
        const response = await fetch("/paypal.json")

        // Check if the response is valid
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }

        const jsonData = await response.json()

        // Extract timeline data from the response
        if (jsonData?.data?.company_timeline && Array.isArray(jsonData.data.company_timeline)) {
          // Filter out events with null event property and limit to 4 events
          const timelineEvents = jsonData.data.company_timeline
            .filter((item: any) => item.event !== null)
            .slice(0, 4)
            .map((item: any) => ({
              date: formatDate(item.date),
              title: item.event,
            }))

          setEvents(timelineEvents)
        } else {
          // Use fallback data if timeline data is not available
          setEvents([
            {
              date: "2024.12.07",
              title: "Generative AI Platform",
            },
            {
              date: "2024.12.07",
              title: "Generative AI Platform",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching timeline data:", error)
        setError("Failed to load timeline data")

        // Set fallback data
        setEvents([
          {
            date: "2024.12.07",
            title: "Generative AI Platform",
          },
          {
            date: "2024.12.07",
            title: "Generative AI Platform",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format date to match the design (YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    if (dateString.includes(".")) return dateString

    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}.${month}.${day}`
  }

  if (loading) {
    return <div className="p-6">Loading product launches timeline data...</div>
  }

  if (error && events.length === 0) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="w-full bg-white">
      {/* Title */}
      <h2 className="text-4xl font-medium text-[#475467] mb-4">Product Launches Timeline</h2>

      {/* Divider line */}
      <div className="w-full h-px bg-[#e5e7eb] mb-16"></div>

      {/* Timeline component */}
      <Timeline events={events} />

      {/* Source citation */}
      <div className="text-xs text-[#6b7280] mt-8">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

