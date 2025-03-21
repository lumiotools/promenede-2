"use client"

import { Edit, Save, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { CompanyOverviewItem } from "@/types/company"

type CompanyOverViewProps = {
  initialData?: CompanyOverviewItem
}

export default function CompanyOverview({ initialData }: CompanyOverViewProps) {
  // Initialize state with initialData if provided, otherwise use defaultData
  const [data, setData] = useState<CompanyOverviewItem | undefined>(initialData)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editData, setEditData] = useState<CompanyOverviewItem | undefined>(initialData)
  // Fetch data if not provided as initialData
  useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])


  const startEditing = (): void => {
    setIsEditing(true)
    // Create a deep copy of the data for editing
    setEditData(data ? structuredClone(data) : createEmptyData())
  }

  const createEmptyData = (): CompanyOverviewItem => {
    return {
      business_model: "",
      products_brands: [],
      customers: [],
    }
  }

  const cancelEditing = (): void => {
    setIsEditing(false)
  }

  const saveChanges = (): void => {
    if (editData) {
      setData(editData)
      setIsEditing(false)
      console.log("Saved data:", editData)
    }
  }

  const updateField = (field: keyof CompanyOverviewItem, value: any): void => {
    if (editData) {
      setEditData({
        ...editData,
        [field]: value,
      })
    }
  }

  const updateproducts_brands = (index: number, value: string): void => {
    if (editData && editData.products_brands) {
      const updatedProducts = [...editData.products_brands]
      updatedProducts[index] = { ...updatedProducts[index], value }
      setEditData({
        ...editData,
        products_brands: updatedProducts,
      })
    }
  }

  // Sample description - in a real app, this would come from the API

  return (
    <div className="w-full max-w-full bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Company Overview</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Left Column - Company Image */}
        <div>
          <img
            src="/companyoverview.png"
            alt="Company Overview"
            className="w-full h-auto rounded-md border border-[#e5e7eb]"
          />
        </div>

        {/* Right Column - Overview Table */}
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-base font-medium text-[#475467]">Overview</h2>
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={saveChanges} className="text-green-600 hover:text-green-800 flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  <span className="text-xs">Save</span>
                </button>
                <button onClick={cancelEditing} className="text-red-600 hover:text-red-800 flex items-center gap-1">
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
                <span>Customers</span>
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
                    onChange={(e) => updateField("business_model", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data?.business_model || "N/A"}</p>
                )}
              </div>
              <div className="py-3 px-4 border-b border-[#e5e7eb] h-[164px] overflow-auto">
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="mb-2">
                      {editData?.products_brands && editData.products_brands.length > 0 ? (
                        editData.products_brands.map((product, index) => (
                          <input
                            key={index}
                            className="border p-1 w-full rounded-md mb-1"
                            value={product.value}
                            onChange={(e) => updateproducts_brands(index, e.target.value)}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No products/brands available</p>
                      )}
                    </div>
                  </div>
                ) : data?.products_brands && data.products_brands.length > 0 ? (
                  <ul className="text-sm list-disc pl-4 space-y-1 mb-4">
                    {data.products_brands.map((product, index) => (
                      <li key={index}>{product.value}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No products/brands available</p>
                )}
              </div>
              <div className="py-3 px-4 h-[164px] overflow-auto">
                {isEditing ? (
                  <textarea
                    className="border p-1 w-full rounded-md"
                    value={editData?.customers?.join(", ") || ""}
                    onChange={(e) => updateField("customers", e.target.value.split(", "))}
                  />
                ) : (
                  <p className="text-sm">
                    {data?.customers && data.customers.length > 0 ? data.customers.join(", ") : "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}



