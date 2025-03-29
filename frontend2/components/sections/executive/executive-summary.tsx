"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { SectionLayout } from "@/components/ui/section-layout";
import remarkGfm from "remark-gfm";

export interface ExecutiveSummary {
  executive_summary: string | null;
}

interface ExecutiveSummaryProps {
  initialData: ExecutiveSummary | undefined;
  onDataUpdate?: (data: ExecutiveSummary) => void;
}

export function ExecutiveSummaryPage({
  initialData,
  onDataUpdate,
}: ExecutiveSummaryProps) {
  const [data, setData] = useState<ExecutiveSummary | undefined>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (onDataUpdate && data) {
      onDataUpdate(data);
    }
  }, [data]);

  return (
    <SectionLayout
      title="Executive Summary"
      sourceText="Source: Coresignal, Crunchbase, Perplexity"
    >
      <div className="">
        {data?.executive_summary ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.executive_summary}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No executive summary available.
          </p>
        )}
      </div>
    </SectionLayout>
  );
}
