"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CompanyData } from "@/types/apiResponse";
import { exportToExcel } from "./export-to-excel";
import { FileIcon } from "lucide-react";

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
  // Initialize with all sections selected
  const [selectedSections, setSelectedSections] = useState<string[]>(
    sections.map((section) => section.id)
  );
  const [isExporting, setIsExporting] = useState(false);

  // Reset selected sections when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSections(sections.map((section) => section.id));
    }
  }, [isOpen, sections]);

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
      <DialogContent className="sm:max-w-md bg-gray-50 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-normal text-gray-700">
            Export Frames
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200 my-2"></div>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="py-4 space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="select-all"
                className="h-5 w-5 rounded-sm border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                checked={selectedSections.length === sections.length}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="text-lg text-gray-600 font-medium"
              >
                Select All
              </label>
            </div>

            <div className="space-y-4 pt-2">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={section.id}
                    className="h-5 w-5 rounded-sm border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                  />
                  <label htmlFor={section.id} className="text-lg text-gray-600">
                    {section.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 flex justify-between mt-auto border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md px-6 py-2 h-auto"
          >
            Cancel
          </Button>

          <Button
            onClick={handleExport}
            disabled={selectedSections.length === 0 || isExporting}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2 h-auto flex items-center gap-2"
          >
            <FileIcon className="w-5 h-5" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
