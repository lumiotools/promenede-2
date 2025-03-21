"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { WebTrafficItem } from "@/types/company"

type WebTrafficTypeProps = {
  initialData?: WebTrafficItem
}

export default function WebTraffic({ initialData }: WebTrafficTypeProps) {
  // Initialize state with initialData if provided
  const [data, setData] = useState<WebTrafficItem | undefined>(initialData)

  // Fetch data if not provided as initialData
  useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])

  console.log("WebTraffic initialData:", initialData)

  // Check if data is available
  if (!data || !data.visits_by_month || !data.visits_by_country) {
    return (
      <div className="space-y-6 bg-white p-6">
        <h1 className="text-4xl font-medium text-[#475467] mb-6">Web Traffic</h1>
        <div className="border-t border-[#e5e7eb] mb-6"></div>
        <div className="p-6 text-center text-[#475467]">No web traffic data available</div>
      </div>
    )
  }

  // Format monthly visits data for the chart
  const monthlyVisitsData = data.visits_by_month
    .slice(0, 12)
    .map((item) => ({
      month: new Date(item.date).toLocaleString("default", { month: "short", year: "2-digit" }),
      visits: item.total_website_visits / 1000000, // Convert to millions
    }))
    .reverse() // Reverse to show oldest to newest

  // Format country data for the chart
  const countryVisitsData = data.visits_by_country.map((item) => ({
    country: item.country || "Unknown",
    percentage: item.percentage,
  }))

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Web Traffic</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-[#475467] font-medium mb-4">MoM Trend (12 months)</h3>
          <div className="bg-[#f9fafb] p-6 rounded-md">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyVisitsData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#475467", fontSize: 12 }} tickMargin={10} />
                  <YAxis
                    tick={{ fill: "#475467", fontSize: 12 }}
                    tickFormatter={(value) => `${value}M`}
                    label={{
                      value: "Visits (millions)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#475467", fontSize: 12 },
                    }}
                  />
                  <Tooltip formatter={(value) => [`${value}M`, "Traffic"]} labelStyle={{ color: "#475467" }} />
                  <Bar dataKey="visits" fill="#002169" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[#475467] font-medium mb-4">Traffic by Country</h3>
          <div className="bg-[#f9fafb] p-6 rounded-md">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={countryVisitsData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 80,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="country" tick={{ fill: "#475467", fontSize: 12 }} tickMargin={10} />
                  <YAxis
                    tick={{ fill: "#475467", fontSize: 12 }}
                    tickFormatter={(value) => `${value}M`}
                    label={{
                      value: "Visits (millions)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#475467", fontSize: 12 },
                    }}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "Traffic"]} labelStyle={{ color: "#475467" }} />
                  <Bar dataKey="percentage" fill="#002169" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

   

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

