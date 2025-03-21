"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { MarketLeadership } from "@/types/market_leadership";

// Default state for the component
const defaultState: MarketLeadership = {
  industry: null,
  rank_category: null,
  rank_global: null,
};

// Award card component
type AwardCardProps = {
  data: MarketLeadership;
  isEditing: boolean;
  onUpdate: (updated: MarketLeadership) => void;
};

const AwardCard: React.FC<AwardCardProps> = ({ data, isEditing, onUpdate }) => {
  // Handle null values
  const rankCategory = data.rank_category !== null ? data.rank_category : "N/A";
  const rankGlobal = data.rank_global !== null ? data.rank_global : "N/A";

  // Handle form input changes
  const handleChange = (field: keyof MarketLeadership, value: string) => {
    const updated = { ...data };

    if (field === "industry") {
      updated.industry = value;
    } else {
      // Convert to number or null if empty
      const numValue = value === "" ? null : Number(value);
      if (field === "rank_category") {
        updated.rank_category = numValue;
      } else if (field === "rank_global") {
        updated.rank_global = numValue;
      }
    }

    onUpdate(updated);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {/* <h3 className="text-lg font-semibold text-center mb-4">G2 Award</h3> */}

      <div className="bg-gray-200 rounded-lg h-36 mb-4"></div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={data.industry || ""}
              onChange={(e) => handleChange("industry", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Rank
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={data.rank_category === null ? "" : data.rank_category}
              onChange={(e) => handleChange("rank_category", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Global Rank
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={data.rank_global === null ? "" : data.rank_global}
              onChange={(e) => handleChange("rank_global", e.target.value)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium">{data.industry || "N/A"}</p>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Category Rank</p>
            <p className="font-medium">{rankCategory}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Global Rank</p>
            <p className="font-medium">{rankGlobal}</p>
          </div>
        </>
      )}
    </div>
  );
};

type MarketLeadershipProps = {
  initialData?: MarketLeadership | MarketLeadership[];
};

const MarketLeadershipPage: React.FC<MarketLeadershipProps> = ({
  initialData = defaultState,
}: MarketLeadershipProps) => {
  // Convert initialData to array if it's a single object
  const getInitialDataArray = (
    data: MarketLeadership | MarketLeadership[]
  ): MarketLeadership[] => {
    if (Array.isArray(data)) {
      return data;
    }
    return [data];
  };

  const [data, setData] = useState<MarketLeadership[]>(
    getInitialDataArray(initialData)
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<MarketLeadership[]>(
    getInitialDataArray(initialData)
  );

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    console.log("market leadership initialData update:", initialData);

    // Convert initialData to array if it's a single object
    const updatedData = getInitialDataArray(initialData);

    // Update the state with the new data
    setData(updatedData);

    // If we're not in edit mode, also update the edit data
    if (!isEditing) {
      setEditData(updatedData);
    }
  }, [initialData, isEditing]);

  // Start editing
  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  // Cancel editing
  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  // Save changes
  const saveChanges = (): void => {
    setData(editData);
    setIsEditing(false);
  };

  // Update a specific award
  const updateAward = (index: number, updated: MarketLeadership): void => {
    const newEditData = [...editData];
    newEditData[index] = updated;
    setEditData(newEditData);
  };

  // Add new award
  const addAward = (): void => {
    const newAward: MarketLeadership = {
      industry: "New Industry",
      rank_category: null,
      rank_global: null,
    };

    setEditData([...editData, newAward]);
  };

  // Remove award
  const removeAward = (index: number): void => {
    const newEditData = [...editData];
    newEditData.splice(index, 1);
    setEditData(newEditData);
  };

  // Safely access data
  const displayData = isEditing ? editData : data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-gray-700 text-5xl font-normal">
          Market Leadership and Industry Recognition
        </h1>

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

      <div className="mb-8">
        <p className="text-lg">
          Company A has presence in the market with leading recognition in
          various industries.
        </p>
      </div>

      {displayData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No market leadership data available.
          {isEditing && (
            <div className="mt-4">
              <button
                onClick={addAward}
                className="text-blue-700 hover:text-blue-900 flex items-center mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Award
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayData.map((item, index) => (
            <div key={index} className="relative">
              <AwardCard
                data={item}
                isEditing={isEditing}
                onUpdate={(updated) => updateAward(index, updated)}
              />

              {isEditing && (
                <button
                  onClick={() => removeAward(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                  title="Remove award"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          ))}

          {isEditing && (
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <button
                onClick={addAward}
                className="text-blue-700 hover:text-blue-900 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Award
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-gray-500 text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
};

export default MarketLeadershipPage;
