"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { PrimaryActivity, SupportActivity, ValueChain } from "@/types/market";

interface ValueChainPageProps {
  initialData?: ValueChain | null;
}

export default function ValueChainPage({ initialData }: ValueChainPageProps) {
  const [data, setData] = useState<ValueChain | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<ValueChain | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setData(initialData || null);
      setEditData(initialData || null);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [initialData]);

  const handleSave = () => {
    setData(editData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditData(data);
    setEditMode(true);
  };

  const handleAddData = () => {
    const emptyData: ValueChain = {
      summary: "",
      primaryActivities: [
        { name: "Inbound Logistics", description: "" },
        { name: "Operations", description: "" },
        { name: "Outbound Logistics", description: "" },
        { name: "Marketing and Sales", description: "" },
        { name: "Service", description: "" },
      ],
      supportActivities: [
        { name: "Firm Infrastructure", description: "" },
        { name: "Human Resource Management", description: "" },
        { name: "Technology Development", description: "" },
        { name: "Procurement", description: "" },
      ],
      keyStrengths: [""],
      keyChallenges: [""],
    };

    setEditData(emptyData);
    setEditMode(true);
  };

  const updateSummary = (value: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      summary: value,
    });
  };

  const updatePrimaryActivity = (
    index: number,
    field: keyof PrimaryActivity,
    value: string
  ) => {
    if (!editData || !editData.primaryActivities) return;

    const updatedActivities = [...editData.primaryActivities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value,
    };

    setEditData({
      ...editData,
      primaryActivities: updatedActivities,
    });
  };

  const updateSupportActivity = (
    index: number,
    field: keyof SupportActivity,
    value: string
  ) => {
    if (!editData || !editData.supportActivities) return;

    const updatedActivities = [...editData.supportActivities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value,
    };

    setEditData({
      ...editData,
      supportActivities: updatedActivities,
    });
  };

  const updateListItems = (
    field: "keyStrengths" | "keyChallenges",
    value: string
  ) => {
    if (!editData) return;

    const items = value.split("\n").filter((item) => item.trim() !== "");

    setEditData({
      ...editData,
      [field]: items.length > 0 ? items : null,
    });
  };

  const addPrimaryActivity = () => {
    if (!editData) return;

    const updatedActivities = editData.primaryActivities
      ? [...editData.primaryActivities]
      : [];
    updatedActivities.push({ name: "", description: "" });

    setEditData({
      ...editData,
      primaryActivities: updatedActivities,
    });
  };

  const removePrimaryActivity = (index: number) => {
    if (!editData || !editData.primaryActivities) return;

    const updatedActivities = [...editData.primaryActivities];
    updatedActivities.splice(index, 1);

    setEditData({
      ...editData,
      primaryActivities:
        updatedActivities.length > 0 ? updatedActivities : null,
    });
  };

  const addSupportActivity = () => {
    if (!editData) return;

    const updatedActivities = editData.supportActivities
      ? [...editData.supportActivities]
      : [];
    updatedActivities.push({ name: "", description: "" });

    setEditData({
      ...editData,
      supportActivities: updatedActivities,
    });
  };

  const removeSupportActivity = (index: number) => {
    if (!editData || !editData.supportActivities) return;

    const updatedActivities = [...editData.supportActivities];
    updatedActivities.splice(index, 1);

    setEditData({
      ...editData,
      supportActivities:
        updatedActivities.length > 0 ? updatedActivities : null,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-[#445963]">
          Value Chain Analysis
        </h1>
        <Separator className="my-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data && !editMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold text-[#445963]">
            Value Chain Analysis
          </h1>
          <Button
            onClick={handleAddData}
            className="bg-[#156082] hover:bg-[#092a38]"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Value Chain Data
          </Button>
        </div>
        <Separator className="my-4" />
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-xl font-medium text-[#35454c]">
                No value chain data available
              </h3>
              <p className="text-[#57727e] mt-2">
                Click the button above to add value chain information
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-[#445963]">
          Value Chain Analysis
        </h1>
        {!editMode ? (
          <div className="space-x-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-[#156082] text-[#156082]"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Data
            </Button>
            {!data && (
              <Button
                onClick={handleAddData}
                className="bg-[#156082] hover:bg-[#092a38]"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Value Chain Data
              </Button>
            )}
          </div>
        ) : (
          <div className="space-x-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-red-500 text-red-500"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#156082] hover:bg-[#092a38]"
            >
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        )}
      </div>
      <Separator className="my-4" />

      {editMode ? (
        <EditValueChain
          data={editData}
          updateSummary={updateSummary}
          updatePrimaryActivity={updatePrimaryActivity}
          updateSupportActivity={updateSupportActivity}
          updateListItems={updateListItems}
          addPrimaryActivity={addPrimaryActivity}
          removePrimaryActivity={removePrimaryActivity}
          addSupportActivity={addSupportActivity}
          removeSupportActivity={removeSupportActivity}
        />
      ) : (
        <ViewValueChain data={data} />
      )}
    </div>
  );
}

interface EditValueChainProps {
  data: ValueChain | null;
  updateSummary: (value: string) => void;
  updatePrimaryActivity: (
    index: number,
    field: keyof PrimaryActivity,
    value: string
  ) => void;
  updateSupportActivity: (
    index: number,
    field: keyof SupportActivity,
    value: string
  ) => void;
  updateListItems: (
    field: "keyStrengths" | "keyChallenges",
    value: string
  ) => void;
  addPrimaryActivity: () => void;
  removePrimaryActivity: (index: number) => void;
  addSupportActivity: () => void;
  removeSupportActivity: (index: number) => void;
}

function EditValueChain({
  data,
  updateSummary,
  updatePrimaryActivity,
  updateSupportActivity,
  updateListItems,
  addPrimaryActivity,
  removePrimaryActivity,
  addSupportActivity,
  removeSupportActivity,
}: EditValueChainProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.summary || ""}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Enter company summary"
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Primary Activities</span>
            <Button
              onClick={addPrimaryActivity}
              size="sm"
              variant="outline"
              className="border-[#156082] text-[#156082]"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Activity
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.primaryActivities?.map((activity, index) => (
              <div key={index} className="p-4 border rounded-md relative">
                <Button
                  onClick={() => removePrimaryActivity(index)}
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Activity Name
                    </label>
                    <Input
                      value={activity.name || ""}
                      onChange={(e) =>
                        updatePrimaryActivity(index, "name", e.target.value)
                      }
                      placeholder="e.g. Inbound Logistics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      value={activity.description || ""}
                      onChange={(e) =>
                        updatePrimaryActivity(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe this activity"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
            {!data.primaryActivities?.length && (
              <div className="text-center py-4 text-[#57727e]">
                No primary activities added. Click &quot;Add Activity&quot; to
                add one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Support Activities</span>
            <Button
              onClick={addSupportActivity}
              size="sm"
              variant="outline"
              className="border-[#156082] text-[#156082]"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Activity
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.supportActivities?.map((activity, index) => (
              <div key={index} className="p-4 border rounded-md relative">
                <Button
                  onClick={() => removeSupportActivity(index)}
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Activity Name
                    </label>
                    <Input
                      value={activity.name || ""}
                      onChange={(e) =>
                        updateSupportActivity(index, "name", e.target.value)
                      }
                      placeholder="e.g. Firm Infrastructure"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      value={activity.description || ""}
                      onChange={(e) =>
                        updateSupportActivity(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe this activity"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
            {!data.supportActivities?.length && (
              <div className="text-center py-4 text-[#57727e]">
                No support activities added. Click &quot;Add Activity&quot; to
                add one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.keyStrengths?.join("\n") || ""}
              onChange={(e) => updateListItems("keyStrengths", e.target.value)}
              placeholder="Enter key strengths (one per line)"
              rows={6}
            />
            <p className="text-sm text-[#57727e] mt-2">
              Enter each strength on a new line
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.keyChallenges?.join("\n") || ""}
              onChange={(e) => updateListItems("keyChallenges", e.target.value)}
              placeholder="Enter key challenges (one per line)"
              rows={6}
            />
            <p className="text-sm text-[#57727e] mt-2">
              Enter each challenge on a new line
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ViewValueChainProps {
  data: ValueChain | null;
}

function ViewValueChain({ data }: ViewValueChainProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {data.summary ? (
            <p className="text-[#35454c]">{data.summary}</p>
          ) : (
            <p className="text-[#8097a2]">Not available</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="bg-[#f8f9fa]">
            <CardTitle>Primary Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.primaryActivities && data.primaryActivities.length > 0 ? (
              <div className="divide-y">
                {data.primaryActivities.map((activity, index) => (
                  <div key={index} className="p-4">
                    <h3 className="font-semibold text-[#156082] mb-2">
                      {activity.name || "Unnamed Activity"}
                    </h3>
                    <p className="text-[#35454c]">
                      {activity.description || "No description available"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-[#8097a2]">
                No primary activities available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="bg-[#f8f9fa]">
            <CardTitle>Support Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.supportActivities && data.supportActivities.length > 0 ? (
              <div className="divide-y">
                {data.supportActivities.map((activity, index) => (
                  <div key={index} className="p-4">
                    <h3 className="font-semibold text-[#156082] mb-2">
                      {activity.name || "Unnamed Activity"}
                    </h3>
                    <p className="text-[#35454c]">
                      {activity.description || "No description available"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-[#8097a2]">
                No support activities available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-[#f8f9fa]">
            <CardTitle>Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            {data.keyStrengths && data.keyStrengths.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {data.keyStrengths.map((strength, index) => (
                  <li key={index} className="text-[#35454c]">
                    {strength}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#8097a2]">No key strengths available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-[#f8f9fa]">
            <CardTitle>Key Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            {data.keyChallenges && data.keyChallenges.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {data.keyChallenges.map((challenge, index) => (
                  <li key={index} className="text-[#35454c]">
                    {challenge}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#8097a2]">No key challenges available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
