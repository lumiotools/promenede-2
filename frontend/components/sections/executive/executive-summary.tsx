"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, PlusIcon, XIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExecutiveSummary } from "@/types/executive";

type FinancialDataEntry = {
  value?: number | null;
  currency?: string | null;
  date?: string | null;
};

type ExecutiveSummaryProps = {
  initialData?: ExecutiveSummary;
};

export function ExecutiveSummaryPage({ initialData }: ExecutiveSummaryProps) {
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

  useEffect(() => {
    setData(initialData);
    setEditDescription(initialData?.description || "");
    setEditIndustry(initialData?.industry || "");
    setEditValuation(initialData?.valuation?.value || 0);
    setEditFundingTotal(initialData?.funding_total?.value || 0);
    setEditEquityFunding(initialData?.equity_funding_total?.value || 0);
  }, [initialData]);

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

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-[#ced7db] pb-4">
        <h1 className="text-4xl font-semibold text-[#445963]">
          Executive Summary
        </h1>
        <Button variant="outline" className="border-[#ced7db]">
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-[#ced7db] shadow-sm">
            <CardHeader className="bg-[#f7f9f9] border-b border-[#ced7db]">
              <CardTitle className="text-[#445963] text-xl">
                Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4 bg-[#f2f4f7] border-r border-[#ced7db]">
                      Industry
                    </TableCell>
                    <TableCell>
                      {editMode === "industry" ? (
                        <div className="flex gap-2">
                          <Input
                            value={editIndustry || ""}
                            onChange={(e) => setEditIndustry(e.target.value)}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleSaveIndustry}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>{data?.industry || "N/A"}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode("industry")}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium bg-[#f2f4f7] border-r border-[#ced7db]">
                      Topic Tags
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {data?.topic_tags?.map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-[#eaecf0] text-[#475467] hover:bg-[#ced7db] flex items-center gap-1"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 rounded-full hover:bg-[#ced7db] p-0.5"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add new tag"
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddTag();
                              e.preventDefault();
                            }
                          }}
                        />
                        <Button size="sm" onClick={handleAddTag}>
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium bg-[#f2f4f7] border-r border-[#ced7db]">
                      Valuation
                    </TableCell>
                    <TableCell>
                      {editMode === "valuation" ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editValuation || 0}
                            onChange={(e) =>
                              setEditValuation(Number(e.target.value))
                            }
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleSaveValuation}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>{formatCurrency(data?.valuation?.value)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode("valuation")}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium bg-[#f2f4f7] border-r border-[#ced7db]">
                      Equity Funding Total
                    </TableCell>
                    <TableCell>
                      {editMode === "equity_funding" ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editEquityFunding || 0}
                            onChange={(e) =>
                              setEditEquityFunding(Number(e.target.value))
                            }
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleSaveEquityFunding}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>
                            {formatCurrency(data?.equity_funding_total?.value)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode("equity_funding")}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium bg-[#f2f4f7] border-r border-[#ced7db]">
                      Funding Total
                    </TableCell>
                    <TableCell>
                      {editMode === "funding_total" ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editFundingTotal || 0}
                            onChange={(e) =>
                              setEditFundingTotal(Number(e.target.value))
                            }
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleSaveFundingTotal}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>
                            {formatCurrency(data?.funding_total?.value)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditMode("funding_total")}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-[#ced7db] shadow-sm mt-6">
            <CardHeader className="bg-[#f7f9f9] border-b border-[#ced7db]">
              <CardTitle className="text-[#445963] text-xl">
                Financial Highlights{" "}
                <span className="text-sm font-normal">$ in millions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#002169] text-white">
                    <TableRow>
                      <TableHead className="text-white">Metric</TableHead>
                      <TableHead className="text-white text-right">
                        Latest Value
                      </TableHead>
                      <TableHead className="text-white text-right">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Operating Revenue
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          getLatestFinancialData(
                            data?.financial_highlights?.operating_revenue
                          )?.value
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(
                          getLatestFinancialData(
                            data?.financial_highlights?.operating_revenue
                          )?.date
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Operating Profit
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          getLatestFinancialData(
                            data?.financial_highlights?.operating_profit
                          )?.value
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(
                          getLatestFinancialData(
                            data?.financial_highlights?.operating_profit
                          )?.date
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">EBITDA</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          getLatestFinancialData(
                            data?.financial_highlights?.ebitda
                          )?.value
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(
                          getLatestFinancialData(
                            data?.financial_highlights?.ebitda
                          )?.date
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Net Income</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          getLatestFinancialData(
                            data?.financial_highlights?.net_income
                          )?.value
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(
                          getLatestFinancialData(
                            data?.financial_highlights?.net_income
                          )?.date
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">P/E Ratio</TableCell>
                      <TableCell className="text-right">
                        {data?.financial_highlights?.per?.value?.toFixed(2) ||
                          "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(data?.financial_highlights?.per?.date)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">EPS</TableCell>
                      <TableCell className="text-right">
                        {data?.financial_highlights?.per?.eps?.toFixed(2) ||
                          "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(data?.financial_highlights?.per?.date)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Closing Price
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          data?.financial_highlights?.per?.closing_price
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(data?.financial_highlights?.per?.date)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <div className="space-y-6">
            <Card className="border-[#ced7db] shadow-sm">
              <CardHeader className="bg-[#f7f9f9] border-b border-[#ced7db] pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#445963] text-xl">
                    Business Description
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode("description")}
                    className="h-8 w-8 p-0"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 max-h-60 overflow-y-auto">
                {editMode === "description" ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDescription || ""}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="h-40 resize-none"
                    />
                    <Button onClick={handleSaveDescription}>Save</Button>
                  </div>
                ) : (
                  <div className="text-[#445963] whitespace-pre-line">
                    {data?.description || "No description available."}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-[#ced7db] shadow-sm">
              <CardHeader className="bg-[#f7f9f9] border-b border-[#ced7db] pb-3">
                <CardTitle className="text-[#445963] text-xl">
                  Financial Data ($M)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[200px] flex items-end justify-between gap-2">
                  {data?.valuation?.value && (
                    <div className="flex flex-col items-center">
                      <div
                        className="bg-[#002169] w-16"
                        style={{
                          height: `${Math.min(
                            150,
                            (data.valuation.value / 1000000000) * 150
                          )}px`,
                        }}
                      ></div>
                      <p className="text-xs mt-2 text-center">Valuation</p>
                    </div>
                  )}
                  {data?.equity_funding_total?.value && (
                    <div className="flex flex-col items-center">
                      <div
                        className="bg-[#156082] w-16"
                        style={{
                          height: `${Math.min(
                            150,
                            (data.equity_funding_total.value / 1000000000) * 150
                          )}px`,
                        }}
                      ></div>
                      <p className="text-xs mt-2 text-center">
                        Equity
                        <br />
                        Funding
                      </p>
                    </div>
                  )}
                  {data?.funding_total?.value && (
                    <div className="flex flex-col items-center">
                      <div
                        className="bg-[#57727e] w-16"
                        style={{
                          height: `${Math.min(
                            150,
                            (data.funding_total.value / 1000000000) * 150
                          )}px`,
                        }}
                      ></div>
                      <p className="text-xs mt-2 text-center">
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

      <div className="mt-6 text-sm text-[#8097a2]">
        Source: Company filings, financial reports
      </div>
    </div>
  );
}
