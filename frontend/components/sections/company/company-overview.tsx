"use client";

import Image from "next/image";
import { Edit, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { companyProfile } from "./companydata";
import { Button } from "@/components/ui/button";

export function CompanyOverview() {
  const initialData = companyProfile.companyOverview;
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState(initialData);

  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    setData(editData);
    setIsEditing(false);
  };

  const updateField = (field: keyof typeof editData, value: string): void => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const updateProductsBrands = (index: number, value: string): void => {
    const updatedProducts = [...editData.productsBrands];
    updatedProducts[index] = { ...updatedProducts[index], value };
    setEditData({
      ...editData,
      productsBrands: updatedProducts,
    });
  };

  const firstSentence = companyProfile.firmographic.description.split(".")[0] + ".";

  return (
    <div className="w-full max-w-full bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Company Overview</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Left Column - Company Image */}
        <div>
          <Image
            src="/companyoverview.png"
            alt="Company Overview"
            width={600}
            height={350}
            className="w-full h-auto rounded-md border border-[#e5e7eb]"
            priority={true}
          />
        </div>

        {/* Right Column - Overview Table */}
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-base font-medium text-[#475467]">Overview</h2>
            {isEditing ? (
              <div className="flex gap-2">
              <Button onClick={saveChanges} className="bg-[#156082] hover:bg-[#092a38] text-white">
                <SaveIcon className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button onClick={cancelEditing} variant="outline" className="border-[#ced7db] text-[#445963]">
                <XIcon className="mr-2 h-4 w-4" /> Cancel
              </Button>
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
                    className="border p-1 w-full"
                    value={editData.businessModel}
                    onChange={(e) => updateField("businessModel", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{data.businessModel || "N.A"}</p>
                )}
              </div>
              <div className="py-3 px-4 border-b border-[#e5e7eb] h-[164px] overflow-auto">
                {isEditing ? (
                  <textarea
                    className="border p-1 w-full"
                    value={editData.customers.join(", ")}
                    onChange={(e) => updateField("customers", e.target.value.split(", "))}
                  />
                ) : (
                  <p className="text-sm">{data.customers.join(", ") || "N.A"}</p>
                )}
              </div>
              <div className="py-3 px-4 h-[164px] overflow-auto">
                <ul className="text-sm list-disc pl-4 space-y-1">
                  {editData.productsBrands.map((product, index) =>
                    isEditing ? (
                      <input
                        key={index}
                        className="border p-1 w-full mb-1"
                        value={product.value}
                        onChange={(e) => updateProductsBrands(index, e.target.value)}
                      />
                    ) : (
                      <li key={index}>{product.value}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  );
}
