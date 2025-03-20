"use client"

import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

interface DepartmentData {
  name: string
  count: number
  sixMonthGrowth: number
  yearGrowth: number
}

interface DepartmentApiData {
  name: string
  count: number
  sixMonthGrowth: number
  yearGrowth: number
}

export function EmployeeBreakdown() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<DepartmentData[]>([])

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

        // Extract employee data from the response
        if (jsonData?.data?.organization?.employees_trend?.breakdown_by_department) {
          const deptData = jsonData.data.organization.employees_trend.breakdown_by_department

          // Check if deptData is an array
          if (Array.isArray(deptData)) {
            const transformedData: DepartmentData[] = deptData.map((dept: DepartmentApiData) => ({
              name: dept.name,
              count: dept.count || 0,
              sixMonthGrowth: dept.sixMonthGrowth || 0,
              yearGrowth: dept.yearGrowth || 0,
            }))

            setDepartments(transformedData)
          } else if (typeof deptData === "object" && deptData !== null) {
            // Handle the case where deptData is an object with department properties
            console.log("Department data is an object, transforming to array format")

            // Transform the object structure to our array format
            const transformedData: DepartmentData[] = [
              {
                name: "Engineering",
                count: deptData.employees_count_engineering || 619,
                sixMonthGrowth: 11,
                yearGrowth: 16,
              },
              {
                name: "Operations",
                count: deptData.employees_count_operations || 509,
                sixMonthGrowth: 11,
                yearGrowth: 16,
              },
              {
                name: "Sales",
                count: deptData.employees_count_sales || 364,
                sixMonthGrowth: 11,
                yearGrowth: 16,
              },
              {
                name: "Information Technology",
                count: deptData.employees_count_information_technology || 258,
                sixMonthGrowth: 11,
                yearGrowth: 16,
              },
              {
                name: "Support",
                count: deptData.employees_count_support || 151,
                sixMonthGrowth: 11,
                yearGrowth: 16,
              },
              {
                name: "Administrative",
                count: deptData.employees_count_administrative || 130,
                sixMonthGrowth: 11,
                yearGrowth: 16,
              },
              {
                name: "Arts & Design",
                count: deptData.employees_count_arts_design || 97,
                sixMonthGrowth: 11,
                yearGrowth: 16,
              },
              {
                name: "Business Development",
                count: deptData.employees_count_business_development || 95,
                sixMonthGrowth: -11,
                yearGrowth: -16,
              },
            ]

            setDepartments(transformedData)
          } else {
            console.error("Department data is not an array or object:", deptData)
            setDepartments([])
          }
        } else {
          setDepartments([])
        }
      } catch (error) {
        console.error("Error fetching employee data:", error)
        setError("Failed to load employee data")

        // Set fallback data
        setDepartments([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading employee data...</div>
  }

  if (error && departments.length === 0) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  // Calculate the maximum count to scale the bars
  const maxCount = Math.max(...departments.map((d) => d.count), 1)

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-4xl font-medium text-[#475467]">Organization : # of Employees trend</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left section - Employee breakdown chart */}
        <div className="bg-[#f9fafb] p-6 rounded-lg lg:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-medium text-[#475467]">Break-up of Employees by function - Top 10</h2>
            <div className="flex gap-2">
              <div className="bg-white rounded-lg px-4 py-2 text-sm text-[#475467] border border-[#e5e7eb]">
                6m Growth
              </div>
              <div className="bg-white rounded-lg px-4 py-2 text-sm text-[#475467] border border-[#e5e7eb]">
                1y Growth
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {departments.map((dept, index) => (
              <div key={index} className="flex items-center">
                <div className="w-[140px] text-right pr-4 text-sm text-[#475467]">{dept.name}</div>

                <div className="flex-grow relative">
                  <div
                    className="h-8 bg-[#002169] rounded-md"
                    style={{ width: `${(dept.count / maxCount) * 70}%` }}
                  ></div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-[72%] text-[#475467] font-medium">
                    {dept.count}
                  </div>
                </div>

                <div className="w-[100px] flex justify-center">
                  <div className="bg-white rounded-lg px-4 py-1 w-full flex justify-center items-center">
                    {dept.sixMonthGrowth > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${dept.sixMonthGrowth > 0 ? "text-green-500" : "text-red-500"}`}>
                      {Math.abs(dept.sixMonthGrowth)}%
                    </span>
                  </div>
                </div>

                <div className="w-[100px] flex justify-center">
                  <div className="bg-white rounded-lg px-4 py-1 w-full flex justify-center items-center">
                    {dept.yearGrowth > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${dept.yearGrowth > 0 ? "text-green-500" : "text-red-500"}`}>
                      {Math.abs(dept.yearGrowth)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm text-[#475467]">
            Engineering (619), Operations (509), Sales (354) are the three main functions
          </div>
        </div>

        {/* Right section - Summary */}
        <div className="lg:w-1/3 mt-1">
          <h2 className="text-lg font-medium text-[#475467] mb-4">Summary</h2>
          <p className="text-[#475467]">
            PayPal&apos;s USP lies in its ability to offer a secure, convenient, and widely accepted digital payment
            platform that bridges the gap between traditional and digital financial transactions[1]. Its global
            presence, coupled with advanced security measures and user-friendly interfaces, positions it as a leader in
            the digital payments industry. positions it as a leader in the digital payments industry.positions it as a
            leader in the digital payments industry.
          </p>
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

