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

// Helper function to format period display dates
const formatPeriodDisplayDate = (statement: IncomeStatement): string => {
  if (!statement.period_display_end_date) return "N/A";

  // Extract year from the period_end_date
  const year = statement.period_end_date
    ? new Date(statement.period_end_date).getFullYear().toString().slice(-2)
    : "";

  if (statement.period_type === "fiscal_year") {
    return `FY${year}`;
  } else if (statement.period_type?.startsWith("q")) {
    // Extract quarter number
    const quarter = statement.period_type.charAt(1);
    return `Q${quarter}-${year}`;
  }

  return statement.period_display_end_date;
};

export function FinancialSummaryDetail({
  initialData,
}: FinancialSummaryDetailProps) {
  const [financialData, setFinancialData] = useState<KeyFinancials | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [periodsToShow, setPeriodsToShow] = useState<IncomeStatement[]>([]);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, Crunchbase"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (initialData) {
          setFinancialData(initialData);

          if (initialData.income_statements) {
            // Get all fiscal years
            const fiscalYears = initialData.income_statements
              .filter((statement) => statement.period_type === "fiscal_year")
              .sort((a, b) => {
                const dateA = a.period_end_date
                  ? new Date(a.period_end_date)
                  : new Date(0);
                const dateB = b.period_end_date
                  ? new Date(b.period_end_date)
                  : new Date(0);
                return dateA.getTime() - dateB.getTime();
              });

            // Get quarterly statements (excluding fiscal years)
            const quarterlyStatements = initialData.income_statements
              .filter((statement) => statement.period_type?.startsWith("q"))
              .sort((a, b) => {
                const dateA = a.period_end_date
                  ? new Date(a.period_end_date)
                  : new Date(0);
                const dateB = b.period_end_date
                  ? new Date(b.period_end_date)
                  : new Date(0);
                return dateA.getTime() - dateB.getTime();
              })
              .slice(0, 6); // Get the 6 most recent quarters

            // Combine both arrays with quarterly statements first, then fiscal years
            const allPeriods = [...quarterlyStatements, ...fiscalYears];

            // Sort the combined array from oldest to newest
            allPeriods.sort((a, b) => {
              const dateA = a.period_end_date
                ? new Date(a.period_end_date)
                : new Date(0);
              const dateB = b.period_end_date
                ? new Date(b.period_end_date)
                : new Date(0);
              return dateA.getTime() - dateB.getTime();
            });

            setPeriodsToShow(allPeriods);
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

  // Get the latest quarter for highlights (excluding fiscal year)
  const latestQuarter = periodsToShow
    .filter((p) => p.period_type?.startsWith("q"))
    .sort((a, b) => {
      const dateA = a.period_end_date
        ? new Date(a.period_end_date)
        : new Date(0);
      const dateB = b.period_end_date
        ? new Date(b.period_end_date)
        : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })[0];

  return (
    <SectionLayout title="Financial Summary" sourceText={sourceText}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#002169] text-white">
              <th className="p-2 text-left font-medium text-sm">Metrics</th>
              {periodsToShow.map((period, index) => (
                <th key={index} className="p-2 text-right font-medium text-sm">
                  {formatPeriodDisplayDate(period)}
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
                {periodsToShow.map((period, colIndex) => (
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

      {latestQuarter && (
        <div className="mt-4 p-4 bg-[#eff2f3] rounded-md">
          <h3 className="font-medium text-[#35454c] text-lg mb-1 ">
            Latest Quarter Highlights ({formatPeriodDisplayDate(latestQuarter)})
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-base text-[#445963]">Revenue</p>
              <p className="font-medium text-base text-[#002169]">
                {formatCurrency(latestQuarter.revenue)}
              </p>
            </div>
            <div>
              <p className="text-base text-[#445963]">Net Income</p>
              <p className="font-medium text-base text-[#002169]">
                {formatCurrency(latestQuarter.net_income)}
              </p>
            </div>
            <div>
              <p className="text-base text-[#445963]">EPS</p>
              <p className="font-medium text-base text-[#002169]">
                {latestQuarter.earnings_per_share
                  ? `${latestQuarter.earnings_per_share.toFixed(2)}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
