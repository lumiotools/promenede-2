"use client";

import { useState } from "react";
import { opportunitiesRisks as initialData } from "./opportunitiesRisks";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import { OpportunitiesRisks, Opportunity } from "@/types/opportunitiesRisks";

export default function OpportunitiesPage() {
  const [data, setData] = useState<OpportunitiesRisks>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<OpportunitiesRisks>(initialData);

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

  const updateOpportunity = (
    index: number,
    field: keyof Opportunity,
    value: string
  ): void => {
    const newData = { ...editData };
    newData.opportunities[index][field] = value;
    setEditData(newData);
  };

  const addOpportunity = (): void => {
    const newData = { ...editData };
    newData.opportunities.push({
      area: "New Area",
      detail: "New detail",
      rationale: "New rationale",
    });
    setEditData(newData);
  };

  const removeOpportunity = (index: number): void => {
    const newData = { ...editData };
    newData.opportunities.splice(index, 1);
    setEditData(newData);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">
          Opportunity Areas
        </h1>
        {!isEditing ? (
          <Button
            onClick={startEditing}
            className="bg-[#156082] hover:bg-[#092a38] text-white"
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={saveChanges}
              className="bg-[#156082] hover:bg-[#092a38] text-white"
            >
              <SaveIcon className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button
              onClick={cancelEditing}
              variant="outline"
              className="border-[#ced7db] text-[#445963]"
            >
              <XIcon className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        )}
      </div>
      <div className="border-t border-[#ced7db] mb-12"></div>

      {data.opportunities.length === 0 && !isEditing ? (
        <div className="text-center py-12 text-[#57727e] text-lg">
          No opportunities present
        </div>
      ) : (
        <div className="border border-[#ced7db] rounded-sm overflow-hidden">
          <div className="grid grid-cols-3 bg-[#002169] text-white font-medium text-lg">
            <div className="p-4 border-r border-[#35454c]">
              Opportunity Areas
            </div>
            <div className="p-4 border-r border-[#35454c]">Detail</div>
            <div className="p-4">Rationale</div>
          </div>

          {isEditing ? (
            <>
              {editData.opportunities.map((opportunity, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 border-t border-[#ced7db]"
                >
                  <div className="bg-[#002169] text-white p-4 flex items-center">
                    <textarea
                      value={opportunity.area}
                      onChange={(e) =>
                        updateOpportunity(index, "area", e.target.value)
                      }
                      className="w-full bg-[#156082] text-white p-2 rounded"
                      rows={2}
                    />
                    <button
                      onClick={() => removeOpportunity(index)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>

                  <div className="p-4 border-l border-[#ced7db]">
                    <textarea
                      value={opportunity.detail}
                      onChange={(e) =>
                        updateOpportunity(index, "detail", e.target.value)
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                      rows={3}
                    />
                  </div>

                  <div className="p-4 border-l border-[#ced7db]">
                    <textarea
                      value={opportunity.rationale}
                      onChange={(e) =>
                        updateOpportunity(index, "rationale", e.target.value)
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <div className="p-4 border-t border-[#ced7db] flex justify-center">
                <Button
                  onClick={addOpportunity}
                  className="bg-[#156082] hover:bg-[#092a38] text-white"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Opportunity
                </Button>
              </div>
            </>
          ) : (
            <>
              {data.opportunities.map((opportunity, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 border-t border-[#ced7db]"
                >
                  {index === 0 ||
                  data.opportunities[index - 1].area !== opportunity.area ? (
                    <div className="bg-[#002169] text-white p-4 flex items-center">
                      <h3 className="font-medium text-lg">
                        {opportunity.area}
                      </h3>
                    </div>
                  ) : (
                    <div className="bg-[#002169] text-white p-4"></div>
                  )}

                  <div className="p-4 border-l border-[#ced7db]">
                    <ul className="list-disc pl-5 space-y-4">
                      <li className="text-[#35454c]">{opportunity.detail}</li>
                    </ul>
                  </div>

                  <div className="p-4 border-l border-[#ced7db]">
                    <ul className="list-disc pl-5 space-y-4">
                      <li className="text-[#35454c]">
                        {opportunity.rationale}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <div className="mt-8 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
