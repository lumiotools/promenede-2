/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { KeyTechnology, Technology } from "@/types/technology";
import { PencilIcon, PlusIcon, XIcon } from "lucide-react";

// Default state for the component
const defaultState: KeyTechnology = {
  technologies_used: [],
  num_technologies: 0,
};

// Helper function to format dates
const formatDate = (dateStr: string | null): string => {
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

type KeyTechnologyProps = {
  initialData?: KeyTechnology;
  onDataUpdate?: (data: KeyTechnology) => void; // Add callback prop
};

const KeyTechnologyPage: React.FC<KeyTechnologyProps> = ({
  initialData = defaultState,
  onDataUpdate,
}: KeyTechnologyProps) => {
  // Ensure technologies_used exists and is an array
  const safeTechnologies = initialData?.technologies_used || [];
  const safeNumTechnologies = initialData?.num_technologies || 0;

  const [data, setData] = useState<KeyTechnology>({
    technologies_used: safeTechnologies,
    num_technologies: safeNumTechnologies,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<KeyTechnology>({
    technologies_used: safeTechnologies,
    num_technologies: safeNumTechnologies,
  });

  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Crunchbase"
  );

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    console.log("key technology initialData update:", initialData);

    // Ensure technologies_used exists and is an array
    const updatedTechnologies = initialData.technologies_used || [];
    const updatedNumTechnologies = initialData.num_technologies || 0;

    // Update the state with the new data
    setData({
      technologies_used: updatedTechnologies,
      num_technologies: updatedNumTechnologies,
    });

    // If we're not in edit mode, also update the edit data
    if (!isEditing) {
      setEditData({
        technologies_used: updatedTechnologies,
        num_technologies: updatedNumTechnologies,
      });
    }
  }, [initialData, isEditing]);

  // Start editing mode
  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  // Cancel editing (discard changes)
  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  // Save changes
  const saveChanges = (): void => {
    // Create UserAttachment entity
    const userAttachment = {
      name: "key-technology-page-5hbOFaVEECQWBUwY9sqqBn29ZCYVWq.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/key-technology-page-5hbOFaVEECQWBUwY9sqqBn29ZCYVWq.tsx",
    };

    console.log("Creating UserAttachment:", userAttachment);
    setData(editData);
    setIsEditing(false);

    // Update the source text to include the user
    setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update");

    // Call the callback to update parent component state
    if (onDataUpdate) {
      onDataUpdate(editData);
    }
  };

  // Update technology - since we don't have IDs, we use index for identification
  const updateTechnology = (
    index: number,
    field: keyof Technology,
    value: string
  ): void => {
    const newData = { ...editData };

    if (!newData.technologies_used) {
      newData.technologies_used = [];
    }

    if (index >= 0 && index < newData.technologies_used.length) {
      newData.technologies_used[index] = {
        ...newData.technologies_used[index],
        [field]: value,
      };
      setEditData(newData);
    }
  };

  // Add new technology
  const addTechnology = (): void => {
    const newData = { ...editData };
    const today = new Date().toISOString().split("T")[0];

    if (!newData.technologies_used) {
      newData.technologies_used = [];
    }

    newData.technologies_used.push({
      technology: "New Technology",
      first_verified_at: today,
      last_verified_at: today,
    });

    // Update count
    newData.num_technologies = (newData.num_technologies || 0) + 1;

    setEditData(newData);
  };

  // Remove technology by index
  const removeTechnology = (index: number): void => {
    const newData = { ...editData };

    if (!newData.technologies_used) {
      newData.technologies_used = [];
      return;
    }

    if (index >= 0 && index < newData.technologies_used.length) {
      newData.technologies_used.splice(index, 1);

      // Update count
      newData.num_technologies = Math.max(
        0,
        (newData.num_technologies || 0) - 1
      );

      setEditData(newData);
    }
  };

  // Safely access data
  const technologies = (isEditing ? editData : data).technologies_used || [];
  const numTechnologies = (isEditing ? editData : data).num_technologies || 0;

  // Only display top 10 technologies
  const displayTechnologies = technologies.slice(0, 5);

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-8 bg-white"
      style={{ minHeight: "100%", aspectRatio: "16/9" }}
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-gray-700 text-2xl font-normal">Key Technology</h1>
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

      <div className="border-t border-gray-300 mb-8"></div>

      {/* Stat summary */}
      {!isEditing ? (
        <div className="mb-2">
          <p className="text-lg text-gray-600">
            There are total
            <span className="font-medium">{numTechnologies}</span> technologies
          </p>
        </div>
      ) : (
        <div className="mb-6 flex items-center">
          <p className="text-lg text-gray-600 mr-4">Tracking</p>
          <input
            type="number"
            className="w-20 p-1 text-center border border-gray-300 rounded"
            value={editData.num_technologies || 0}
            onChange={(e) =>
              setEditData({
                ...editData,
                num_technologies: Number.parseInt(e.target.value) || 0,
              })
            }
          />
          <p className="text-lg text-gray-600 ml-4">technologies</p>
        </div>
      )}

      {/* Technology table - simplified to match screenshot */}
      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white">
              <th className="p-3 text-left font-medium border-b border-gray-200">
                Top Technology
              </th>
              <th className="p-3 text-left font-medium border-b border-gray-200">
                First Verified
              </th>
              <th className="p-3 text-left font-medium border-b border-gray-200">
                Last Verified
              </th>
              {isEditing && (
                <th className="p-3 text-center font-medium border-b border-gray-200 w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayTechnologies.length === 0 ? (
              <tr>
                <td
                  colSpan={isEditing ? 4 : 3}
                  className="p-3 text-center text-gray-500"
                >
                  No technologies available
                </td>
              </tr>
            ) : (
              displayTechnologies.map((tech, index) => (
                <tr
                  key={`${tech.technology || "unknown"}-${index}`}
                  className="border-t border-gray-200"
                >
                  {isEditing ? (
                    <>
                      <td className="p-3">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={tech.technology || ""}
                          onChange={(e) =>
                            updateTechnology(
                              index,
                              "technology",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={tech.first_verified_at || ""}
                          onChange={(e) =>
                            updateTechnology(
                              index,
                              "first_verified_at",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={tech.last_verified_at || ""}
                          onChange={(e) =>
                            updateTechnology(
                              index,
                              "last_verified_at",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeTechnology(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{tech.technology || "N/A"}</td>
                      <td className="p-3">
                        {formatDate(tech.first_verified_at)}
                      </td>
                      <td className="p-3">
                        {formatDate(tech.last_verified_at)}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}

            {/* Add new technology row */}
            {isEditing && (
              <tr className="border-t border-gray-200 bg-gray-50">
                <td colSpan={4} className="p-3 text-center">
                  <button
                    onClick={addTechnology}
                    className="text-blue-700 hover:text-blue-900 flex items-center justify-center w-full"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add Technology
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-gray-500 text-sm">{sourceText}</div>
    </div>
  );
};

export default KeyTechnologyPage;
