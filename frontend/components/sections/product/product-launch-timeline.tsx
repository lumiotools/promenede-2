"use client";

import { useEffect, useState } from "react";
import { TimelineEvent, Timeline } from "../../timeline";
import { SectionHeader } from "@/components/ui/section-header";

export function ProductLaunchesTimeline() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/paypal.json");

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const jsonData = await response.json();

        if (
          jsonData?.data?.company_timeline &&
          Array.isArray(jsonData.data.company_timeline)
        ) {
          const timelineEvents = jsonData.data.company_timeline
            .filter((item: any) => item.event !== null)
            .slice(0, 4)
            .map((item: any) => ({
              date: formatDate(item.date),
              title: item.event,
            }));

          setEvents(timelineEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching timeline data:", error);
        setError("Failed to load timeline data");

        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (dateString.includes(".")) return dateString;

    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  if (loading)
    return <div className="p-6">Loading product launches timeline data...</div>;
  if (error && events.length === 0)
    return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="w-full bg-white">
     
      <h1 className="text-4xl font-medium text-[#475467]">Product Launches Timeline</h1>
      <div className="w-full h-px bg-[#e5e7eb] mb-16"></div>

      <Timeline events={events} />

      <div className="text-xs text-[#6b7280] mt-20 italic">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
