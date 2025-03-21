"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type {
  Competitor,
  CompetitorWebsite,
  CompetitiveAnalysis,
} from "@/types/competitor";

// Helper function to format numbers
const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "N/A";
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

type CompetitiveAnalysisProps = {
  initialData?: CompetitiveAnalysis;
};

const defaultState: CompetitiveAnalysis = {
  landscape: [],
  competitors: [],
  competitors_websites: [],
  financial_comparables: [],
  peer_developments: {
    funding_vs_founded: {
      company_data: null,
      competitors_data: [],
    },
    webtraffic_vs_founded: {
      company_data: null,
      competitors_data: [],
    },
  },
};

export default function CompetitorAnalysisPage({
  initialData = defaultState,
}: CompetitiveAnalysisProps) {
  // Ensure initialData is not null and has expected structure
  const safeInitialData = initialData || defaultState;

  const [data, setData] = useState<CompetitiveAnalysis>({
    ...safeInitialData,
    competitors: safeInitialData.competitors || [],
    competitors_websites: safeInitialData.competitors_websites || [],
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [editData, setEditData] = useState<CompetitiveAnalysis>({
    ...safeInitialData,
    competitors: safeInitialData.competitors || [],
    competitors_websites: safeInitialData.competitors_websites || [],
  });

  useEffect(() => {
    // Ensure we have valid data with the correct structure
    const validData = initialData || defaultState;
    setData({
      ...validData,
      competitors: validData.competitors || [],
      competitors_websites: validData.competitors_websites || [],
    });
  }, [initialData]);

  const startEditing = (): void => {
    setIsEditing(true);
    const dataCopy = JSON.parse(JSON.stringify(data));
    // Ensure arrays exist even after parsing
    dataCopy.competitors = dataCopy.competitors || [];
    dataCopy.competitors_websites = dataCopy.competitors_websites || [];
    setEditData(dataCopy);
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    setData(editData);
    setIsEditing(false);
  };

  const updateCompetitor = (
    index: number,
    field: keyof Competitor,
    value: string | number
  ): void => {
    const newData = { ...editData };
    // Ensure competitors array exists
    if (!newData.competitors) {
      newData.competitors = [];
    }

    if (newData.competitors[index]) {
      if (field === "similarity_score") {
        newData.competitors[index][field] = Number(value);
      } else {
        newData.competitors[index][field as keyof Competitor] = value as never;
      }
      setEditData(newData);
    }
  };

  const updateCompetitorWebsite = (
    index: number,
    field: keyof CompetitorWebsite,
    value: string | number
  ): void => {
    const newData = { ...editData };
    // Ensure competitors_websites array exists
    if (!newData.competitors_websites) {
      newData.competitors_websites = [];
    }

    if (newData.competitors_websites[index]) {
      if (
        field === "similarity_score" ||
        field === "total_website_visits_monthly" ||
        field === "rank_category"
      ) {
        newData.competitors_websites[index][field] = Number(value);
      } else {
        newData.competitors_websites[index][field as keyof CompetitorWebsite] =
          value as never;
      }
      setEditData(newData);
    }
  };

  const addCompetitor = (): void => {
    const newData = { ...editData };
    // Ensure competitors array exists
    if (!newData.competitors) {
      newData.competitors = [];
    }

    newData.competitors.push({
      company_name: "New Competitor",
      similarity_score: 0,
    });
    setEditData(newData);
  };

  const addCompetitorWebsite = (): void => {
    const newData = { ...editData };
    // Ensure competitors_websites array exists
    if (!newData.competitors_websites) {
      newData.competitors_websites = [];
    }

    newData.competitors_websites.push({
      website: "example.com",
      similarity_score: 0,
      total_website_visits_monthly: 0,
      category: "Category",
      rank_category: 0,
    });
    setEditData(newData);
  };

  const removeCompetitor = (index: number): void => {
    const newData = { ...editData };
    // Ensure competitors array exists
    if (!newData.competitors) {
      newData.competitors = [];
      return;
    }

    newData.competitors.splice(index, 1);
    setEditData(newData);
  };

  const removeCompetitorWebsite = (index: number): void => {
    const newData = { ...editData };
    // Ensure competitors_websites array exists
    if (!newData.competitors_websites) {
      newData.competitors_websites = [];
      return;
    }

    newData.competitors_websites.splice(index, 1);
    setEditData(newData);
  };

  // Ensure arrays exist for rendering
  const competitors = data.competitors || [];
  const competitors_websites = data.competitors_websites || [];

  // Check if competitors and websites data are empty
  const isCompetitorsEmpty = competitors.length === 0;
  const isWebsitesEmpty = competitors_websites.length === 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">
          Competitor Analysis
        </h1>
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

      <div className="border border-[#ced7db] rounded-sm overflow-hidden mb-12">
        <div className="flex justify-between items-center p-4 border-b border-[#ced7db]">
          <h2 className="text-[#445963] text-xl font-medium">
            Competitor Analysis
          </h2>
          {isEditing && (
            <div className="flex gap-2">
              <Button
                onClick={addCompetitor}
                size="sm"
                className="bg-[#156082] hover:bg-[#092a38] text-white"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Competitor
              </Button>
              <Button
                onClick={addCompetitorWebsite}
                size="sm"
                className="bg-[#156082] hover:bg-[#092a38] text-white"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Website
              </Button>
            </div>
          )}
        </div>

        {/* Main competitors table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="p-4 text-left font-medium text-lg border-r border-[#35454c]">
                  Company Name
                </th>
                {!isCompetitorsEmpty &&
                  competitors.map((competitor, index) => (
                    <th
                      key={index}
                      className="p-4 text-center font-medium text-lg border-r border-[#35454c]"
                    >
                      {competitor.company_name || "N/A"}
                    </th>
                  ))}
                {isCompetitorsEmpty && (
                  <th className="p-4 text-center font-medium text-lg border-r border-[#35454c]">
                    No competitors available
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#ced7db]">
                <td className="p-4 font-medium text-[#35454c] border-r border-[#ced7db]">
                  Similarity Score
                </td>
                {isEditing ? (
                  <>
                    {(editData.competitors || []).map((competitor, index) => (
                      <td
                        key={index}
                        className="p-4 text-center border-r border-[#ced7db]"
                      >
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            value={competitor.similarity_score || 0}
                            onChange={(e) =>
                              updateCompetitor(
                                index,
                                "similarity_score",
                                e.target.value
                              )
                            }
                            className="w-24 border border-[#ced7db] p-2 rounded text-center"
                          />
                          <button
                            onClick={() => removeCompetitor(index)}
                            className="ml-2 text-[#445963] hover:text-red-500"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    ))}
                  </>
                ) : (
                  <>
                    {competitors.map((competitor, index) => (
                      <td
                        key={index}
                        className="p-4 text-center text-[#35454c] border-r border-[#ced7db]"
                      >
                        {competitor.similarity_score || "N/A"}
                      </td>
                    ))}
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Competitor websites table */}
        <div className="mt-8 overflow-x-auto">
          <h3 className="p-4 text-[#445963] text-lg font-medium border-t border-[#ced7db]">
            Competitor Websites
          </h3>
          <table className="w-full">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="p-4 text-left font-medium text-lg">Website</th>
                <th className="p-4 text-left font-medium text-lg">
                  Similarity Score
                </th>
                <th className="p-4 text-left font-medium text-lg">
                  Monthly Visits
                </th>
                <th className="p-4 text-left font-medium text-lg">Category</th>
                <th className="p-4 text-left font-medium text-lg">
                  Rank in Category
                </th>
                {isEditing && (
                  <th className="p-4 text-left font-medium text-lg">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {isWebsitesEmpty && !isEditing ? (
                <tr className="border-t border-[#ced7db]">
                  <td colSpan={5} className="p-4 text-center text-[#57727e]">
                    No competitor websites available
                  </td>
                </tr>
              ) : isEditing ? (
                (editData.competitors_websites || []).map((website, index) => (
                  <tr key={index} className="border-t border-[#ced7db]">
                    <td className="p-4">
                      <input
                        type="text"
                        value={website.website || ""}
                        onChange={(e) =>
                          updateCompetitorWebsite(
                            index,
                            "website",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={website.similarity_score || 0}
                        onChange={(e) =>
                          updateCompetitorWebsite(
                            index,
                            "similarity_score",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={website.total_website_visits_monthly || 0}
                        onChange={(e) =>
                          updateCompetitorWebsite(
                            index,
                            "total_website_visits_monthly",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={website.category || ""}
                        onChange={(e) =>
                          updateCompetitorWebsite(
                            index,
                            "category",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={website.rank_category || 0}
                        onChange={(e) =>
                          updateCompetitorWebsite(
                            index,
                            "rank_category",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => removeCompetitorWebsite(index)}
                        className="text-[#445963] hover:text-red-500"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                competitors_websites.map((website, index) => (
                  <tr key={index} className="border-t border-[#ced7db]">
                    <td className="p-4 text-[#35454c]">
                      {website.website || "N/A"}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {website.similarity_score || "N/A"}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {formatNumber(website.total_website_visits_monthly)}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {website.category || "N/A"}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {website.rank_category || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
