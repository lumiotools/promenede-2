"use client";

import { useState } from "react";
import { marketInfo as initialData } from "./marketData";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { MarketSize, MarketSizeItem } from "@/types/market";

export default function MarketSizePage() {
  const [data, setData] = useState<MarketSize>(initialData.size);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<MarketSize>(initialData.size);

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

  const updateTitle = (value: string): void => {
    setEditData({
      ...editData,
      title: value,
    });
  };

  const updateSubtitle = (value: string): void => {
    setEditData({
      ...editData,
      subtitle: value,
    });
  };

  const updateMarketItem = (
    index: number,
    field: keyof MarketSizeItem,
    value: string
  ): void => {
    const newData = { ...editData };
    if (field === "keyExcerpts") return; // Handle separately

    newData.items[index][field] = value as never;
    setEditData(newData);
  };

  const addMarketItem = (): void => {
    const newData = { ...editData };
    newData.items.push({
      marketName: "New Market",
      source: "Source",
      sourceLink: "link",
      keyExcerpts: [{ text: "New excerpt" }],
    });
    setEditData(newData);
  };

  const removeMarketItem = (index: number): void => {
    const newData = { ...editData };
    newData.items.splice(index, 1);
    setEditData(newData);
  };

  const addExcerpt = (marketIndex: number): void => {
    const newData = { ...editData };
    newData.items[marketIndex].keyExcerpts.push({ text: "New excerpt" });
    setEditData(newData);
  };

  const updateExcerpt = (
    marketIndex: number,
    excerptIndex: number,
    value: string
  ): void => {
    const newData = { ...editData };
    newData.items[marketIndex].keyExcerpts[excerptIndex].text = value;
    setEditData(newData);
  };

  const removeExcerpt = (marketIndex: number, excerptIndex: number): void => {
    const newData = { ...editData };
    newData.items[marketIndex].keyExcerpts.splice(excerptIndex, 1);
    setEditData(newData);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">
          {data.title || "Market Size"}
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

      {isEditing ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-[#445963] text-xl font-medium mb-4">Title</h2>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="w-full border border-[#ced7db] p-2 rounded mb-4"
            />
          </div>

          <div>
            <h2 className="text-[#445963] text-xl font-medium mb-4">
              Subtitle
            </h2>
            <input
              type="text"
              value={editData.subtitle}
              onChange={(e) => updateSubtitle(e.target.value)}
              className="w-full border border-[#ced7db] p-2 rounded mb-4"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#445963] text-xl font-medium">
              Market Size Items
            </h2>
            <Button
              onClick={addMarketItem}
              size="sm"
              className="bg-[#156082] hover:bg-[#092a38] text-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Market
            </Button>
          </div>

          <div className="space-y-6">
            {editData.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="border border-[#ced7db] rounded-md p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#445963] mb-1">
                      Market Name:
                    </label>
                    <input
                      type="text"
                      value={item.marketName}
                      onChange={(e) =>
                        updateMarketItem(
                          itemIndex,
                          "marketName",
                          e.target.value
                        )
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeMarketItem(itemIndex)}
                    className="ml-2 text-[#445963] hover:text-red-500"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#445963] mb-1">
                      Source:
                    </label>
                    <input
                      type="text"
                      value={item.source}
                      onChange={(e) =>
                        updateMarketItem(itemIndex, "source", e.target.value)
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#445963] mb-1">
                      Source Link:
                    </label>
                    <input
                      type="text"
                      value={item.sourceLink || ""}
                      onChange={(e) =>
                        updateMarketItem(
                          itemIndex,
                          "sourceLink",
                          e.target.value
                        )
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-[#445963]">
                      Key Excerpts:
                    </label>
                    <Button
                      onClick={() => addExcerpt(itemIndex)}
                      size="sm"
                      variant="outline"
                      className="border-[#ced7db] text-[#445963] text-xs py-1 h-7"
                    >
                      <PlusIcon className="mr-1 h-3 w-3" /> Add Excerpt
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {item.keyExcerpts.map((excerpt, excerptIndex) => (
                      <div
                        key={excerptIndex}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={excerpt.text}
                          onChange={(e) =>
                            updateExcerpt(
                              itemIndex,
                              excerptIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 border border-[#ced7db] p-2 rounded"
                        />
                        <button
                          onClick={() => removeExcerpt(itemIndex, excerptIndex)}
                          className="text-[#445963] hover:text-red-500"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {data.items.length === 0 ? (
            <div className="text-center py-12 text-[#57727e] text-lg">
              No market size data present
            </div>
          ) : (
            <div className="border border-[#ced7db] rounded-sm overflow-hidden">
              <div className="p-4 border-b border-[#ced7db]">
                <h2 className="text-[#445963] text-xl">
                  {data.subtitle || "Market Size Data"}
                </h2>
              </div>

              <div className="grid grid-cols-2 bg-[#002169] text-white font-medium text-lg">
                <div className="p-4 border-r border-[#35454c]">Market</div>
                <div className="p-4">Key excerpts</div>
              </div>

              {data.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 border-t border-[#ced7db]"
                >
                  <div className="p-4 border-r border-[#ced7db]">
                    <h3 className="font-medium text-[#35454c] text-lg mb-2">
                      {item.marketName || "N/A"}
                    </h3>
                    <p className="text-[#57727e] text-sm">
                      Source: {item.source || "N/A"}
                      {item.sourceLink && (
                        <span className="text-[#156082]">
                          {" "}
                          ({item.sourceLink})
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="p-4">
                    {item.keyExcerpts && item.keyExcerpts.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {item.keyExcerpts.map((excerpt, excerptIndex) => (
                          <li key={excerptIndex} className="text-[#35454c]">
                            {excerpt.text || "N/A"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#57727e]">No excerpts available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-8 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
