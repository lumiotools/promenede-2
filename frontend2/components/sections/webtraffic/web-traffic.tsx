"use client"

import { useState, useEffect } from "react"
import { SectionLayout } from "@/components/ui/section-layout"
import { BarChart } from "@/components/ui/bar-chart"
import type { WebTraffic } from "@/types/webtraffic"

interface WebTrafficProps {
  initialData?: WebTraffic | null
}

export default function WebTrafficComponent({ initialData }: WebTrafficProps) {
  const [data, setData] = useState<WebTraffic | null>(null)
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.SimilarWeb")

  useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])

  const handleSave = (editedData: WebTraffic) => {
    setData(editedData)
    // Here you would typically send the data to an API
  }

  // Prepare chart data
  const monthlyVisitsData = data?.monthlyVisits?.slice(0, 6) || []
  const trafficSourcesData = data?.trafficSources || null

  return (
    <SectionLayout title="Web Traffic" sourceText={sourceText} initialData={data} onSave={handleSave}>
      {!data ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No web traffic data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Visits */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Monthly Visits</h3>
            {monthlyVisitsData.length > 0 ? (
              <div className="h-64">
                <BarChart
                  data={monthlyVisitsData.map((item) => ({
                    name: item.month,
                    value: item.visits,
                  }))}
                  xAxisKey="name"
                  yAxisKey="value"
                  color="#3b82f6"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No monthly visit data available</p>
              </div>
            )}
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Traffic Sources</h3>
            {trafficSourcesData ? (
              <div className="space-y-4">
                {Object.entries(trafficSourcesData).map(([source, percentage]) => (
                  <div key={source} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{source}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No traffic source data available</p>
              </div>
            )}
          </div>

          {/* Key Metrics */}
          <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Key Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Avg. Visit Duration</p>
                <p className="text-base font-medium text-gray-800">{data.avgVisitDuration || "N/A"}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Pages per Visit</p>
                <p className="text-base font-medium text-gray-800">{data.pagesPerVisit || "N/A"}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Bounce Rate</p>
                <p className="text-base font-medium text-gray-800">{data.bounceRate || "N/A"}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Global Rank</p>
                <p className="text-base font-medium text-gray-800">{data.globalRank || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  )
}

