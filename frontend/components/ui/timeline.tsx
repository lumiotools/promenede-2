export interface TimelineEvent {
    date: string
    title: string
  }
  
  interface TimelineProps {
    events: TimelineEvent[]
  }
  
  export function Timeline({ events }: TimelineProps) {
    // Only display up to 2 events
    const displayEvents = events.slice(0, 2)
  
    return (
      <div className="relative w-full h-48">
        {/* Horizontal timeline line */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-[#6b7280]"></div>
  
        {/* Timeline points */}
        {displayEvents.map((event, index) => {
          // First point at 20%, second at 70%
          const position = index === 0 ? "20%" : "70%"
  
          // First point goes up, second goes down
          const isUp = index === 0
  
          return (
            <div key={index} className="absolute top-1/2 -translate-y-1/2" style={{ left: position }}>
              {/* Dot */}
              <div className="w-4 h-4 rounded-full bg-[#6b7280]"></div>
  
              {/* Diagonal line */}
              <div
                className="absolute w-px bg-[#6b7280]"
                style={{
                  height: "100px",
                  left: "8px",
                  top: isUp ? "-50px" : "8px",
                  transform: isUp ? "rotate(-45deg)" : "rotate(45deg)",
                  transformOrigin: isUp ? "bottom left" : "top left",
                }}
              ></div>
  
              {/* Text container */}
              <div
                className="absolute"
                style={{
                  left: "32px",
                  top: isUp ? "-90px" : "50px",
                }}
              >
                <p className="text-[#475467] text-base">{event.date}</p>
                <p className="text-[#475467] text-base">{event.title}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  
  