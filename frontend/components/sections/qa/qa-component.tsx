"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import { QAItem } from "@/types/qa";

// Initial QA data
type QAProps = {
  initialData?: QAItem[];
};

export default function QAComponent({ initialData = [] }: QAProps) {
  const [qaData, setQaData] = useState<QAItem[]>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<QAItem[]>(initialData || []);
  useEffect(() => {
    // console.log("QAComponent received new data:", initialData);
    setQaData(initialData);
  }, [initialData]);
  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(qaData)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    setQaData(editData);
    setIsEditing(false);
  };

  const updateQA = (
    index: number,
    field: keyof QAItem,
    value: string
  ): void => {
    const newData = [...editData];
    newData[index][field] = value;
    setEditData(newData);
  };

  const addQA = (): void => {
    const newData = [...editData];
    newData.push({
      question: "New Question",
      answer: "New Answer",
    });
    setEditData(newData);
  };

  const removeQA = (index: number): void => {
    const newData = [...editData];
    newData.splice(index, 1);
    setEditData(newData);
  };

  // Check if QA data is empty
  const isQADataEmpty = !qaData || qaData.length === 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#445963] text-6xl font-normal">Q&A</h2>
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

      {isQADataEmpty && !isEditing ? (
        <div className="text-center py-12 text-[#57727e] text-lg">
          No Q&A data present
        </div>
      ) : isEditing ? (
        <div className="space-y-8">
          {editData.map((item, index) => (
            <div key={index} className="border border-[#ced7db] rounded-md p-4">
              <div className="flex justify-between mb-3">
                <h3 className="text-[#35454c] text-lg font-medium">
                  Q&A Item #{index + 1}
                </h3>
                <button
                  onClick={() => removeQA(index)}
                  className="text-[#445963] hover:text-red-500"
                >
                  <TrashIcon size={18} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#445963] mb-1">
                  Question:
                </label>
                <textarea
                  value={item.question || ""}
                  onChange={(e) => updateQA(index, "question", e.target.value)}
                  className="w-full border border-[#ced7db] p-2 rounded"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#445963] mb-1">
                  Answer:
                </label>
                <textarea
                  value={item.answer || ""}
                  onChange={(e) => updateQA(index, "answer", e.target.value)}
                  className="w-full border border-[#ced7db] p-2 rounded"
                  rows={3}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <Button
              onClick={addQA}
              className="bg-[#156082] hover:bg-[#092a38] text-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Q&A Item
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {qaData.map((item, index) => (
            <div key={index} className="mb-12">
              <h3 className="text-[#35454c] text-2xl font-normal mb-8">
                {item.question || ""}
              </h3>

              <ul className="space-y-6">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <span className="inline-block w-1.5 h-1.5 bg-[#35454c] rounded-full"></span>
                  </div>
                  <div>
                    <span className="text-[#35454c] font-semibold">
                      End-to-End Automation:{" "}
                    </span>
                    <span className="text-[#445963]">{item.answer || ""}</span>
                  </div>
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
