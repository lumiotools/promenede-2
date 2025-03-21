/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

// Define interfaces for type safety
export interface TimelineEvent {
  id: string;
  date: string | null;
  title: string | null;
  description?: string | null;
  position: "top" | "bottom" | ""; // Indicates whether event appears above or below timeline
}

export interface TimelineData {
  title: string;
  events: TimelineEvent[];
}

// Sample initial data
// const initialData: TimelineData = {
//   title: "Recent Strategic Development",
//   events: [
//     {
//       id: "event-1",
//       date: "2024.12.07",
//       title: "Generative AI Platform",
//       description: null,
//       position: "top",
//     },
//     {
//       id: "event-2",
//       date: "2024.12.07",
//       title: "Generative AI Platform",
//       description: null,
//       position: "bottom",
//     },
//   ],
// };
const initialData: TimelineData = {
  title: "",
  events: [
    {
      id: "",
      date: "",
      title: "",
      description: null,
      position: "",
    },
  ],
};

// Format date function with null handling
const formatDate = (date: string | null): string => {
  if (!date) return "N/A";
  return date;
};

const StrategicDevelopmentTimeline: React.FC = () => {
  const [data, setData] = useState<TimelineData>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<TimelineData>(initialData);

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

  // Update timeline title
  const updateTitle = (value: string): void => {
    setEditData({
      ...editData,
      title: value,
    });
  };

  // Update event data
  const updateEvent = (
    eventId: string,
    field: keyof TimelineEvent,
    value: string | null | "top" | "bottom"
  ): void => {
    const newData = { ...editData };
    const eventIndex = newData.events.findIndex(
      (event) => event.id === eventId
    );

    if (eventIndex !== -1) {
      newData.events[eventIndex] = {
        ...newData.events[eventIndex],
        [field]: value,
      };
      setEditData(newData);
    }
  };

  // Add new event
  const addEvent = (): void => {
    const newData = { ...editData };
    const newId = `event-${Date.now()}`;

    // Determine position based on number of events
    // Alternate between top and bottom for balanced appearance
    const position: "top" | "bottom" =
      newData.events.length % 2 === 0 ? "top" : "bottom";

    newData.events.push({
      id: newId,
      date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
      title: "New Strategic Event",
      description: null,
      position: position,
    });

    setEditData(newData);
  };

  // Remove event
  const removeEvent = (eventId: string): void => {
    const newData = { ...editData };
    const eventIndex = newData.events.findIndex(
      (event) => event.id === eventId
    );

    if (eventIndex !== -1) {
      newData.events.splice(eventIndex, 1);
      setEditData(newData);
    }
  };

  // Sort events by date for proper timeline order
  const sortedEvents = [...(isEditing ? editData.events : data.events)].sort(
    (a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    }
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <input
            type="text"
            className="text-5xl font-normal text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            value={editData.title}
            onChange={(e) => updateTitle(e.target.value)}
          />
        ) : (
          <h1 className="text-5xl font-normal text-gray-700">{data.title}</h1>
        )}

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
      <div className="border-t-2 border-blue-500 mb-12"></div>

      {/* Timeline with a more contained design */}
      <div className="relative max-w-4xl mx-auto">
        {/* Horizontal timeline line */}
        <div className="absolute left-12 right-12 h-0.5 bg-gray-800 top-16"></div>

        {/* Timeline events */}
        <div className="pt-16 pb-8">
          <div className="flex justify-between px-12">
            {sortedEvents.map((event, index) => (
              <div
                key={event.id}
                className="relative flex flex-col items-center"
              >
                {/* Timeline dot */}
                <div className="absolute top-0 -mt-4 w-4 h-4 bg-gray-600 rounded-full border-2 border-white z-10"></div>

                {/* Timeline content */}
                <div
                  className={`mt-8 w-36 ${
                    event.position === "top"
                      ? "order-last mt-4"
                      : "order-first -mt-24"
                  }`}
                >
                  {isEditing ? (
                    <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="absolute top-0 right-0 text-gray-500 hover:text-red-500"
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
                      <div className="mb-2">
                        <label className="block text-xs text-gray-500 mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          value={event.date || ""}
                          onChange={(e) =>
                            updateEvent(event.id, "date", e.target.value)
                          }
                          placeholder="YYYY.MM.DD"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs text-gray-500 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          value={event.title || ""}
                          onChange={(e) =>
                            updateEvent(event.id, "title", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Position
                        </label>
                        <select
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          value={event.position}
                          onChange={(e) =>
                            updateEvent(
                              event.id,
                              "position",
                              e.target.value as "top" | "bottom"
                            )
                          }
                        >
                          <option value="top">Bottom</option>
                          <option value="bottom">Top</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-700 font-normal">
                        {formatDate(event.date)}
                      </p>
                      <p className="text-gray-700 font-normal">
                        {event.title || "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Timeline connector line */}
                <div
                  className="absolute w-0.5 bg-gray-600"
                  style={{
                    height: "12px",
                    top: event.position === "top" ? "0" : "-12px",
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Add new event button */}
        {isEditing && (
          <div className="flex justify-center mt-6">
            <button
              onClick={addEvent}
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
              Add Event
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-gray-500 text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
};

export default StrategicDevelopmentTimeline;
