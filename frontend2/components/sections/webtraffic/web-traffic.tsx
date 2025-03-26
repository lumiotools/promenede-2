"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import { BarChart } from "@/components/ui/bar-chart";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Globe,
  MousePointerClick,
} from "lucide-react";
import type { WebTraffic } from "@/types/webtraffic";

interface WebTrafficProps {
  initialData?: WebTraffic | null;
}

export default function WebTrafficComponent({ initialData }: WebTrafficProps) {
  const [data, setData] = useState<WebTraffic | null>(null);
  const [sourceText, setSourceText] = useState<string>("Source: Coresignal");

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleSave = (editedData: WebTraffic) => {
    setData(editedData);
    // Here you would typically send the data to an API
  };

  // Helper function to format large numbers with commas
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return "N/A";
    return new Intl.NumberFormat().format(num);
  };

  // Helper function to format duration in seconds to minutes and seconds
  const formatDuration = (seconds: number | null | undefined): string => {
    if (seconds === null || seconds === undefined) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Helper function to format month names
  const formatMonth = (dateString: string | null | undefined): string => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Helper function to determine arrow color based on change
  const getChangeColor = (change: number | null | undefined): string => {
    if (change === null || change === undefined) return "text-gray-500";
    return change >= 0 ? "text-[#17b26a]" : "text-red-500";
  };

  // Helper function to determine arrow icon based on change
  const getChangeIcon = (change: number | null | undefined) => {
    if (change === null || change === undefined) return null;
    return change >= 0 ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  // Helper function to safely get percentage value
  const safePercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "N/A";
    return value.toFixed(2) + "%";
  };

  // Helper function to safely calculate width for progress bars
  const safeWidth = (percentage: number | null | undefined): string => {
    if (percentage === null || percentage === undefined) return "0%";
    return `${Math.max(0, Math.min(100, percentage))}%`;
  };

  return (
    <SectionLayout
      title="Web Traffic"
      sourceText={sourceText}
      initialData={data}
      onSave={handleSave}
    >
      {!data ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No web traffic data available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Traffic Overview */}
          <div className="bg-[#eff2f3] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#445963]">Monthly Visits</p>
                    <p className="text-xl font-semibold text-[#092a38]">
                      {formatNumber(data.monthly_visits)}
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-[#156082]" />
                </div>
                {data.visits_change &&
                  data.visits_change.change_monthly_percentage !== null && (
                    <div className="mt-2 flex items-center text-xs">
                      <span
                        className={getChangeColor(
                          data.visits_change.change_monthly_percentage
                        )}
                      >
                        {getChangeIcon(
                          data.visits_change.change_monthly_percentage
                        )}
                      </span>
                      <span
                        className={`ml-1 ${getChangeColor(
                          data.visits_change.change_monthly_percentage
                        )}`}
                      >
                        {data.visits_change.change_monthly_percentage !== null
                          ? Math.abs(
                              data.visits_change.change_monthly_percentage
                            ).toFixed(2) + "% from last month"
                          : "No change data available"}
                      </span>
                    </div>
                  )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#445963]">Bounce Rate</p>
                    <p className="text-xl font-semibold text-[#092a38]">
                      {data.bounce_rate !== null
                        ? data.bounce_rate.toFixed(2) + "%"
                        : "N/A"}
                    </p>
                  </div>
                  <MousePointerClick className="h-8 w-8 text-[#156082]" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#445963]">Pages per Visit</p>
                    <p className="text-xl font-semibold text-[#092a38]">
                      {data.pages_per_visit !== null
                        ? data.pages_per_visit.toFixed(2)
                        : "N/A"}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#156082]"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                  </svg>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#445963]">
                      Avg. Visit Duration
                    </p>
                    <p className="text-xl font-semibold text-[#092a38]">
                      {formatDuration(data.average_visit_duration)}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-[#156082]" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Visits Chart */}
            <div className="bg-[#eff2f3] rounded-lg p-4">
              <h3 className="text-base font-semibold text-[#092a38] mb-4">
                Monthly Visits Trend
              </h3>
              {data.visits_by_month && data.visits_by_month.length > 0 ? (
                <div className="h-64">
                  <BarChart
                    data={{
                      labels: data.visits_by_month
                        .filter(
                          (item) =>
                            item.total_website_visits !== null &&
                            item.date !== null
                        )
                        .slice(0, 6)
                        .map((item) => formatMonth(item.date))
                        .reverse(),
                      values: data.visits_by_month
                        .filter(
                          (item) =>
                            item.total_website_visits !== null &&
                            item.date !== null
                        )
                        .slice(0, 6)
                        .map((item) => item.total_website_visits || 0)
                        .reverse(),
                    }}
                    color="#156082"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">
                    No monthly visit data available
                  </p>
                </div>
              )}
            </div>

            {/* Traffic by Country */}
            <div className="bg-[#eff2f3] rounded-lg p-4">
              <h3 className="text-base font-semibold text-[#092a38] mb-4">
                Traffic by Country
              </h3>
              {data.visits_by_country && data.visits_by_country.length > 0 ? (
                <div className="space-y-4">
                  {data.visits_by_country.map((country, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#35454c]">
                          {country.country || "Unknown"}
                        </span>
                        <div className="flex items-center">
                          <span className="text-[#092a38] mr-2">
                            {safePercentage(country.percentage)}
                          </span>
                          {country.percentage_monthly_change !== null && (
                            <span
                              className={getChangeColor(
                                country.percentage_monthly_change
                              )}
                            >
                              {getChangeIcon(country.percentage_monthly_change)}
                              {country.percentage_monthly_change !== null
                                ? Math.abs(
                                    country.percentage_monthly_change
                                  ).toFixed(2) + "%"
                                : ""}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-[#ced7db] rounded-full h-2">
                        <div
                          className="bg-[#156082] h-2 rounded-full"
                          style={{ width: safeWidth(country.percentage) }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">No country data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Traffic Change Analysis */}
          {data.visits_change ? (
            <div className="hidden bg-[#eff2f3] rounded-lg p-2">
              <h3 className="text-base font-semibold text-[#092a38] mb-4">
                Traffic Change Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-[#445963]">Monthly Change</p>
                  <p className="text-xl font-semibold text-[#092a38]">
                    {formatNumber(data.visits_change.change_monthly)}
                  </p>
                  {data.visits_change.change_monthly_percentage !== null && (
                    <div className="mt-2 flex items-center text-xs">
                      <span
                        className={getChangeColor(
                          data.visits_change.change_monthly_percentage
                        )}
                      >
                        {getChangeIcon(
                          data.visits_change.change_monthly_percentage
                        )}
                      </span>
                      <span
                        className={`ml-1 ${getChangeColor(
                          data.visits_change.change_monthly_percentage
                        )}`}
                      >
                        {data.visits_change.change_monthly_percentage !== null
                          ? Math.abs(
                              data.visits_change.change_monthly_percentage
                            ).toFixed(2) + "%"
                          : "N/A"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-[#445963]">Quarterly Change</p>
                  <p className="text-xl font-semibold text-[#092a38]">
                    {formatNumber(data.visits_change.change_quarterly)}
                  </p>
                  {data.visits_change.change_quarterly_percentage !== null && (
                    <div className="mt-2 flex items-center text-xs">
                      <span
                        className={getChangeColor(
                          data.visits_change.change_quarterly_percentage
                        )}
                      >
                        {getChangeIcon(
                          data.visits_change.change_quarterly_percentage
                        )}
                      </span>
                      <span
                        className={`ml-1 ${getChangeColor(
                          data.visits_change.change_quarterly_percentage
                        )}`}
                      >
                        {data.visits_change.change_quarterly_percentage !== null
                          ? Math.abs(
                              data.visits_change.change_quarterly_percentage
                            ).toFixed(2) + "%"
                          : "N/A"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-[#445963]">Yearly Change</p>
                  <p className="text-xl font-semibold text-[#092a38]">
                    {formatNumber(data.visits_change.change_yearly)}
                  </p>
                  {data.visits_change.change_yearly_percentage !== null && (
                    <div className="mt-2 flex items-center text-xs">
                      <span
                        className={getChangeColor(
                          data.visits_change.change_yearly_percentage
                        )}
                      >
                        {getChangeIcon(
                          data.visits_change.change_yearly_percentage
                        )}
                      </span>
                      <span
                        className={`ml-1 ${getChangeColor(
                          data.visits_change.change_yearly_percentage
                        )}`}
                      >
                        {data.visits_change.change_yearly_percentage !== null
                          ? Math.abs(
                              data.visits_change.change_yearly_percentage
                            ).toFixed(2) + "%"
                          : "N/A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#eff2f3] rounded-lg p-4">
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">
                  No traffic change data available
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
