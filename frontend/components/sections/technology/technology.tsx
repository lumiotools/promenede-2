"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import type { KeyTechnology, Technology } from "@/types/technology";

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
};

const KeyTechnologyPage: React.FC<KeyTechnologyProps> = ({
  initialData = defaultState,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

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

  // Calculate total pages whenever data or items per page changes
  useEffect(() => {
    const dataToUse = isEditing ? editData : data;
    const technologiesLength = dataToUse.technologies_used?.length || 0;
    setTotalPages(Math.max(1, Math.ceil(technologiesLength / itemsPerPage)));
  }, [data, editData, isEditing, itemsPerPage]);

  // Reset to first page when switching between edit and view modes
  useEffect(() => {
    setCurrentPage(1);
  }, [isEditing]);

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
    setData(editData);
    setIsEditing(false);
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

    // Navigate to the last page when adding a new technology
    const newTotalPages = Math.ceil(
      newData.technologies_used.length / itemsPerPage
    );
    setCurrentPage(newTotalPages);
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

      // Adjust current page if necessary
      const newTotalPages = Math.ceil(
        newData.technologies_used.length / itemsPerPage
      );
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    }
  };

  // Get current page items
  const getCurrentItems = () => {
    const dataToUse = isEditing ? editData : data;
    const technologies = dataToUse.technologies_used || [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return technologies.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Pagination controls
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Get actual index in the full data array for a given index in the current page
  const getActualIndex = (pageIndex: number) => {
    return (currentPage - 1) * itemsPerPage + pageIndex;
  };

  // Safely access data
  const technologies = (isEditing ? editData : data).technologies_used || [];
  const numTechnologies = (isEditing ? editData : data).num_technologies || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-gray-700 text-5xl font-normal">Key Technology</h1>
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

      {/* Stat summary */}
      {!isEditing ? (
        <div className="mb-6">
          <p className="text-lg text-gray-600">
            Tracking <span className="font-medium">{numTechnologies}</span>{" "}
            technologies
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

      {/* Items per page selector */}
      <div className="flex justify-end mb-4 items-center">
        <span className="text-sm text-gray-600 mr-2">Rows per page:</span>
        <select
          className="border border-gray-300 rounded p-1 text-sm"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Technology table */}
      <div className="border border-gray-200 rounded-sm overflow-hidden text-black">
        <table className="w-full">
          <thead>
            <tr className="bg-navy-900">
              <th className="p-3 text-left font-medium border-r border-gray-600">
                Technology
              </th>
              <th className="p-3 text-left font-medium border-r border-gray-600">
                First Verified
              </th>
              <th className="p-3 text-left font-medium">Last Verified</th>
              {isEditing && (
                <th className="p-3 text-center font-medium w-20">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {technologies.length === 0 ? (
              <tr className="border-t border-gray-200">
                <td
                  colSpan={isEditing ? 4 : 3}
                  className="p-3 text-center text-gray-500"
                >
                  No technologies available
                </td>
              </tr>
            ) : (
              getCurrentItems().map((tech, pageIndex) => {
                const actualIndex = getActualIndex(pageIndex);
                return (
                  <tr
                    key={`${tech.technology || "unknown"}-${actualIndex}`}
                    className="border-t border-gray-200"
                  >
                    {isEditing ? (
                      <>
                        <td className="p-3 border-r border-gray-200">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={tech.technology || ""}
                            onChange={(e) =>
                              updateTechnology(
                                actualIndex,
                                "technology",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200">
                          <input
                            type="date"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={tech.first_verified_at || ""}
                            onChange={(e) =>
                              updateTechnology(
                                actualIndex,
                                "first_verified_at",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200">
                          <input
                            type="date"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={tech.last_verified_at || ""}
                            onChange={(e) =>
                              updateTechnology(
                                actualIndex,
                                "last_verified_at",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => removeTechnology(actualIndex)}
                            className="text-red-500 hover:text-red-700"
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
                        <td className="p-3 border-r border-gray-200">
                          {tech.technology || "N/A"}
                        </td>
                        <td className="p-3 border-r border-gray-200">
                          {formatDate(tech.first_verified_at)}
                        </td>
                        <td className="p-3">
                          {formatDate(tech.last_verified_at)}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}

            {/* Empty rows for visual consistency */}
            {!isEditing &&
              technologies.length > 0 &&
              getCurrentItems().length < itemsPerPage &&
              Array(itemsPerPage - getCurrentItems().length)
                .fill(0)
                .map((_, index) => (
                  <tr
                    key={`empty-${index}`}
                    className="border-t border-gray-200"
                  >
                    <td className="p-3 border-r border-gray-200">&nbsp;</td>
                    <td className="p-3 border-r border-gray-200">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                  </tr>
                ))}

            {/* Add new technology row */}
            {isEditing && (
              <tr className="border-t border-gray-200 bg-gray-50">
                <td colSpan={4} className="p-3 text-center">
                  <button
                    onClick={addTechnology}
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
                    Add Technology
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {technologies.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing{" "}
            {technologies.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
            to {Math.min(currentPage * itemsPerPage, technologies.length)} of{" "}
            {technologies.length} entries
          </div>
          <div className="flex items-center">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-1 rounded border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            {/* Page number buttons - show first, last, and pages around current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const showEllipsisBefore =
                  index > 0 && page > array[index - 1] + 1;
                const showEllipsisAfter =
                  index < array.length - 1 && page < array[index + 1] - 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsisBefore && (
                      <span className="mx-1 px-3 py-1">...</span>
                    )}
                    <button
                      onClick={() => paginate(page)}
                      className={`mx-1 px-3 py-1 rounded border ${
                        currentPage === page
                          ? "bg-blue-700 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                    {showEllipsisAfter && (
                      <span className="mx-1 px-3 py-1">...</span>
                    )}
                  </React.Fragment>
                );
              })}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-gray-500 text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
};

export default KeyTechnologyPage;
