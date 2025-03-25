/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Edit,
  Save,
  X,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import type {
  CompanyOverviewItem,
  CompanyUrls,
  ProductService,
} from "@/types/company";
import { SectionLayout } from "@/components/ui/section-layout";

type CompanyOverViewProps = {
  initialData?: CompanyOverviewItem;
  urls?: CompanyUrls | null;
};

export default function CompanyOverview({
  initialData,
  urls,
}: CompanyOverViewProps) {
  // Initialize state with initialData if provided, otherwise use defaultData
  const [data, setData] = useState<CompanyOverviewItem | undefined>(
    initialData
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<CompanyOverviewItem | undefined>(
    initialData
  );
  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Crunchbase"
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
      business_model: "",
      products_brands: [],
      customers: [],
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
        setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update");
      }
    }
  };

  // Fixed: replaced 'any' with a specific type based on field value types
  const updateField = (
    field: keyof CompanyOverviewItem,
    value: string | string[]
  ): void => {
    if (editData) {
      setEditData({
        ...editData,
        [field]: value,
      });
    }
  };

  const updateproducts_brands = (index: number, value: string): void => {
    if (editData && editData.products_brands) {
      const updatedProducts = [...editData.products_brands];
      // Make sure the product exists and create a proper copy with the updated value
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          value,
        };
        setEditData({
          ...editData,
          products_brands: updatedProducts,
        });
      }
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
            setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update");
          }
        }
      }}
    >
      {({ isEditing, editData, setEditData }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Company Image */}
          <div>
            {initialData?.website_screenshot ? (
              <img
                src={`data:image/png;base64,${
                  initialData.website_screenshot.split("base64,")[1]
                }`}
                alt="Company Website"
                className="w-full h-auto rounded-md border border-[#e5e7eb]"
              />
            ) : (
              <img
                src="/companyoverview.png"
                alt="Company Overview"
                className="w-full h-auto rounded-md border border-[#e5e7eb]"
              />
            )}

            {/* Company URL and Social Links */}
            {urls && (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {urls.company_url && (
                  <a
                    href={urls.company_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#445963] hover:text-[#002169] transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">
                      {urls.company_url.replace(/(^\w+:|^)\/\//, "")}
                    </span>
                  </a>
                )}

                <div className="flex gap-3">
                  {urls.facebook_url && urls.facebook_url.length > 0 && (
                    <a
                      href={urls.facebook_url[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#445963] hover:text-[#002169] transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}

                  {urls.twitter_url && urls.twitter_url.length > 0 && (
                    <a
                      href={urls.twitter_url[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#445963] hover:text-[#002169] transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}

                  {urls.instagram_url && urls.instagram_url.length > 0 && (
                    <a
                      href={urls.instagram_url[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#445963] hover:text-[#002169] transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}

                  {urls.youtube_url && urls.youtube_url.length > 0 && (
                    <a
                      href={urls.youtube_url[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#445963] hover:text-[#002169] transition-colors"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Overview Table */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-base font-medium text-[#475467]">Overview</h2>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveChanges}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span className="text-xs">Save</span>
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-xs">Cancel</span>
                  </button>
                </div>
              ) : (
                <button onClick={startEditing} className="text-[#8097a2]">
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2">
              <div className="bg-[#002169] text-white">
                <div className="py-[82px] px-4 flex items-center">
                  <span>Business Model</span>
                </div>
                <div className="py-[82px] px-4 flex items-center border-t border-[#1a3573]">
                  <span>Products/Brands</span>
                </div>
                <div className="py-[82px] px-4 flex items-center border-t border-[#1a3573]">
                  <span>Services</span>
                </div>
              </div>
              <div>
                <div className="py-3 px-4 border-b border-[#e5e7eb]">
                  <span>Description</span>
                </div>
                <div className="py-3 px-4 border-b border-[#e5e7eb] h-[164px] overflow-auto">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full rounded-md"
                      value={editData?.business_model || ""}
                      onChange={(e) =>
                        updateField("business_model", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm">{data?.business_model || "N/A"}</p>
                  )}
                </div>
                <div className="py-3 px-4 border-b border-[#e5e7eb] h-[164px] overflow-auto">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="mb-2">
                        {editData?.products_brands &&
                        editData.products_brands.length > 0 ? (
                          editData.products_brands.map(
                            (product: ProductService, index: number) => (
                              <input
                                key={index}
                                className="border p-1 w-full rounded-md mb-1"
                                value={product.value || ""}
                                onChange={(e) =>
                                  updateproducts_brands(index, e.target.value)
                                }
                              />
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-500">
                            No products/brands available
                          </p>
                        )}
                      </div>
                    </div>
                  ) : data?.products_brands &&
                    data.products_brands.length > 0 ? (
                    <ul className="text-sm list-disc pl-4 space-y-1 mb-4">
                      {data.products_brands.map((product, index) => (
                        <li key={index} className="group relative">
                          <span>{product.value}</span>
                          {product.description && (
                            <div className="hidden group-hover:block absolute left-0 top-full z-10 bg-white shadow-lg p-2 rounded text-xs w-64 border border-gray-200">
                              {product.description}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">
                      No products/brands available
                    </p>
                  )}
                </div>
                <div className="py-3 px-4 h-[164px] overflow-auto">
                  {isEditing ? (
                    <textarea
                      className="border p-1 w-full rounded-md"
                      value={editData?.customers?.join(", ") || ""}
                      onChange={(e) =>
                        updateField("customers", e.target.value.split(", "))
                      }
                    />
                  ) : (
                    <p className="text-sm">
                      {data?.customers && data.customers.length > 0
                        ? data.customers.slice(0, 5).join(", ") +
                          (data.customers.length > 5
                            ? ` and ${data.customers.length - 5} more`
                            : "")
                        : "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
