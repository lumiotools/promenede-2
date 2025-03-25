"use client";

import { useState, useEffect } from "react";
import type { MarketInfo, MarketMap } from "@/types/market";
import { SectionLayout } from "@/components/ui/section-layout";

// Default state for the component
const defaultState: MarketInfo = {
  size: null,
  value_chain: null,
  market_map: {
    industry: "",
    segments: [],
    related_industries: [],
    segments_new: [],
  },
};

type MarketMapProps = {
  initialData?: MarketInfo;
};

export default function MarketMapPage({
  initialData = defaultState,
}: MarketMapProps) {
  // Ensure market_map exists and has the expected structure
  const safeMarketMap: MarketMap = initialData?.market_map || {
    industry: "",
    segments: [],
    related_industries: [],
    segments_new: [],
  };

  const [data, setData] = useState<MarketInfo>({
    ...initialData,
    market_map: safeMarketMap,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<MarketInfo>({
    ...initialData,
    market_map: safeMarketMap,
  });

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    // Ensure market_map exists and has the expected structure
    const updatedMarketMap: MarketMap = initialData.market_map || {
      industry: "",
      segments: [],
      related_industries: [],
      segments_new: [],
    };

    // Update the state with the new data
    setData({
      ...initialData,
      market_map: updatedMarketMap,
    });

    // If we're not in edit mode, also update the edit-related state
    if (!isEditing) {
      setEditData({
        ...initialData,
        market_map: updatedMarketMap,
      });
    }
  }, [initialData, isEditing]);

  // Safely access market_map data
  const marketMap = data.market_map || {
    industry: "",
    segments: [],
    related_industries: [],
    segments_new: [],
  };

  // Get segments from the structure - CHANGED FROM segments_new TO segments
  const segments = marketMap.segments || [];

  // Limit to top 4 segments for display
  const topSegments = segments.slice(0, 4);

  return (
    <SectionLayout
      title="Market Map"
      sourceText="Source: 1.PromenadeAI, 2.Crunchbase"
    >
      {segments.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-[#57727e] text-lg">No market map data present</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {topSegments.map((segment, index) => (
            <div
              key={index}
              className="border border-[#ced7db] rounded-lg overflow-hidden shadow-sm"
            >
              <div className="bg-[#002169] text-white p-3 flex justify-between items-center">
                <h3 className="font-medium">{segment.segment}</h3>
                <span className="text-sm">
                  {segment.companies.length} of {segment.companies.length}
                </span>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-3 gap-4">
                  {segment.companies
                    .slice(0, 12)
                    .map((company, companyIndex) => (
                      <div
                        key={companyIndex}
                        className="flex items-center justify-center h-12"
                      >
                        {segment.companyLogos &&
                        segment.companyLogos[companyIndex] ? (
                          <div className="relative h-8 w-full">
                            <img
                              src={
                                segment.companyLogos[companyIndex] ||
                                "/placeholder.svg"
                              }
                              alt={company}
                              className="object-contain h-full w-full"
                              onError={(e) => {
                                // If image fails to load, replace with company name
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.parentElement!.innerHTML = `<span class="text-xs text-center">${company}</span>`;
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-center">{company}</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionLayout>
  );
}
