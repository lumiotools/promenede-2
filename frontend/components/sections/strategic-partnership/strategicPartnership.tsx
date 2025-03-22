/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StrategicAlliance } from "@/types/strategicAlliance";

interface StrategicAlliancePageProps {
  initialData?: StrategicAlliance[] | null;
}

export function StrategicAlliancePage({
  initialData,
}: StrategicAlliancePageProps) {
  const [alliances, setAlliances] = useState<StrategicAlliance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAlliance, setCurrentAlliance] =
    useState<StrategicAlliance | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      if (initialData && initialData.length > 0) {
        setAlliances(initialData);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [initialData]);

  const handleEdit = (alliance: StrategicAlliance) => {
    setCurrentAlliance(alliance);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setCurrentAlliance({
      name: null,
      description: null,
      date: null,
      logo: null,
    });
    setIsAddingNew(true);
  };

  const handleSave = () => {
    if (currentAlliance) {
      if (isAddingNew) {
        setAlliances([...alliances, currentAlliance]);
        setIsAddingNew(false);
      } else {
        setAlliances(
          alliances.map((a) =>
            a.name === currentAlliance.name ? currentAlliance : a
          )
        );
        setIsEditing(false);
      }
    }
    setCurrentAlliance(null);
  };

  const handleDelete = (allianceName: string | null) => {
    if (allianceName) {
      setAlliances(alliances.filter((a) => a.name !== allianceName));
    }
  };

  const handleInputChange = (field: keyof StrategicAlliance, value: string) => {
    if (currentAlliance) {
      setCurrentAlliance({
        ...currentAlliance,
        [field]: value,
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not available";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-4xl font-semibold text-[#445963]">
          Strategic Alliance & Partnerships
        </CardTitle>
        <Button onClick={handleAdd} className="bg-[#156082] hover:bg-[#092a38]">
          <Plus className="mr-2 h-4 w-4" />
          Add Alliance
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingTable />
        ) : alliances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-lg text-[#57727e]">
              No strategic alliances available
            </p>
            <Button
              onClick={handleAdd}
              className="mt-4 bg-[#156082] hover:bg-[#092a38]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Alliance
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="border-collapse w-full">
              <TableHeader className="bg-[#002169]">
                <TableRow>
                  <TableHead className="text-white font-medium w-[20%]">
                    Name
                  </TableHead>
                  <TableHead className="text-white font-medium w-[50%]">
                    Description
                  </TableHead>
                  <TableHead className="text-white font-medium w-[20%]">
                    Date
                  </TableHead>
                  <TableHead className="text-white font-medium w-[10%]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alliances.map((alliance, index) => (
                  <TableRow
                    key={alliance.name || index}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#ced7db]/20"}
                  >
                    <TableCell className="font-medium text-[#35454c]">
                      {alliance.name || "Not available"}
                    </TableCell>
                    <TableCell className="text-[#57727e]">
                      {alliance.description || "Not available"}
                    </TableCell>
                    <TableCell className="text-[#57727e]">
                      {formatDate(alliance.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(alliance)}
                          className="h-8 w-8 text-[#156082]"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(alliance.name)}
                          className="h-8 w-8 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Strategic Alliance</DialogTitle>
              <DialogDescription>
                Make changes to the strategic alliance details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={currentAlliance?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={currentAlliance?.date?.split("T")[0] || ""}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={currentAlliance?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSave}
                className="bg-[#156082]"
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Strategic Alliance</DialogTitle>
              <DialogDescription>
                Enter the details for the new strategic alliance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="new-name"
                  value={currentAlliance?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="new-date"
                  type="date"
                  value={currentAlliance?.date || ""}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="new-description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="new-description"
                  value={currentAlliance?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingNew(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSave}
                className="bg-[#156082]"
              >
                Add Alliance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function LoadingTable() {
  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-[#002169]">
          <TableRow>
            <TableHead className="text-white font-medium w-[20%]">
              Name
            </TableHead>
            <TableHead className="text-white font-medium w-[50%]">
              Description
            </TableHead>
            <TableHead className="text-white font-medium w-[20%]">
              Date
            </TableHead>
            <TableHead className="text-white font-medium w-[10%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-[#ced7db]/20"}
            >
              <TableCell>
                <Skeleton className="h-4 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
