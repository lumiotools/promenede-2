"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import { OpportunitiesRisks, Risk } from "@/types/opportunitiesRisks";

type RisksProps = {
  initialData?: OpportunitiesRisks;
};

// Default empty state that matches the OpportunitiesRisks interface structure
const defaultState: OpportunitiesRisks = {
  opportunities: [],
  risks: [],
};

export default function RisksPage({ initialData = defaultState }: RisksProps) {
  const [data, setData] = useState<OpportunitiesRisks>(
    initialData || defaultState
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<OpportunitiesRisks>(
    initialData || defaultState
  );

  useEffect(() => {
    // Ensure we have valid data with the correct structure
    console.log("risk data", initialData);
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
    setData(editData);
    setIsEditing(false);
  };

  const updateRisk = (
    index: number,
    field: keyof Risk,
    value: string
  ): void => {
    const newData = { ...editData };
    // Ensure risks array exists
    if (!newData.risks) {
      newData.risks = [];
    }
    if (newData.risks[index]) {
      newData.risks[index][field] = value;
      setEditData(newData);
    }
  };

  const addRisk = (): void => {
    const newData = { ...editData };
    // Ensure risks array exists
    if (!newData.risks) {
      newData.risks = [];
    }
    newData.risks.push({
      area: "New Risk Area",
      detail: "New risk detail",
      rationale: "New risk rationale",
    });
    setEditData(newData);
  };

  const removeRisk = (index: number): void => {
    const newData = { ...editData };
    // Ensure risks array exists
    if (!newData.risks) {
      newData.risks = [];
      return;
    }
    newData.risks.splice(index, 1);
    setEditData(newData);
  };

  // Check if risks data is empty or null
  const isRisksEmpty = !data.risks || data.risks.length === 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">Risk Areas</h1>
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

      {isRisksEmpty && !isEditing ? (
        <div className="text-center py-12 text-[#57727e] text-lg">
          No risks present
        </div>
      ) : (
        <div className="border border-[#ced7db] rounded-sm overflow-hidden">
          <div className="grid grid-cols-2 bg-[#002169] text-white font-medium text-lg">
            <div className="p-4 border-r border-[#35454c]">Risk Areas</div>
            <div className="p-4">Rationale</div>
          </div>

          {isEditing ? (
            <>
              {editData.risks &&
                editData.risks.map((risk, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 border-t border-[#ced7db]"
                  >
                    <div className="bg-[#002169] text-white p-4 flex items-center">
                      <textarea
                        value={risk.area || ""}
                        onChange={(e) =>
                          updateRisk(index, "area", e.target.value)
                        }
                        className="w-full bg-[#156082] text-white p-2 rounded"
                        rows={2}
                      />
                      <button
                        onClick={() => removeRisk(index)}
                        className="ml-2 text-white hover:text-red-300"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>

                    <div className="p-4 border-l border-[#ced7db]">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-[#445963] mb-1">
                          Detail:
                        </label>
                        <textarea
                          value={risk.detail || ""}
                          onChange={(e) =>
                            updateRisk(index, "detail", e.target.value)
                          }
                          className="w-full border border-[#ced7db] p-2 rounded"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#445963] mb-1">
                          Rationale:
                        </label>
                        <textarea
                          value={risk.rationale || ""}
                          onChange={(e) =>
                            updateRisk(index, "rationale", e.target.value)
                          }
                          className="w-full border border-[#ced7db] p-2 rounded"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              <div className="p-4 border-t border-[#ced7db] flex justify-center">
                <Button
                  onClick={addRisk}
                  className="bg-[#156082] hover:bg-[#092a38] text-white"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Risk
                </Button>
              </div>
            </>
          ) : (
            <>
              {data.risks &&
                data.risks.map((risk, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 border-t border-[#ced7db]"
                  >
                    {index === 0 ||
                    (data.risks &&
                      data.risks[index - 1] &&
                      data.risks[index - 1].area !== risk.area) ? (
                      <div className="bg-[#002169] text-white p-4 flex items-center">
                        <h3 className="font-medium text-lg">
                          {risk.area || ""}
                        </h3>
                      </div>
                    ) : (
                      <div className="bg-[#002169] text-white p-4"></div>
                    )}

                    <div className="p-4 border-l border-[#ced7db]">
                      <ul className="list-disc pl-5 space-y-4">
                        <li className="text-[#35454c]">
                          {risk.detail || ""}
                          <br />
                          <span className="block mt-2">
                            {risk.rationale || ""}
                          </span>
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
