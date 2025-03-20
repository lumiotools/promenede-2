"use client";

import { useState } from "react";
import { competitiveAnalysis as initialData } from "./competitorData";
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

export default function CompetitorAnalysisPage() {
  const [data, setData] = useState<CompetitiveAnalysis>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<CompetitiveAnalysis>(initialData);

  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(data)));
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
    if (field === "similarityScore") {
      newData.competitors[index][field] = Number(value);
    } else {
      newData.competitors[index][field as keyof Competitor] = value as never;
    }
    setEditData(newData);
  };

  const updateCompetitorWebsite = (
    index: number,
    field: keyof CompetitorWebsite,
    value: string | number
  ): void => {
    const newData = { ...editData };
    if (
      field === "similarityScore" ||
      field === "totalWebsiteVisitsMonthly" ||
      field === "rankCategory"
    ) {
      newData.competitorsWebsites[index][field] = Number(value);
    } else {
      newData.competitorsWebsites[index][field as keyof CompetitorWebsite] =
        value as never;
    }
    setEditData(newData);
  };

  const addCompetitor = (): void => {
    const newData = { ...editData };
    newData.competitors.push({
      companyName: "New Competitor",
      similarityScore: 0,
    });
    setEditData(newData);
  };

  const addCompetitorWebsite = (): void => {
    const newData = { ...editData };
    newData.competitorsWebsites.push({
      website: "example.com",
      similarityScore: 0,
      totalWebsiteVisitsMonthly: 0,
      category: "Category",
      rankCategory: 0,
    });
    setEditData(newData);
  };

  const removeCompetitor = (index: number): void => {
    const newData = { ...editData };
    newData.competitors.splice(index, 1);
    setEditData(newData);
  };

  const removeCompetitorWebsite = (index: number): void => {
    const newData = { ...editData };
    newData.competitorsWebsites.splice(index, 1);
    setEditData(newData);
  };

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
                {data.competitors.length > 0 &&
                  data.competitors.map((competitor, index) => (
                    <th
                      key={index}
                      className="p-4 text-center font-medium text-lg border-r border-[#35454c]"
                    >
                      {competitor.companyName || "N/A"}
                    </th>
                  ))}
                {data.competitors.length === 0 && (
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
                    {editData.competitors.map((competitor, index) => (
                      <td
                        key={index}
                        className="p-4 text-center border-r border-[#ced7db]"
                      >
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            value={competitor.similarityScore}
                            onChange={(e) =>
                              updateCompetitor(
                                index,
                                "similarityScore",
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
                    {data.competitors.map((competitor, index) => (
                      <td
                        key={index}
                        className="p-4 text-center text-[#35454c] border-r border-[#ced7db]"
                      >
                        {competitor.similarityScore || "N/A"}
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
              {data.competitorsWebsites.length === 0 && !isEditing ? (
                <tr className="border-t border-[#ced7db]">
                  <td colSpan={5} className="p-4 text-center text-[#57727e]">
                    No competitor websites available
                  </td>
                </tr>
              ) : isEditing ? (
                editData.competitorsWebsites.map((website, index) => (
                  <tr key={index} className="border-t border-[#ced7db]">
                    <td className="p-4">
                      <input
                        type="text"
                        value={website.website}
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
                        value={website.similarityScore}
                        onChange={(e) =>
                          updateCompetitorWebsite(
                            index,
                            "similarityScore",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={website.totalWebsiteVisitsMonthly}
                        onChange={(e) =>
                          updateCompetitorWebsite(
                            index,
                            "totalWebsiteVisitsMonthly",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={website.category}
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
                        value={website.rankCategory}
                        onChange={(e) =>
                          updateCompetitorWebsite(
                            index,
                            "rankCategory",
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
                data.competitorsWebsites.map((website, index) => (
                  <tr key={index} className="border-t border-[#ced7db]">
                    <td className="p-4 text-[#35454c]">
                      {website.website || "N/A"}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {website.similarityScore || "N/A"}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {formatNumber(website.totalWebsiteVisitsMonthly)}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {website.category || "N/A"}
                    </td>
                    <td className="p-4 text-[#35454c]">
                      {website.rankCategory || "N/A"}
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
