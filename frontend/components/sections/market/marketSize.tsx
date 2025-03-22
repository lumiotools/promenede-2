"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export interface SizeData {
  industryName: string | null;
  pastYearData: YearData | null;
  yearBeforeData: YearData | null;
  projectionFor2030: YearData | null;
}

export interface YearData {
  marketSize: string | null;
  cagr: string | null;
  explanation: string | null;
  keyIndustryTrends: string[] | null;
  keyExcerpt: string | null;
}

// Define a type that only includes the year data fields
type YearDataField = "pastYearData" | "yearBeforeData" | "projectionFor2030";

interface MarketSizePageProps {
  initialData?: SizeData | null;
}

export default function MarketSizePage({ initialData }: MarketSizePageProps) {
  const [data, setData] = useState<SizeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<SizeData | null>(null);

  useEffect(() => {
    // Simulate loading data
    setData(initialData || null);
    setEditData(initialData || null);
    setLoading(false);
  }, [initialData]);

  const handleSave = () => {
    setData(editData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditData(data);
    setEditMode(true);
  };

  const handleAddData = () => {
    const emptyData: SizeData = {
      industryName: "",
      pastYearData: {
        marketSize: "",
        cagr: "",
        explanation: "",
        keyIndustryTrends: [],
        keyExcerpt: "",
      },
      yearBeforeData: {
        marketSize: "",
        cagr: "",
        explanation: "",
        keyIndustryTrends: [],
        keyExcerpt: "",
      },
      projectionFor2030: {
        marketSize: "",
        cagr: "",
        explanation: "",
        keyIndustryTrends: [],
        keyExcerpt: "",
      },
    };

    setEditData(emptyData);
    setEditMode(true);
  };

  const updateEditData = (field: string, value: string | null) => {
    if (!editData) return;

    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const updateYearData = (
    yearField: YearDataField,
    field: keyof YearData,
    value: string | null
  ) => {
    if (!editData) return;

    // Create a new empty YearData object if the field is null
    const currentYearData = editData[yearField] || {
      marketSize: null,
      cagr: null,
      explanation: null,
      keyIndustryTrends: null,
      keyExcerpt: null,
    };

    setEditData({
      ...editData,
      [yearField]: {
        ...currentYearData,
        [field]: value,
      },
    });
  };

  const updateTrends = (yearField: YearDataField, value: string) => {
    if (!editData) return;

    // Create a new empty YearData object if the field is null
    const currentYearData = editData[yearField] || {
      marketSize: null,
      cagr: null,
      explanation: null,
      keyIndustryTrends: null,
      keyExcerpt: null,
    };

    const trends = value.split("\n").filter((trend) => trend.trim() !== "");

    setEditData({
      ...editData,
      [yearField]: {
        ...currentYearData,
        keyIndustryTrends: trends.length > 0 ? trends : null,
      },
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-[#445963]">Market Size</h1>
        <Separator className="my-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data && !editMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold text-[#445963]">Market Size</h1>
          <Button
            onClick={handleAddData}
            className="bg-[#156082] hover:bg-[#092a38]"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Market Data
          </Button>
        </div>
        <Separator className="my-4" />
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-xl font-medium text-[#35454c]">
                No market data available
              </h3>
              <p className="text-[#57727e] mt-2">
                Click the button above to add market size information
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-[#445963]">Market Size</h1>
        {!editMode ? (
          <div className="space-x-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-[#156082] text-[#156082]"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Data
            </Button>
            {!data && (
              <Button
                onClick={handleAddData}
                className="bg-[#156082] hover:bg-[#092a38]"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Market Data
              </Button>
            )}
          </div>
        ) : (
          <div className="space-x-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-red-500 text-red-500"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#156082] hover:bg-[#092a38]"
            >
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        )}
      </div>
      <Separator className="my-4" />

      {editMode ? (
        <EditForm
          data={editData}
          updateEditData={updateEditData}
          updateYearData={updateYearData}
          updateTrends={updateTrends}
        />
      ) : (
        <MarketSizeTable data={data} />
      )}
    </div>
  );
}

interface EditFormProps {
  data: SizeData | null;
  updateEditData: (field: string, value: string | null) => void;
  updateYearData: (
    yearField: YearDataField,
    field: keyof YearData,
    value: string | null
  ) => void;
  updateTrends: (yearField: YearDataField, value: string) => void;
}

function EditForm({
  data,
  updateEditData,
  updateYearData,
  updateTrends,
}: EditFormProps) {
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Market Size Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Industry Name
            </label>
            <Input
              value={data.industryName || ""}
              onChange={(e) => updateEditData("industryName", e.target.value)}
              placeholder="Enter industry name"
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Past Year Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Market Size
                </label>
                <Input
                  value={data.pastYearData?.marketSize || ""}
                  onChange={(e) =>
                    updateYearData("pastYearData", "marketSize", e.target.value)
                  }
                  placeholder="e.g. $3,661.89 million"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CAGR</label>
                <Input
                  value={data.pastYearData?.cagr || ""}
                  onChange={(e) =>
                    updateYearData("pastYearData", "cagr", e.target.value)
                  }
                  placeholder="e.g. 37.9%"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Explanation
                </label>
                <Textarea
                  value={data.pastYearData?.explanation || ""}
                  onChange={(e) =>
                    updateYearData(
                      "pastYearData",
                      "explanation",
                      e.target.value
                    )
                  }
                  placeholder="Enter market explanation"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Key Industry Trends (one per line)
                </label>
                <Textarea
                  value={data.pastYearData?.keyIndustryTrends?.join("\n") || ""}
                  onChange={(e) => updateTrends("pastYearData", e.target.value)}
                  placeholder="Enter trends, one per line"
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Key Excerpt
                </label>
                <Textarea
                  value={data.pastYearData?.keyExcerpt || ""}
                  onChange={(e) =>
                    updateYearData("pastYearData", "keyExcerpt", e.target.value)
                  }
                  placeholder="Enter key excerpt"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Year Before Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Market Size
                </label>
                <Input
                  value={data.yearBeforeData?.marketSize || ""}
                  onChange={(e) =>
                    updateYearData(
                      "yearBeforeData",
                      "marketSize",
                      e.target.value
                    )
                  }
                  placeholder="e.g. $2,500.00 million"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CAGR</label>
                <Input
                  value={data.yearBeforeData?.cagr || ""}
                  onChange={(e) =>
                    updateYearData("yearBeforeData", "cagr", e.target.value)
                  }
                  placeholder="e.g. 35.2%"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Explanation
                </label>
                <Textarea
                  value={data.yearBeforeData?.explanation || ""}
                  onChange={(e) =>
                    updateYearData(
                      "yearBeforeData",
                      "explanation",
                      e.target.value
                    )
                  }
                  placeholder="Enter market explanation"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Key Industry Trends (one per line)
                </label>
                <Textarea
                  value={
                    data.yearBeforeData?.keyIndustryTrends?.join("\n") || ""
                  }
                  onChange={(e) =>
                    updateTrends("yearBeforeData", e.target.value)
                  }
                  placeholder="Enter trends, one per line"
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Key Excerpt
                </label>
                <Textarea
                  value={data.yearBeforeData?.keyExcerpt || ""}
                  onChange={(e) =>
                    updateYearData(
                      "yearBeforeData",
                      "keyExcerpt",
                      e.target.value
                    )
                  }
                  placeholder="Enter key excerpt"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Projection for 2030</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Market Size
                </label>
                <Input
                  value={data.projectionFor2030?.marketSize || ""}
                  onChange={(e) =>
                    updateYearData(
                      "projectionFor2030",
                      "marketSize",
                      e.target.value
                    )
                  }
                  placeholder="e.g. $66,079.34 million"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CAGR</label>
                <Input
                  value={data.projectionFor2030?.cagr || ""}
                  onChange={(e) =>
                    updateYearData("projectionFor2030", "cagr", e.target.value)
                  }
                  placeholder="e.g. 37.9%"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Explanation
                </label>
                <Textarea
                  value={data.projectionFor2030?.explanation || ""}
                  onChange={(e) =>
                    updateYearData(
                      "projectionFor2030",
                      "explanation",
                      e.target.value
                    )
                  }
                  placeholder="Enter market explanation"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Key Industry Trends (one per line)
                </label>
                <Textarea
                  value={
                    data.projectionFor2030?.keyIndustryTrends?.join("\n") || ""
                  }
                  onChange={(e) =>
                    updateTrends("projectionFor2030", e.target.value)
                  }
                  placeholder="Enter trends, one per line"
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Key Excerpt
                </label>
                <Textarea
                  value={data.projectionFor2030?.keyExcerpt || ""}
                  onChange={(e) =>
                    updateYearData(
                      "projectionFor2030",
                      "keyExcerpt",
                      e.target.value
                    )
                  }
                  placeholder="Enter key excerpt"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MarketSizeTableProps {
  data: SizeData | null;
}

function MarketSizeTable({ data }: MarketSizeTableProps) {
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#445963]">
          Market size estimates for {data.industryName || "Industry"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="p-3 text-left font-medium">Market</th>
                <th className="p-3 text-left font-medium">Key excerpts</th>
              </tr>
            </thead>
            <tbody>
              {data.pastYearData && (
                <tr className="border-b border-[#ced7db]">
                  <td className="p-3 align-top">
                    <div className="font-medium">
                      {data.industryName || "Industry"} Market (Past Year)
                    </div>
                    {data.pastYearData.marketSize && (
                      <div className="text-sm text-[#57727e] mt-1">
                        Market Size: {data.pastYearData.marketSize}
                      </div>
                    )}
                    {data.pastYearData.cagr && (
                      <div className="text-sm text-[#57727e] mt-1">
                        CAGR: {data.pastYearData.cagr}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    {data.pastYearData.keyExcerpt ? (
                      <ul className="list-disc pl-5 space-y-2">
                        <li>{data.pastYearData.keyExcerpt}</li>
                        {data.pastYearData.explanation && (
                          <li>{data.pastYearData.explanation}</li>
                        )}
                        {data.pastYearData.keyIndustryTrends?.map(
                          (trend, index) => (
                            <li key={index}>{trend}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <span className="text-[#8097a2]">Not available</span>
                    )}
                  </td>
                </tr>
              )}

              {data.yearBeforeData && (
                <tr className="border-b border-[#ced7db] bg-[#f8f9fa]">
                  <td className="p-3 align-top">
                    <div className="font-medium">
                      {data.industryName || "Industry"} Market (Year Before)
                    </div>
                    {data.yearBeforeData.marketSize && (
                      <div className="text-sm text-[#57727e] mt-1">
                        Market Size: {data.yearBeforeData.marketSize}
                      </div>
                    )}
                    {data.yearBeforeData.cagr && (
                      <div className="text-sm text-[#57727e] mt-1">
                        CAGR: {data.yearBeforeData.cagr}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    {data.yearBeforeData.keyExcerpt ? (
                      <ul className="list-disc pl-5 space-y-2">
                        <li>{data.yearBeforeData.keyExcerpt}</li>
                        {data.yearBeforeData.explanation && (
                          <li>{data.yearBeforeData.explanation}</li>
                        )}
                        {data.yearBeforeData.keyIndustryTrends?.map(
                          (trend, index) => (
                            <li key={index}>{trend}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <span className="text-[#8097a2]">Not available</span>
                    )}
                  </td>
                </tr>
              )}

              {data.projectionFor2030 && (
                <tr>
                  <td className="p-3 align-top">
                    <div className="font-medium">
                      {data.industryName || "Industry"} Market (Projection for
                      2030)
                    </div>
                    {data.projectionFor2030.marketSize && (
                      <div className="text-sm text-[#57727e] mt-1">
                        Market Size: {data.projectionFor2030.marketSize}
                      </div>
                    )}
                    {data.projectionFor2030.cagr && (
                      <div className="text-sm text-[#57727e] mt-1">
                        CAGR: {data.projectionFor2030.cagr}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    {data.projectionFor2030.keyExcerpt ? (
                      <ul className="list-disc pl-5 space-y-2">
                        <li>{data.projectionFor2030.keyExcerpt}</li>
                        {data.projectionFor2030.explanation && (
                          <li>{data.projectionFor2030.explanation}</li>
                        )}
                        {data.projectionFor2030.keyIndustryTrends?.map(
                          (trend, index) => (
                            <li key={index}>{trend}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <span className="text-[#8097a2]">Not available</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!data.pastYearData &&
          !data.yearBeforeData &&
          !data.projectionFor2030 && (
            <div className="text-center py-8">
              <p className="text-[#57727e]">No market data available</p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
