"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileIcon } from "lucide-react"
import { exportToPDF } from "@/utils/export-to-pdf"

// Define the section type
interface Section {
  id: string
  title: string
}

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  sections: Section[]
}

export function ExportDialog({ isOpen, onClose, sections }: ExportDialogProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)

  // Initialize with all sections selected
  useEffect(() => {
    if (isOpen) {
      setSelectedSections(sections.map((section) => section.id))
    }
  }, [isOpen, sections])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSections(sections.map((section) => section.id))
    } else {
      setSelectedSections([])
    }
  }

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSections((prev) => [...prev, sectionId])
    } else {
      setSelectedSections((prev) => prev.filter((id) => id !== sectionId))
    }
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const success = await exportToPDF({
        title: "Promenade Business Report",
        author: "Promenade",
        subject: "Business Intelligence Dashboard",
        selectedSections: selectedSections,
      })

      if (!success) {
        throw new Error("Failed to export PDF")
      }

      // Close the dialog after successful export
      onClose()
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      alert("Failed to export to PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const isAllSelected = selectedSections.length === sections.length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-[#445963]">Export Frames</DialogTitle>
        </DialogHeader>

        <div className="border-t border-[#ced7db] my-4"></div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            className="data-[state=checked]:bg-[#0a7aff] data-[state=checked]:border-[#0a7aff]"
          />
          <label htmlFor="select-all" className="text-lg font-medium text-[#445963] cursor-pointer">
            Select All
          </label>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center space-x-2">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={(checked) => handleSectionToggle(section.id, checked as boolean)}
                  className="data-[state=checked]:bg-[#0a7aff] data-[state=checked]:border-[#0a7aff]"
                />
                <label htmlFor={section.id} className="text-base text-[#445963] cursor-pointer">
                  {section.title}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onClose} className="text-[#57727e] border-[#ced7db]">
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedSections.length === 0}
            className="bg-[#0a7aff] hover:bg-[#0a7aff]/90 text-white"
          >
            {isExporting ? (
              <span className="flex items-center">Exporting...</span>
            ) : (
              <span className="flex items-center">
                <FileIcon className="mr-2 h-4 w-4" /> Export
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

