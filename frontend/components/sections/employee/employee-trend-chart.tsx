/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { EmployeesTrend } from "@/types/employeeTrend";

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

interface EmployeeTrendChartProps {
  initialData?: EmployeesTrend;
}

interface ChartDataPoint {
  month: string;
  employees: number;
}

export function EmployeeTrendChart({
  initialData = defaultState,
}: EmployeeTrendChartProps) {
  const [data, setData] = useState<EmployeesTrend>(initialData);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [increase, setIncrease] = useState<number>(0);
  const [percentIncrease, setPercentIncrease] = useState<string>("0.0");

  useEffect(() => {
    // Update state when initialData changes
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    // Process data for the chart when data changes
    processChartData();
  }, [data]);

  const processChartData = () => {
    if (!data.count_by_month || data.count_by_month.length === 0) {
      setChartData([]);
      setIncrease(0);
      setPercentIncrease("0.0");
      return;
    }

    // Filter out entries with null values
    const validData = data.count_by_month.filter(
      (entry) => entry.date !== null && entry.employees_count !== null
    ) as {
      date: string;
      employees_count: number;
    }[];

    // Sort data by date (oldest to newest)
    const sortedData = [...validData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    // Take only the last 12 months of data for better visualization
    const recentData = sortedData.slice(-12);

    // Format data for the chart
    const formattedData = recentData.map((entry) => {
      // Parse date and format it
      const date = new Date(entry.date);
      const month = date.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      });

      return {
        month,
        employees: entry.employees_count,
      };
    });

    setChartData(formattedData);

    // Calculate increase
    if (formattedData.length > 0) {
      const firstCount = formattedData[0]?.employees || 0;
      const lastCount = formattedData[formattedData.length - 1]?.employees || 0;
      const calculatedIncrease = lastCount - firstCount;
      setIncrease(calculatedIncrease);

      // Calculate percent increase with null safety
      if (firstCount > 0) {
        setPercentIncrease(
          ((calculatedIncrease / firstCount) * 100).toFixed(1)
        );
      } else {
        setPercentIncrease("0.0");
      }
    }
  };

  // Format number to K format (e.g., 2000 -> 2.0K)
  const formatToK = (num: number) => {
    return `${(num / 1000).toFixed(1)}K`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-4xl font-medium text-[#445963]">
        Organization : # of Employees trend
      </h1>
      <div className="border-t border-gray-200 mb-8"></div>

      {/* Chart Section */}
      <div className="bg-[#f7f9f9] p-6 rounded-lg">
        {chartData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient
                    id="colorEmployees"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#002169" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#002169" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e0e0e0"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#445963" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tickFormatter={formatToK}
                  tick={{ fill: "#445963" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  formatter={(value: number) => formatToK(value)}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="employees"
                  stroke="#002169"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEmployees)"
                  dot={{
                    r: 5,
                    fill: "#002169",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#002169",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-md">
            <p className="text-gray-500">No employee trend data available</p>
          </div>
        )}
        <p className="text-sm text-[#445963] mt-2">Source : Employee Data</p>
      </div>

      {/* Employee Increase Info */}
      <p className="text-center text-lg font-medium text-[#445963]">
        There has been a total {increase >= 0 ? "increase" : "decrease"} of{" "}
        {percentIncrease}%
      </p>

      <div className="text-sm text-[#445963]">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
