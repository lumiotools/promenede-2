"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, PlusIcon, XIcon } from "lucide-react";
import type { ExecutiveSummary } from "@/types/executive";
import { SectionLayout } from "@/components/ui/section-layout";

interface ExecutiveSummaryProps {
  initialData: ExecutiveSummary | undefined;
  onDataUpdate?: (data: ExecutiveSummary) => void;
}

interface FinancialDataEntry {
  value?: number | null;
  date?: string | null;
  currency?: string | null;
}

export function ExecutiveSummaryPage({
  initialData,
  onDataUpdate,
}: ExecutiveSummaryProps) {
  const [masterEditMode, setMasterEditMode] = useState(false);
  const [data, setData] = useState<ExecutiveSummary | undefined>(initialData);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [editDescription, setEditDescription] = useState(
    data?.description || ""
  );
  const [editIndustry, setEditIndustry] = useState(data?.industry || "");
  const [editValuation, setEditValuation] = useState(
    data?.valuation?.value || 0
  );
  const [editFundingTotal, setEditFundingTotal] = useState(
    data?.funding_total?.value || 0
  );
  const [editEquityFunding, setEditEquityFunding] = useState(
    data?.equity_funding_total?.value || 0
  );

  const [editFinancialHighlights, setEditFinancialHighlights] = useState<{
    [key: string]: { value: number | null; date: string | null };
  }>({});

  useEffect(() => {
    setData(initialData);
    setEditDescription(initialData?.description || "");
    setEditIndustry(initialData?.industry || "");
    setEditValuation(initialData?.valuation?.value || 0);
    setEditFundingTotal(initialData?.funding_total?.value || 0);
    setEditEquityFunding(initialData?.equity_funding_total?.value || 0);
  }, [initialData]);

  useEffect(() => {
    if (onDataUpdate && data) {
      onDataUpdate(data);
    }
  }, [data]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSaveDescription = () => {
    if (data) {
      setData({
        ...data,
        description: editDescription,
      });
    }
    setEditMode(null);
  };

  const handleSaveIndustry = () => {
    if (data) {
      setData({
        ...data,
        industry: editIndustry,
      });
    }
    setEditMode(null);
  };

  const handleSaveValuation = () => {
    if (data) {
      setData({
        ...data,
        valuation: {
          ...data.valuation,
          value: editValuation,
          value_usd: editValuation,
        },
      });
    }
    setEditMode(null);
  };

  const handleSaveFundingTotal = () => {
    if (data) {
      setData({
        ...data,
        funding_total: {
          ...data.funding_total,
          value: editFundingTotal,
          value_usd: editFundingTotal,
        },
      });
    }
    setEditMode(null);
  };

  const handleSaveEquityFunding = () => {
    if (data) {
      setData({
        ...data,
        equity_funding_total: {
          ...data.equity_funding_total,
          value: editEquityFunding,
          value_usd: editEquityFunding,
        },
      });
    }
    setEditMode(null);
  };

  const handleAddTag = () => {
    if (newTag.trim() === "") return;
    if (data) {
      const currentTags = data.topic_tags || [];
      setData({
        ...data,
        topic_tags: [...currentTags, newTag.trim()],
      });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (data && data.topic_tags) {
      setData({
        ...data,
        topic_tags: data.topic_tags.filter((tag) => tag !== tagToRemove),
      });
    }
  };

  const getLatestFinancialData = (
    dataArray: FinancialDataEntry[] | null | undefined
  ) => {
    if (!dataArray || dataArray.length === 0) return null;
    return dataArray.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })[0];
  };

  const handleFinancialDataChange = (
    metric: string,
    value: number | null,
    date: string | null
  ) => {
    setEditFinancialHighlights((prev) => ({
      ...prev,
      [metric]: { value, date },
    }));
  };

  const handleSaveFinancialHighlights = () => {
    if (data) {
      const updatedData = { ...data };

      if (!updatedData.financial_highlights) {
        updatedData.financial_highlights = {};
      }

      Object.keys(editFinancialHighlights).forEach((metricKey) => {
        switch (metricKey) {
          case "operating_revenue":
          case "operating_profit":
          case "ebitda":
          case "net_income":
            const metricArray =
              updatedData.financial_highlights?.[metricKey] || [];

            if (metricArray && metricArray.length > 0) {
              metricArray[0] = {
                ...metricArray[0],
                value: editFinancialHighlights[metricKey].value,
                date: editFinancialHighlights[metricKey].date,
              };
            } else {
              if (!updatedData.financial_highlights) {
                updatedData.financial_highlights = {};
              }
              updatedData.financial_highlights[metricKey] = [
                {
                  value: editFinancialHighlights[metricKey].value,
                  date: editFinancialHighlights[metricKey].date,
                  currency: "USD",
                },
              ];
            }
            break;

          case "per":
            if (!updatedData.financial_highlights) {
              updatedData.financial_highlights = {};
            }

            if (!updatedData.financial_highlights.per) {
              updatedData.financial_highlights.per = {};
            }

            updatedData.financial_highlights.per = {
              ...updatedData.financial_highlights.per,
              value: editFinancialHighlights[metricKey].value,
              date: editFinancialHighlights[metricKey].date,
            };
            break;

          default:
            break;
        }
      });

      setData({ ...updatedData });

      if (onDataUpdate) {
        onDataUpdate(updatedData);
      }
    }
    setEditMode(null);
  };

  const handleSaveFinancialData = () => {
    if (data) {
      const updatedData = {
        ...data,
        valuation: {
          ...data.valuation,
          value: editValuation,
          value_usd: editValuation,
        },
        equity_funding_total: {
          ...data.equity_funding_total,
          value: editEquityFunding,
          value_usd: editEquityFunding,
        },
        funding_total: {
          ...data.funding_total,
          value: editFundingTotal,
          value_usd: editFundingTotal,
        },
      };

      setData(updatedData);

      if (onDataUpdate) {
        onDataUpdate(updatedData);
      }
    }
    setEditMode(null);
  };

  useEffect(() => {
    if (!masterEditMode) {
      setEditMode(null);
    }
  }, [masterEditMode]);

  return (
    <SectionLayout
      title="Executive Summary"
      sourceText="Source: Coresignal, Crunchbase, Perplexity"
    >
      <div className="p-4">
        <div className="hidden flex justify-between items-center mb-2 border-b border-gray-200 pb-1">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 ml-auto"
            onClick={() => setMasterEditMode(!masterEditMode)}
          >
            <PencilIcon className="h-3 w-3 mr-1" />
            {masterEditMode ? "Save All" : "Edit"}
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-8">
            <Card className="border-gray-200 shadow-sm mb-4">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-700 text-lg">
                  Company Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  <div className="flex">
                    <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-2 text-sm font-medium">
                      Industry
                    </div>
                    <div className="flex-1 p-2">
                      {editMode === "industry" ? (
                        <div className="flex gap-2">
                          <Input
                            value={editIndustry || ""}
                            onChange={(e) => setEditIndustry(e.target.value)}
                            className="flex-1 h-7 text-sm"
                          />
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleSaveIndustry}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {data?.industry || "N/A"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode("industry")}
                            className={`h-5 w-5 p-0 ${
                              !masterEditMode && "hidden"
                            }`}
                          >
                            <PencilIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-2 text-sm font-medium">
                      Topic Tags
                    </div>
                    <div className="flex-1 p-2">
                      <div className="flex flex-wrap gap-1">
                        {data?.topic_tags?.slice(0, 5).map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs py-0.5"
                          >
                            {tag}
                            {masterEditMode && (
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                              >
                                <XIcon className="h-2 w-2" />
                              </button>
                            )}
                          </Badge>
                        ))}
                        {data?.topic_tags && data.topic_tags.length > 5 && (
                          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs py-0.5">
                            +{data.topic_tags.length - 5} more
                          </Badge>
                        )}
                      </div>
                      {masterEditMode && (
                        <div className="flex gap-1 mt-1">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add new tag"
                            className="flex-1 h-6 text-xs"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddTag();
                                e.preventDefault();
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={handleAddTag}
                          >
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-2 text-sm font-medium">
                      Valuation
                    </div>
                    <div className="flex-1 p-2">
                      {editMode === "valuation" ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editValuation || 0}
                            onChange={(e) =>
                              setEditValuation(Number(e.target.value))
                            }
                            className="flex-1 h-7 text-sm"
                          />
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleSaveValuation}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {formatCurrency(data?.valuation?.value)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode("valuation")}
                            className={`h-5 w-5 p-0 ${
                              !masterEditMode && "hidden"
                            }`}
                          >
                            <PencilIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-2 text-sm font-medium">
                      Equity Funding Total
                    </div>
                    <div className="flex-1 p-2">
                      {editMode === "equity_funding" ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editEquityFunding || 0}
                            onChange={(e) =>
                              setEditEquityFunding(Number(e.target.value))
                            }
                            className="flex-1 h-7 text-sm"
                          />
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleSaveEquityFunding}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {formatCurrency(data?.equity_funding_total?.value)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode("equity_funding")}
                            className={`h-5 w-5 p-0 ${
                              !masterEditMode && "hidden"
                            }`}
                          >
                            <PencilIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-2 text-sm font-medium">
                      Funding Total
                    </div>
                    <div className="flex-1 p-2">
                      {editMode === "funding_total" ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editFundingTotal || 0}
                            onChange={(e) =>
                              setEditFundingTotal(Number(e.target.value))
                            }
                            className="flex-1 h-7 text-sm"
                          />
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleSaveFundingTotal}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {formatCurrency(data?.funding_total?.value)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode("funding_total")}
                            className={`h-5 w-5 p-0 ${
                              !masterEditMode && "hidden"
                            }`}
                          >
                            <PencilIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm mb-4">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-1 px-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-700 text-lg">
                    Financial Highlights{" "}
                    <span className="text-xs font-normal">$ in millions</span>
                  </CardTitle>
                  {masterEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode("financial_highlights")}
                      className="h-5 w-5 p-0"
                    >
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#002169] text-white">
                      <TableRow>
                        <TableHead className="text-white text-xs py-1 h-8">
                          Metric
                        </TableHead>
                        <TableHead className="text-white text-right text-xs py-1 h-8">
                          Latest Value
                        </TableHead>
                        <TableHead className="text-white text-right text-xs py-1 h-8">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-xs py-1 h-8">
                          Operating Revenue
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="number"
                              value={
                                editFinancialHighlights.operating_revenue
                                  ?.value ||
                                getLatestFinancialData(
                                  data?.financial_highlights?.operating_revenue
                                )?.value ||
                                0
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "operating_revenue",
                                  Number(e.target.value),
                                  editFinancialHighlights.operating_revenue
                                    ?.date ||
                                    getLatestFinancialData(
                                      data?.financial_highlights
                                        ?.operating_revenue
                                    )?.date ||
                                    null
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatCurrency(
                              getLatestFinancialData(
                                data?.financial_highlights?.operating_revenue
                              )?.value
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="date"
                              value={
                                editFinancialHighlights.operating_revenue
                                  ?.date ||
                                getLatestFinancialData(
                                  data?.financial_highlights?.operating_revenue
                                )?.date ||
                                ""
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "operating_revenue",
                                  editFinancialHighlights.operating_revenue
                                    ?.value ||
                                    getLatestFinancialData(
                                      data?.financial_highlights
                                        ?.operating_revenue
                                    )?.value ||
                                    0,
                                  e.target.value
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatDate(
                              getLatestFinancialData(
                                data?.financial_highlights?.operating_revenue
                              )?.date
                            )
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs py-1 h-8">
                          Operating Profit
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="number"
                              value={
                                editFinancialHighlights.operating_profit
                                  ?.value ||
                                getLatestFinancialData(
                                  data?.financial_highlights?.operating_profit
                                )?.value ||
                                0
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "operating_profit",
                                  Number(e.target.value),
                                  editFinancialHighlights.operating_profit
                                    ?.date ||
                                    getLatestFinancialData(
                                      data?.financial_highlights
                                        ?.operating_profit
                                    )?.date ||
                                    null
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatCurrency(
                              getLatestFinancialData(
                                data?.financial_highlights?.operating_profit
                              )?.value
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="date"
                              value={
                                editFinancialHighlights.operating_profit
                                  ?.date ||
                                getLatestFinancialData(
                                  data?.financial_highlights?.operating_profit
                                )?.date ||
                                ""
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "operating_profit",
                                  editFinancialHighlights.operating_profit
                                    ?.value ||
                                    getLatestFinancialData(
                                      data?.financial_highlights
                                        ?.operating_profit
                                    )?.value ||
                                    0,
                                  e.target.value
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatDate(
                              getLatestFinancialData(
                                data?.financial_highlights?.operating_profit
                              )?.date
                            )
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs py-1 h-8">
                          EBITDA
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="number"
                              value={
                                editFinancialHighlights.ebitda?.value ||
                                getLatestFinancialData(
                                  data?.financial_highlights?.ebitda
                                )?.value ||
                                0
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "ebitda",
                                  Number(e.target.value),
                                  editFinancialHighlights.ebitda?.date ||
                                    getLatestFinancialData(
                                      data?.financial_highlights?.ebitda
                                    )?.date ||
                                    null
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatCurrency(
                              getLatestFinancialData(
                                data?.financial_highlights?.ebitda
                              )?.value
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="date"
                              value={
                                editFinancialHighlights.ebitda?.date ||
                                getLatestFinancialData(
                                  data?.financial_highlights?.ebitda
                                )?.date ||
                                ""
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "ebitda",
                                  editFinancialHighlights.ebitda?.value ||
                                    getLatestFinancialData(
                                      data?.financial_highlights?.ebitda
                                    )?.value ||
                                    0,
                                  e.target.value
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatDate(
                              getLatestFinancialData(
                                data?.financial_highlights?.ebitda
                              )?.date
                            )
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs py-1 h-8">
                          Net Income
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="number"
                              value={
                                editFinancialHighlights.net_income?.value ||
                                getLatestFinancialData(
                                  data?.financial_highlights?.net_income
                                )?.value ||
                                0
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "net_income",
                                  Number(e.target.value),
                                  editFinancialHighlights.net_income?.date ||
                                    getLatestFinancialData(
                                      data?.financial_highlights?.net_income
                                    )?.date ||
                                    null
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatCurrency(
                              getLatestFinancialData(
                                data?.financial_highlights?.net_income
                              )?.value
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="date"
                              value={
                                editFinancialHighlights.net_income?.date ||
                                getLatestFinancialData(
                                  data?.financial_highlights?.net_income
                                )?.date ||
                                ""
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "net_income",
                                  editFinancialHighlights.net_income?.value ||
                                    getLatestFinancialData(
                                      data?.financial_highlights?.net_income
                                    )?.value ||
                                    0,
                                  e.target.value
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatDate(
                              getLatestFinancialData(
                                data?.financial_highlights?.net_income
                              )?.date
                            )
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs py-1 h-8">
                          P/E Ratio
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="number"
                              value={
                                editFinancialHighlights.per?.value ||
                                data?.financial_highlights?.per?.value ||
                                0
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "per",
                                  Number(e.target.value),
                                  data?.financial_highlights?.per?.date || null
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            data?.financial_highlights?.per?.value?.toFixed(
                              2
                            ) || "N/A"
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {editMode === "financial_highlights" ? (
                            <Input
                              type="date"
                              value={
                                editFinancialHighlights.per?.date ||
                                data?.financial_highlights?.per?.date ||
                                ""
                              }
                              onChange={(e) =>
                                handleFinancialDataChange(
                                  "per",
                                  editFinancialHighlights.per?.value ||
                                    data?.financial_highlights?.per?.value ||
                                    0,
                                  e.target.value
                                )
                              }
                              className="w-full h-6 text-xs"
                            />
                          ) : (
                            formatDate(data?.financial_highlights?.per?.date)
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs py-1 h-8">
                          EPS
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {data?.financial_highlights?.per?.eps?.toFixed(2) ||
                            "N/A"}
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {formatDate(data?.financial_highlights?.per?.date)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs py-1 h-8">
                          Closing Price
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {formatCurrency(
                            data?.financial_highlights?.per?.closing_price
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs py-1 h-8">
                          {formatDate(data?.financial_highlights?.per?.date)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            {editMode === "financial_highlights" && (
              <div className="mt-1 flex justify-end">
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={handleSaveFinancialHighlights}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="col-span-4">
            <div className="space-y-3 h-full">
              <Card className="border-gray-200 shadow-sm mb-4">
                <CardHeader className="bg-gray-50 border-b border-gray-200 py-1 px-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-700 text-lg">
                      Business Description
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode("description")}
                      className={`h-5 w-5 p-0 ${!masterEditMode && "hidden"}`}
                    >
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  {editMode === "description" ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editDescription || ""}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="h-28 resize-none text-sm"
                      />
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={handleSaveDescription}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-700 text-sm">
                      {data?.description || "No description available."}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-200 py-1 px-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-700 text-lg">
                      Financial Data ($M)
                    </CardTitle>
                    {masterEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditMode("financial_data")}
                        className="h-5 w-5 p-0"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="h-[150px] flex items-end justify-between gap-2">
                    {data?.valuation?.value && (
                      <div className="flex flex-col items-center">
                        <div
                          className="bg-[#002169] w-12"
                          style={{
                            height: `${Math.min(
                              120,
                              (data.valuation.value / 1000000000) * 120
                            )}px`,
                          }}
                        ></div>
                        <p className="text-[10px] mt-1 text-center">
                          Valuation
                        </p>
                      </div>
                    )}
                    {data?.equity_funding_total?.value && (
                      <div className="flex flex-col items-center">
                        <div
                          className="bg-[#156082] w-12"
                          style={{
                            height: `${Math.min(
                              120,
                              (data.equity_funding_total.value / 1000000000) *
                                120
                            )}px`,
                          }}
                        ></div>
                        <p className="text-[10px] mt-1 text-center">
                          Equity
                          <br />
                          Funding
                        </p>
                      </div>
                    )}
                    {data?.funding_total?.value && (
                      <div className="flex flex-col items-center">
                        <div
                          className="bg-[#57727e] w-12"
                          style={{
                            height: `${Math.min(
                              120,
                              (data.funding_total.value / 1000000000) * 120
                            )}px`,
                          }}
                        ></div>
                        <p className="text-[10px] mt-1 text-center">
                          Total
                          <br />
                          Funding
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {editMode === "financial_data" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-3">Edit Financial Data</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Valuation ($M)
                  </label>
                  <Input
                    type="number"
                    value={editValuation || 0}
                    onChange={(e) => setEditValuation(Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Equity Funding ($M)
                  </label>
                  <Input
                    type="number"
                    value={editEquityFunding || 0}
                    onChange={(e) =>
                      setEditEquityFunding(Number(e.target.value))
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Total Funding ($M)
                  </label>
                  <Input
                    type="number"
                    value={editFundingTotal || 0}
                    onChange={(e) =>
                      setEditFundingTotal(Number(e.target.value))
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setEditMode(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={handleSaveFinancialData}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
