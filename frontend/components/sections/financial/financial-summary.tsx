"use client";

import { useState, useEffect } from "react";
import { Edit, Plus, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { KeyFinancials } from "@/types/company";

interface FinancialSummaryProps {
  initialData?: KeyFinancials | null;
}

interface ChartData {
  year: string;
  revenue: number;
  cost: number;
  profit: number;
}

export function FinancialSummary({ initialData }: FinancialSummaryProps) {
  // Process the initial data to create chart data
  const processData = (data?: KeyFinancials | null): ChartData[] => {
    if (!data?.income_statements) return [];

    // Filter for fiscal year statements and sort by date
    const fiscalYearStatements = data.income_statements
      .filter((statement) => statement.period_type === "fiscal_year")
      .sort((a, b) => {
        if (!a.period_end_date || !b.period_end_date) return 0;
        return (
          new Date(a.period_end_date).getTime() -
          new Date(b.period_end_date).getTime()
        );
      })
      .slice(-3); // Get the last 3 years

    return fiscalYearStatements.map((statement) => {
      const year = statement.period_end_date
        ? new Date(statement.period_end_date).getFullYear().toString()
        : "";
      return {
        year,
        revenue: statement.revenue
          ? Math.round(statement.revenue / 1000000000)
          : 0, // Convert to billions
        cost: statement.cost_of_goods_sold
          ? Math.round(statement.cost_of_goods_sold / 1000000000)
          : 0, // Convert to billions
        profit: statement.gross_profit
          ? Math.round(statement.gross_profit / 1000000000)
          : 0, // Convert to billions
      };
    });
  };

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<ChartData[]>(chartData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDataPoint, setNewDataPoint] = useState<ChartData>({
    year: new Date().getFullYear().toString(),
    revenue: 0,
    cost: 0,
    profit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Update chart data when initialData changes (e.g., when API data loads)
  useEffect(() => {
    if (initialData) {
      const processedData = processData(initialData);
      setChartData(processedData);
      setEditingData(processedData);
      setIsLoading(false);
    }
  }, [initialData]);

  const handleEditClick = () => {
    setEditingData([...chartData]);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setChartData(editingData);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (
    index: number,
    field: keyof ChartData,
    value: string
  ) => {
    const newData = [...editingData];
    if (field === "year") {
      newData[index][field] = value;
    } else {
      newData[index][field] = Number.parseFloat(value) || 0;
    }
    setEditingData(newData);
  };

  const handleAddNewDataPoint = () => {
    setChartData([...chartData, newDataPoint]);
    setNewDataPoint({
      year: (Number.parseInt(newDataPoint.year) + 1).toString(),
      revenue: 0,
      cost: 0,
      profit: 0,
    });
    setIsAddDialogOpen(false);
  };

  const handleNewDataChange = (field: keyof ChartData, value: string) => {
    if (field === "year") {
      setNewDataPoint({ ...newDataPoint, [field]: value });
    } else {
      setNewDataPoint({
        ...newDataPoint,
        [field]: Number.parseFloat(value) || 0,
      });
    }
  };

  // Render loading state
  if (isLoading && (!chartData || chartData.length === 0)) {
    return (
      <div className="w-full">
        <h2 className="text-4xl font-semibold text-[#445963] mb-4">
          Financial Summary (Past three years)
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-[#f7f9f9] border-[#ced7db]">
              <CardHeader>
                <CardTitle className="text-[#445963]">
                  {i === 1 ? "Revenue" : i === 2 ? "Cost" : "Profit"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-pulse text-[#ced7db]">
                    Loading financial data...
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-semibold text-[#445963]">
          Financial Summary (Past three years)
        </h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="border-[#ced7db] text-[#445963]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#001e69] hover:bg-[#001e69]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Year
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Financial Year</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="year" className="text-right">
                        Year
                      </Label>
                      <Input
                        id="year"
                        value={newDataPoint.year}
                        onChange={(e) =>
                          handleNewDataChange("year", e.target.value)
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="revenue" className="text-right">
                        Revenue (B)
                      </Label>
                      <Input
                        id="revenue"
                        type="number"
                        value={newDataPoint.revenue}
                        onChange={(e) =>
                          handleNewDataChange("revenue", e.target.value)
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cost" className="text-right">
                        Cost (B)
                      </Label>
                      <Input
                        id="cost"
                        type="number"
                        value={newDataPoint.cost}
                        onChange={(e) =>
                          handleNewDataChange("cost", e.target.value)
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="profit" className="text-right">
                        Profit (B)
                      </Label>
                      <Input
                        id="profit"
                        type="number"
                        value={newDataPoint.profit}
                        onChange={(e) =>
                          handleNewDataChange("profit", e.target.value)
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddNewDataPoint}
                      className="bg-[#001e69] hover:bg-[#001e69]/90"
                    >
                      Add
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancelClick}
                className="border-[#ced7db] text-[#445963]"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveClick}
                className="bg-[#001e69] hover:bg-[#001e69]/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#f7f9f9] border-[#ced7db]">
          <CardHeader>
            <CardTitle className="text-[#445963]">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                {editingData.map((data, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input
                      value={data.year}
                      onChange={(e) =>
                        handleInputChange(index, "year", e.target.value)
                      }
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      value={data.revenue}
                      onChange={(e) =>
                        handleInputChange(index, "revenue", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: "Year",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "USD (billion)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                    domain={[0, 1500]}
                  />
                  <Tooltip formatter={(value) => [`${value} B`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#001e69" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#f7f9f9] border-[#ced7db]">
          <CardHeader>
            <CardTitle className="text-[#445963]">Cost</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                {editingData.map((data, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input
                      value={data.year}
                      disabled
                      className="text-sm bg-[#f2f4f7]"
                    />
                    <Input
                      type="number"
                      value={data.cost}
                      onChange={(e) =>
                        handleInputChange(index, "cost", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: "Year",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "USD (billion)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                    domain={[0, 1500]}
                  />
                  <Tooltip formatter={(value) => [`${value} B`, "Cost"]} />
                  <Bar dataKey="cost" fill="#001e69" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#f7f9f9] border-[#ced7db]">
          <CardHeader>
            <CardTitle className="text-[#445963]">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                {editingData.map((data, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input
                      value={data.year}
                      disabled
                      className="text-sm bg-[#f2f4f7]"
                    />
                    <Input
                      type="number"
                      value={data.profit}
                      onChange={(e) =>
                        handleInputChange(index, "profit", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: "Year",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "USD (billion)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                    domain={[0, 1500]}
                  />
                  <Tooltip formatter={(value) => [`${value} B`, "Profit"]} />
                  <Bar dataKey="profit" fill="#001e69" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-sm text-[#475467]">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
