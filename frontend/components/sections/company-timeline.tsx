import { useEffect, useState } from "react";

interface TimelineEvent {
  date: string;
  event: string;
  description: string;
}

export default function CompanyTimeline() {
  const [data, setData] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const timelineData: TimelineEvent[] = [
      { date: "2020.12.07", event: "Incorporate", description: "Company was incorporated" },
      { date: "2024.12.04", event: "Generative AI Platform", description: "Launch of Generative AI Platform" },
      { date: "2024.12.07", event: "Generative AI Platform", description: "Major update to Generative AI Platform" },
      { date: "2024.12.07", event: "Generative AI Platform", description: "International expansion of Generative AI Platform" },
    ];
    setData(timelineData);
  }, []);

  return (
    <div className="bg-white p-10">
      <h1 className="text-4xl font-medium text-gray-700 mb-6">Company Timeline</h1>
      <div className="border-t border-gray-300 mb-6"></div>

      <div className="relative py-16">
        {/* Horizontal line */}
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gray-400"></div>

        {/* Timeline Points */}
        <div className="relative">
          {data.map((event, index) => {
            const position = `${(index / (data.length - 1)) * 100}%`;
            const isTop = index % 2 === 0;
            return (
              <div key={index} className="absolute" style={{ left: position, top: "50%", transform: "translate(-50%, -50%)" }}>
                {/* Point */}
                <div className="w-3 h-3 rounded-full bg-gray-600 relative z-10"></div>

                {/* Label */}
                <div
                  className={`absolute ${isTop ? "bottom-4" : "top-4"} left-0 flex flex-col items-start whitespace-nowrap`}
                  style={{ transform: isTop ? "translateY(-100%)" : "translateY(100%)" }}
                >
                  {/* Diagonal Line */}
                  <div
                    className="absolute bg-gray-600"
                    style={{
                      width: "1px",
                      height: "30px",
                      bottom: isTop ? "-30px" : "auto",
                      top: isTop ? "auto" : "-30px",
                      left: "0",
                      transform: isTop ? "rotate(-45deg)" : "rotate(45deg)",
                      transformOrigin: isTop ? "bottom left" : "top left",
                    }}
                  ></div>

                  {/* Date */}
                  <div className="text-sm text-gray-700 font-medium ml-4">{event.date}</div>
                  {/* Event */}
                  <div className="text-sm text-gray-700 ml-4">{event.event}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-xs text-gray-500">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  );
}
