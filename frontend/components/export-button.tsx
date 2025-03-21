"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { exportToPDF } from "@/utils/export-to-pdf"

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const success = await exportToPDF({
        title: "Promenade Business Report",
        author: "Promenade",
        subject: "Business Intelligence Dashboard",
      })

      if (!success) {
        throw new Error("Failed to export PDF")
      }
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      alert("Failed to export to PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="px-3 py-1 text-sm bg-[#0ba5ec] text-white rounded-md flex items-center gap-1 hover:bg-[#0990d3] transition-colors disabled:opacity-50"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Export to PDF</span>
        </>
      )}
    </button>
  )
}

