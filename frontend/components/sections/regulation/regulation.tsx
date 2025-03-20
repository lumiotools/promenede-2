"use client";

import { useState } from "react";
import { regulationData as initialData } from "./regulationdata";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import { RegulationItem } from "@/types/regulation";

export default function RegulationPage() {
  const [data, setData] = useState<RegulationItem[]>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<RegulationItem[]>(initialData);

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

  const updateRegulation = (
    index: number,
    field: keyof RegulationItem,
    value: string
  ): void => {
    const newData = [...editData];
    newData[index][field] = value;
    setEditData(newData);
  };

  const addRegulation = (): void => {
    const newData = [...editData];
    newData.push({
      trend: "New Regulatory Trend",
      description: "Description of the new regulatory trend",
    });
    setEditData(newData);
  };

  const removeRegulation = (index: number): void => {
    const newData = [...editData];
    newData.splice(index, 1);
    setEditData(newData);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">Regulation</h1>
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

      {data.length === 0 && !isEditing ? (
        <div className="text-center py-12 text-[#57727e] text-lg">
          No regulation data present
        </div>
      ) : (
        <div className="border border-[#ced7db] rounded-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-[#ced7db]">
            <h2 className="text-[#445963] text-xl font-medium">Regulation</h2>
            {isEditing && (
              <Button
                onClick={addRegulation}
                size="sm"
                className="bg-[#156082] hover:bg-[#092a38] text-white"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 bg-[#002169] text-white font-medium text-lg">
            <div className="p-4 border-r border-[#35454c]">
              Key Regulatory Trend
            </div>
            <div className="p-4">Description</div>
          </div>

          {isEditing ? (
            <>
              {editData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 border-t border-[#ced7db]"
                >
                  <div className="p-4 border-r border-[#ced7db] flex items-start">
                    <textarea
                      value={item.trend}
                      onChange={(e) =>
                        updateRegulation(index, "trend", e.target.value)
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                      rows={3}
                    />
                    <button
                      onClick={() => removeRegulation(index)}
                      className="ml-2 text-[#445963] hover:text-red-500"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>

                  <div className="p-4">
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateRegulation(index, "description", e.target.value)
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {data.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 border-t border-[#ced7db]"
                >
                  <div className="p-4 border-r border-[#ced7db]">
                    <p className="text-[#35454c]">{item.trend}</p>
                  </div>

                  <div className="p-4">
                    <p className="text-[#35454c]">{item.description}</p>
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
