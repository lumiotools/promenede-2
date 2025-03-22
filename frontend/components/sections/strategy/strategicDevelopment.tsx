/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Initiative,
  StrategicDevelopment,
  YearData,
} from "@/types/strategicDevelopment";
import React, { useState, useEffect } from "react";

interface StrategicDevelopmentTimelineProps {
  initialData: StrategicDevelopment | null | undefined;
}

export const StrategicDevelopmentTimeline: React.FC<
  StrategicDevelopmentTimelineProps
> = ({ initialData }) => {
  const [data, setData] = useState<StrategicDevelopment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<StrategicDevelopment | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
    setIsLoading(false);
  }, [initialData]);

  // Start editing mode
  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(data ? JSON.parse(JSON.stringify(data)) : createEmptyData());
  };

  // Cancel editing (discard changes)
  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  // Save changes
  const saveChanges = (): void => {
    setData(editData);
    setIsEditing(false);
  };

  // Create empty data structure
  const createEmptyData = (): StrategicDevelopment => {
    return {
      strategicFocusGoingForward: "",
      years: {},
    };
  };

  // Update strategic focus
  const updateStrategicFocus = (value: string): void => {
    if (editData) {
      setEditData({
        ...editData,
        strategicFocusGoingForward: value,
      });
    }
  };

  // Add new year
  const addYear = (): void => {
    if (editData) {
      const newYear = new Date().getFullYear().toString();
      const updatedYears = editData.years ? { ...editData.years } : {};
      // Find a year that doesn't exist yet
      let yearToAdd = newYear;
      let counter = 0;
      while (updatedYears && updatedYears[yearToAdd]) {
        yearToAdd = (parseInt(newYear) + counter).toString();
        counter++;
      }

      updatedYears[yearToAdd] = {
        strategicFocus: "",
        initiativesAndAchievements: [],
      };

      setEditData({
        ...editData,
        years: updatedYears,
      });
    }
  };

  // Remove year
  const removeYear = (year: string): void => {
    if (editData && editData.years) {
      const updatedYears = { ...editData.years };
      delete updatedYears[year];

      setEditData({
        ...editData,
        years: updatedYears,
      });
    }
  };

  // Update year data
  const updateYearData = (
    year: string,
    field: keyof YearData,
    value: string
  ): void => {
    if (editData && editData.years && editData.years[year]) {
      const updatedYears = { ...editData.years };
      updatedYears[year] = {
        ...updatedYears[year],
        [field]: value,
      } as YearData;

      setEditData({
        ...editData,
        years: updatedYears,
      });
    }
  };

  // Add new initiative to a year
  const addInitiative = (year: string): void => {
    if (editData && editData.years && editData.years[year]) {
      const updatedYears = { ...editData.years };
      const currentInitiatives =
        updatedYears[year]?.initiativesAndAchievements || [];

      updatedYears[year] = {
        ...updatedYears[year],
        initiativesAndAchievements: [
          ...currentInitiatives,
          {
            initiativeName: "",
            description: "",
            referenceLink: "",
          },
        ],
      } as YearData;

      setEditData({
        ...editData,
        years: updatedYears,
      });
    }
  };

  // Remove initiative from a year
  const removeInitiative = (year: string, index: number): void => {
    if (
      editData &&
      editData.years &&
      editData.years[year] &&
      editData.years[year]?.initiativesAndAchievements
    ) {
      const updatedYears = { ...editData.years };
      const initiatives = [
        ...(updatedYears[year]?.initiativesAndAchievements || []),
      ];

      initiatives.splice(index, 1);

      updatedYears[year] = {
        ...updatedYears[year],
        initiativesAndAchievements: initiatives,
      } as YearData;

      setEditData({
        ...editData,
        years: updatedYears,
      });
    }
  };

  // Update initiative data
  const updateInitiative = (
    year: string,
    index: number,
    field: keyof Initiative,
    value: string
  ): void => {
    if (
      editData &&
      editData.years &&
      editData.years[year] &&
      editData.years[year]?.initiativesAndAchievements
    ) {
      const updatedYears = { ...editData.years };
      const initiatives = [
        ...(updatedYears[year]?.initiativesAndAchievements || []),
      ];

      if (initiatives[index]) {
        initiatives[index] = {
          ...initiatives[index],
          [field]: value,
        };

        updatedYears[year] = {
          ...updatedYears[year],
          initiativesAndAchievements: initiatives,
        } as YearData;

        setEditData({
          ...editData,
          years: updatedYears,
        });
      }
    }
  };

  // Sort years in descending order
  const getSortedYears = (): string[] => {
    const yearsData = isEditing ? editData?.years : data?.years;
    if (!yearsData) return [];

    return Object.keys(yearsData).sort((a, b) => parseInt(b) - parseInt(a));
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!data && !isEditing) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-normal text-gray-700">
            Strategic Development
          </h1>
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
            Add Data
          </button>
        </div>
        <div className="border-t-2 border-blue-500 mb-12"></div>
        <div className="text-center py-16 text-gray-500">Not available</div>
      </div>
    );
  }

  const currentData = isEditing ? editData : data;
  const sortedYears = getSortedYears();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-normal text-gray-700">
          Strategic Development
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

      {/* Blue line beneath the title */}
      <div className="border-t-2 border-blue-500 mb-8"></div>

      {/* Strategic Focus Going Forward */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Strategic Focus Going Forward
        </h2>
        {isEditing ? (
          <textarea
            className="w-full p-3 border border-gray-300 rounded text-gray-700"
            rows={3}
            value={currentData?.strategicFocusGoingForward || ""}
            onChange={(e) => updateStrategicFocus(e.target.value)}
            placeholder="Enter strategic focus"
          />
        ) : (
          <p className="text-gray-700">
            {currentData?.strategicFocusGoingForward || "Not available"}
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Horizontal timeline line */}
        <div className="absolute left-0 right-0 h-0.5 bg-gray-300 top-16"></div>

        {/* Years */}
        <div className="pt-16 pb-8">
          <div className="flex justify-between">
            {sortedYears.length > 0 ? (
              sortedYears.map((year, index) => (
                <div
                  key={year}
                  className="relative flex flex-col items-center w-1/3 px-4"
                >
                  {/* Timeline dot */}
                  <div className="absolute top-0 -mt-4 w-4 h-4 bg-blue-600 rounded-full border-2 border-white z-10"></div>

                  {/* Year */}
                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-medium text-gray-800">
                      {year}
                    </h3>
                    {isEditing && (
                      <button
                        onClick={() => removeYear(year)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Year content */}
                  <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm w-full">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      Strategic Focus
                    </h4>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded text-gray-700 mb-4"
                        rows={2}
                        value={currentData?.years?.[year]?.strategicFocus || ""}
                        onChange={(e) =>
                          updateYearData(year, "strategicFocus", e.target.value)
                        }
                        placeholder="Enter strategic focus for this year"
                      />
                    ) : (
                      <p className="text-gray-700 mb-4">
                        {currentData?.years?.[year]?.strategicFocus ||
                          "Not available"}
                      </p>
                    )}

                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      Initiatives & Achievements
                    </h4>

                    {currentData?.years?.[year]?.initiativesAndAchievements
                      ?.length ? (
                      <div className="space-y-4">
                        {currentData.years[
                          year
                        ]?.initiativesAndAchievements?.map((initiative, i) => (
                          <div
                            key={i}
                            className="border-t border-gray-200 pt-3"
                          >
                            {isEditing && (
                              <div className="flex justify-end mb-1">
                                <button
                                  onClick={() => removeInitiative(year, i)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            )}

                            {isEditing ? (
                              <>
                                <div className="mb-2">
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Initiative Name
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-gray-700"
                                    value={initiative.initiativeName || ""}
                                    onChange={(e) =>
                                      updateInitiative(
                                        year,
                                        i,
                                        "initiativeName",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter initiative name"
                                  />
                                </div>
                                <div className="mb-2">
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    className="w-full p-2 border border-gray-300 rounded text-gray-700"
                                    rows={2}
                                    value={initiative.description || ""}
                                    onChange={(e) =>
                                      updateInitiative(
                                        year,
                                        i,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter description"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Reference Link
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-gray-700"
                                    value={initiative.referenceLink || ""}
                                    onChange={(e) =>
                                      updateInitiative(
                                        year,
                                        i,
                                        "referenceLink",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter reference link"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <h5 className="font-medium text-gray-800">
                                  {initiative.initiativeName ||
                                    "Unnamed Initiative"}
                                </h5>
                                <p className="text-gray-700 text-sm mt-1">
                                  {initiative.description ||
                                    "No description available"}
                                </p>
                                {initiative.referenceLink && (
                                  <a
                                    href={initiative.referenceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm mt-1 block"
                                  >
                                    Reference Link
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No initiatives available
                      </p>
                    )}

                    {isEditing && (
                      <button
                        onClick={() => addInitiative(year)}
                        className="mt-4 text-blue-600 hover:text-blue-800 text-sm flex items-center"
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
                        Add Initiative
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 text-gray-500">
                No years available
              </div>
            )}
          </div>
        </div>

        {/* Add new year button */}
        {isEditing && (
          <div className="flex justify-center mt-6">
            <button
              onClick={addYear}
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Year
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-gray-500 text-sm">
        Source: Company Reports, Strategic Planning Documents
      </div>
    </div>
  );
};

export default StrategicDevelopmentTimeline;
