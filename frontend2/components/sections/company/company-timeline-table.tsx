/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import type { TimelineEvent } from "@/types/company";
import { SectionLayout } from "@/components/ui/section-layout";

type CompanyTimelineTableProps = {
  initialData?: TimelineEvent | TimelineEvent[] | null;
};

export function CompanyTimelineTable({
  initialData,
}: CompanyTimelineTableProps) {
  // More robust conversion that handles null values
  const getInitialDataArray = () => {
    if (!initialData) return [];
    if (Array.isArray(initialData)) return initialData;
    // Handle the case where initialData is an object but might be empty
    if (typeof initialData === "object") {
      // Check if the object has the required properties
      if (
        "date" in initialData &&
        ("description" in initialData || "event" in initialData)
      ) {
        return [initialData];
      }
    }
    console.log("Couldn't convert initialData to array, using empty array");
    return [];
  };

  // No default dataset - we'll show a message when no data is available

  const [data, setData] = useState<TimelineEvent[]>(getInitialDataArray());

  const [editData, setEditData] = useState<TimelineEvent[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, Perplexity"
  );

  // Helper function to check if a string is empty or null
  const isValidString = (str: string | null | undefined): boolean => {
    return str !== null && str !== undefined && str.trim() !== "";
  };

  // Filter data to only include entries with valid date and at least one of event or description
  const filterValidData = (dataArray: TimelineEvent[]): TimelineEvent[] => {
    return dataArray.filter(
      (event) =>
        isValidString(event.date) &&
        (isValidString(event.event) || isValidString(event.description))
    );
  };

  // Update data when initialData changes
  useEffect(() => {
    const newDataArray = getInitialDataArray();
    if (newDataArray.length > 0) {
      console.log("useEffect updating data:", newDataArray);
      setData(newDataArray);
    }
  }, [initialData]);

  // Format date to MM/YY format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If date is invalid, try to parse it from different formats
        if (dateString.includes(".")) {
          const parts = dateString.split(".");
          if (parts.length >= 2) {
            return `${parts[1]}/${parts[0].substring(2)}`;
          }
        }
        return dateString;
      }

      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear().toString().substring(2);
      return `${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Start editing mode
  const startEditing = () => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  // Cancel editing and revert changes
  const cancelEditing = () => {
    setIsEditing(false);
    setEditData(null);
  };

  // Save changes
  const saveChanges = () => {
    if (editData) {
      // Create UserAttachment entity
      const userAttachment = {
        name: "company-timeline-table-update.tsx",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/company-timeline-table-update.tsx",
      };

      console.log("Creating UserAttachment:", userAttachment);

      setData(editData);

      // Update the source text to include the user
      setSourceText("Source: Coresignal, Perplexity, User Update");
    }
    setIsEditing(false);
  };

  // Update a field in a timeline event
  const updateField = (
    index: number,
    field: keyof TimelineEvent,
    value: string
  ) => {
    if (!editData) return;

    const newEditData = [...editData];
    if (field === "event") {
      newEditData[index][field] = value || null;
    } else {
      newEditData[index][field] = value;
    }
    setEditData(newEditData);
  };

  // Add a new timeline event
  const addTimelineEvent = () => {
    if (!editData) return;

    const newEvent: TimelineEvent = {
      date: new Date().toISOString().split("T")[0],
      event: null,
      description: "",
    };

    setEditData([...editData, newEvent]);
  };

  // Remove a timeline event
  const removeTimelineEvent = (index: number) => {
    if (!editData) return;

    const newEditData = [...editData];
    newEditData.splice(index, 1);
    setEditData(newEditData);
  };

  // Use editData when in editing mode, otherwise filter valid data and sort by date (newest first)
  // Then limit to only the top 7 entries using slice
  const displayData = isEditing
    ? editData
    : filterValidData([...data])
        .sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        .slice(0, 7); // Limit to top 7 events

  // Check if there is any valid data to display
  const hasData = isEditing
    ? editData && editData.length > 0
    : filterValidData([...data]).length > 0;

  return (
    <SectionLayout title="Company Timeline (Top 7)" sourceText={sourceText}>
      {hasData ? (
        /* Timeline Table */
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#002169] text-white">
                  <th className="py-3 px-4 text-left font-base border-r border-[#1a3573] w-16">
                    No.
                  </th>
                  <th className="py-3 px-4 text-left font-base border-r border-[#1a3573] w-32">
                    MM/YY
                  </th>
                  <th className="py-3 px-4 text-left font-base border-r border-[#1a3573]">
                    Event
                  </th>
                  <th className="py-3 px-4 text-left font-base">Detail</th>
                  {isEditing && (
                    <th className="py-3 px-4 text-center font-base w-16">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayData?.map((event, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}
                  >
                    <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">
                      {isEditing ? (
                        <input
                          type="date"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={event.date || ""}
                          onChange={(e) =>
                            updateField(index, "date", e.target.value)
                          }
                        />
                      ) : (
                        formatDate(event.date || "")
                      )}
                    </td>
                    <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={event.event || ""}
                          onChange={(e) =>
                            updateField(index, "event", e.target.value)
                          }
                        />
                      ) : (
                        event.event || "NA"
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#475467]">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={event.description || ""}
                          onChange={(e) =>
                            updateField(index, "description", e.target.value)
                          }
                        />
                      ) : (
                        event.description || "NA"
                      )}
                    </td>
                    {isEditing && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => removeTimelineEvent(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add new event button when in edit mode */}
          {isEditing && (
            <div className="p-4 border-t border-[#e5e7eb] flex justify-center">
              <button
                onClick={addTimelineEvent}
                className="flex items-center gap-1 text-[#002169] hover:text-[#1a3573] font-base"
              >
                <Plus className="h-4 w-4" />
                <span>Add Timeline Event</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* No data message */
        <div className="w-full py-16 flex justify-center items-center border border-[#e5e7eb] rounded-md">
          <div className="text-center">
            <p className="text-[#475467] text-lg mb-4">No data present</p>
            <button
              onClick={startEditing}
              className="flex items-center gap-1 text-[#002169] hover:text-[#1a3573] font-base mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Timeline Event</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit/Save/Cancel buttons */}
      <div className="hidden mt-4 flex justify-end gap-2">
        {isEditing ? (
          <>
            <button
              onClick={cancelEditing}
              className="flex items-center gap-1 px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={saveChanges}
              className="flex items-center gap-1 px-3 py-2 bg-[#002169] text-white rounded hover:bg-[#001a54]"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </>
        ) : (
          <button
            onClick={startEditing}
            className="flex items-center gap-1 px-3 py-2 border border-[#002169] text-[#002169] rounded hover:bg-[#f0f4ff]"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
        )}
      </div>
    </SectionLayout>
  );
}
