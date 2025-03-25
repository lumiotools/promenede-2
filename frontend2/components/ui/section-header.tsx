"use client"

import { Edit } from "lucide-react"

interface SectionHeaderProps {
  title: string
  editable?: boolean
  onEdit?: () => void
}

export function SectionHeader({ title, editable = true, onEdit }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-gray-700 text-2xl font-normal">{title}</h2>
      {editable && (
        <button
          onClick={onEdit}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </button>
      )}
    </div>
  )
}

