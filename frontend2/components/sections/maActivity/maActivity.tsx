"use client";

import type { MAActivity, MADeals } from "@/types/maActivity";
import type React from "react";
import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, XIcon, Trash2Icon } from "lucide-react";
import { SectionLayout } from "@/components/ui/section-layout";

// Default state for the component
const defaultState: MAActivity = {
  acquisitions: [],
  acquired_by: null,
  ma_deals: [],
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

const MAStrategyPage: React.FC<MaActivityProps> = ({
  initialData = defaultState,
}: MaActivityProps) => {
  // Ensure ma_deals exists and is an array
  const safeMADeals = initialData?.ma_deals || [];

  // Initialize data states
  const [dealsData, setDealsData] = useState<MADeals[]>(safeMADeals);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editDealsData, setEditDealsData] = useState<MADeals[]>(safeMADeals);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, Perplexity"
  );

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    console.log("M&A strategy initialData update:", initialData);

    // Ensure ma_deals exists and is an array
    const updatedDeals = initialData.ma_deals || [];

    // Update the states
    setDealsData(updatedDeals);

    // If we're not in edit mode, also update the edit data
    if (!isEditing) {
      setEditDealsData(updatedDeals);
    }
  }, [initialData, isEditing]);

  const startEditing = (): void => {
    setIsEditing(true);
    // Create deep copy to avoid reference issues
    setEditDealsData(JSON.parse(JSON.stringify(dealsData)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    // Create UserAttachment entity
    const userAttachment = {
      name: "mastrategy-page-updated.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mastrategy-page-updated.tsx",
    };

    console.log("Creating UserAttachment:", userAttachment);
    setDealsData(editDealsData);
    setIsEditing(false);

    // Update the source text to include the user
    setSourceText("Source: Coresignal, Perplexity User Update");
  };

  // Deal update handlers
  const updateDeal = (
    index: number,
    field: keyof MADeals,
    value: string | null
  ): void => {
    const newData = [...editDealsData];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    setEditDealsData(newData);
  };

  const addDeal = (): void => {
    const newData = [...editDealsData];
    newData.push({
      deal_name: "New Deal",
      description: "Deal description",
      deal_type: "Partnership",
      deal_date: new Date().toISOString().split("T")[0],
      deal_value: "$0M",
    });
    setEditDealsData(newData);
  };

  const removeDeal = (index: number): void => {
    const newData = [...editDealsData];
    newData.splice(index, 1);
    setEditDealsData(newData);
  };

  // Only display top 5 deals
  const displayDeals = isEditing
    ? editDealsData.slice(0, 5)
    : dealsData.slice(0, 5);

  return (
    <SectionLayout title="M&A Strategy" sourceText={sourceText}>
      <div className="flex justify-between items-center mb-4">
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

      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <div
          className="flex justify-between items-center p-3 border-b border-gray-200"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <h2 className="text-gray-800 text-xl font-medium">
            M&A Deal History
          </h2>
          {isEditing && (
            <button
              onClick={addDeal}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Deal
            </button>
          )}
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#002169", color: "white" }}>
              <th className="p-3 text-left font-medium">Deal Name</th>
              <th className="p-3 text-left font-medium">Description</th>
              <th className="p-3 text-left font-medium">Deal Type</th>
              <th className="p-3 text-left font-medium">Deal Date</th>
              <th className="p-3 text-left font-medium">Deal Value</th>
              {isEditing && (
                <th className="p-3 text-center font-medium w-16">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayDeals.length === 0 ? (
              <tr>
                <td
                  colSpan={isEditing ? 6 : 5}
                  className="p-3 text-center text-gray-500"
                >
                  No deals available
                </td>
              </tr>
            ) : (
              displayDeals.map((deal, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  {isEditing ? (
                    <>
                      <td className="p-3 border border-gray-200">
                        <input
                          type="text"
                          value={deal.deal_name || ""}
                          onChange={(e) =>
                            updateDeal(index, "deal_name", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input
                          type="text"
                          value={deal.description || ""}
                          onChange={(e) =>
                            updateDeal(index, "description", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <select
                          value={deal.deal_type || ""}
                          onChange={(e) =>
                            updateDeal(index, "deal_type", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          <option value="Acquisition">Acquisition</option>
                          <option value="Merger">Merger</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Joint Venture">Joint Venture</option>
                          <option value="Investment">Investment</option>
                        </select>
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input
                          type="date"
                          value={deal.deal_date || ""}
                          onChange={(e) =>
                            updateDeal(index, "deal_date", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input
                          type="text"
                          value={deal.deal_value || ""}
                          onChange={(e) =>
                            updateDeal(index, "deal_value", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                          placeholder="$0M"
                        />
                      </td>
                      <td className="p-3 text-center border border-gray-200">
                        <button
                          onClick={() => removeDeal(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2Icon className="h-5 w-5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 border border-gray-200">
                        {deal.deal_name || "N/A"}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {deal.description || "N/A"}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {deal.deal_type || "N/A"}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {formatDate(deal.deal_date)}
                      </td>
                      <td className="p-3 border border-gray-200">
                        {deal.deal_value || "N/A"}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  );
};

export default MAStrategyPage;
