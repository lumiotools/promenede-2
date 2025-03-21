"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";

// Dummy data for employee count trends
const dummyEmployeeData = [
  { date: "2024-03", employees_count: 2200 },
  { date: "2024-04", employees_count: 2250 },
  { date: "2024-05", employees_count: 2300 },
  { date: "2024-06", employees_count: 2400 },
  { date: "2024-07", employees_count: 2500 },
  { date: "2024-08", employees_count: 2600 },
  { date: "2024-09", employees_count: 2700 },
  { date: "2024-10", employees_count: 2800 },
  { date: "2024-11", employees_count: 2900 },
  { date: "2024-12", employees_count: 3000 },
];

export function EmployeeTrendChart() {
  const [employeesTrend] = useState(dummyEmployeeData);

  // Ensure data is sorted (oldest to latest)
  const sortedData = employeesTrend.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Format data for the chart
  const chartData = sortedData.map((entry) => ({
    month: new Date(entry.date).toLocaleString("en-US", { month: "short", year: "2-digit" }),
    employees: entry.employees_count,
  }));

  // Calculate increase in employees
  const firstCount = chartData[0]?.employees || 0;
  const lastCount = chartData[chartData.length - 1]?.employees || 0;
  const increase = lastCount - firstCount;
  const percentIncrease = firstCount ? ((increase / firstCount) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <h1 className="text-4xl font-medium text-[#475467]">Organization: # of Employees Trend</h1>
      <div className="border-t border-[#e5e7eb] mb-6"></div>

      {/* Chart Section */}
      <div className="mx-10">
        <div className="bg-[#f9fafb] p-6 rounded-lg">
          <h2 className="text-base font-medium text-[#475467] mb-4">Employees Count Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              {/* Linear Gradient for Area Fill */}
              <defs>
                <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#002169" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#002169" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "#475467", fontSize: 12 }} />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                tick={{ fill: "#475467", fontSize: 12 }}
              />
              <Tooltip formatter={(value) => `${value.toLocaleString()}`} />

              {/* Area Fill with Gradient */}
              <Area type="monotone" dataKey="employees" stroke="#002169" fill="url(#colorFill)" strokeWidth={3} />

              {/* Line with White-Outlined Dots */}
              <Line
                type="monotone"
                dataKey="employees"
                stroke="#002169"
                strokeWidth={3}
                dot={{ r: 5, fill: "#002169", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#8097a2] mt-2">Source: Employee Data</p>
        </div>

        {/* Right section - Summary */}
        
      </div>

      {/* Employee Increase Info */}
      <p className="text-center text-lg font-medium text-[#475467]">
        There has been an increase of <span className="text-blue-600">{increase.toLocaleString()}</span> employees (~
        {percentIncrease}%)
      </p>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  );
}
