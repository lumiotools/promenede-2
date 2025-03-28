"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SectionLayout } from "@/components/ui/section-layout";
import type { LeadershipExecutive } from "@/types/leadership_executives";

interface LeadershipExecutivesProps {
  initialData: LeadershipExecutive[] | null | undefined;
}

export function LeadershipExecutivesPage({
  initialData,
}: LeadershipExecutivesProps) {
  const [executives, setExecutives] = useState<LeadershipExecutive[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedExecutive, setExpandedExecutive] = useState<number | null>(
    null
  );
  const [editingExecutive, setEditingExecutive] =
    useState<LeadershipExecutive | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newAchievement, setNewAchievement] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setLoading(false);
      setExecutives(initialData);
    }
  }, [initialData]);

  const toggleExpand = (index: number) => {
    if (expandedExecutive === index) {
      setExpandedExecutive(null);
    } else {
      setExpandedExecutive(index);
    }
  };

  const handleEdit = (executive: LeadershipExecutive, index: number) => {
    setEditingExecutive({ ...executive });
    setEditingIndex(index);
  };

  const handleSave = () => {
    if (editingExecutive && editingIndex !== null) {
      const updatedExecutives = [...executives];
      updatedExecutives[editingIndex] = editingExecutive;
      setExecutives(updatedExecutives);
      setEditingExecutive(null);
      setEditingIndex(null);
    }
  };

  const handleAddExecutive = () => {
    const newExecutive: LeadershipExecutive = {
      name: "",
      position: "",
      since: "",
      background: "",
      achievements: [],
      educationalBackground: "",
    };
    setEditingExecutive(newExecutive);
    setEditingIndex(-1); // -1 indicates a new executive
  };

  const handleAddNewExecutive = () => {
    if (editingExecutive) {
      setExecutives([...executives, editingExecutive]);
      setEditingExecutive(null);
      setEditingIndex(null);
    }
  };

  const handleAddAchievement = () => {
    if (editingExecutive && newAchievement.trim()) {
      setEditingExecutive({
        ...editingExecutive,
        achievements: [
          ...(editingExecutive.achievements || []),
          newAchievement,
        ],
      });
      setNewAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    if (editingExecutive && editingExecutive.achievements) {
      const updatedAchievements = [...editingExecutive.achievements];
      updatedAchievements.splice(index, 1);
      setEditingExecutive({
        ...editingExecutive,
        achievements: updatedAchievements,
      });
    }
  };

  // Calculate average tenure
  const calculateAverageTenure = (): number => {
    if (!executives.length) return 0;

    const executivesWithTenure = executives.filter((exec) => exec.since);
    if (!executivesWithTenure.length) return 0;

    const currentYear = new Date().getFullYear();
    const totalYears = executivesWithTenure.reduce((sum, exec) => {
      if (exec.since) {
        // Extract the year more robustly
        const yearMatch = exec.since.match(/\d{4}/);
        if (yearMatch) {
          const startYear = Number.parseInt(yearMatch[0]);
          return sum + (currentYear - startYear);
        }
      }
      return sum;
    }, 0);

    return Math.round((totalYears / executivesWithTenure.length) * 10) / 10;
  };

  if (loading) {
    return (
      <SectionLayout
        title="Leadership & Executives"
        sourceText="Source: Coresignal, OpenAI"
      >
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-[#ced7db] mb-3"></div>
            <div className="h-3 w-32 bg-[#ced7db] rounded mb-2"></div>
            <div className="h-3 w-24 bg-[#ced7db] rounded"></div>
          </div>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout
      title="Leadership & Executives"
      onSave={(data) => console.log("Saved data:", data)}
      initialData={executives}
      sourceText="Source: Coresignal, OpenAI"
    >
      {({ isEditing, editData, setEditData }) => (
        <div className="h-full overflow-auto">
          {/* Add Executive Button */}
          <div className="hidden flex justify-end mb-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={handleAddExecutive}
                  size="sm"
                  className="bg-[#156082] hover:bg-[#092a38] text-white text-xs h-7"
                >
                  <PlusCircle className="mr-1 h-3 w-3" />
                  Add Executive
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingIndex === -1
                      ? "Add New Executive"
                      : "Edit Executive"}
                  </DialogTitle>
                </DialogHeader>
                {editingExecutive && (
                  <div className="grid gap-3 py-3">
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="name" className="text-right text-xs">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={editingExecutive.name || ""}
                        onChange={(e) =>
                          setEditingExecutive({
                            ...editingExecutive,
                            name: e.target.value,
                          })
                        }
                        className="col-span-3 h-8 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="position" className="text-right text-xs">
                        Position
                      </Label>
                      <Input
                        id="position"
                        value={editingExecutive.position || ""}
                        onChange={(e) =>
                          setEditingExecutive({
                            ...editingExecutive,
                            position: e.target.value,
                          })
                        }
                        className="col-span-3 h-8 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="since" className="text-right text-xs">
                        Since
                      </Label>
                      <Input
                        id="since"
                        value={editingExecutive.since || ""}
                        onChange={(e) =>
                          setEditingExecutive({
                            ...editingExecutive,
                            since: e.target.value,
                          })
                        }
                        className="col-span-3 h-8 text-xs"
                        placeholder="e.g. 2011"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingExecutive(null);
                          setEditingIndex(null);
                        }}
                        className="text-xs h-7"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#156082] hover:bg-[#092a38] text-xs h-7"
                        onClick={
                          editingIndex === -1
                            ? handleAddNewExecutive
                            : handleSave
                        }
                      >
                        {editingIndex === -1 ? "Add" : "Save"}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Company Tenure Section */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-[#445963] mb-2">
              Company Tenure
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <Card className="bg-[#f2f4f7] border-[#ced7db]">
                <CardHeader className="p-2">
                  <CardTitle className="text-center text-[#445963] text-xs font-medium">
                    Average Tenure
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 flex justify-center items-center">
                  <div className="text-xl font-bold text-[#156082]">
                    {calculateAverageTenure()}{" "}
                    <span className="text-xs">years</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#f2f4f7] border-[#ced7db]">
                <CardHeader className="p-2">
                  <CardTitle className="text-center text-[#445963] text-xs font-medium">
                    Executive Count
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 flex justify-center items-center">
                  <div className="text-xl font-bold text-[#156082]">
                    {executives.length} <span className="text-xs">execs</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#f2f4f7] border-[#ced7db]">
                <CardHeader className="p-2">
                  <CardTitle className="text-center text-[#445963] text-xs font-medium">
                    Combined Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 flex justify-center items-center">
                  <div className="text-xl font-bold text-[#156082]">
                    {calculateAverageTenure() * executives.length}{" "}
                    <span className="text-xs">years</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Executives List */}
          <div>
            <h3 className="text-sm font-medium text-[#445963] mb-2">
              Leadership Team
            </h3>

            {executives.length === 0 ? (
              <div className="bg-white rounded-lg p-3 text-center border border-[#ced7db]">
                <p className="text-[#57727e] text-xs">
                  No executives data available
                </p>
                <Button
                  onClick={handleAddExecutive}
                  className="mt-2 bg-[#156082] hover:bg-[#092a38] text-xs h-7"
                >
                  <PlusCircle className="mr-1 h-3 w-3" />
                  Add Executive
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[calc(100%-120px)] overflow-auto">
                {executives.slice(0, 5).map((executive, index) => (
                  <Card key={index} className="bg-white border-[#ced7db]">
                    <CardHeader className="p-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-semibold text-[#092a38]">
                            {executive.name || "Unnamed"}
                          </CardTitle>
                          <div className="flex items-center mt-1 space-x-1">
                            <Badge className="bg-[#156082] hover:bg-[#156082] text-[10px] px-1 py-0">
                              {executive.position || "No position"}
                            </Badge>
                            {executive.since && (
                              <span className="text-[10px] text-[#57727e]">
                                Since {executive.since}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(executive, index)}
                                className="h-6 text-[10px] px-1"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Executive</DialogTitle>
                              </DialogHeader>
                              {/* Dialog content is handled by the shared edit/add form */}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(index)}
                            className="h-6 w-6 p-0"
                          >
                            {expandedExecutive === index ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandedExecutive === index && (
                      <CardContent className="p-2">
                        <div className="space-y-2 text-xs">
                          {executive.background && (
                            <div>
                              <h4 className="font-medium text-[#445963] text-[11px]">
                                Background
                              </h4>
                              <p className="text-[#57727e] text-[10px]">
                                {executive.background}
                              </p>
                            </div>
                          )}

                          {executive.achievements &&
                            executive.achievements.length > 0 && (
                              <div>
                                <h4 className="font-medium text-[#445963] text-[11px]">
                                  Key Achievements
                                </h4>
                                <ul className="list-disc pl-4 space-y-0.5">
                                  {executive.achievements
                                    .slice(0, 3)
                                    .map((achievement, idx) => (
                                      <li
                                        key={idx}
                                        className="text-[#57727e] text-[10px]"
                                      >
                                        {achievement}
                                      </li>
                                    ))}
                                  {executive.achievements.length > 3 && (
                                    <li className="text-[#57727e] text-[10px] italic">
                                      +{executive.achievements.length - 3} more
                                      achievements
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}

                          {executive.educationalBackground && (
                            <div>
                              <h4 className="font-medium text-[#445963] text-[11px]">
                                Education
                              </h4>
                              <p className="text-[#57727e] text-[10px]">
                                {executive.educationalBackground}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
                {executives.length > 5 && (
                  <div className="text-center text-[10px] text-[#57727e] italic">
                    +{executives.length - 5} more executives not shown
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
