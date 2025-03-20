import { Edit } from "lucide-react"

interface SectionHeaderProps {
  title: string
  editable?: boolean
}

export function SectionHeader({ title, editable = true }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-4xl font-medium text-[#475467]">{title}</h2>
      {editable && (
        <button className="text-[#8097a2]">
          <Edit className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

