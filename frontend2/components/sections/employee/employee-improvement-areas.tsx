"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import type { EmployeeReviews } from "@/types/employee_reviews";
import { SectionLayout } from "@/components/ui/section-layout";

interface EmployeeImprovementAreasProps {
  initialData?: EmployeeReviews;
}

export default function EmployeeImprovementAreas({
  initialData,
}: EmployeeImprovementAreasProps) {
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

  const renderAreasOfImprovement = () => {
    if (!data?.areas_of_improvements) return null;

    if (Array.isArray(data.areas_of_improvements)) {
      if (data.areas_of_improvements.length === 0) return null;

      // Check if it's an array of strings or objects
      if (typeof data.areas_of_improvements[0] === "string") {
        // It's an array of strings
        return (
          <ul className="list-disc pl-5 space-y-2 text-sm text-[#445963]">
            {(data.areas_of_improvements as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      } else {
        // It's an array of objects with title/description
        return (
          <div className="space-y-4">
            {(
              data.areas_of_improvements as Array<{
                title: string;
                description: string;
              }>
            ).map((item, index) => (
              <div
                key={index}
                className="border-b border-[#eff2f3] pb-3 last:border-0 last:pb-0"
              >
                <h4 className="font-medium text-[#445963] mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-[#57727e]">{item.description}</p>
              </div>
            ))}
          </div>
        );
      }
    }

    return null;
  };

  return (
    <SectionLayout
      title="Areas for Improvement"
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : !data || !data.areas_of_improvements ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-[#445963] mb-4">
            <Users size={48} />
          </div>
          <h2 className="text-xl font-semibold text-[#445963] mb-2">
            No Improvement Areas Available
          </h2>
          <p className="text-[#57727e] mb-4">
            There are no improvement areas to display at this time.
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Employee Improvement Areas</CardTitle>
          </CardHeader>
          <CardContent>
            {renderAreasOfImprovement() || (
              <p className="text-sm text-[#57727e]">
                No improvement areas identified.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </SectionLayout>
  );
}
