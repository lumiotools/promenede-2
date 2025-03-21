"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import { CompetitiveAnalysis, FinancialComparable } from "@/types/competitor";

// Helper function to format numbers
const formatNumber = (num: string | null | undefined): string => {
  if (num === null || num === undefined || num === "N/A") return "N/A";
  return num;
};

// Default state for the component
const defaultState: CompetitiveAnalysis = {
  landscape: [],
  competitors: [],
  competitors_websites: [],
  financial_comparables: [],
  peer_developments: null,
};

type FinancialComparablesProps = {
  initialData?: CompetitiveAnalysis;
};

export default function FinancialComparablesPage({
  initialData = defaultState,
}: FinancialComparablesProps) {
  // Ensure financial_comparables exists and is an array
  const safeFinancialComparables = initialData?.financial_comparables || [];

  const [data, setData] = useState<FinancialComparable[]>(
    safeFinancialComparables
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<FinancialComparable[]>(
    safeFinancialComparables
  );

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    console.log("financial comparables initialData update:", initialData);

    // Ensure financial_comparables exists and is an array
    const updatedFinancialComparables = initialData.financial_comparables || [];

    // Update the state with the new data
    setData(updatedFinancialComparables);
  }, [initialData]);

  // Financial metrics to display
  const metrics = ["revenue", "profit", "employees"];

  const startEditing = (): void => {
    setIsEditing(true);
    // Create a deep copy to avoid reference issues
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    setData(editData);
    setIsEditing(false);
  };

  const updateCompanyName = (index: number, value: string): void => {
    const newData = [...editData];
    newData[index].name = value;
    setEditData(newData);
  };

  const updateSimilarityScore = (index: number, value: string): void => {
    const newData = [...editData];
    newData[index].similarity_score = Number(value);
    setEditData(newData);
  };

  const updateFinancialData = (
    index: number,
    field: string,
    value: string
  ): void => {
    const newData = [...editData];

    // Ensure financial_data exists
    if (!newData[index].financial_data) {
      newData[index].financial_data = {
        revenue: null,
        profit: null,
        employees: null,
      };
    }

    // Update the field
    if (field === "revenue") {
      newData[index].financial_data.revenue = value;
    } else if (field === "profit") {
      newData[index].financial_data.profit = value;
    } else if (field === "employees") {
      newData[index].financial_data.employees = value;
    }

    setEditData(newData);
  };

  const addCompany = (): void => {
    const newData = [...editData];
    newData.push({
      name: "New Company",
      similarity_score: 0,
      financial_data: {
        revenue: "N/A",
        profit: "N/A",
        employees: "N/A",
      },
    });
    setEditData(newData);
  };

  const removeCompany = (index: number): void => {
    const newData = [...editData];
    newData.splice(index, 1);
    setEditData(newData);
  };

  // Render table headers for companies
  const renderTableHeaders = () => {
    if (data.length > 0) {
      return data.map((company, index) => (
        <th key={index} className="p-4 text-center font-medium text-lg">
          {company.name || "Unnamed Company"}
        </th>
      ));
    } else {
      return (
        <th className="p-4 text-center font-medium text-lg">
          No companies available
        </th>
      );
    }
  };

  // Render edit mode rows
  const renderEditRows = () => {
    return (
      <>
        <tr className="border-t border-[#ced7db]">
          <td className="p-4 font-medium text-[#35454c]">Company Name</td>
          {editData.map((company, index) => (
            <td key={index} className="p-4 border-l border-[#ced7db]">
              <div className="flex items-center justify-center">
                <input
                  type="text"
                  value={company.name || ""}
                  onChange={(e) => updateCompanyName(index, e.target.value)}
                  className="w-full border border-[#ced7db] p-2 rounded text-center"
                />
                <button
                  onClick={() => removeCompany(index)}
                  className="ml-2 text-[#445963] hover:text-red-500"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </td>
          ))}
        </tr>
        <tr className="border-t border-[#ced7db]">
          <td className="p-4 font-medium text-[#35454c]">Similarity Score</td>
          {editData.map((company, index) => (
            <td key={index} className="p-4 border-l border-[#ced7db]">
              <input
                type="number"
                value={company.similarity_score || 0}
                onChange={(e) => updateSimilarityScore(index, e.target.value)}
                className="w-full border border-[#ced7db] p-2 rounded text-center"
              />
            </td>
          ))}
        </tr>
        {metrics.map((metric) => (
          <tr key={metric} className="border-t border-[#ced7db]">
            <td className="p-4 font-medium text-[#35454c] capitalize">
              {metric}
            </td>
            {editData.map((company, index) => {
              // Safely access financial data
              const financialData = company.financial_data || {
                revenue: "N/A",
                profit: "N/A",
                employees: "N/A",
              };

              let value = "N/A";
              if (metric === "revenue") value = financialData.revenue || "N/A";
              if (metric === "profit") value = financialData.profit || "N/A";
              if (metric === "employees")
                value = financialData.employees || "N/A";

              return (
                <td key={index} className="p-4 border-l border-[#ced7db]">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      updateFinancialData(index, metric, e.target.value)
                    }
                    className="w-full border border-[#ced7db] p-2 rounded text-center"
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </>
    );
  };

  // Render view mode rows
  const renderViewRows = () => {
    return (
      <>
        <tr className="border-t border-[#ced7db]">
          <td className="p-4 font-medium text-[#35454c]">Similarity Score</td>
          {data.map((company, index) => (
            <td
              key={index}
              className="p-4 text-center text-[#35454c] border-l border-[#ced7db]"
            >
              {company.similarity_score || "N/A"}
            </td>
          ))}
        </tr>
        {metrics.map((metric) => (
          <tr key={metric} className="border-t border-[#ced7db]">
            <td className="p-4 font-medium text-[#35454c] capitalize">
              {metric}
            </td>
            {data.map((company, index) => {
              // Safely access financial data
              const financialData = company.financial_data || {
                revenue: "N/A",
                profit: "N/A",
                employees: "N/A",
              };

              let value = "N/A";
              if (metric === "revenue") value = financialData.revenue || "N/A";
              if (metric === "profit") value = financialData.profit || "N/A";
              if (metric === "employees")
                value = financialData.employees || "N/A";

              return (
                <td
                  key={index}
                  className="p-4 text-center text-[#35454c] border-l border-[#ced7db]"
                >
                  {formatNumber(value)}
                </td>
              );
            })}
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">
          Financial Comparables
        </h1>
        {!isEditing ? (
          <Button
            onClick={startEditing}
            className="bg-[#156082] hover:bg-[#092a38] text-white"
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={saveChanges}
              className="bg-[#156082] hover:bg-[#092a38] text-white"
            >
              <SaveIcon className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button
              onClick={cancelEditing}
              variant="outline"
              className="border-[#ced7db] text-[#445963]"
            >
              <XIcon className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        )}
      </div>
      <div className="border-t border-[#ced7db] mb-12"></div>

      <div className="border border-[#ced7db] rounded-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[#ced7db]">
          <h2 className="text-[#445963] text-xl font-medium">Comparison</h2>
          {isEditing && (
            <Button
              onClick={addCompany}
              size="sm"
              className="bg-[#156082] hover:bg-[#092a38] text-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Company
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="p-4 text-left font-medium text-lg">
                  FY&apos;XX, USDm
                </th>
                {renderTableHeaders()}
              </tr>
            </thead>
            <tbody>{isEditing ? renderEditRows() : renderViewRows()}</tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
