"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CompanyData } from "@/types/apiResponse";
import { exportToExcel } from "./export-to-excel";

interface Section {
  id: string;
  title: string;
}

interface ExportExcelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  companyName: string;
  data?: CompanyData;
}

export function ExportExcelDialog({
  isOpen,
  onClose,
  sections,
  companyName,
  data,
}: ExportExcelDialogProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectAll = () => {
    if (selectedSections.length === sections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(sections.map((section) => section.id));
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToExcel(companyName, data, selectedSections);
      onClose();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export to Excel</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="select-all"
              checked={selectedSections.length === sections.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all" className="font-medium">
              Select All
            </Label>
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={section.id}
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                  />
                  <Label htmlFor={section.id}>{section.title}</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedSections.length === 0 || isExporting}
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
