/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

// Define the type for a strategic partnership
export type StrategicPartnership = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  partnershipDate: string | null; // ISO date string format
};

// Sample data
export const strategicPartnershipsData: StrategicPartnership[] = [
  {
    id: "1",
    name: "Microsoft",
    description: "Cloud services partnership for enterprise solutions",
    logoUrl: null,
    partnershipDate: "2023-05-15",
  },
  {
    id: "2",
    name: "Salesforce",
    description: "CRM integration and co-marketing agreement",
    logoUrl: null,
    partnershipDate: "2022-11-03",
  },
  {
    id: "3",
    name: "IBM",
    description: "AI research and development collaboration",
    logoUrl: null,
    partnershipDate: "2024-01-22",
  },
  {
    id: "4",
    name: "Oracle",
    description: "Database technology integration partnership",
    logoUrl: null,
    partnershipDate: "2023-08-10",
  },
  {
    id: "5",
    name: "AWS",
    description: "Cloud infrastructure and deployment solutions",
    logoUrl: null,
    partnershipDate: "2022-06-30",
  },
];

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

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const StrategicAlliancePage: React.FC = () => {
  const [data, setData] = useState<StrategicPartnership[]>(
    strategicPartnershipsData
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<StrategicPartnership[]>(
    strategicPartnershipsData
  );

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

  // Update a partnership field
  const updatePartnership = (
    id: string,
    field: keyof StrategicPartnership,
    value: string
  ): void => {
    const newEditData = editData.map((item) => {
      if (item.id === id) {
        // For date and description fields, empty string becomes null
        const processedValue =
          (field === "partnershipDate" || field === "description") &&
          value === ""
            ? null
            : value;

        return {
          ...item,
          [field]: processedValue,
        };
      }
      return item;
    });

    setEditData(newEditData);
  };

  // Add new partnership
  const addPartnership = (): void => {
    const newPartnership: StrategicPartnership = {
      id: generateId(),
      name: "New Partner",
      description: null,
      logoUrl: null,
      partnershipDate: null,
    };

    setEditData([...editData, newPartnership]);
  };

  // Remove partnership
  const removePartnership = (id: string): void => {
    const newEditData = editData.filter((item) => item.id !== id);
    setEditData(newEditData);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-gray-700 text-5xl font-normal">
          Strategic Alliance & Partnerships
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

      <div className="overflow-hidden border border-gray-200 rounded-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-navy-900 text-white">
              <th className="p-3 text-left font-medium w-1/6">Logo</th>
              <th className="p-3 text-left font-medium w-1/5">Name</th>
              <th className="p-3 text-left font-medium w-2/5">Description</th>
              <th className="p-3 text-left font-medium w-1/5">Date</th>
              {isEditing && (
                <th className="p-3 text-center font-medium w-16">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {(isEditing ? editData : data).map((partnership) => (
              <tr key={partnership.id} className="border-t border-gray-200">
                {isEditing ? (
                  <>
                    <td className="p-3 border-r border-gray-200 text-center">
                      <div className="bg-gray-100 h-12 w-full flex items-center justify-center text-sm text-gray-500">
                        Logo Placeholder
                      </div>
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={partnership.name}
                        onChange={(e) =>
                          updatePartnership(
                            partnership.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={partnership.description || ""}
                        onChange={(e) =>
                          updatePartnership(
                            partnership.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={partnership.partnershipDate || ""}
                        onChange={(e) =>
                          updatePartnership(
                            partnership.id,
                            "partnershipDate",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => removePartnership(partnership.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove partnership"
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
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 border-r border-gray-200 text-center">
                      {partnership.logoUrl ? (
                        <img
                          src={partnership.logoUrl}
                          alt={`${partnership.name} logo`}
                          className="h-12 mx-auto"
                        />
                      ) : (
                        <div className="bg-gray-100 h-12 w-full flex items-center justify-center text-sm text-gray-500">
                          Logo Placeholder
                        </div>
                      )}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      {partnership.name}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      {partnership.description || "N/A"}
                    </td>
                    <td className="p-3">
                      {formatDate(partnership.partnershipDate)}
                    </td>
                  </>
                )}
              </tr>
            ))}

            {/* Empty rows for visual consistency when fewer than 5 partnerships */}
            {!isEditing &&
              data.length < 5 &&
              Array(5 - data.length)
                .fill(0)
                .map((_, index) => (
                  <tr
                    key={`empty-${index}`}
                    className="border-t border-gray-200"
                  >
                    <td className="p-3 border-r border-gray-200">&nbsp;</td>
                    <td className="p-3 border-r border-gray-200">&nbsp;</td>
                    <td className="p-3 border-r border-gray-200">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                  </tr>
                ))}

            {/* Add new partnership row */}
            {isEditing && (
              <tr className="border-t border-gray-200 bg-gray-50">
                <td colSpan={isEditing ? 5 : 4} className="p-3 text-center">
                  <button
                    onClick={addPartnership}
                    className="text-blue-700 hover:text-blue-900 flex items-center justify-center w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Partnership
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-gray-500 text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
};

export default StrategicAlliancePage;
