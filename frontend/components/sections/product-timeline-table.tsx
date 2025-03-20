"use client"

import { useState, useEffect } from "react"
import { Edit } from "lucide-react"

interface ProductLaunch {
  id: number
  year: string
  description: string
  link?: string
}

export function ProductTimelineTable() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ProductLaunch[]>([])

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
          // Map the data to the format we need
          const timelineEvents = jsonData.data.company_timeline
            .filter((item: any) => item.event !== null)
            .slice(0, 5)
            .map((item: any, index: number) => ({
              id: index + 1,
              year: new Date(item.date).getFullYear().toString(),
              description: item.event,
              link: item.link || "#",
            }))

          setData(timelineEvents)
        } else {
          // Use fallback data if timeline data is not available
          setData([])
        }
      } catch (error) {
        console.error("Error fetching timeline data:", error)
        setError("Failed to load timeline data")

        // Set fallback data
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading product timeline data...</div>
  }

  if (error && data.length === 0) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6 bg-white">
      {/* Title */}
      <h1 className="text-4xl font-medium text-[#475467]">Product Timeline</h1>

      {/* Divider line */}
      <div className="border-t border-[#e5e7eb] w-full"></div>

      {/* Table */}
      <div className="border border-[#e5e7eb] mx-10 rounded-md overflow-hidden">
        {/* Table header with edit icon */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#e5e7eb]">
          <h2 className="text-lg font-medium text-[#475467]">Product Timeline</h2>
          <button className="text-[#475467]">
            <Edit size={18} />
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#002266] text-white">
              <th className="py-2 px-4 text-left font-medium border-r border-[#1a3a80] w-12">#</th>
              <th className="py-2 px-4 text-left font-medium border-r border-[#1a3a80] w-24">Year</th>
              <th className="py-2 px-4 text-left font-medium">Product Launches</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-[#e5e7eb] last:border-b-0">
                <td className="py-3 px-4 border-r border-[#e5e7eb] align-top">{item.id}</td>
                <td className="py-3 px-4 border-r border-[#e5e7eb] align-top">{item.year}</td>
                <td className="py-3 px-4 align-top">
                  {item.description}{" "}
                  {item.link && (
                    <a href={item.link} className="text-blue-600 hover:underline">
                      (link)
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Source citation */}
      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

