"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import { Badge } from "@/components/ui/badge";
import type { Strategy } from "@/types/strategy";

interface StrategyProps {
  initialData?: Strategy | null;
}

export default function StrategyComponent({ initialData }: StrategyProps) {
  const [data, setData] = useState<Strategy | null>(null);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, OpenAI"
  );

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleSave = (editedData: Strategy) => {
    setData(editedData);
    // Here you would typically send the data to an API
  };

  if (!data) {
    return (
      <SectionLayout title="Strategy" sourceText={sourceText}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No strategy data available</p>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout
      title="Strategy"
      sourceText={sourceText}
      initialData={data}
      onSave={handleSave}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Mission & Vision */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Mission & Vision
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Mission</h4>
                <p className="text-xs text-gray-600">
                  {data.mission || "No mission statement available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Vision</h4>
                <p className="text-xs text-gray-600">
                  {data.vision || "No vision statement available"}
                </p>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Core Values
            </h3>
            {data.coreValues && data.coreValues.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.coreValues.slice(0, 5).map((value, index) => (
                  <Badge key={index} variant="outline" className="bg-white">
                    {value}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">No core values available</p>
            )}
          </div>

          {/* Business Model */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Business Model
            </h3>
            <p className="text-xs text-gray-600">
              {data.businessModel || "No business model information available"}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Growth Strategy */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Growth Strategy
            </h3>
            <p className="text-xs text-gray-600">
              {data.growthStrategy ||
                "No growth strategy information available"}
            </p>
          </div>

          {/* Competitive Advantage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Competitive Advantage
            </h3>
            <p className="text-xs text-gray-600">
              {data.competitiveAdvantage ||
                "No competitive advantage information available"}
            </p>
          </div>

          {/* Key Initiatives */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Key Initiatives
            </h3>
            {data.keyInitiatives && data.keyInitiatives.length > 0 ? (
              <div className="space-y-3">
                {data.keyInitiatives.slice(0, 4).map((initiative, index) => (
                  <div
                    key={index}
                    className={index > 0 ? "pt-2 border-t border-gray-200" : ""}
                  >
                    <h4 className="text-sm font-medium text-gray-700">
                      {initiative.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {initiative.description}
                    </p>
                    <p className="text-xs text-gray-500 italic mt-1">
                      Expected outcome: {initiative.expectedOutcome}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">
                No key initiatives available
              </p>
            )}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
