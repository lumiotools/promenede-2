import React, { useState } from "react";

// Define interfaces for type safety
export interface StrategyPoint {
  id: string;
  title: string | null;
  description: string | null;
}

export interface StrategySection {
  id: string;
  title: string;
  points: StrategyPoint[];
}

export interface StrategyComment {
  id: string;
  title: string;
  content: string | null;
}

export interface StrategyData {
  latestStrategy: StrategyComment | null;
  strategicFocus: StrategyComment | null;
  strategySections: StrategySection[];
}

// Sample initial data
// const initialData: StrategyData = {
//   latestStrategy: {
//     id: "latest-strategy-1",
//     title: "Latest Strategy",
//     content: "Comment A",
//   },
//   strategicFocus: {
//     id: "strategic-focus-1",
//     title: "Strategic Focus going forward",
//     content: "Comment A",
//   },
//   strategySections: [
//     {
//       id: "recent-strategy",
//       title: "Recent Strategy and Outcomes Digital Focus",
//       points: [
//         {
//           id: "digital-focus",
//           title: "Digital Focus:",
//           description:
//             "Significant investments in e-commerce and digital platforms, resulting in robust online sales growth.",
//         },
//         {
//           id: "sustainability-efforts",
//           title: "Sustainability Efforts:",
//           description:
//             "Increased investment in sustainable practices and eco-friendly product lines.",
//         },
//         {
//           id: "luxury-segments",
//           title: "Luxury and Professional Segments:",
//           description:
//             "Luxury and Professional Segments: Strong performance in luxury cosmetics and professional haircare sectors, driving overall revenue growth.",
//         },
//         {
//           id: "innovation",
//           title: "Innovation:",
//           description:
//             "Continuous focus on research and development, introducing new, innovative beauty products to the market.",
//         },
//         {
//           id: "financial-performance",
//           title: "Financial Performance:",
//           description:
//             "Achieved solid financial results in 2022, reflecting successful strategic initiatives.",
//         },
//       ],
//     },
//     {
//       id: "strategic-focus-forward",
//       title: "Strategic Focus Going Forward",
//       points: [
//         {
//           id: "digital-transformation",
//           title: "Digital Transformation:",
//           description:
//             "Achieved solid financial results in 2022, reflecting successful strategic initiatives.",
//         },
//         {
//           id: "emerging-markets",
//           title: "Emerging Markets",
//           description:
//             "Strengthen presence and expand operations in emerging economies.",
//         },
//         {
//           id: "sustainability",
//           title: "Sustainability:",
//           description:
//             "Maintain commitment to sustainability through eco-friendly products and practices.",
//         },
//         {
//           id: "innovation-forward",
//           title: "Innovation:",
//           description:
//             "Continue investment in R&D for cutting-edge beauty technologies.",
//         },
//         {
//           id: "consumer-engagement",
//           title: "Consumer Engagement:",
//           description:
//             "Enhance direct-to-consumer channels to improve customer experience and personalization.",
//         },
//       ],
//     },
//   ],
// };
const initialData: StrategyData = {
  latestStrategy: {
    id: "",
    title: "",
    content: "",
  },
  strategicFocus: {
    id: "",
    title: "",
    content: "",
  },
  strategySections: [
    {
      id: "",
      title: "",
      points: [
        {
          id: "",
          title: "",
          description: "",
        },
      ],
    },
  ],
};

