/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { MarketInfo, MarketMap } from "@/types/market";

// Default state for the component
const defaultState: MarketInfo = {
  size: null,
  value_chain: null,
  market_map: {
    industry: "",
    segments: [],
    related_industries: [],
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

  // State for managing segments and related industries
  const [editSegments, setEditSegments] = useState<string[]>(
    safeMarketMap.segments || []
  );
  const [editRelatedIndustries, setEditRelatedIndustries] = useState<string[]>(
    safeMarketMap.related_industries || []
  );
  const [editIndustry, setEditIndustry] = useState<string>(
    safeMarketMap.industry || ""
  );

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    console.log("market map initialData update:", initialData);

    // Ensure market_map exists and has the expected structure
    const updatedMarketMap: MarketMap = initialData.market_map || {
      industry: "",
      segments: [],
      related_industries: [],
    };

    // Update the state with the new data
    setData({
      ...initialData,
      market_map: updatedMarketMap,
    });

    // If we're not in edit mode, also update the edit-related state
    if (!isEditing) {
      setEditSegments(updatedMarketMap.segments || []);
      setEditRelatedIndustries(updatedMarketMap.related_industries || []);
      setEditIndustry(updatedMarketMap.industry || "");
    }
  }, [initialData, isEditing]);

  const startEditing = (): void => {
    setIsEditing(true);

    // Ensure we have the latest data
    const safeSegments = data.market_map?.segments || [];
    const safeRelatedIndustries = data.market_map?.related_industries || [];
    const safeIndustry = data.market_map?.industry || "";

    // Create deep copies to avoid reference issues
    setEditSegments([...safeSegments]);
    setEditRelatedIndustries([...safeRelatedIndustries]);
    setEditIndustry(safeIndustry);
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    const newData = { ...data };

    // Ensure market_map exists
    if (!newData.market_map) {
      newData.market_map = {
        industry: "",
        segments: [],
        related_industries: [],
      };
    }

    newData.market_map.segments = editSegments;
    newData.market_map.related_industries = editRelatedIndustries;
    newData.market_map.industry = editIndustry;

    setData(newData);
    setIsEditing(false);
  };

  const addSegment = (): void => {
    setEditSegments([...editSegments, "New Segment"]);
  };

  const removeSegment = (index: number): void => {
    const newSegments = [...editSegments];
    newSegments.splice(index, 1);
    setEditSegments(newSegments);
  };

  const updateSegment = (index: number, value: string): void => {
    const newSegments = [...editSegments];
    newSegments[index] = value;
    setEditSegments(newSegments);
  };

  const addRelatedIndustry = (): void => {
    setEditRelatedIndustries([
      ...editRelatedIndustries,
      "New Related Industry",
    ]);
  };

  const removeRelatedIndustry = (index: number): void => {
    const newRelatedIndustries = [...editRelatedIndustries];
    newRelatedIndustries.splice(index, 1);
    setEditRelatedIndustries(newRelatedIndustries);
  };

  const updateRelatedIndustry = (index: number, value: string): void => {
    const newRelatedIndustries = [...editRelatedIndustries];
    newRelatedIndustries[index] = value;
    setEditRelatedIndustries(newRelatedIndustries);
  };

  // Safely access market_map data
  const marketMap = data.market_map || {
    industry: "",
    segments: [],
    related_industries: [],
  };
  const segments = marketMap.segments || [];
  const relatedIndustries = marketMap.related_industries || [];
  const industry = marketMap.industry || "";

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">Market Map</h1>
        {!isEditing ? (
          <Button
            onClick={startEditing}
            className="bg-[#156082] hover:bg-[#092a38] text-white"
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={saveChanges}
              className="bg-[#156082] hover:bg-[#092a38] text-white"
            >
              <SaveIcon className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button
              onClick={cancelEditing}
              variant="outline"
              className="border-[#ced7db] text-[#445963]"
            >
              <XIcon className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        )}
      </div>
      <div className="border-t border-[#ced7db] mb-12"></div>

      {isEditing ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-[#445963] text-xl font-medium mb-4">
              Industry
            </h2>
            <input
              type="text"
              value={editIndustry}
              onChange={(e) => setEditIndustry(e.target.value)}
              className="w-full border border-[#ced7db] p-2 rounded mb-4"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#445963] text-xl font-medium">Segments</h2>
              <Button
                onClick={addSegment}
                size="sm"
                className="bg-[#156082] hover:bg-[#092a38] text-white"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Segment
              </Button>
            </div>
            <div className="space-y-2">
              {editSegments.map((segment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={segment}
                    onChange={(e) => updateSegment(index, e.target.value)}
                    className="flex-1 border border-[#ced7db] p-2 rounded"
                  />
                  <button
                    onClick={() => removeSegment(index)}
                    className="text-[#445963] hover:text-red-500"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              ))}
              {editSegments.length === 0 && (
                <div className="text-center py-4 text-[#57727e]">
                  No segments added yet. Click &quot;Add Segment&quot; to add
                  one.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#445963] text-xl font-medium">
                Related Industries
              </h2>
              <Button
                onClick={addRelatedIndustry}
                size="sm"
                className="bg-[#156082] hover:bg-[#092a38] text-white"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Related Industry
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {editRelatedIndustries.map((industry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) =>
                      updateRelatedIndustry(index, e.target.value)
                    }
                    className="flex-1 border border-[#ced7db] p-2 rounded"
                  />
                  <button
                    onClick={() => removeRelatedIndustry(index)}
                    className="text-[#445963] hover:text-red-500"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              ))}
              {editRelatedIndustries.length === 0 && (
                <div className="col-span-3 text-center py-4 text-[#57727e]">
                  No related industries added yet. Click &quot;Add Related
                  Industry&quot; to add one.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {!industry &&
          segments.length === 0 &&
          relatedIndustries.length === 0 ? (
            <div className="text-center py-12 text-[#57727e] text-lg">
              No market map data present
            </div>
          ) : (
            <div className="space-y-12">
              {/* Main Industry Section */}
              <div className="flex flex-col items-center">
                <div className="bg-[#002169] text-white px-8 py-4 rounded-md text-center w-full max-w-md">
                  <h2 className="text-xl font-medium">{industry || "N/A"}</h2>
                </div>
                <div className="h-8 border-l-2 border-[#ced7db]"></div>
              </div>

              {/* Segments Section */}
              <div className="space-y-4">
                <h2 className="text-[#445963] text-2xl font-medium text-center">
                  Industry Segments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {segments.length > 0 ? (
                    segments.map((segment, index) => (
                      <div
                        key={index}
                        className="bg-[#eff2f3] border border-[#ced7db] rounded-md p-4 text-center shadow-sm hover:shadow-md transition-shadow"
                      >
                        <span className="text-[#445963] font-medium">
                          {segment}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-4 text-[#57727e]">
                      No segments available
                    </div>
                  )}
                </div>
              </div>

              {/* Related Industries Section */}
              <div className="space-y-4">
                <h2 className="text-[#445963] text-2xl font-medium text-center">
                  Related Industries
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {relatedIndustries.length > 0 ? (
                    relatedIndustries.map((industry, index) => (
                      <div
                        key={index}
                        className="bg-[#e5e7eb] border border-[#ced7db] rounded-full px-4 py-2 text-[#445963]"
                      >
                        {industry}
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-4 text-[#57727e]">
                      No related industries available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-16 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
