"use client";

import { useState } from "react";
import { competitiveAnalysis as initialData } from "./competitorData";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { FinancialComparable } from "@/types/competitor";

// Helper function to format numbers
const formatNumber = (num: string | null | undefined): string => {
  if (num === null || num === undefined || num === "N/A") return "N/A";
  return num;
};

export default function FinancialComparablesPage() {
  const [data, setData] = useState<FinancialComparable[]>(
    initialData.financialComparables
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<FinancialComparable[]>(
    initialData.financialComparables
  );

  // Financial metrics to display
  const metrics = ["revenue", "profit", "employees"];

  const startEditing = (): void => {
    setIsEditing(true);
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
    newData[index].similarityScore = Number(value);
    setEditData(newData);
  };

  // Fixed code
  const updateFinancialData = (
    index: number,
    field: string,
    value: string
  ): void => {
    const newData = [...editData];
    // Fix the type assertion to specifically use the keys of financialData
    newData[index].financialData[
      field as keyof FinancialComparable["financialData"]
    ] = value;
    setEditData(newData);
  };

  const addCompany = (): void => {
    const newData = [...editData];
    newData.push({
      name: "New Company",
      similarityScore: 0,
      financialData: {
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
          {company.name}
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
                  value={company.name}
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
                value={company.similarityScore}
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
            {editData.map((company, index) => (
              <td key={index} className="p-4 border-l border-[#ced7db]">
                <input
                  type="text"
                  value={
                    company.financialData[
                      metric as keyof typeof company.financialData
                    ]
                  }
                  onChange={(e) =>
                    updateFinancialData(index, metric, e.target.value)
                  }
                  className="w-full border border-[#ced7db] p-2 rounded text-center"
                />
              </td>
            ))}
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
              {company.similarityScore || "N/A"}
            </td>
          ))}
        </tr>
        {metrics.map((metric) => (
          <tr key={metric} className="border-t border-[#ced7db]">
            <td className="p-4 font-medium text-[#35454c] capitalize">
              {metric}
            </td>
            {data.map((company, index) => (
              <td
                key={index}
                className="p-4 text-center text-[#35454c] border-l border-[#ced7db]"
              >
                {formatNumber(
                  company.financialData[
                    metric as keyof typeof company.financialData
                  ]
                )}
              </td>
            ))}
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
