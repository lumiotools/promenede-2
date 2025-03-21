"use client";

import { EmployeeReviewsData } from "@/types/employeeTrend";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EmployeeReviewsProps {
  initialData?: EmployeeReviewsData;
}

export function EmployeeReviews({ initialData }: EmployeeReviewsProps) {
  const [members, setMembers] = useState<EmployeeReviewsData | null>(null);

  useEffect(() => {
    if (initialData) {
      setMembers(initialData);
    }
  }, [initialData]);

  console.log("Employee Reviews", initialData);

  // Return null or a loader if no data is available
  if (!members) {
    return <div className="text-center py-10 text-[#475467]">Loading...</div>;
  }

  // Convert ratings into bar chart data
  const ratingsData = Object.entries(members.breakdown).map(([key, value]) => ({
    category: key.replace(/_/g, " ").toUpperCase(),
    rating: value,
  }));

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <h1 className="text-4xl font-medium text-[#475467]">
        Organization: Employee Reviews
      </h1>
      <div className="border-t border-[#e5e7eb] my-6"></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mx-10">
        {[
          { label: "Overall rating", value: `${members.score} / 5` },
          {
            label: "Total Reviews",
            value: `${(members.count / 1000).toFixed(1)}K`,
          },
          {
            label: "CEO approval",
            value: `${(members.breakdown.ceo_approval * 100).toFixed(0)}%`,
          },
          {
            label: "Recommend",
            value: `${(members.breakdown.recommend * 100).toFixed(0)}%`,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-[#e5e7eb] text-center"
          >
            <p className="text-3xl font-bold text-[#002169]">{stat.value}</p>
            <p className="text-sm text-[#475467]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-10">
        {/* Employee Ratings Chart */}
        <div className="bg-[#f9fafb] p-6 rounded-lg">
          <h2 className="text-base font-medium text-[#475467] mb-4">
            Employee Ratings (by category)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} tick={{ fill: "#475467" }} />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fill: "#475467" }}
                width={180}
              />
              <Tooltip formatter={(value) => `${value}`} />
              <Bar dataKey="rating" fill="#002169" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Review Summaries */}
        <div className="space-y-4">
          {[
            {
              title: "Work/life balance",
              content:
                "The work-life balance at Automation Anywhere is generally described good, with many employees having flexibility in their schedules and enjoying benefits such as stress-free days and a no-meeting Friday. However, some employees also highlighted that there can be excessive workloads, resulting in a challenging balance",
            },
            {
              title: "Senior management",
              content:
                "Reviews indicate a significant level of dissatisfaction with senior management, which is frequently described as being too focused on personal gains rather than the well-being of employees. There are mentions of frequent layoffs, poor communication, and a lack of transparency, leading to low morale and trust issues among staff.",
            },
            {
              title: "Culture and values",
              content:
                "The company culture has been described as toxic by some employees, with reports of politics, favoritism, and a lack of support for employees' career advancement. Conversely, some reviews praise the organization's commitment to innovation and collaboration, highlighting a positive work environment in certain departments. The overall sentiment reflects a divide in experiences with the culture at Automation Anywhere.",
            },
            {
              title: "Career opportunities",
              content:
                "Some employees feel ample growth opportunities, while others report career stagnation within teams.",
            },
          ].map((review, index) => (
            <div key={index} className="text-[#475467] text-xs">
              <strong>• {review.title}:</strong> {review.content}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Source */}
      <div className="text-xs text-[#8097a2] italic mt-6">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
