"use client"

import { useState, useEffect } from "react"
import { SectionLayout } from "@/components/ui/section-layout"
import { format } from "date-fns"
import type { StrategicAlliance } from "@/types/strategicAlliance"

interface StrategicPartnershipProps {
  initialData?: StrategicAlliance[] | null
}

export default function StrategicPartnershipComponent({ initialData }: StrategicPartnershipProps) {
  const [data, setData] = useState<StrategicAlliance[] | null>(null)
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])

  const handleSave = (editedData: StrategicAlliance[]) => {
    setData(editedData)
    // Here you would typically send the data to an API
  }

  // Sort partnerships by date (newest first) and limit to top 5
  const sortedPartnerships = data
    ? [...data]
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0
          const dateB = b.date ? new Date(b.date).getTime() : 0
          return dateB - dateA
        })
        .slice(0, 5)
    : []

  return (
    <SectionLayout title="Strategic Partnerships" sourceText={sourceText} initialData={data} onSave={handleSave}>
      {!sortedPartnerships || sortedPartnerships.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No strategic partnership data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPartnerships.map((partnership, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0 md:mr-6 md:w-1/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{partnership.name || "Unnamed Partner"}</h3>
                  <p className="text-sm text-gray-500">
                    {partnership.date ? format(new Date(partnership.date), "MMMM d, yyyy") : "Date unknown"}
                  </p>
                </div>

                <div className="md:w-2/3">
                  <p className="text-gray-600">{partnership.description || "No description available"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionLayout>
  )
}

