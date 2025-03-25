"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ExecutiveSummaryData } from "@/types/executive_summary"
import { SectionLayout } from "@/components/ui/section-layout"

// Default empty state with null safety
const defaultState: ExecutiveSummaryData = {
  company_name: "",
  company_description: "",
  key_metrics: {},
  key_strengths: [],
  key_challenges: [],
  key_opportunities: [],
  key_threats: [],
  recent_developments: [],
}

interface ExecutiveSummaryProps {
  initialData?: ExecutiveSummaryData
}

export function ExecutiveSummary({ initialData = defaultState }: ExecutiveSummaryProps) {
  const [data, setData] = useState<ExecutiveSummaryData>(initialData)

  useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])

  // Format financial metrics
  const formatValue = (value: any) => {
    if (typeof value === "number") {
      // Format as currency if it's likely a monetary value (over 1000)
      if (value > 1000) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      }
      // Format as percentage if it's between 0 and 1
      else if (value >= 0 && value <= 1) {
        return new Intl.NumberFormat("en-US", {
          style: "percent",
          maximumFractionDigits: 2,
        }).format(value)
      }
      // Format as number otherwise
      return new Intl.NumberFormat("en-US").format(value)
    }
    return value || "N/A"
  }

  // Get key metrics as array of objects
  const keyMetricsArray = data.key_metrics
    ? Object.entries(data.key_metrics).map(([key, value]) => ({
        key: key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: formatValue(value),
      }))
    : []

  return (
    <SectionLayout title="Executive Summary" source="Source: 1.PromenadeAI, 2.Crunchbase">
      <div className="space-y-6">
        {/* Company Overview */}
        <Card>
          <CardHeader className="bg-[#f8f9fa]">
            <CardTitle className="text-xl font-medium text-[#445963]">Company Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-[#35454c]">{data.company_description || "No company description available."}</p>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader className="bg-[#f8f9fa]">
            <CardTitle className="text-xl font-medium text-[#445963]">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {keyMetricsArray.length > 0 ? (
              <Table>
                <TableHeader className="bg-[#f0f4f7]">
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keyMetricsArray.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{metric.key}</TableCell>
                      <TableCell className="text-right">{metric.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-4 text-center text-[#8097a2]">No key metrics available</div>
            )}
          </CardContent>
        </Card>

        {/* SWOT Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card>
            <CardHeader className="bg-[#f8f9fa]">
              <CardTitle className="text-xl font-medium text-[#445963]">Strengths</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {data.key_strengths && data.key_strengths.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {data.key_strengths.slice(0, 5).map((strength, index) => (
                    <li key={index} className="text-[#35454c]">
                      {strength}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#8097a2]">No strengths data available</p>
              )}
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card>
            <CardHeader className="bg-[#f8f9fa]">
              <CardTitle className="text-xl font-medium text-[#445963]">Challenges</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {data.key_challenges && data.key_challenges.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {data.key_challenges.slice(0, 5).map((challenge, index) => (
                    <li key={index} className="text-[#35454c]">
                      {challenge}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#8097a2]">No challenges data available</p>
              )}
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card>
            <CardHeader className="bg-[#f8f9fa]">
              <CardTitle className="text-xl font-medium text-[#445963]">Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {data.key_opportunities && data.key_opportunities.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {data.key_opportunities.slice(0, 5).map((opportunity, index) => (
                    <li key={index} className="text-[#35454c]">
                      {opportunity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#8097a2]">No opportunities data available</p>
              )}
            </CardContent>
          </Card>

          {/* Threats */}
          <Card>
            <CardHeader className="bg-[#f8f9fa]">
              <CardTitle className="text-xl font-medium text-[#445963]">Threats</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {data.key_threats && data.key_threats.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {data.key_threats.slice(0, 5).map((threat, index) => (
                    <li key={index} className="text-[#35454c]">
                      {threat}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#8097a2]">No threats data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Developments */}
        <Card>
          <CardHeader className="bg-[#f8f9fa]">
            <CardTitle className="text-xl font-medium text-[#445963]">Recent Developments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.recent_developments && data.recent_developments.length > 0 ? (
              <Table>
                <TableHeader className="bg-[#f0f4f7]">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Development</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recent_developments.slice(0, 5).map((development, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {development.date
                          ? new Date(development.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell>{development.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-4 text-center text-[#8097a2]">No recent developments available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </SectionLayout>
  )
}

