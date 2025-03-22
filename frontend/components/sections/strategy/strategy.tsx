"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Edit, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KeyInitiative, Strategy } from "@/types/strategy";

interface StrategyPageProps {
  initialData?: Strategy | null;
}

const StrategyPage: React.FC<StrategyPageProps> = ({ initialData }) => {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editInitiative, setEditInitiative] = useState<KeyInitiative | null>(
    null
  );
  const [editInitiativeIndex, setEditInitiativeIndex] = useState<number | null>(
    null
  );
  const [editCoreValueIndex, setEditCoreValueIndex] = useState<number | null>(
    null
  );
  const [editCoreValue, setEditCoreValue] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setStrategy(initialData);
    }
    setLoading(false);
  }, [initialData]);

  const handleEdit = (section: string, value: string | null) => {
    setEditSection(section);
    setEditValue(value || "");
  };

  const handleSave = () => {
    if (!strategy || !editSection) return;

    const updatedStrategy = { ...strategy } as Strategy;

    // Handle different property types correctly
    if (
      editSection === "mission" ||
      editSection === "vision" ||
      editSection === "businessModel" ||
      editSection === "growthStrategy" ||
      editSection === "competitiveAdvantage"
    ) {
      updatedStrategy[editSection] = editValue;
    }
    setStrategy(updatedStrategy);
    setEditSection(null);
  };

  const handleCancel = () => {
    setEditSection(null);
    setEditInitiative(null);
    setEditInitiativeIndex(null);
    setEditCoreValueIndex(null);
  };

  const handleEditInitiative = (initiative: KeyInitiative, index: number) => {
    setEditInitiative({ ...initiative });
    setEditInitiativeIndex(index);
  };

  const handleSaveInitiative = () => {
    if (!strategy || editInitiativeIndex === null || !editInitiative) return;

    const updatedInitiatives = [...(strategy.keyInitiatives || [])];
    updatedInitiatives[editInitiativeIndex] = editInitiative;

    const updatedStrategy = { ...strategy };
    updatedStrategy.keyInitiatives = updatedInitiatives;

    setStrategy(updatedStrategy);
    setEditInitiative(null);
    setEditInitiativeIndex(null);
  };

  const handleAddInitiative = () => {
    if (!strategy) return;

    const newInitiative: KeyInitiative = {
      name: "",
      description: "",
      expectedOutcome: "",
    };

    const updatedStrategy = { ...strategy };
    updatedStrategy.keyInitiatives = [
      ...(strategy.keyInitiatives || []),
      newInitiative,
    ];

    setStrategy(updatedStrategy);
    setEditInitiative(newInitiative);
    setEditInitiativeIndex((strategy.keyInitiatives || []).length);
  };

  const handleEditCoreValue = (value: string, index: number) => {
    setEditCoreValueIndex(index);
    setEditCoreValue(value || "");
  };

  const handleSaveCoreValue = () => {
    if (!strategy || editCoreValueIndex === null) return;

    const updatedCoreValues = [...(strategy.coreValues || [])];
    updatedCoreValues[editCoreValueIndex] = editCoreValue;

    const updatedStrategy = { ...strategy };
    updatedStrategy.coreValues = updatedCoreValues;

    setStrategy(updatedStrategy);
    setEditCoreValueIndex(null);
  };

  const handleAddCoreValue = () => {
    if (!strategy) return;

    const updatedStrategy = { ...strategy };
    updatedStrategy.coreValues = [...(strategy.coreValues || []), ""];

    setStrategy(updatedStrategy);
    setEditCoreValueIndex((strategy.coreValues || []).length - 1);
    setEditCoreValue("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#445963]">
          Loading strategy data...
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-[#445963] text-xl">No strategy data available</div>
        <Button
          onClick={() => {
            setStrategy({
              mission: null,
              vision: null,
              coreValues: [],
              businessModel: null,
              growthStrategy: null,
              competitiveAdvantage: null,
              keyInitiatives: [],
            });
          }}
          className="bg-[#156082] hover:bg-[#092a38] text-white"
        >
          Create Strategy
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-semibold text-[#445963] mb-4">Strategy</h1>
      <div className="h-px bg-[#ced7db] w-full mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="bg-[#eff2f3] p-6 border-none shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#445963]">
                Mission & Vision
              </h2>
              {editSection !== "mission" && editSection !== "vision" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#57727e] hover:text-[#156082] hover:bg-[#ced7db]/50"
                  onClick={() => handleEdit("mission", strategy.mission)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[#57727e] mb-1">
                  Mission
                </h3>
                {editSection === "mission" ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="min-h-[100px] border-[#ced7db]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-[#156082] hover:bg-[#092a38]"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="text-[#445963] border-[#ced7db]"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#35454c]">
                    {strategy.mission || "Not available"}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#57727e] mb-1">
                  Vision
                </h3>
                {editSection === "vision" ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="min-h-[100px] border-[#ced7db]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-[#156082] hover:bg-[#092a38]"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="text-[#445963] border-[#ced7db]"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#35454c]">
                    {strategy.vision || "Not available"}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-[#eff2f3] p-6 border-none shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#445963]">
                Core Values
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#57727e] hover:text-[#156082] hover:bg-[#ced7db]/50"
                onClick={handleAddCoreValue}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {strategy.coreValues && strategy.coreValues.length > 0 ? (
                <ul className="space-y-2">
                  {strategy.coreValues.map((value, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      {editCoreValueIndex === index ? (
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={editCoreValue}
                            onChange={(e) => setEditCoreValue(e.target.value)}
                            className="border-[#ced7db]"
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveCoreValue}
                            className="bg-[#156082] hover:bg-[#092a38]"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            className="text-[#445963] border-[#ced7db]"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-[#35454c]">• {value}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#57727e] hover:text-[#156082] hover:bg-[#ced7db]/50"
                            onClick={() => handleEditCoreValue(value, index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#35454c]">Not available</p>
              )}
            </div>
          </Card>

          <Card className="bg-[#eff2f3] p-6 border-none shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#445963]">
                Business Model
              </h2>
              {editSection !== "businessModel" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#57727e] hover:text-[#156082] hover:bg-[#ced7db]/50"
                  onClick={() =>
                    handleEdit("businessModel", strategy.businessModel)
                  }
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editSection === "businessModel" ? (
              <div className="space-y-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="min-h-[100px] border-[#ced7db]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-[#156082] hover:bg-[#092a38]"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="text-[#445963] border-[#ced7db]"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[#35454c]">
                {strategy.businessModel || "Not available"}
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-[#eff2f3] p-6 border-none shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#445963]">
                Growth Strategy
              </h2>
              {editSection !== "growthStrategy" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#57727e] hover:text-[#156082] hover:bg-[#ced7db]/50"
                  onClick={() =>
                    handleEdit("growthStrategy", strategy.growthStrategy)
                  }
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editSection === "growthStrategy" ? (
              <div className="space-y-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="min-h-[100px] border-[#ced7db]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-[#156082] hover:bg-[#092a38]"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="text-[#445963] border-[#ced7db]"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[#35454c]">
                {strategy.growthStrategy || "Not available"}
              </p>
            )}
          </Card>

          <Card className="bg-[#eff2f3] p-6 border-none shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#445963]">
                Competitive Advantage
              </h2>
              {editSection !== "competitiveAdvantage" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#57727e] hover:text-[#156082] hover:bg-[#ced7db]/50"
                  onClick={() =>
                    handleEdit(
                      "competitiveAdvantage",
                      strategy.competitiveAdvantage
                    )
                  }
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editSection === "competitiveAdvantage" ? (
              <div className="space-y-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="min-h-[100px] border-[#ced7db]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-[#156082] hover:bg-[#092a38]"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="text-[#445963] border-[#ced7db]"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[#35454c]">
                {strategy.competitiveAdvantage || "Not available"}
              </p>
            )}
          </Card>

          <Card className="bg-[#eff2f3] p-6 border-none shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#445963]">
                Key Initiatives
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#57727e] hover:text-[#156082] hover:bg-[#ced7db]/50"
                onClick={handleAddInitiative}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-4">
              {strategy.keyInitiatives && strategy.keyInitiatives.length > 0 ? (
                strategy.keyInitiatives.map((initiative, index) => (
                  <div
                    key={index}
                    className="border border-[#ced7db] rounded-md p-4 bg-white"
                  >
                    {editInitiativeIndex === index && editInitiative ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-[#57727e] mb-1 block">
                            Name
                          </label>
                          <Input
                            value={editInitiative.name || ""}
                            onChange={(e) =>
                              setEditInitiative({
                                ...editInitiative,
                                name: e.target.value,
                              })
                            }
                            className="border-[#ced7db]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#57727e] mb-1 block">
                            Description
                          </label>
                          <Textarea
                            value={editInitiative.description || ""}
                            onChange={(e) =>
                              setEditInitiative({
                                ...editInitiative,
                                description: e.target.value,
                              })
                            }
                            className="min-h-[80px] border-[#ced7db]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#57727e] mb-1 block">
                            Expected Outcome
                          </label>
                          <Textarea
                            value={editInitiative.expectedOutcome || ""}
                            onChange={(e) =>
                              setEditInitiative({
                                ...editInitiative,
                                expectedOutcome: e.target.value,
                              })
                            }
                            className="min-h-[80px] border-[#ced7db]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSaveInitiative}
                            className="bg-[#156082] hover:bg-[#092a38]"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            className="text-[#445963] border-[#ced7db]"
                          >
                            <X className="h-4 w-4 mr-1" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-[#445963]">
                            {initiative.name || "Untitled Initiative"}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#57727e] hover:text-[#156082] hover:bg-[#ced7db]/50"
                            onClick={() =>
                              handleEditInitiative(initiative, index)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div>
                            <h4 className="text-xs font-medium text-[#57727e]">
                              Description
                            </h4>
                            <p className="text-sm text-[#35454c]">
                              {initiative.description || "Not available"}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-[#57727e]">
                              Expected Outcome
                            </h4>
                            <p className="text-sm text-[#35454c]">
                              {initiative.expectedOutcome || "Not available"}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[#35454c]">No key initiatives available</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 text-sm text-[#57727e] italic">
        Source: Company Strategy Documentation
      </div>
    </div>
  );
};

export default StrategyPage;