const StrategyPage: React.FC = () => {
  const [data, setData] = useState<StrategyData>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<StrategyData>(initialData);

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

  // Update comment data
  const updateComment = (
    commentType: "latestStrategy" | "strategicFocus",
    field: keyof StrategyComment,
    value: string | null
  ): void => {
    if (!editData[commentType]) return;

    const newData = { ...editData };
    newData[commentType] = {
      ...newData[commentType]!,
      [field]: value,
    };
    setEditData(newData);
  };

  // Update section title
  const updateSectionTitle = (sectionId: string, value: string): void => {
    const newData = { ...editData };
    const sectionIndex = newData.strategySections.findIndex(
      (section) => section.id === sectionId
    );

    if (sectionIndex !== -1) {
      newData.strategySections[sectionIndex].title = value;
      setEditData(newData);
    }
  };

  // Update strategy point
  const updateStrategyPoint = (
    sectionId: string,
    pointId: string,
    field: keyof StrategyPoint,
    value: string | null
  ): void => {
    const newData = { ...editData };
    const sectionIndex = newData.strategySections.findIndex(
      (section) => section.id === sectionId
    );

    if (sectionIndex !== -1) {
      const pointIndex = newData.strategySections[
        sectionIndex
      ].points.findIndex((point) => point.id === pointId);
      if (pointIndex !== -1) {
        newData.strategySections[sectionIndex].points[pointIndex] = {
          ...newData.strategySections[sectionIndex].points[pointIndex],
          [field]: value,
        };
        setEditData(newData);
      }
    }
  };

  // Add new strategy point
  const addStrategyPoint = (sectionId: string): void => {
    const newData = { ...editData };
    const sectionIndex = newData.strategySections.findIndex(
      (section) => section.id === sectionId
    );

    if (sectionIndex !== -1) {
      const newId = `point-${Date.now()}`;
      newData.strategySections[sectionIndex].points.push({
        id: newId,
        title: "New Point:",
        description: "Description for the new point.",
      });
      setEditData(newData);
    }
  };

  // Remove strategy point
  const removeStrategyPoint = (sectionId: string, pointId: string): void => {
    const newData = { ...editData };
    const sectionIndex = newData.strategySections.findIndex(
      (section) => section.id === sectionId
    );

    if (sectionIndex !== -1) {
      const pointIndex = newData.strategySections[
        sectionIndex
      ].points.findIndex((point) => point.id === pointId);
      if (pointIndex !== -1) {
        newData.strategySections[sectionIndex].points.splice(pointIndex, 1);
        setEditData(newData);
      }
    }
  };

  // Add new strategy section
  const addStrategySection = (): void => {
    const newData = { ...editData };
    const newId = `section-${Date.now()}`;

    newData.strategySections.push({
      id: newId,
      title: "New Strategy Section",
      points: [
        {
          id: `point-${Date.now()}`,
          title: "New Point:",
          description: "Description for the new point.",
        },
      ],
    });

    setEditData(newData);
  };

  // Remove strategy section
  const removeStrategySection = (sectionId: string): void => {
    const newData = { ...editData };
    const sectionIndex = newData.strategySections.findIndex(
      (section) => section.id === sectionId
    );

    if (sectionIndex !== -1) {
      newData.strategySections.splice(sectionIndex, 1);
      setEditData(newData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-gray-700 text-5xl font-normal">Strategy</h1>
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

      {/* Strategy Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Latest Strategy */}
          <div className="bg-gray-50 p-6 rounded-lg">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 mb-4 border border-gray-300 rounded text-xl font-medium"
                  value={editData.latestStrategy?.title || ""}
                  onChange={(e) =>
                    updateComment("latestStrategy", "title", e.target.value)
                  }
                />
                <textarea
                  className="w-full h-32 p-4 border border-gray-300 rounded bg-gray-200"
                  value={editData.latestStrategy?.content || ""}
                  onChange={(e) =>
                    updateComment("latestStrategy", "content", e.target.value)
                  }
                />
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium text-gray-700 mb-4">
                  {data.latestStrategy?.title || "N/A"}
                </h2>
                <div className="p-8 rounded bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-700">
                    {data.latestStrategy?.content || "N/A"}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Strategic Focus going forward */}
          <div className="bg-gray-50 p-6 rounded-lg">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 mb-4 border border-gray-300 rounded text-xl font-medium"
                  value={editData.strategicFocus?.title || ""}
                  onChange={(e) =>
                    updateComment("strategicFocus", "title", e.target.value)
                  }
                />
                <textarea
                  className="w-full h-32 p-4 border border-gray-300 rounded bg-gray-200"
                  value={editData.strategicFocus?.content || ""}
                  onChange={(e) =>
                    updateComment("strategicFocus", "content", e.target.value)
                  }
                />
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium text-gray-700 mb-4">
                  {data.strategicFocus?.title || "N/A"}
                </h2>
                <div className="p-8 rounded bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-700">
                    {data.strategicFocus?.content || "N/A"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Strategy Sections */}
          {isEditing ? (
            <>
              {editData.strategySections.map((section) => (
                <div key={section.id} className="relative">
                  <div className="mb-4 flex justify-between items-center">
                    <input
                      type="text"
                      className="flex-1 p-2 border border-gray-300 rounded text-xl font-medium"
                      value={section.title}
                      onChange={(e) =>
                        updateSectionTitle(section.id, e.target.value)
                      }
                    />
                    <button
                      onClick={() => removeStrategySection(section.id)}
                      className="ml-2 text-gray-500 hover:text-red-500"
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
                  </div>

                  <ul className="space-y-4">
                    {section.points.map((point) => (
                      <li key={point.id} className="flex items-start">
                        <div className="mr-2 mt-2">•</div>
                        <div className="flex-1">
                          <div className="flex items-start mb-1">
                            <input
                              type="text"
                              className="flex-1 p-1 border border-gray-300 rounded text-sm font-medium"
                              value={point.title || ""}
                              onChange={(e) =>
                                updateStrategyPoint(
                                  section.id,
                                  point.id,
                                  "title",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                removeStrategyPoint(section.id, point.id)
                              }
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                          <textarea
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            rows={2}
                            value={point.description || ""}
                            onChange={(e) =>
                              updateStrategyPoint(
                                section.id,
                                point.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => addStrategyPoint(section.id)}
                    className="mt-4 text-blue-700 text-sm flex items-center"
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
                    Add Point
                  </button>
                </div>
              ))}

              <button
                onClick={addStrategySection}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Strategy Section
              </button>
            </>
          ) : (
            <>
              {data.strategySections.map((section) => (
                <div key={section.id}>
                  <h2 className="text-xl font-medium text-gray-700 mb-4">
                    {section.title}
                  </h2>
                  <ul className="space-y-4">
                    {section.points.map((point) => (
                      <li key={point.id} className="flex items-start">
                        <div className="mr-2">•</div>
                        <div>
                          <span className="font-medium">
                            {point.title || "N/A"}{" "}
                          </span>
                          <span>{point.description || "N/A"}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 text-gray-500 text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
};

export default StrategyPage;
