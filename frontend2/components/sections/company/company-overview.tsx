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
      // Since products_brands is a string[] array, just replace the string at the index
      updatedProducts[index] = value;
      setEditData({
        ...editData,
        products_brands: updatedProducts,
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

          {/* Right Column - Overview Table - Improved */}
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

            <table className="w-full border-collapse">
              <tbody>
                {/* Row 1: Business Model */}
                <tr>
                  <td className="w-1/5 bg-[#002169] text-white p-4 border-b border-[#1a3573]">
                    <span className="text-sm font-medium">Business Model</span>
                  </td>
                  <td className="w-4/5 p-4 border-b border-[#e5e7eb]">
                    {isEditing ? (
                      <textarea
                        className="border p-2 w-full rounded-md min-h-24 resize-y"
                        value={editData?.business_model || ""}
                        onChange={(e) =>
                          updateField("business_model", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {data?.business_model || "N/A"}
                      </p>
                    )}
                  </td>
                </tr>

                {/* Row 2: Products/Brands */}
                <tr>
                  <td className="w-1/5 bg-[#002169] text-white p-4 border-b border-[#1a3573]">
                    <span className="text-sm font-medium">Products/Brands</span>
                  </td>
                  <td className="w-4/5 p-4 border-b border-[#e5e7eb]">
                    {isEditing ? (
                      <div className="space-y-2">
                        {editData?.products_brands &&
                        editData.products_brands.length > 0 ? (
                          editData.products_brands.map(
                            (product: string[], index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <input
                                  className="border p-2 w-full rounded-md mb-1"
                                  value={product || ""}
                                  onChange={(e) =>
                                    updateproducts_brands(index, e.target.value)
                                  }
                                />
                                {index > 0 && (
                                  <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      if (
                                        editData &&
                                        editData.products_brands
                                      ) {
                                        const newProducts = [
                                          ...editData.products_brands,
                                        ];
                                        newProducts.splice(index, 1);
                                        updateField(
                                          "products_brands",
                                          newProducts
                                        );
                                      }
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-500">
                            No products/brands available
                          </p>
                        )}

                        <button
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            if (editData) {
                              const newProducts = [
                                ...(editData.products_brands || []),
                                "",
                              ];
                              updateField("products_brands", newProducts);
                            }
                          }}
                        >
                          + Add Product/Brand
                        </button>
                      </div>
                    ) : data?.products_brands &&
                      data.products_brands.length > 0 ? (
                      <p className="text-sm">
                        {data.products_brands.join(", ")}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No products/brands available
                      </p>
                    )}
                  </td>
                </tr>

                {/* Row 3: Services */}
                <tr>
                  <td className="w-1/5 bg-[#002169] text-white p-4">
                    <span className="text-sm font-medium">Services</span>
                  </td>
                  <td className="w-4/5 p-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          className="border p-2 w-full rounded-md min-h-24 resize-y"
                          value={editData?.customers?.join(", ") || ""}
                          placeholder="Enter customers separated by commas"
                          onChange={(e) =>
                            updateField(
                              "customers",
                              e.target.value
                                .split(", ")
                                .filter((item) => item.trim() !== "")
                            )
                          }
                        />
                        <p className="text-xs text-gray-500">
                          Separate customers with commas
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {data?.customers && data.customers.length > 0
                          ? data.customers.join(", ")
                          : "N/A"}
                      </p>
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
