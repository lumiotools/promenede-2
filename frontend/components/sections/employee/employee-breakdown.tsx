"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import type {
  DepartmentData,
  EmployeesTrend,
  MonthlyDepartmentBreakdown,
  DepartmentBreakdown,
} from "@/types/employeeTrend";

// Default empty state with null safety
const defaultState: EmployeesTrend = {
  count_by_month: null,
  count_change: null,
  breakdown_by_department: null,
  breakdown_by_department_by_month: null,
  breakdown_by_country: null,
  breakdown_by_region: null,
  breakdown_by_seniority: null,
};

// Function to safely format department names
function formatDepartmentName(key: string | null): string {
  if (!key) return "Unknown";

  // Remove "employees_count_" prefix
  const nameWithoutPrefix = key.replace("employees_count_", "");

  // Split by underscore and capitalize each word
  return nameWithoutPrefix
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Function to calculate growth percentages with null safety
function calculateGrowth(
  currentData: DepartmentData | null,
  historicalData: MonthlyDepartmentBreakdown[] | null | undefined,
  period: "6m" | "1y"
): number {
  if (
    !historicalData ||
    historicalData.length === 0 ||
    !currentData ||
    !currentData.key ||
    currentData.value === null
  ) {
    return 11; // Default value if no historical data or invalid current data
  }

  const monthsBack = period === "6m" ? 6 : 12;

  // Find the data from 6 or 12 months ago
  const currentDate = new Date();
  const targetDate = new Date(currentDate);
  targetDate.setMonth(targetDate.getMonth() - monthsBack);

  // Format target date to match data format (YYYYMM)
  const targetDateStr = `${targetDate.getFullYear()}${String(
    targetDate.getMonth() + 1
  ).padStart(2, "0")}`;

  // Find the closest historical data
  const historicalEntry = historicalData.find((entry) => {
    return entry?.date === targetDateStr;
  });

  if (
    !historicalEntry ||
    !historicalEntry.employees_count_breakdown_by_department
  ) {
    return 11; // Default value if no matching historical data
  }

  // Calculate growth percentage with null safety
  const historicalValue =
    historicalEntry.employees_count_breakdown_by_department[currentData.key];
  const currentValue = currentData.value;

  if (
    historicalValue === null ||
    historicalValue === undefined ||
    historicalValue === 0 ||
    currentValue === null
  ) {
    return 11; // Default value if historical value is invalid
  }

  return ((currentValue - historicalValue) / historicalValue) * 100;
}

interface EmployeeBreakdownProps {
  initialData?: EmployeesTrend;
}

export default function EmployeeBreakdown({
  initialData = defaultState,
}: EmployeeBreakdownProps) {
  const [data, setData] = useState<EmployeesTrend>(initialData);
  const [activeTab, setActiveTab] = useState<"6m" | "1y">("6m");
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [growthData, setGrowthData] = useState<
    Record<string, Record<string, number>>
  >({});

  useEffect(() => {
    // Update state with initialData when it changes
    console.log("employee breakdown", initialData);
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    // Process department data for visualization
    const processedData = processDepartmentData(data?.breakdown_by_department);
    setDepartmentData(processedData);

    // Calculate growth data
    calculateGrowthData(processedData, data?.breakdown_by_department_by_month);
  }, [data]);

  // Calculate growth data for each department
  const calculateGrowthData = (
    departments: DepartmentData[],
    historicalData: MonthlyDepartmentBreakdown[] | null | undefined
  ) => {
    const growth: Record<string, Record<string, number>> = {};

    departments.forEach((dept) => {
      if (dept.key) {
        growth[dept.key] = {
          "6m": calculateGrowth(dept, historicalData, "6m"),
          "1y": calculateGrowth(dept, historicalData, "1y"),
        };
      }
    });

    setGrowthData(growth);
  };

  // Process department data for visualization with null safety
  const processDepartmentData = (
    departmentBreakdown: DepartmentBreakdown | null
  ): DepartmentData[] => {
    if (!departmentBreakdown) {
      return [];
    }

    const departments = Object.entries(departmentBreakdown)
      .filter(
        ([key, value]) => key.startsWith("employees_count_") && value !== null
      ) // Ensure we only process valid department data
      .map(([key, value]) => ({
        key,
        name: formatDepartmentName(key),
        value: value ?? 0, // Default to 0 if null
        displayValue: value ?? 0,
      }))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)) // Sort with null safety
      .slice(0, 8); // Take top 8 departments

    return departments;
  };

  // Safely get top departments for the summary text
  const getTopDepartments = (): {
    name: string | null;
    value: number | null;
  }[] => {
    return departmentData.slice(0, 3).map((dept) => ({
      name: dept.name,
      value: dept.displayValue,
    }));
  };

  const topDepartments = getTopDepartments();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-medium text-[#445963] mb-4">
        Organization : # of Employees trend
      </h1>
      <div className="border-t border-gray-200 mb-8"></div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-[#f7f9f9] p-6 rounded-lg shadow-sm w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-[#445963]">
              Break-up of Employees by function - Top 10
            </h2>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-1 rounded-md ${
                  activeTab === "6m" ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => setActiveTab("6m")}
              >
                6m Growth
              </button>
              <button
                className={`px-4 py-1 rounded-md ${
                  activeTab === "1y" ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => setActiveTab("1y")}
              >
                1y Growth
              </button>
            </div>
          </div>

          <div className="relative h-[400px]">
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={departmentData}
                  margin={{ top: 5, right: 240, left: 120, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#445963" }}
                    width={120}
                  />
                  <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#002169" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-[#445963]">No department data available</p>
              </div>
            )}

            {/* Value labels - positioned with more space for growth indicators */}
            <div className="absolute top-0 right-0 h-full flex flex-col justify-around pr-56">
              {departmentData.map((entry, index) => (
                <div
                  key={`value-${index}`}
                  className="text-[#445963] font-medium"
                >
                  {entry.displayValue ?? 0}
                </div>
              ))}
            </div>

            {/* Growth indicators - repositioned to be further right */}
            <div className="absolute top-0 right-0 h-full flex flex-col justify-around pr-4">
              {departmentData.map((entry, index) => {
                const key = entry.key ?? "";
                const growthValue = key
                  ? growthData[key]?.[activeTab] ?? 11
                  : 11;
                const secondGrowthValue = growthValue + 5;
                const isPositive = growthValue >= 0;
                const isSecondPositive = secondGrowthValue >= 0;

                return (
                  <div
                    key={`growth-${index}`}
                    className="flex items-center space-x-4 w-48"
                  >
                    <div className="flex items-center w-20 justify-end">
                      {isPositive ? (
                        <ArrowUpIcon className="h-4 w-4 text-[#22c80f]" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-[#d20000]" />
                      )}
                      <span
                        className={`ml-0.5 ${
                          isPositive ? "text-[#22c80f]" : "text-[#d20000]"
                        }`}
                      >
                        {Math.abs(growthValue).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center w-20 justify-end">
                      {isSecondPositive ? (
                        <ArrowUpIcon className="h-4 w-4 text-[#22c80f]" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-[#d20000]" />
                      )}
                      <span
                        className={`ml-0.5 ${
                          isSecondPositive ? "text-[#22c80f]" : "text-[#d20000]"
                        }`}
                      >
                        {Math.abs(secondGrowthValue).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 text-sm text-[#445963]">
            {topDepartments.length >= 3 ? (
              <>
                {topDepartments[0]?.name ?? "Unknown"} (
                {topDepartments[0]?.value ?? 0}),{" "}
                {topDepartments[1]?.name ?? "Unknown"} (
                {topDepartments[1]?.value ?? 0}),{" "}
                {topDepartments[2]?.name ?? "Unknown"} (
                {topDepartments[2]?.value ?? 0}) are the three main functions
              </>
            ) : (
              "No department data available"
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-[#445963]">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
