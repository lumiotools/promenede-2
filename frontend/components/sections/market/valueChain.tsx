"use client";

import { useState } from "react";
import { marketInfo as initialData } from "./marketData";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { ValueChain } from "@/types/market";

export default function ValueChainPage() {
  const [data, setData] = useState<ValueChain>(initialData.valueChain);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<ValueChain>(initialData.valueChain);

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

  const updateIndustry = (value: string): void => {
    setEditData({
      ...editData,
      industry: value,
    });
  };

  const updateStageName = (index: number, value: string): void => {
    const newData = { ...editData };
    newData.stages[index].name = value;
    setEditData(newData);
  };

  const addStage = (): void => {
    const newData = { ...editData };
    newData.stages.push({
      name: "New Stage",
      activities: [{ name: "New Activity" }],
      tools: ["Tool 1", "Tool 2"],
    });
    setEditData(newData);
  };

  const removeStage = (index: number): void => {
    const newData = { ...editData };
    newData.stages.splice(index, 1);
    setEditData(newData);
  };

  const addActivity = (stageIndex: number): void => {
    const newData = { ...editData };
    newData.stages[stageIndex].activities.push({ name: "New Activity" });
    setEditData(newData);
  };

  const updateActivity = (
    stageIndex: number,
    activityIndex: number,
    value: string
  ): void => {
    const newData = { ...editData };
    newData.stages[stageIndex].activities[activityIndex].name = value;
    setEditData(newData);
  };

  const removeActivity = (stageIndex: number, activityIndex: number): void => {
    const newData = { ...editData };
    newData.stages[stageIndex].activities.splice(activityIndex, 1);
    setEditData(newData);
  };

  const addTool = (stageIndex: number): void => {
    const newData = { ...editData };
    if (!newData.stages[stageIndex].tools) {
      newData.stages[stageIndex].tools = [];
    }
    newData.stages[stageIndex].tools?.push("New Tool");
    setEditData(newData);
  };

  const updateTool = (
    stageIndex: number,
    toolIndex: number,
    value: string
  ): void => {
    const newData = { ...editData };
    if (newData.stages[stageIndex].tools) {
      newData.stages[stageIndex].tools![toolIndex] = value;
    }
    setEditData(newData);
  };

  const removeTool = (stageIndex: number, toolIndex: number): void => {
    const newData = { ...editData };
    if (newData.stages[stageIndex].tools) {
      newData.stages[stageIndex].tools!.splice(toolIndex, 1);
    }
    setEditData(newData);
  };

  // Tool logos - using placeholders
  const toolLogos: Record<string, string> = {
    greenhouse: "/placeholder.svg?height=20&width=80",
    phenom: "/placeholder.svg?height=20&width=80",
    Gem: "/placeholder.svg?height=20&width=80",
    seekout: "/placeholder.svg?height=20&width=80",
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">Value Chain</h1>
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
            <h2 className="text-[#445963] text-xl font-medium mb-4">
              Industry
            </h2>
            <input
              type="text"
              value={editData.industry}
              onChange={(e) => updateIndustry(e.target.value)}
              className="w-full border border-[#ced7db] p-2 rounded mb-4"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#445963] text-xl font-medium">
              Value Chain Stages
            </h2>
            <Button
              onClick={addStage}
              size="sm"
              className="bg-[#156082] hover:bg-[#092a38] text-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Stage
            </Button>
          </div>

          <div className="space-y-6">
            {editData.stages.map((stage, stageIndex) => (
              <div
                key={stageIndex}
                className="border border-[#ced7db] rounded-md p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#445963] mb-1">
                      Stage Name:
                    </label>
                    <input
                      type="text"
                      value={stage.name}
                      onChange={(e) =>
                        updateStageName(stageIndex, e.target.value)
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeStage(stageIndex)}
                    className="ml-2 text-[#445963] hover:text-red-500"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-[#445963]">
                      Activities:
                    </label>
                    <Button
                      onClick={() => addActivity(stageIndex)}
                      size="sm"
                      variant="outline"
                      className="border-[#ced7db] text-[#445963] text-xs py-1 h-7"
                    >
                      <PlusIcon className="mr-1 h-3 w-3" /> Add Activity
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {stage.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={activity.name}
                          onChange={(e) =>
                            updateActivity(
                              stageIndex,
                              activityIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 border border-[#ced7db] p-2 rounded"
                        />
                        <button
                          onClick={() =>
                            removeActivity(stageIndex, activityIndex)
                          }
                          className="text-[#445963] hover:text-red-500"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-[#445963]">
                      Tools:
                    </label>
                    <Button
                      onClick={() => addTool(stageIndex)}
                      size="sm"
                      variant="outline"
                      className="border-[#ced7db] text-[#445963] text-xs py-1 h-7"
                    >
                      <PlusIcon className="mr-1 h-3 w-3" /> Add Tool
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {stage.tools?.map((tool, toolIndex) => (
                      <div key={toolIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tool}
                          onChange={(e) =>
                            updateTool(stageIndex, toolIndex, e.target.value)
                          }
                          className="flex-1 border border-[#ced7db] p-2 rounded"
                        />
                        <button
                          onClick={() => removeTool(stageIndex, toolIndex)}
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
          {!data.industry && data.stages.length === 0 ? (
            <div className="text-center py-12 text-[#57727e] text-lg">
              No value chain data present
            </div>
          ) : (
            <>
              <div className="mb-8 border-b border-[#ced7db] pb-4">
                <h2 className="text-[#445963] text-xl">
                  Industry :{" "}
                  <span className="font-medium">{data.industry || "N/A"}</span>
                </h2>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                {data.stages.map((stage, stageIndex) => (
                  <div key={stageIndex} className="flex-1 flex flex-col">
                    <div className="bg-[#002169] text-white p-4 rounded-t-md text-center">
                      <h3 className="font-medium">{stage.name || "N/A"}</h3>
                    </div>
                    <div className="bg-[#f8f9fa] flex-1 p-4 rounded-b-md border border-[#ced7db] border-t-0">
                      <div className="space-y-3">
                        {stage.activities && stage.activities.length > 0 ? (
                          stage.activities.map((activity, activityIndex) => (
                            <div
                              key={activityIndex}
                              className="flex items-start gap-2"
                            >
                              <div className="mt-1.5 flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-[#17b26a]"></div>
                              </div>
                              <p className="text-[#445963]">
                                {activity.name || "N/A"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#57727e] text-center">
                            No activities available
                          </p>
                        )}
                      </div>

                      <div className="mt-8 pt-4 border-t border-[#ced7db] flex justify-center gap-4">
                        {stage.tools && stage.tools.length > 0 ? (
                          stage.tools.map((tool, toolIndex) => (
                            <img
                              key={toolIndex}
                              src={
                                toolLogos[tool] ||
                                "/placeholder.svg?height=20&width=80"
                              }
                              alt={`${tool} logo`}
                              className="h-5"
                            />
                          ))
                        ) : (
                          <p className="text-[#57727e] text-sm text-center">
                            No tools available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div className="mt-8 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
