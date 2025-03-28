"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import type { CompanyData } from "@/types/apiResponse";
import { exportToExcel } from "./export-to-excel";

interface ExportExcelButtonProps {
  companyName: string;
  data?: CompanyData;
}

// Export button component
export const ExportExcelButton = ({
  companyName,
  data,
  selectedSections,
  className,
}: {
  companyName: string;
  data?: CompanyData;
  selectedSections?: string[];
  className?: string;
}) => {
  const handleExport = async () => {
    try {
      await exportToExcel(companyName, data, selectedSections);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      // Handle error (e.g., show a toast notification)
    }
  };

  return (
    <Button onClick={handleExport} className={className} variant="outline">
      Export to Excel
    </Button>
  );
};
