"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type { KeyFinancials, IncomeStatement } from "@/types/company";

interface FinancialSummaryDetailProps {
  initialData?: KeyFinancials | null;
}

// Helper function to format currency values
const formatCurrency = (value: number | null): string => {
  if (value === null) return "N/A";

  // Format large numbers in millions or billions
  if (Math.abs(value) >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else {
    return `$${value.toLocaleString()}`;
  }
};

// Helper function to format percentage values
const formatPercentage = (value: number | null): string => {
  if (value === null) return "N/A";
  return `${(value * 100).toFixed(2)}%`;
};

export function FinancialSummaryDetail({
  initialData,
}: FinancialSummaryDetailProps) {
  const [financialData, setFinancialData] = useState<KeyFinancials | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [periods, setPeriods] = useState<IncomeStatement[]>([]);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, Crunchbase"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (initialData) {
          setFinancialData(initialData);

          // Filter and sort the income statements
          // Filter by quarterly reports and exclude fiscal_year
          // Sort by date (newest first)
          if (initialData.income_statements) {
            const quarterlyStatements = initialData.income_statements
              .filter(
                (statement) =>
                  statement.period_type?.startsWith("q") &&
                  statement.period_type !== "fiscal_year"
              )
              .sort((a, b) => {
                // Sort by date (newest first)
                const dateA = a.period_end_date
                  ? new Date(a.period_end_date)
                  : new Date(0);
                const dateB = b.period_end_date
                  ? new Date(b.period_end_date)
                  : new Date(0);
                return dateB.getTime() - dateA.getTime();
              })
              .slice(0, 6); // Get the 6 most recent quarters

            setPeriods(quarterlyStatements);
          }
        }
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  if (loading) {
    return (
      <SectionLayout title="Financial Summary">
        <div className="p-4 text-center">Loading financial data...</div>
      </SectionLayout>
    );
  }

  if (
    !financialData ||
    !financialData.income_statements ||
    financialData.income_statements.length === 0
  ) {
    return (
      <SectionLayout title="Financial Summary">
        <div className="p-4 text-center">No financial data available.</div>
      </SectionLayout>
    );
  }

  // Define the metrics to display
  const metrics = [
    {
      name: "Revenue",
      getValue: (statement: IncomeStatement) => statement.revenue,
      format: formatCurrency,
    },
    {
      name: "Cost of Goods Sold (COGS)",
      getValue: (statement: IncomeStatement) => statement.cost_of_goods_sold,
      format: formatCurrency,
    },
    {
      name: "Gross Profit",
      getValue: (statement: IncomeStatement) => statement.gross_profit,
      format: formatCurrency,
    },
    {
      name: "Gross Profit Margin",
      getValue: (statement: IncomeStatement) => statement.gross_profit_margin,
      format: formatPercentage,
    },
    {
      name: "EBIT",
      getValue: (statement: IncomeStatement) => statement.ebit,
      format: formatCurrency,
    },
    {
      name: "EBIT Margin",
      getValue: (statement: IncomeStatement) => statement.ebit_margin,
      format: formatPercentage,
    },
    {
      name: "Net Income",
      getValue: (statement: IncomeStatement) => statement.net_income,
      format: formatCurrency,
    },
    {
      name: "Earnings Per Share (EPS)",
      getValue: (statement: IncomeStatement) => statement.earnings_per_share,
      format: (value: number | null) =>
        value === null ? "N/A" : `${value.toFixed(2)}`,
    },
    {
      name: "Interest Expense",
      getValue: (statement: IncomeStatement) => statement.interest_expense,
      format: formatCurrency,
    },
    {
      name: "Income Tax Expense",
      getValue: (statement: IncomeStatement) => statement.income_tax_expense,
      format: formatCurrency,
    },
  ];

  return (
    <SectionLayout
      title="Financial Summary"
      sourceText={"Source: Coresignal, Crunchbase"}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#002169] text-white">
              <th className="p-2 text-left font-medium text-sm">Metrics</th>
              {periods.map((period, index) => (
                <th key={index} className="p-2 text-right font-medium text-sm">
                  {period.period_display_end_date || `Period ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, rowIndex) => (
              <tr
                key={metric.name}
                className={rowIndex % 2 === 0 ? "bg-[#eff2f3]" : "bg-white"}
              >
                <td className="p-2 font-medium text-sm text-[#35454c]">
                  {metric.name}
                </td>
                {periods.map((period, colIndex) => (
                  <td
                    key={`${metric.name}-${colIndex}`}
                    className="p-2 text-right text-sm"
                  >
                    {metric.format(metric.getValue(period))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {periods.length > 0 && (
        <div className="mt-4 p-4 bg-[#eff2f3] rounded-md">
          <h3 className="font-medium text-[#35454c] text-lg mb-1 ">
            Latest Quarter Highlights
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-base text-[#445963]">Revenue</p>
              <p className="font-medium text-base text-[#002169]">
                {formatCurrency(periods[0].revenue)}
              </p>
            </div>
            <div>
              <p className="text-base text-[#445963]">Net Income</p>
              <p className="font-medium text-base text-[#002169]">
                {formatCurrency(periods[0].net_income)}
              </p>
            </div>
            <div>
              <p className="text-base text-[#445963]">EPS</p>
              <p className="font-medium text-base text-[#002169]">
                {periods[0].earnings_per_share
                  ? `${periods[0].earnings_per_share.toFixed(2)}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
