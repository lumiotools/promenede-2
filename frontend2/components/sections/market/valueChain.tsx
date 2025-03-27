"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Plus, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { SectionLayout } from "@/components/ui/section-layout";
import type { ValueChain, ValueChainStage } from "@/types/market";

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

  const updateIndustryName = (value: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      industryName: value,
    });
  };

  const updateStage = (
    index: number,
    field: keyof ValueChainStage,
    value: any
  ) => {
    if (!editData || !editData.stages) return;

    const updatedStages = [...editData.stages];
    updatedStages[index] = {
      ...updatedStages[index],
      [field]: value,
    };

    setEditData({
      ...editData,
      stages: updatedStages,
    });
  };

  const updateActivities = (stageIndex: number, activitiesText: string) => {
    if (!editData || !editData.stages) return;

    const activities = activitiesText
      .split("\n")
      .filter((item) => item.trim() !== "");

    const updatedStages = [...editData.stages];
    updatedStages[stageIndex] = {
      ...updatedStages[stageIndex],
      activities: activities,
    };

    setEditData({
      ...editData,
      stages: updatedStages,
    });
  };

  const updateCompanies = (stageIndex: number, companiesText: string) => {
    if (!editData || !editData.stages) return;

    const companies = companiesText
      .split("\n")
      .filter((item) => item.trim() !== "");

    const updatedStages = [...editData.stages];
    updatedStages[stageIndex] = {
      ...updatedStages[stageIndex],
      companies: companies,
    };

    setEditData({
      ...editData,
      stages: updatedStages,
    });
  };

  const updateCompanyLogos = (stageIndex: number, logosText: string) => {
    if (!editData || !editData.stages) return;

    const logos = logosText.split("\n").filter((item) => item.trim() !== "");

    const updatedStages = [...editData.stages];
    updatedStages[stageIndex] = {
      ...updatedStages[stageIndex],
      company_logos: logos,
    };

    setEditData({
      ...editData,
      stages: updatedStages,
    });
  };

  const addStage = () => {
    if (!editData) {
      // If no data exists, create initial structure with first stage
      setEditData({
        industryName: "",
        stages: [
          {
            stage: "",
            activities: [],
            companies: [],
            company_logos: [],
          },
        ],
      });
      return;
    }

    const updatedStages = editData.stages ? [...editData.stages] : [];
    updatedStages.push({
      stage: "",
      activities: [],
      companies: [],
      company_logos: [],
    });

    setEditData({
      ...editData,
      stages: updatedStages,
    });
  };

  const removeStage = (index: number) => {
    if (!editData || !editData.stages) return;

    const updatedStages = [...editData.stages];
    updatedStages.splice(index, 1);

    setEditData({
      ...editData,
      stages: updatedStages.length > 0 ? updatedStages : null,
    });
  };

  if (loading) {
    return (
      <SectionLayout
        title="Value Chain Analysis"
        sourceText="Source: OpenAI"
        showEditButton={false}
      >
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </SectionLayout>
    );
  }

  if (!data && !editMode) {
    return (
      <SectionLayout
        title="Value Chain Analysis"
        sourceText="Source: OpenAI"
        showEditButton={false}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={addStage}
              className="bg-[#156082] hover:bg-[#092a38]"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Value Chain Data
            </Button>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center">
                <h3 className="text-xl font-medium text-[#35454c]">
                  No value chain data available
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout
      title="Value Chain Analysis"
      sourceText="Source: OpenAI"
      showEditButton={false}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {!editMode ? (
            <div className="space-x-2">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="border-[#156082] text-[#156082]"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Data
              </Button>
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

        {editMode ? (
          <EditValueChain
            data={editData}
            updateIndustryName={updateIndustryName}
            updateStage={updateStage}
            updateActivities={updateActivities}
            updateCompanies={updateCompanies}
            updateCompanyLogos={updateCompanyLogos}
            addStage={addStage}
            removeStage={removeStage}
          />
        ) : (
          <ViewValueChain data={data} />
        )}
      </div>
    </SectionLayout>
  );
}

interface EditValueChainProps {
  data: ValueChain | null;
  updateIndustryName: (value: string) => void;
  updateStage: (
    index: number,
    field: keyof ValueChainStage,
    value: any
  ) => void;
  updateActivities: (stageIndex: number, activitiesText: string) => void;
  updateCompanies: (stageIndex: number, companiesText: string) => void;
  updateCompanyLogos: (stageIndex: number, logosText: string) => void;
  addStage: () => void;
  removeStage: (index: number) => void;
}

function EditValueChain({
  data,
  updateIndustryName,
  updateStage,
  updateActivities,
  updateCompanies,
  updateCompanyLogos,
  addStage,
  removeStage,
}: EditValueChainProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={data.industryName || ""}
            onChange={(e) => updateIndustryName(e.target.value)}
            placeholder="Enter industry name"
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Value Chain Stages</h3>
        <Button
          onClick={addStage}
          size="sm"
          variant="outline"
          className="border-[#156082] text-[#156082]"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Stage
        </Button>
      </div>

      {data.stages?.map((stage, index) => (
        <Card key={index} className="relative">
          <Button
            onClick={() => removeStage(index)}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="text-base">
              <Input
                value={stage.stage || ""}
                onChange={(e) => updateStage(index, "stage", e.target.value)}
                placeholder="Enter stage name"
                className="font-medium"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Activities (one per line)
              </label>
              <Textarea
                value={stage.activities?.join("\n") || ""}
                onChange={(e) => updateActivities(index, e.target.value)}
                placeholder="Enter activities (one per line)"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Companies (one per line)
              </label>
              <Textarea
                value={stage.companies?.join("\n") || ""}
                onChange={(e) => updateCompanies(index, e.target.value)}
                placeholder="Enter company names (one per line)"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Logo URLs (one per line)
              </label>
              <Textarea
                value={stage.company_logos?.join("\n") || ""}
                onChange={(e) => updateCompanyLogos(index, e.target.value)}
                placeholder="Enter logo URLs (one per line)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {!data.stages?.length && (
        <Card>
          <CardContent className="p-6 text-center text-[#57727e]">
            No stages added. Click "Add Stage" to add one.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ViewValueChainProps {
  data: ValueChain | null;
}

function ViewValueChain({ data }: ViewValueChainProps) {
  if (!data) return null;

  // Helper function to determine if a string is a URL
  const isUrl = (str: string): boolean => {
    return str.startsWith("http://") || str.startsWith("https://");
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-medium text-[#445963]">
          Industry:{" "}
          <span className="text-[#156082]">
            {data.industryName || "Not specified"}
          </span>
        </h2>
      </div>

      {data.stages && data.stages.length > 0 ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-nowrap gap-2 min-w-full">
            {data.stages.map((stage, index) => (
              <div key={index} className="w-[200px] flex-shrink-0 relative">
                <div className="bg-[#002169] text-white p-2 rounded-t-md flex items-center justify-center relative">
                  <h3 className="font-medium text-center text-sm">
                    {stage.stage}
                  </h3>
                  {index < data.stages!.length - 1 && (
                    <div className="absolute -right-2 top-0 bottom-0 w-4 overflow-hidden">
                      <div className="h-full w-4 bg-[#002169] transform rotate-45 origin-top-left"></div>
                    </div>
                  )}
                </div>
                <div className="bg-[#eff2f3] p-3 rounded-b-md h-[200px] overflow-y-auto">
                  <ul className="space-y-1 mb-3">
                    {stage.activities.slice(0, 4).map((activity, actIndex) => (
                      <li key={actIndex} className="flex items-start">
                        <span className="text-[#17b26a] mr-1 mt-0.5 flex-shrink-0">
                          •
                        </span>
                        <span className="text-[#35454c] text-xs">
                          {activity}
                        </span>
                      </li>
                    ))}
                    {stage.activities.length > 4 && (
                      <li className="text-xs text-[#57727e] italic">
                        +{stage.activities.length - 4} more activities
                      </li>
                    )}
                  </ul>

                  {/* Display company logos or names */}
                  {((stage.companies && stage.companies.length > 0) ||
                    (stage.company_logos &&
                      stage.company_logos.length > 0)) && (
                    <div className="border-t pt-2 mt-2">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {/* Display companies */}
                        {stage.companies &&
                          stage.companies.map((company, compIndex) => {
                            // If there's a matching logo, use it
                            const logo =
                              stage.company_logos &&
                              compIndex < stage.company_logos.length
                                ? stage.company_logos[compIndex]
                                : null;

                            return (
                              <div
                                key={`company-${compIndex}`}
                                className="mr-1"
                              >
                                {logo && isUrl(logo) ? (
                                  <div className="w-6 h-6 relative">
                                    <Image
                                      src={logo}
                                      alt={company}
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="text-xs text-[#35454c] px-1">
                                    {company}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                        {/* Display any extra logos without companies */}
                        {stage.company_logos &&
                          stage.companies &&
                          stage.company_logos.length > stage.companies.length &&
                          stage.company_logos
                            .slice(stage.companies.length)
                            .map((logo, logoIndex) => (
                              <div key={`logo-${logoIndex}`} className="mr-1">
                                {isUrl(logo) ? (
                                  <div className="w-6 h-6 relative">
                                    <Image
                                      src={logo}
                                      alt="Company logo"
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="text-xs text-[#35454c] px-1">
                                    {logo}
                                  </div>
                                )}
                              </div>
                            ))}

                        {/* Handle case where we have company_logos but no companies array */}
                        {(!stage.companies || stage.companies.length === 0) &&
                          stage.company_logos &&
                          stage.company_logos.map((logo, logoIndex) => (
                            <div
                              key={`solo-logo-${logoIndex}`}
                              className="mr-1"
                            >
                              {isUrl(logo) ? (
                                <div className="w-6 h-6 relative">
                                  <Image
                                    src={logo}
                                    alt="Company logo"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="text-xs text-[#35454c] px-1">
                                  {logo}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-[#57727e]">
          No value chain stages available
        </div>
      )}
    </div>
  );
}
