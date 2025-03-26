"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import type { EmployeeReviews } from "@/types/employee_reviews";
import { SectionLayout } from "@/components/ui/section-layout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EmployeeReviewDistributionProps {
  initialData?: EmployeeReviews;
}

export default function EmployeeReviewDistribution({
  initialData,
}: EmployeeReviewDistributionProps) {
  const [data, setData] = useState<EmployeeReviews | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sourceText, setSourceText] = useState<string>(
    "Source: Coresignal, OpenAI"
  );

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setIsLoading(false);
    }
  }, [initialData]);

  return (
    <SectionLayout
      title="Employee Review Distribution"
      sourceText={sourceText}
      showEditButton={false}
    >
      {isLoading ? (
        <div className="space-y-4">
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
      ) : !data ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-[#445963] mb-4">
            <Users size={48} />
          </div>
          <h2 className="text-xl font-semibold text-[#445963] mb-2">
            No Employee Review Distribution Data Available
          </h2>
          <p className="text-[#57727e] mb-4">
            There is no distribution data to display at this time.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <Card className={`${data.ratings_summary ? "flex-[2]" : "w-full"}`}>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>
                How ratings are distributed across the 1-5 scale
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.distribution &&
              Object.keys(data.distribution).length > 0 ? (
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = data.distribution?.[rating.toString()] ?? 0;
                    const total = Object.values(data.distribution || {}).reduce(
                      (sum, val) => (sum || 0) + (val || 0),
                      0
                    );
                    const percentage =
                      (total || 0) > 0 ? (count / (total || 1)) * 100 : 0;

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

          {data.ratings_summary && (
            <Card className="flex-[3]">
              <CardHeader>
                <CardTitle>Ratings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-[#445963]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {data.ratings_summary}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
