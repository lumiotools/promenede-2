"use client";

import { useState, useEffect } from "react";
import { Edit, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FinancialSummaryDetailProps {
  initialData?: KeyFinancials | null;
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { KeyFinancials } from "@/types/company";

export function formatCurrency(value: number): string {
  // Format large numbers in millions or billions
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else {
    return `$${value.toLocaleString()}`;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function FinancialSummaryDetail({
  initialData,
}: FinancialSummaryDetailProps) {
  const [financialData, setFinancialData] = useState<KeyFinancials | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [periods, setPeriods] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API fetch - in real app, replace with actual API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch from API
        // const response = await fetch('/api/financial-data');
        // const data = await response.json();

        // For now, use the initialData
        setFinancialData(initialData || null);

        // Extract periods from income statements for table headers
        if (initialData?.income_statements) {
          const uniquePeriods = initialData.income_statements
            .filter(
              (statement) =>
                statement.period_type === "q1" ||
                statement.period_type === "q2" ||
                statement.period_type === "q3"
            )
            .slice(0, 6) // Limit to 6 most recent quarters
            .map((statement) => statement.period_display_end_date || "")
            .filter(Boolean)
            .reverse(); // Most recent first

          setPeriods(uniquePeriods);
        }
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  const handleEdit = (category: string) => {
    setEditMode(true);
    setEditingRow(category);

    // Initialize edit values based on current data
    const newEditValues: Record<string, string> = {};

    if (category === "Revenue" && financialData?.operating_revenue) {
      financialData.operating_revenue.forEach((item, index) => {
        if (item.value !== null && periods[index]) {
          newEditValues[periods[index]] = item.value.toString();
        }
      });
    } else if (category === "Net Income" && financialData?.net_income) {
      financialData.net_income.forEach((item, index) => {
        if (item.value !== null && periods[index]) {
          newEditValues[periods[index]] = item.value.toString();
        }
      });
    } else if (
      category === "Operating Profit" &&
      financialData?.operating_profit
    ) {
      financialData.operating_profit.forEach((item, index) => {
        if (item.value !== null && periods[index]) {
          newEditValues[periods[index]] = item.value.toString();
        }
      });
    }

    setEditValues(newEditValues);
  };

  const handleSave = () => {
    // Here you would typically send the updated data to your API
    console.log("Saving changes:", editValues);

    // Update local state (in a real app, this would happen after API success)
    if (editingRow === "Revenue" && financialData) {
      const updatedRevenue = [...(financialData.operating_revenue || [])];
      periods.forEach((period, index) => {
        if (updatedRevenue[index] && editValues[period]) {
          updatedRevenue[index] = {
            ...updatedRevenue[index],
            value: Number.parseFloat(editValues[period]),
          };
        }
      });

      setFinancialData({
        ...financialData,
        operating_revenue: updatedRevenue,
      });
    }

    // Similar updates for other categories would go here

    setEditMode(false);
    setEditingRow(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditingRow(null);
    setEditValues({});
  };

  const handleInputChange = (period: string, value: string) => {
    setEditValues({
      ...editValues,
      [period]: value,
    });
  };

  const handleAddRow = () => {
    // Implementation for adding a new row would go here
    console.log("Adding new row");
    // This would typically open a modal or form to add a new financial metric
  };

  if (loading) {
    return <div className="p-4 text-center">Loading financial data...</div>;
  }

  if (!financialData) {
    return <div className="p-4 text-center">No financial data available.</div>;
  }

  // Extract the financial metrics we want to display
  const metrics = [
    {
      category: "Revenue",
      data: financialData.operating_revenue || [],
      getValue: (index: number) =>
        financialData.operating_revenue?.[index]?.value,
    },
    {
      category: "Operating Profit",
      data: financialData.operating_profit || [],
      getValue: (index: number) =>
        financialData.operating_profit?.[index]?.value,
    },
    {
      category: "Net Income",
      data: financialData.net_income || [],
      getValue: (index: number) => financialData.net_income?.[index]?.value,
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#35454c]">
          Financial Summary
        </h2>
        <Button
          onClick={handleAddRow}
          variant="outline"
          className="flex items-center gap-1 border-[#002169] text-[#002169]"
        >
          <Plus size={16} />
          Add Row
        </Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#002169] text-white">
            <th className="p-3 text-left font-semibold">Category</th>
            {periods.map((period) => (
              <th key={period} className="p-3 text-right font-semibold">
                {period}
              </th>
            ))}
            <th className="p-3 text-center w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, rowIndex) => (
            <tr
              key={metric.category}
              className={rowIndex % 2 === 0 ? "bg-[#eff2f3]" : "bg-white"}
            >
              <td className="p-3 font-medium text-[#35454c]">
                {metric.category}
              </td>

              {periods.map((period, colIndex) => (
                <td
                  key={`${metric.category}-${period}`}
                  className="p-3 text-right"
                >
                  {editMode && editingRow === metric.category ? (
                    <Input
                      type="text"
                      value={editValues[period] || ""}
                      onChange={(e) =>
                        handleInputChange(period, e.target.value)
                      }
                      className="w-full text-right"
                    />
                  ) : (
                    formatCurrency(metric.getValue(colIndex) || 0)
                  )}
                </td>
              ))}

              <td className="p-3 text-center">
                {editMode && editingRow === metric.category ? (
                  <div className="flex justify-center gap-1">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Save size={16} className="text-green-600" />
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <X size={16} className="text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleEdit(metric.category)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <Edit size={16} className="text-[#002169]" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {financialData.per && (
        <div className="mt-6 p-4 bg-[#eff2f3] rounded-md">
          <h3 className="font-medium text-[#35454c] mb-2">
            Price-to-Earnings Ratio
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-[#445963]">P/E Ratio</p>
              <p className="font-semibold text-[#002169]">
                {financialData.per.value?.toFixed(2) || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#445963]">Closing Price</p>
              <p className="font-semibold text-[#002169]">
                ${financialData.per.closing_price?.toFixed(2) || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#445963]">EPS</p>
              <p className="font-semibold text-[#002169]">
                ${financialData.per.eps?.toFixed(2) || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
