"use client";

import { useEffect, useState } from "react";
import { PencilIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { QAItem } from "@/types/qa";

// Initial QA data
type QAProps = {
  initialData?: QAItem[];
};

export default function QAComponent({ initialData = [] }: QAProps) {
  const [qaData, setQaData] = useState<QAItem[]>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<QAItem[]>(initialData || []);
  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Crunchbase"
  );

  useEffect(() => {
    // console.log("QAComponent received new data:", initialData)
    setQaData(initialData);
    if (!isEditing) {
      setEditData(initialData || []);
    }
  }, [initialData, isEditing]);

  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(qaData)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    // Create UserAttachment entity
    const userAttachment = {
      name: "qa-component-mxW7m4ypuvj5UDPAYcM1jKFEpJnmwe.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peer-developments-page-mxW7m4ypuvj5UDPAYcM1jKFEpJnmwe.tsx",
    };

    console.log("Creating UserAttachment:", userAttachment);

    setQaData(editData);
    setIsEditing(false);

    // Update the source text to include the user
    setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update");
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

  // Get only top 5 items for display
  const displayQAData = qaData.slice(0, 6);
  const displayEditData = editData.slice(0, 6);

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-2 bg-white flex flex-col"
      style={{ minHeight: "100%", aspectRatio: "16/9" }}
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-gray-700 text-2xl font-normal">Q&A</h1>
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={cancelEditing}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>
      <div className="border-t border-gray-300 mb-1"></div>

      {/* Content area that will grow/shrink as needed */}
      <div className="flex-grow">
        {isQADataEmpty && !isEditing ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            No Q&A data present
          </div>
        ) : isEditing ? (
          <div className="space-y-6">
            {displayEditData.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-1"
              >
                <div className="flex justify-between ">
                  <h3 className="text-gray-700 text-lg font-medium">
                    Q&A Item #{index + 1}
                  </h3>
                  <button
                    onClick={() => removeQA(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question:
                  </label>
                  <textarea
                    value={item.question || ""}
                    onChange={(e) =>
                      updateQA(index, "question", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer:
                  </label>
                  <textarea
                    value={item.answer || ""}
                    onChange={(e) => updateQA(index, "answer", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    rows={3}
                  />
                </div>
              </div>
            ))}

            {editData.length < 5 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={addQA}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Q&A Item
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {displayQAData.map((item, index) => (
              <div key={index} className="mb-3">
                <h3 className="text-gray-700 text-xl font-normal mb-1">
                  {item.question || ""}
                </h3>

                <ul className="space-y-6">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 ">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                    </div>
                    <div>
                      <span className="text-gray-600">{item.answer || ""}</span>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with source text, always at the bottom */}
      <div className="mt-auto pt-4 text-gray-500 text-sm">{sourceText}</div>
    </div>
  );
}
