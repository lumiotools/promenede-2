"use client"

import { useState, useEffect } from "react"
import { SectionLayout } from "@/components/ui/section-layout"
import type { Technology } from "@/types/technology"

interface TechnologyProps {
  initialData?: Technology | null
}

export default function TechnologyComponent({ initialData }: TechnologyProps) {
  const [data, setData] = useState<Technology | null>(null)
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Company Reports")

  useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])

  const handleSave = (editedData: Technology) => {
    setData(editedData)
    // Here you would typically send the data to an API
  }

  return (
    <SectionLayout title="Technology" sourceText={sourceText} initialData={data} onSave={handleSave}>
      {!data ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No technology data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Tech Stack</h3>
              {data.techStack && data.techStack.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {data.techStack.slice(0, 10).map((tech, index) => (
                    <div key={index} className="bg-white p-2 rounded border border-gray-200 text-xs">
                      {tech}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600">No tech stack information available</p>
              )}
            </div>

            {/* Patents */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Patents</h3>
              {data.patents && data.patents.length > 0 ? (
                <div className="space-y-2">
                  {data.patents.slice(0, 5).map((patent, index) => (
                    <div key={index} className="bg-white p-2 rounded border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700">{patent.title}</h4>
                      <p className="text-xs text-gray-500">
                        Patent #{patent.patentNumber} • {patent.filingDate}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600">No patent information available</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* R&D Focus */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">R&D Focus</h3>
              <p className="text-xs text-gray-600">{data.rdFocus || "No R&D focus information available"}</p>
            </div>

            {/* Innovation Metrics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Innovation Metrics</h3>
              {data.innovationMetrics ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500">R&D Spending</p>
                    <p className="text-base font-medium text-gray-800">{data.innovationMetrics.rdSpending}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500">Patents Filed (Last Year)</p>
                    <p className="text-base font-medium text-gray-800">{data.innovationMetrics.patentsFiledLastYear}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500">R&D Employees</p>
                    <p className="text-base font-medium text-gray-800">{data.innovationMetrics.rdEmployees}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500">Innovation Index</p>
                    <p className="text-base font-medium text-gray-800">{data.innovationMetrics.innovationIndex}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600">No innovation metrics available</p>
              )}
            </div>

            {/* Recent Tech Developments */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Recent Tech Developments</h3>
              {data.recentDevelopments && data.recentDevelopments.length > 0 ? (
                <div className="space-y-3">
                  {data.recentDevelopments.slice(0, 3).map((development, index) => (
                    <div key={index} className={index > 0 ? "pt-2 border-t border-gray-200" : ""}>
                      <h4 className="text-sm font-medium text-gray-700">{development.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{development.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{development.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600">No recent developments available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  )
}

