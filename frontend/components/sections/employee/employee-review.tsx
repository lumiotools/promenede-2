/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Plus, Users } from "lucide-react";
import type { JSX } from "react";
import { Breakdown, EmployeeReviews } from "@/types/employee_reviews";

interface EmployeeReviewsProps {
  initialData?: EmployeeReviews;
}

export function EmployeeReviewsPage({ initialData }: EmployeeReviewsProps) {
  const [data, setData] = useState<EmployeeReviews | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("overview");

  useEffect(() => {
    console.log("employee review data", initialData);
    if (initialData) {
      setData(initialData);
      setIsLoading(false);
    }
  }, [initialData]);

  const formatPercentage = (value: number | null): string => {
    if (value === null) return "N/A";
    return `${(value * 100).toFixed(0)}%`;
  };

  const formatDecimal = (value: number | null, decimals = 1): string => {
    if (value === null) return "N/A";
    return value.toFixed(decimals);
  };

  const getChangeIndicator = (value: number | null): JSX.Element | null => {
    if (value === null) return null;
    if (value > 0) return <span className="text-green-500">↑</span>;
    if (value < 0) return <span className="text-red-500">↓</span>;
    return <span className="text-gray-500">→</span>;
  };

  const getCategoryName = (key: string): string => {
    const names: Record<string, string> = {
      business_outlook: "Business Outlook",
      career_opportunities: "Career Opportunities",
      ceo_approval: "CEO Approval",
      compensation_benefits: "Compensation & Benefits",
      culture_values: "Culture & Values",
      diversity_inclusion: "Diversity & Inclusion",
      recommend: "Recommend to Friend",
      senior_management: "Senior Management",
      work_life_balance: "Work/Life Balance",
    };
    return names[key] || key;
  };

  const handleEditData = (newData: Partial<EmployeeReviews>) => {
    if (data) {
      setData({
        ...data,
        ...newData,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#445963]">
            Employee Reviews
          </h1>
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-[#f7f9f9]">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-[#445963] mb-4">
          <Users size={48} />
        </div>
        <h2 className="text-xl font-semibold text-[#445963] mb-2">
          No Employee Review Data Available
        </h2>
        <p className="text-[#57727e] mb-4">
          There is no review data to display at this time.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#156082] hover:bg-[#092a38]">
              <Plus className="mr-2 h-4 w-4" /> Add Review Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee Review Data</DialogTitle>
              <DialogDescription>
                Enter the initial employee review data to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count">Total Reviews</Label>
                  <Input id="count" type="number" placeholder="e.g. 1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score">Overall Score</Label>
                  <Input
                    id="score"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="e.g. 4.2"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  setData({
                    count: 0,
                    score: 0,
                    breakdown: null,
                    distribution: null,
                    by_category: null,
                  });
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const totalReviews = data.count ?? 0;
  const overallScore = data.score ?? 0;
  const breakdown = data.breakdown ?? ({} as Breakdown);
  const distribution = data.distribution ?? {};

  // Calculate total for distribution to get percentages
  const distributionTotal: number =
    Object.values(distribution).reduce(
      (sum, value) => (sum || 0) + (value ?? 0),
      0
    ) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#445963]">Employee Reviews</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-[#ced7db]">
              <Edit className="mr-2 h-4 w-4" /> Edit Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee Review Data</DialogTitle>
              <DialogDescription>
                Make changes to the employee review data.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-count">Total Reviews</Label>
                  <Input
                    id="edit-count"
                    type="number"
                    defaultValue={data.count?.toString() || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-score">Overall Score</Label>
                  <Input
                    id="edit-score"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    defaultValue={data.score?.toString() || ""}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  const countInput = document.getElementById(
                    "edit-count"
                  ) as HTMLInputElement;
                  const scoreInput = document.getElementById(
                    "edit-score"
                  ) as HTMLInputElement;

                  handleEditData({
                    count: countInput.value ? Number(countInput.value) : null,
                    score: scoreInput.value ? Number(scoreInput.value) : null,
                  });
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#f7f9f9]">
          <CardHeader className="pb-2">
            <CardDescription>Overall Rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#445963]">
                {formatDecimal(overallScore)}
              </span>
              <span className="text-lg text-[#57727e] ml-1">/ 5</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#f7f9f9]">
          <CardHeader className="pb-2">
            <CardDescription>Total Reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#445963]">
              {totalReviews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#f7f9f9]">
          <CardHeader className="pb-2">
            <CardDescription>CEO Approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#445963]">
              {formatPercentage(breakdown.ceo_approval ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#f7f9f9]">
          <CardHeader className="pb-2">
            <CardDescription>Would Recommend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#445963]">
              {formatPercentage(breakdown.recommend ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeCategory}
        onValueChange={setActiveCategory}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Employee Ratings by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {breakdown &&
                  Object.entries(breakdown).map(([key, value]) => {
                    if (value === null) return null;

                    // Calculate width percentage for the bar (out of 5 or 1 depending on the metric)
                    const isPercentMetric =
                      key === "ceo_approval" ||
                      key === "recommend" ||
                      key === "business_outlook";
                    const maxValue = isPercentMetric ? 1 : 5;
                    const widthPercentage = (value / maxValue) * 100;

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#445963]">
                            {getCategoryName(key)}
                          </span>
                          <span className="text-sm font-medium text-[#445963]">
                            {isPercentMetric
                              ? formatPercentage(value)
                              : formatDecimal(value)}
                          </span>
                        </div>
                        <div className="h-2 bg-[#eff2f3] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#156082] rounded-full"
                            style={{ width: `${widthPercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>
                How ratings are distributed across the 1-5 scale
              </CardDescription>
            </CardHeader>
            <CardContent>
              {distribution && Object.keys(distribution).length > 0 ? (
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = distribution[rating.toString()] ?? 0;
                    const percentage = (count / distributionTotal) * 100;

                    return (
                      <div key={rating} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-[#445963] mr-2">
                              {rating} stars
                            </span>
                            <span className="text-xs text-[#57727e]">
                              ({count.toLocaleString()})
                            </span>
                          </div>
                          <span className="text-sm font-medium text-[#445963]">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#eff2f3] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#156082] rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-[#b6c3ca] mb-4" />
                  <h3 className="text-lg font-medium text-[#445963] mb-1">
                    No Distribution Data Available
                  </h3>
                  <p className="text-[#57727e]">
                    Distribution data will appear here once available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
