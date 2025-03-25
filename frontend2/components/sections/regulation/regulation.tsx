"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { RegulationItem } from "@/types/regulation";
import { SectionLayout } from "@/components/ui/section-layout";

type RegulationProps = {
  initialData?: RegulationItem[];
};

const defaultState: RegulationItem[] = [];

export default function RegulationPage({
  initialData = defaultState,
}: RegulationProps) {
  const [data, setData] = useState<RegulationItem[]>(
    initialData || defaultState
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<RegulationItem[]>(
    initialData || defaultState
  );
  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Crunchbase"
  );

  useEffect(() => {
    // Ensure we have valid data with the correct structure
    const validData = initialData || defaultState;
    setData(validData);
  }, [initialData]);

  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    // Create UserAttachment entity
    const userAttachment = {
      name: "regulation-component-update.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/regulation-component-update.tsx",
    };

    console.log("Creating UserAttachment:", userAttachment);

    setData(editData);
    setIsEditing(false);

    // Update the source text to include the user
    setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update");
  };

  const updateRegulation = (
    index: number,
    field: keyof RegulationItem,
    value: string
  ): void => {
    const newData = [...editData];
    if (newData[index]) {
      newData[index][field] = value;
      setEditData(newData);
    }
  };

  const addRegulation = (): void => {
    const newData = [...editData];
    newData.push({
      regulation: "New Regulation",
      description: "Description of the new regulation",
    });
    setEditData(newData);
  };

  const removeRegulation = (index: number): void => {
    const newData = [...editData];
    newData.splice(index, 1);
    setEditData(newData);
  };

  // Check if regulation data is empty
  const isDataEmpty = !data || data.length === 0;

  // Limit to top 5 items
  const limitedData = isEditing ? editData.slice(0, 5) : data.slice(0, 5);

  return (
    <SectionLayout title="Regulation" sourceText={sourceText}>
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

      {/* Content area that will grow/shrink as needed */}
      <div className="flex-grow">
        {isDataEmpty && !isEditing ? (
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
              <div className="p-4 border-r border-[#35454c]">Regulation</div>
              <div className="p-4">Description</div>
            </div>

            {isEditing ? (
              <>
                {limitedData.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 border-t border-[#ced7db]"
                  >
                    <div className="p-4 border-r border-[#ced7db] flex items-start">
                      <textarea
                        value={item.regulation || ""}
                        onChange={(e) =>
                          updateRegulation(index, "regulation", e.target.value)
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
                        value={item.description || ""}
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
                {limitedData.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 border-t border-[#ced7db]"
                  >
                    <div className="p-4 border-r border-[#ced7db]">
                      <p className="text-[#35454c]">{item.regulation || ""}</p>
                    </div>

                    <div className="p-4">
                      <p className="text-[#35454c]">{item.description || ""}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </SectionLayout>
  );
}
