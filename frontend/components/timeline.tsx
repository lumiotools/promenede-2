import React from "react";

export interface TimelineEvent {
  date: string;
  title: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative flex items-center w-full border-t border-gray-300 py-6">
      {events.map((event, index) => (
        <div key={index} className="relative w-1/4 text-center">
          {/* Timeline Node */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-700 w-3 h-3 rounded-full"></div>

          {/* Event Label */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs whitespace-nowrap">
            {event.date}
          </div>

          {/* Event Title */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-gray-700 text-sm">
            {event.title}
          </div>
        </div>
      ))}
    </div>
  );
};
