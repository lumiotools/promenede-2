"use client";

import { useState, useEffect } from "react";
import { PencilIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type {
  CompetitiveAnalysis,
  LandscapeCompetitor,
} from "@/types/competitor";

// Extended landscape competitor with additional fields
interface ExtendedLandscapeCompetitor extends LandscapeCompetitor {
  description?: string;
  year?: string;
  ceo?: string;
  hqLocation?: string;
  employees?: number;
  revenue?: number;
}

// Helper function to format numbers
const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "N/A";
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// Default state for the component
const defaultState: CompetitiveAnalysis = {
  landscape: [],
  competitors: [],
  competitors_websites: [],
  financial_comparables: [],
  peer_developments: null,
};

type CompetitiveLandscapeProps = {
  initialData?: CompetitiveAnalysis;
};

export default function CompetitiveLandscapePage({
  initialData = defaultState,
}: CompetitiveLandscapeProps) {
  // Ensure landscape exists and is an array
  const safeLandscape = initialData?.landscape || [];

  // Initialize with extended data
  const getExtendedData = (
    landscapeData: LandscapeCompetitor[]
  ): ExtendedLandscapeCompetitor[] => {
    return landscapeData.map((competitor) => ({
      ...competitor,
      description: "Technology company specializing in hardware and software",
      year: "1993",
      ceo: "N/A",
      hqLocation: "N/A",
      employees: Math.floor(Math.random() * 50000) + 1000, // Random number for demonstration
      revenue: Math.floor(Math.random() * 10000000000) + 1000000, // Random revenue for demonstration
    }));
  };

  const [data, setData] = useState<ExtendedLandscapeCompetitor[]>(
    getExtendedData(safeLandscape)
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<ExtendedLandscapeCompetitor[]>(
    getExtendedData(safeLandscape)
  );
  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Crunchbase"
  );

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    console.log("competitive landscape initialData update:", initialData);

    // Ensure landscape exists and is an array
    const updatedLandscape = initialData.landscape || [];

    // Update the state with the new extended data
    const extendedData = getExtendedData(updatedLandscape);
    setData(extendedData);

    // If we're not in edit mode, also update the edit data
    if (!isEditing) {
      setEditData(extendedData);
    }
  }, [initialData, isEditing]);

  const startEditing = (): void => {
    setIsEditing(true);
    // Create a deep copy to avoid reference issues
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    // Create UserAttachment entity
    const userAttachment = {
      name: "competitive-landscape-page-x6JnB7OLREUiIol3ELdhIwXI40M3Xw.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/competitive-landscape-page-x6JnB7OLREUiIol3ELdhIwXI40M3Xw.tsx",
    };

    console.log("Creating UserAttachment:", userAttachment);
    setData(editData);
    setIsEditing(false);

    // Update the source text to include the user
    setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update");
  };

  const updateCompetitor = (
    index: number,
    field: keyof ExtendedLandscapeCompetitor,
    value: string | number
  ): void => {
    const newData = [...editData];

    // Handle numeric fields
    if (
      field === "similarity_score" ||
      field === "monthly_visits" ||
      field === "rank_category" ||
      field === "employees" ||
      field === "revenue"
    ) {
      newData[index][field] = Number(value);
    } else {
      // Handle string fields
      newData[index][field] = value as never;
    }

    setEditData(newData);
  };

  const addCompetitor = (): void => {
    const newData = [...editData];
    newData.push({
      name: "New Company",
      similarity_score: 0,
      website: "example.com",
      monthly_visits: 0,
      rank_category: 0,
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

  // Only display top 5 competitors
  const displayCompetitors = isEditing
    ? editData.slice(0, 5)
    : data.slice(0, 5);

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-8 bg-white"
      style={{ minHeight: "100%", aspectRatio: "16/9" }}
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-gray-700 text-2xl font-normal">
          Competitive Landscape
        </h1>
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={cancelEditing}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 mb-2"></div>

      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h2 className="text-gray-700 text-xl font-medium">
            Competitive Landscape
          </h2>
          {isEditing && (
            <button
              onClick={addCompetitor}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Company
            </button>
          )}
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-white">
              <th className="p-3 text-left font-medium border-b border-gray-200">
                Name
              </th>
              <th className="p-3 text-left font-medium border-b border-gray-200">
                Description
              </th>
              <th className="p-3 text-left font-medium border-b border-gray-200">
                Employees
              </th>
              <th className="p-3 text-left font-medium border-b border-gray-200">
                Revenue
              </th>
              <th className="p-3 text-left font-medium border-b border-gray-200">
                Year
              </th>
              {isEditing && (
                <th className="p-3 text-center font-medium border-b border-gray-200 w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayCompetitors.length === 0 ? (
              <tr>
                <td
                  colSpan={isEditing ? 5 : 4}
                  className="p-3 text-center text-gray-500"
                >
                  No companies available
                </td>
              </tr>
            ) : (
              displayCompetitors.map((competitor, index) => (
                <tr key={index} className="border-t border-gray-200">
                  {isEditing ? (
                    <>
                      <td className="p-3">
                        <input
                          type="text"
                          value={competitor.name || ""}
                          onChange={(e) =>
                            updateCompetitor(index, "name", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={competitor.description || ""}
                          onChange={(e) =>
                            updateCompetitor(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={competitor.employees || 0}
                          onChange={(e) =>
                            updateCompetitor(index, "employees", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={competitor.revenue || 0}
                          onChange={(e) =>
                            updateCompetitor(index, "revenue", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeCompetitor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{competitor.name || "N/A"}</td>
                      <td className="p-3">{competitor.description || "N/A"}</td>
                      <td className="p-3">
                        {formatNumber(competitor.employees)}
                      </td>
                      <td className="p-3">
                        {formatNumber(competitor.revenue)}
                      </td>
                      <td className="p-3">{competitor.year} </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-gray-500 text-sm">{sourceText}</div>
    </div>
  );
}
