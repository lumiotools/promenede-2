"use client"

import { useState, useEffect } from "react"
import { SectionLayout } from "@/components/ui/section-layout"
import type { CompetitiveAnalysisItem } from "@/types/competitor"
import Image from "next/image"

interface CompetitiveLandscapeProps {
  initialData?: any
}

export default function CompetitiveLandscape({ initialData }: CompetitiveLandscapeProps) {
  const [data, setData] = useState<CompetitiveAnalysisItem[] | null>(null)
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  useEffect(() => {
    if (initialData?.competitive_analysis) {
      // Sort by score in descending order and take top 5
      const sortedData = [...initialData.competitive_analysis].sort((a, b) => b.score - a.score).slice(0, 5)
      setData(sortedData)
    }
  }, [initialData])

  return (
    <SectionLayout title="Competitive Landscape" sourceText={sourceText}>
      {!data || data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No competitive landscape data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="py-3 px-4 text-left font-medium">Company</th>
                <th className="py-3 px-4 text-left font-medium">Field</th>
                <th className="py-3 px-4 text-left font-medium">Score</th>
                <th className="py-3 px-4 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((competitor, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#eff2f3]"}>
                  <td className="py-3 px-4 border-t border-[#ced7db]">
                    <div className="flex items-center gap-2">
                      {competitor.logo_url && (
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            src={competitor.logo_url || "/placeholder.svg"}
                            alt={`${competitor.company_name} logo`}
                            width={24}
                            height={24}
                            className="object-contain"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        </div>
                      )}
                      <span className="font-medium text-[#445963]">{competitor.company_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-t border-[#ced7db] text-[#445963]">{competitor.field}</td>
                  <td className="py-3 px-4 border-t border-[#ced7db]">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${competitor.score}%` }}></div>
                      </div>
                      <span className="text-sm text-[#445963]">{competitor.score}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-t border-[#ced7db] text-[#445963] text-sm">
                    {competitor.description}
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

