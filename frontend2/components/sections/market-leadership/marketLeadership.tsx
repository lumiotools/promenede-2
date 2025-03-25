"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { MarketLeadership } from "@/types/market_leadership";
import { PencilIcon, PlusIcon, XIcon } from "lucide-react";
import { SectionLayout } from "@/components/ui/section-layout";

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
  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Crunchbase"
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
    // Create UserAttachment entity
    const userAttachment = {
      name: "market-leadership-page-rfIK0zPoqztIbqDKai2QIJFCnsyyM7.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/market-leadership-page-rfIK0zPoqztIbqDKai2QIJFCnsyyM7.tsx",
    };

    console.log("Creating UserAttachment:", userAttachment);
    setData(editData);
    setIsEditing(false);

    // Update the source text to include the user
    setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update");
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

  // Limit to top 3 items
  const limitedData = displayData.slice(0, 3);

  return (
    <SectionLayout
      title="Market Leadership and Industry Recognition"
      sourceText={sourceText}
    >
      {!isEditing ? (
        <button
          onClick={startEditing}
          className="hidden bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
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

      {limitedData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No market leadership data available.
          {isEditing && (
            <div className="mt-4">
              <button
                onClick={addAward}
                className="text-blue-700 hover:text-blue-900 flex items-center mx-auto"
              >
                <PlusIcon className="h-6 w-6 mr-2" />
                Add Award
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {limitedData.map((item, index) => (
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
                  <XIcon className="h-5 w-5" />
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
                <PlusIcon className="h-6 w-6 mr-2" />
                Add Award
              </button>
            </div>
          )}
        </div>
      )}
    </SectionLayout>
  );
};

export default MarketLeadershipPage;
