"use client"

import { useState, useEffect } from "react"
import { SectionLayout } from "@/components/ui/section-layout"
import type { Service } from "@/types/company"

interface ProductServicesProps {
  initialData?: Service[] | null
}

export default function ProductServices({ initialData }: ProductServicesProps) {
  const [data, setData] = useState<Service[]>([])
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      // Limit to top 5 services
      setData(initialData.slice(0, 5))
    }
  }, [initialData])

  return (
    <SectionLayout title="Products & Services" sourceText={sourceText}>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No product or service data available</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-1/3 bg-[#002169] text-white p-4 text-left font-medium">Product & Services</th>
                <th className="w-2/3 bg-white text-gray-700 p-4 text-left font-medium border-b border-gray-200">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((service, index) => (
                <tr key={service.uuid || index}>
                  <td className="bg-[#002169] text-white p-4 border-t border-[#35454c]">
                    {service.value || "Unnamed Service"}
                  </td>
                  <td className="bg-white text-gray-600 p-4 border-t border-gray-200">
                    {service.description ? (
                      <p>{service.description}</p>
                    ) : (
                      <p className="text-gray-400 italic">No description available</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionLayout>
  )
}

