"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import type { CompanyData } from "@/types/apiResponse";
import { ExportExcelDialog } from "./export-excel-dialog";
import { availableSections } from "./export-to-excel";

interface ExportExcelButtonProps {
  companyName: string;
  data?: CompanyData;
}

export function ExportExcelButton({
  companyName,
  data,
}: ExportExcelButtonProps) {
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);

  // Use the same sections as defined in export-to-excel.tsx
  const sections = availableSections.map((section) => ({
    id: section.id,
    title: section.title,
  }));

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 text-[#57727e] border-[#ced7db]"
        onClick={() => setIsExcelDialogOpen(true)}
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline">Excel Export</span>
      </Button>

      <ExportExcelDialog
        isOpen={isExcelDialogOpen}
        onClose={() => setIsExcelDialogOpen(false)}
        sections={sections}
        companyName={companyName}
        data={data}
      />
    </>
  );
}
