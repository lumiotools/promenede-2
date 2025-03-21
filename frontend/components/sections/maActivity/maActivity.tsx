"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Acquisition, MAActivity } from "@/types/maActivity";
import type React from "react";
import { useState, useEffect } from "react";

// Default state for the component
const defaultState: MAActivity = {
  acquisitions: [],
  acquired_by: null,
};

// Helper function to format currency values
const formatCurrency = (
  value: number | null | undefined,
  currency = "$"
): string => {
  if (value === null || value === undefined) return "N/A";

  if (value >= 1000000000) {
    return `${currency}${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${currency}${(value / 1000000).toFixed(1)}M`;
  } else {
    return `${currency}${value.toLocaleString()}`;
  }
};

// Helper to format dates
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "N/A";

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "N/A";
  }
};

type MaActivityProps = {
  initialData?: MAActivity;
};

// Extended acquisition type with additional fields for UI
interface ExtendedAcquisition extends Acquisition {
  description?: string;
  dealType?: string;
}

const MAStrategyPage: React.FC<MaActivityProps> = ({
  initialData = defaultState,
}: MaActivityProps) => {
  // Ensure acquisitions exists and is an array
  const safeAcquisitions = initialData?.acquisitions || [];

  // Initialize with extended data
  const getExtendedData = (
    acquisitionsData: Acquisition[]
  ): ExtendedAcquisition[] => {
    return acquisitionsData.map((acquisition) => ({
      ...acquisition,
      description: "Technology company acquisition",
      dealType: "Acquisition",
    }));
  };

  const [data, setData] = useState<ExtendedAcquisition[]>(
    getExtendedData(safeAcquisitions)
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<ExtendedAcquisition[]>(
    getExtendedData(safeAcquisitions)
  );

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    console.log("M&A strategy initialData update:", initialData);

    // Ensure acquisitions exists and is an array
    const updatedAcquisitions = initialData.acquisitions || [];

    // Update the state with the new extended data
    const extendedData = getExtendedData(updatedAcquisitions);
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
    setData(editData);
    setIsEditing(false);
  };

  const updateAcquisition = (
    index: number,
    field: keyof ExtendedAcquisition,
    value: string | number
  ): void => {
    const newData = [...editData];

    // Handle property name mapping
    if (field === "acquiree_name") {
      newData[index].acquiree_name = value as string;
    } else if (field === "announced_date") {
      newData[index].announced_date = value as string;
    } else {
      // For other fields, directly update
      newData[index][field] = value as never; // Type assertion needed due to generic update
    }

    setEditData(newData);
  };

  const addAcquisition = (): void => {
    const newData = [...editData];
    newData.push({
      acquiree_name: "New Company",
      announced_date: new Date().toISOString().split("T")[0],
      price: 0,
      currency: "$",
      description: "New acquisition",
      dealType: "Acquisition",
    });
    setEditData(newData);
  };

  const removeAcquisition = (index: number): void => {
    const newData = [...editData];
    newData.splice(index, 1);
    setEditData(newData);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-gray-700 text-5xl font-normal">M&A Strategy</h1>
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save
            </button>
            <button
              onClick={cancelEditing}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 mb-8"></div>

      <p className="text-lg text-gray-600 mb-10">
        Automation Anywhere has made strategic acquisitions...
      </p>

      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-gray-700 text-xl font-medium">
            Acquisition History
          </h2>
          {isEditing && (
            <button
              onClick={addAcquisition}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Acquisition
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-4 text-left font-medium">Logo</th>
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Deal Date</th>
                <th className="p-4 text-left font-medium">Deal Value</th>
                {isEditing && (
                  <th className="p-4 text-center font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && !isEditing ? (
                <tr className="border-t border-gray-300">
                  <td
                    colSpan={isEditing ? 7 : 6}
                    className="p-4 text-center text-gray-500"
                  >
                    No acquisitions available
                  </td>
                </tr>
              ) : isEditing ? (
                editData.map((acquisition, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-4 border-r border-gray-300">
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                        <span className="text-xs text-gray-500">Logo</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-gray-300">
                      <input
                        type="text"
                        value={acquisition.acquiree_name || ""}
                        onChange={(e) =>
                          updateAcquisition(
                            index,
                            "acquiree_name",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </td>

                    <td className="p-4 border-r border-gray-300">
                      <input
                        type="date"
                        value={acquisition.announced_date || ""}
                        onChange={(e) =>
                          updateAcquisition(
                            index,
                            "announced_date",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </td>
                    <td className="p-4 border-r border-gray-300">
                      <div className="flex items-center">
                        <select
                          value={acquisition.currency || "$"}
                          onChange={(e) =>
                            updateAcquisition(index, "currency", e.target.value)
                          }
                          className="border border-gray-300 p-2 rounded mr-2 w-16"
                        >
                          <option value="$">$</option>
                          <option value="€">€</option>
                          <option value="£">£</option>
                          <option value="¥">¥</option>
                        </select>
                        <input
                          type="number"
                          value={acquisition.price || 0}
                          onChange={(e) =>
                            updateAcquisition(
                              index,
                              "price",
                              Number.parseFloat(e.target.value)
                            )
                          }
                          className="flex-1 border border-gray-300 p-2 rounded"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => removeAcquisition(index)}
                        className="text-gray-700 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                data.map((acquisition, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-4 border-r border-gray-300">
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                        <span className="text-xs text-gray-500">Logo</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-gray-300 text-gray-700">
                      {acquisition.acquiree_name || "N/A"}
                    </td>

                    <td className="p-4 border-r border-gray-300 text-gray-700">
                      {formatDate(acquisition.announced_date)}
                    </td>
                    <td className="p-4 text-gray-700">
                      {formatCurrency(
                        acquisition.price,
                        acquisition.currency || "N/A"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-gray-500 text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
};

export default MAStrategyPage;
