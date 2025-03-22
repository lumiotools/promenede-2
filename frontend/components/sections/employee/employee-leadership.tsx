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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LeadershipExecutive } from "@/types/leadership_executives";

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
    console.log("leadership executives", initialData);
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
      <div className="w-full p-8 bg-[#f7f9f9]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-semibold text-[#445963] mb-6">
            Organization: Leadership & Executives
          </h1>
          <div className="border-t border-[#ced7db] mb-8"></div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-[#ced7db] mb-4"></div>
              <div className="h-4 w-48 bg-[#ced7db] rounded mb-3"></div>
              <div className="h-4 w-36 bg-[#ced7db] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-[#f7f9f9]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-[#445963]">
            Organization: Leadership & Executives
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={handleAddExecutive}
                className="bg-[#156082] hover:bg-[#092a38] text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Executive
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingIndex === -1 ? "Add New Executive" : "Edit Executive"}
                </DialogTitle>
              </DialogHeader>
              {editingExecutive && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
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
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">
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
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="since" className="text-right">
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
                      className="col-span-3"
                      placeholder="e.g. August 2011"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="background" className="text-right">
                      Background
                    </Label>
                    <Textarea
                      id="background"
                      value={editingExecutive.background || ""}
                      onChange={(e) =>
                        setEditingExecutive({
                          ...editingExecutive,
                          background: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="achievements" className="text-right pt-2">
                      Achievements
                    </Label>
                    <div className="col-span-3">
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="newAchievement"
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          placeholder="Add new achievement"
                          className="flex-1"
                        />
                        <Button
                          onClick={handleAddAchievement}
                          type="button"
                          className="bg-[#156082] hover:bg-[#092a38]"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {editingExecutive.achievements?.map(
                          (achievement, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="bg-[#eff2f3] p-2 rounded flex-1 text-sm">
                                {achievement}
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveAchievement(idx)}
                              >
                                Remove
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="education" className="text-right">
                      Education
                    </Label>
                    <Textarea
                      id="education"
                      value={editingExecutive.educationalBackground || ""}
                      onChange={(e) =>
                        setEditingExecutive({
                          ...editingExecutive,
                          educationalBackground: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingExecutive(null);
                        setEditingIndex(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#156082] hover:bg-[#092a38]"
                      onClick={
                        editingIndex === -1 ? handleAddNewExecutive : handleSave
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

        <div className="border-t border-[#ced7db] mb-8"></div>

        {/* Company Tenure Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-medium text-[#445963] mb-6">
            Company tenure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#f2f4f7] border-[#ced7db]">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-[#445963] text-lg font-medium">
                  Average Tenure at current company
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex justify-center items-center h-32">
                <div className="text-4xl font-bold text-[#156082]">
                  {calculateAverageTenure()}{" "}
                  <span className="text-lg">years</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#f2f4f7] border-[#ced7db]">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-[#445963] text-lg font-medium">
                  Average years of experience
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex justify-center items-center h-32">
                <div className="text-4xl font-bold text-[#156082]">
                  {executives.length}{" "}
                  <span className="text-lg">executives</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#f2f4f7] border-[#ced7db]">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-[#445963] text-lg font-medium">
                  Combined Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex justify-center items-center h-32">
                <div className="text-4xl font-bold text-[#156082]">
                  {calculateAverageTenure() * executives.length}{" "}
                  <span className="text-lg">years</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Executives List */}
        <div>
          <h2 className="text-2xl font-medium text-[#445963] mb-6">
            Leadership Team
          </h2>

          {executives.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-[#ced7db]">
              <p className="text-[#57727e] text-lg">
                No executives data available
              </p>
              <Button
                onClick={handleAddExecutive}
                className="mt-4 bg-[#156082] hover:bg-[#092a38]"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Executive
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {executives.map((executive, index) => (
                <Card key={index} className="bg-white border-[#ced7db]">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold text-[#092a38]">
                          {executive.name || "Unnamed"}
                        </CardTitle>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge className="bg-[#156082] hover:bg-[#156082]">
                            {executive.position || "No position"}
                          </Badge>
                          {executive.since && (
                            <span className="text-sm text-[#57727e]">
                              Since {executive.since}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(executive, index)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
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
                        >
                          {expandedExecutive === index ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedExecutive === index && (
                    <CardContent>
                      <div className="space-y-4 mt-2">
                        {executive.background && (
                          <div>
                            <h3 className="font-medium text-[#445963] mb-1">
                              Background
                            </h3>
                            <p className="text-[#57727e]">
                              {executive.background}
                            </p>
                          </div>
                        )}

                        {executive.achievements &&
                          executive.achievements.length > 0 && (
                            <div>
                              <h3 className="font-medium text-[#445963] mb-1">
                                Key Achievements
                              </h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {executive.achievements.map(
                                  (achievement, idx) => (
                                    <li key={idx} className="text-[#57727e]">
                                      {achievement}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {executive.educationalBackground && (
                          <div>
                            <h3 className="font-medium text-[#445963] mb-1">
                              Education
                            </h3>
                            <p className="text-[#57727e]">
                              {executive.educationalBackground}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
