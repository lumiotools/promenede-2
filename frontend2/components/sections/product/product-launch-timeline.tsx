"use client"

import { useState, useEffect } from "react"
import { SectionLayout } from "@/components/ui/section-layout"
import type { ProductLaunch } from "@/types/company"

interface ProductLaunchTimelineProps {
  initialData?: ProductLaunch[] | null
}

export default function ProductLaunchTimeline({ initialData }: ProductLaunchTimelineProps) {
  const [data, setData] = useState<ProductLaunch[]>([])
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  useEffect(() => {
    if (initialData) {
      // Sort by date if available
      const sortedData = [...initialData].sort((a, b) => {
        if (!a.date || !b.date) return 0
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      setData(sortedData)
    }
  }, [initialData])

  // Limit to top 5 product launches
  const displayLaunches = data.slice(0, 5)

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date unknown"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return "Invalid date"
    }
  }

  return (
    <SectionLayout title="Product Launch Timeline" sourceText={sourceText}>
      {displayLaunches.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No product launch data available</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {displayLaunches.map((launch, index) => (
              <div key={index} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2"></div>

                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-8 md:ml-auto" : "md:pl-8"}`}>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="mb-2 text-sm text-gray-500">{formatDate(launch.date)}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {launch.product_name || "Unnamed Product"}
                    </h3>
                    <p className="text-gray-600">{launch.description || "No description available"}</p>

                    {launch.key_features && launch.key_features.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Key Features</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {launch.key_features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-gray-600">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionLayout>
  )
}

