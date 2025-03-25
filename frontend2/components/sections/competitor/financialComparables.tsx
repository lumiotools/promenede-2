"use client"

import { useState, useEffect } from "react"
import { SectionLayout } from "@/components/ui/section-layout"
import type { FinancialComparable } from "@/types/competitor"

interface FinancialComparablesProps {
  initialData?: FinancialComparable[] | null
}

export default function FinancialComparables({ initialData }: FinancialComparablesProps) {
  const [data, setData] = useState<FinancialComparable[]>([])
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      setData(initialData)
    }
  }, [initialData])

  // Limit to top 5 financial comparables
  const displayComparables = Array.isArray(data) ? data.slice(0, 5) : []

  // Format currency function
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(value)
  }

  // Format percentage function
  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return "N/A"
    return `${value.toFixed(2)}%`
  }

  return (
    <SectionLayout title="Financial Comparables" sourceText={sourceText}>
      {displayComparables.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No financial comparables data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="p-4 text-left font-medium">Company</th>
                <th className="p-4 text-right font-medium">Revenue</th>
                <th className="p-4 text-right font-medium">Market Cap</th>
                <th className="p-4 text-right font-medium">P/E Ratio</th>
                <th className="p-4 text-right font-medium">Revenue Growth</th>
                <th className="p-4 text-right font-medium">Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {displayComparables.map((company, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-4 border-t border-gray-200 font-medium">{company.name || "Unnamed Company"}</td>
                  <td className="p-4 border-t border-gray-200 text-right">{formatCurrency(company.revenue)}</td>
                  <td className="p-4 border-t border-gray-200 text-right">{formatCurrency(company.market_cap)}</td>
                  <td className="p-4 border-t border-gray-200 text-right">{company.pe_ratio?.toFixed(2) || "N/A"}</td>
                  <td className="p-4 border-t border-gray-200 text-right">
                    {formatPercentage(company.revenue_growth)}
                  </td>
                  <td className="p-4 border-t border-gray-200 text-right">{formatPercentage(company.profit_margin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionLayout>
  )
}

