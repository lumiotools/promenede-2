"use client";

import { useState } from "react";
import { competitiveAnalysis as initialData } from "./competitorData";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { LandscapeCompetitor } from "@/types/competitor";

// Helper function to format numbers
const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "N/A";
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// Extended landscape competitor with additional fields
interface ExtendedLandscapeCompetitor extends LandscapeCompetitor {
  description?: string;
  year?: string;
  ceo?: string;
  hqLocation?: string;
  employees?: number; // Changed to number to use formatNumber
  revenue?: number; // Added revenue field to demonstrate formatNumber
}

export default function CompetitiveLandscapePage() {
  // Initialize with extended data
  const extendedInitialData: ExtendedLandscapeCompetitor[] =
    initialData.landscape.map((competitor) => ({
      ...competitor,
      description: "Technology company specializing in hardware and software",
      year: "1993",
      ceo: "N/A",
      hqLocation: "N/A",
      employees: Math.floor(Math.random() * 50000) + 1000, // Random number for demonstration
      revenue: Math.floor(Math.random() * 10000000000) + 1000000, // Random revenue for demonstration
    }));

  const [data, setData] =
    useState<ExtendedLandscapeCompetitor[]>(extendedInitialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] =
    useState<ExtendedLandscapeCompetitor[]>(extendedInitialData);

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

  const updateCompetitor = (
    index: number,
    field: keyof ExtendedLandscapeCompetitor,
    value: string | number
  ): void => {
    const newData = [...editData];
    if (
      field === "similarityScore" ||
      field === "monthlyVisits" ||
      field === "rankCategory" ||
      field === "employees" ||
      field === "revenue"
    ) {
      newData[index][field] = Number(value);
    } else {
      newData[index][field as keyof ExtendedLandscapeCompetitor] =
        value as never;
    }
    setEditData(newData);
  };

  const addCompetitor = (): void => {
    const newData = [...editData];
    newData.push({
      name: "New Company",
      similarityScore: 0,
      website: "example.com",
      monthlyVisits: 0,
      rankCategory: 0,
      description: "Technology company",
      year: "2000",
      ceo: "N/A",
      hqLocation: "N/A",
      employees: 0,
      revenue: 0,
    });
    setEditData(newData);
  };

  const removeCompetitor = (index: number): void => {
    const newData = [...editData];
    newData.splice(index, 1);
    setEditData(newData);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">
          Competitive Landscape
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
          <h2 className="text-[#445963] text-xl font-medium">
            Competitive Landscape
          </h2>
          {isEditing && (
            <Button
              onClick={addCompetitor}
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
                <th className="p-4 text-left font-medium text-lg">Name</th>
                <th className="p-4 text-left font-medium text-lg">
                  Description
                </th>
                <th className="p-4 text-left font-medium text-lg">Year</th>
                <th className="p-4 text-left font-medium text-lg">CEO</th>
                <th className="p-4 text-left font-medium text-lg">
                  HQ Location
                </th>
                <th className="p-4 text-left font-medium text-lg">Employees</th>
                <th className="p-4 text-left font-medium text-lg">Revenue</th>
                <th className="p-4 text-left font-medium text-lg">
                  Monthly Visits
                </th>
                {isEditing && (
                  <th className="p-4 text-left font-medium text-lg">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && !isEditing ? (
                <tr className="border-t border-[#ced7db]">
                  <td
                    colSpan={isEditing ? 9 : 8}
                    className="p-4 text-center text-[#57727e]"
                  >
                    No companies available
                  </td>
                </tr>
              ) : isEditing ? (
                editData.map((competitor, index) => (
                  <tr key={index} className="border-t border-[#ced7db]">
                    <td className="p-4 border-r border-[#ced7db]">
                      <input
                        type="text"
                        value={competitor.name}
                        onChange={(e) =>
                          updateCompetitor(index, "name", e.target.value)
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4 border-r border-[#ced7db]">
                      <input
                        type="text"
                        value={competitor.description || ""}
                        onChange={(e) =>
                          updateCompetitor(index, "description", e.target.value)
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4 border-r border-[#ced7db]">
                      <input
                        type="text"
                        value={competitor.year || ""}
                        onChange={(e) =>
                          updateCompetitor(index, "year", e.target.value)
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4 border-r border-[#ced7db]">
                      <input
                        type="text"
                        value={competitor.ceo || ""}
                        onChange={(e) =>
                          updateCompetitor(index, "ceo", e.target.value)
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4 border-r border-[#ced7db]">
                      <input
                        type="text"
                        value={competitor.hqLocation || ""}
                        onChange={(e) =>
                          updateCompetitor(index, "hqLocation", e.target.value)
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4 border-r border-[#ced7db]">
                      <input
                        type="number"
                        value={competitor.employees || 0}
                        onChange={(e) =>
                          updateCompetitor(index, "employees", e.target.value)
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4 border-r border-[#ced7db]">
                      <input
                        type="number"
                        value={competitor.revenue || 0}
                        onChange={(e) =>
                          updateCompetitor(index, "revenue", e.target.value)
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4 border-r border-[#ced7db]">
                      <input
                        type="number"
                        value={competitor.monthlyVisits || 0}
                        onChange={(e) =>
                          updateCompetitor(
                            index,
                            "monthlyVisits",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => removeCompetitor(index)}
                        className="text-[#445963] hover:text-red-500"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                data.map((competitor, index) => (
                  <tr key={index} className="border-t border-[#ced7db]">
                    <td className="p-4 border-r border-[#ced7db] text-[#35454c]">
                      {competitor.name || "N/A"}
                    </td>
                    <td className="p-4 border-r border-[#ced7db] text-[#35454c]">
                      {competitor.description || "N/A"}
                    </td>
                    <td className="p-4 border-r border-[#ced7db] text-[#35454c]">
                      {competitor.year || "N/A"}
                    </td>
                    <td className="p-4 border-r border-[#ced7db] text-[#35454c]">
                      {competitor.ceo || "N/A"}
                    </td>
                    <td className="p-4 border-r border-[#ced7db] text-[#35454c]">
                      {competitor.hqLocation || "N/A"}
                    </td>
                    <td className="p-4 border-r border-[#ced7db] text-[#35454c]">
                      {formatNumber(competitor.employees)}
                    </td>
                    <td className="p-4 border-r border-[#ced7db] text-[#35454c]">
                      {formatNumber(competitor.revenue)}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {formatNumber(competitor.monthlyVisits)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
