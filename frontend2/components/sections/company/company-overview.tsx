/* eslint-disable @next/next/no-img-element */
"use client";

import { Edit, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { SectionLayout } from "@/components/ui/section-layout";

// Updated interface according to the new type definition
export interface CompanyOverviewItem {
  business_model: string | null;
  products_brands: string | null;
  customers: string | null;
  description_enriched?: string | null;
  website_screenshot?: string | null;
}

type CompanyOverViewProps = {
  initialData?: CompanyOverviewItem;
};

export default function CompanyOverview({ initialData }: CompanyOverViewProps) {
  // Initialize state with initialData if provided, otherwise use defaultData
  const [data, setData] = useState<CompanyOverviewItem | undefined>(
    initialData
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<CompanyOverviewItem | undefined>(
    initialData
  );
  const [sourceText, setSourceText] = useState<string>(
    "Source: Crunchbase, Perplexity"
  );

  // Fetch data if not provided as initialData
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const startEditing = (): void => {
    setIsEditing(true);
    // Create a deep copy of the data for editing
    setEditData(data ? structuredClone(data) : createEmptyData());
  };

  const createEmptyData = (): CompanyOverviewItem => {
    return {
      business_model: null,
      products_brands: null,
      customers: null,
      description_enriched: null,
    };
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    if (editData) {
      setData(editData);
      setIsEditing(false);
      console.log("Saved data:", editData);

      // Update source text
      if (!sourceText.includes("User Update")) {
        setSourceText("Source: Crunchbase, Perplexity, User Update");
      }
    }
  };

  // Update field with new value
  const updateField = (
    field: keyof CompanyOverviewItem,
    value: string | null
  ): void => {
    if (editData) {
      setEditData({
        ...editData,
        [field]: value,
      });
    }
  };

  return (
    <SectionLayout
      title="Company Overview"
      sourceText={sourceText}
      onSave={() => {
        if (editData) {
          setData(editData);
          if (!sourceText.includes("User Update")) {
            setSourceText("Source: Crunchbase, Perplexity, User Update");
          }
        }
      }}
    >
      {({ isEditing, editData, setEditData }) => (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          {/* Left Column - Company Image and Description - Reduced width */}
          <div className="md:col-span-4">
            {initialData?.website_screenshot ? (
              <img
                src={`data:image/png;base64,${
                  initialData.website_screenshot.split("base64,")[1]
                }`}
                alt="Company Website"
                className="w-full h-auto rounded-md border border-[#e5e7eb]"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            ) : (
              <img
                src="/companyoverview.png"
                alt="Company Overview"
                className="w-full h-auto rounded-md border border-[#e5e7eb]"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            )}

            {/* Description Enriched Section */}
            {isEditing ? (
              <div className="mt-4">
                <h3 className="hidden text-sm font-medium text-[#475467] mb-2">
                  Company Description
                </h3>
                <textarea
                  className="border p-2 w-full rounded-md min-h-24 resize-y"
                  value={editData?.description_enriched || ""}
                  onChange={(e) =>
                    updateField("description_enriched", e.target.value)
                  }
                  placeholder="Enter company description"
                />
              </div>
            ) : (
              data?.description_enriched && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-[#475467] mb-2">
                    Company Description
                  </h3>
                  <div className="text-sm text-[#445963] whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {data.description_enriched}
                  </div>
                </div>
              )
            )}

            {/* URLs section removed */}
          </div>

          {/* Right Column - Overview Table - Wider */}
          <div className="md:col-span-8 border border-[#e5e7eb] rounded-md overflow-hidden flex flex-col h-full">
            <table className="w-full border-collapse text-sm table-fixed h-full">
              <tbody className="divide-y divide-[#e5e7eb]">
                {/* Row 1: Business Model */}
                <tr className="h-1/3">
                  <td className="w-20 bg-[#002169] text-white p-3 align-top">
                    <span className="text-sm font-medium">Business Model</span>
                  </td>
                  <td className="w-auto p-3 align-top">
                    {isEditing ? (
                      <textarea
                        className="border p-2 w-full rounded-md min-h-24 resize-y"
                        value={editData?.business_model || ""}
                        onChange={(e) =>
                          updateField("business_model", e.target.value)
                        }
                      />
                    ) : (
                      <div className="text-sm whitespace-pre-wrap h-full overflow-y-auto">
                        {data?.business_model || "N/A"}
                      </div>
                    )}
                  </td>
                </tr>

                {/* Row 2: Products/Brands - Top 3 */}
                <tr className="h-1/3">
                  <td className="w-20 bg-[#002169] text-white p-3 align-top">
                    <span className="text-sm font-medium">
                      Products/ Brands
                    </span>
                  </td>
                  <td className="w-auto p-3 align-top">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          className="border p-2 w-full rounded-md min-h-24 resize-y"
                          value={editData?.products_brands || ""}
                          onChange={(e) =>
                            updateField("products_brands", e.target.value)
                          }
                          placeholder="Enter products/brands using markdown format"
                        />
                        <p className="text-xs text-gray-500">
                          Use markdown format for rich text (e.g., **bold**,
                          *italic*, - bullets)
                        </p>
                      </div>
                    ) : (
                      <div className="h-full overflow-y-auto">
                        {data?.products_brands ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {data.products_brands}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No products/brands available
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>

                {/* Row 3: Customers - Top 3 */}
                <tr className="h-1/3">
                  <td className="w-24 bg-[#002169] text-white p-3 align-top">
                    <span className="text-sm font-medium">Customer</span>
                  </td>
                  <td className="w-auto p-3 align-top">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          className="border p-2 w-full rounded-md min-h-24 resize-y"
                          value={editData?.customers || ""}
                          placeholder="Enter customers using markdown format"
                          onChange={(e) =>
                            updateField("customers", e.target.value)
                          }
                        />
                        <p className="text-xs text-gray-500">
                          Use markdown format for rich text (e.g., **bold**,
                          *italic*, - bullets)
                        </p>
                      </div>
                    ) : (
                      <div className="h-full overflow-y-auto">
                        {data?.customers ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {data.customers}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No customers available
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
