"use client"

import { useState, useEffect } from "react"
import { PlusIcon, TrashIcon } from "lucide-react"
import { SectionLayout } from "@/components/ui/section-layout"
import type { OpportunitiesRisks, Opportunity } from "@/types/opportunitiesRisks"

interface OpportunitiesProps {
  initialData?: OpportunitiesRisks
}

// Default empty state
const defaultState: OpportunitiesRisks = {
  opportunities: [],
  risks: [],
}

export default function Opportunities({ initialData = defaultState }: OpportunitiesProps) {
  const [data, setData] = useState<OpportunitiesRisks>(initialData || defaultState)
  const [editData, setEditData] = useState<OpportunitiesRisks>(initialData || defaultState)
  const [sourceText, setSourceText] = useState<string>("Source: PromenadeAI, Industry Analysis")

  // Fix: Only include initialData in the dependency array and add proper comparison
  useEffect(() => {
    // Only update if initialData changes and is different from current data
    if (JSON.stringify(initialData) !== JSON.stringify(data)) {
      setData(initialData || defaultState)
      setEditData(initialData || defaultState)
    }
  }, [initialData])

  const saveChanges = (): void => {
    setData(editData)
    setSourceText("Source: PromenadeAI, Industry Analysis, User Update")
  }

  const updateOpportunity = (index: number, field: keyof Opportunity, value: string): void => {
    const newData = { ...editData }
    // Ensure opportunities array exists
    if (!newData.opportunities) {
      newData.opportunities = []
    }
    if (newData.opportunities[index]) {
      newData.opportunities[index][field] = value
      setEditData(newData)
    }
  }

  const addOpportunity = (): void => {
    const newData = { ...editData }
    // Ensure opportunities array exists
    if (!newData.opportunities) {
      newData.opportunities = []
    }
    newData.opportunities.push({
      area: "New Area",
      detail: "New detail",
      rationale: "New rationale",
    })
    setEditData(newData)
  }

  const removeOpportunity = (index: number): void => {
    const newData = { ...editData }
    // Ensure opportunities array exists
    if (!newData.opportunities) {
      newData.opportunities = []
      return
    }
    newData.opportunities.splice(index, 1)
    setEditData(newData)
  }

  // Check if opportunities data is empty or null
  const isOpportunitiesEmpty = !data.opportunities || data.opportunities.length === 0

  // Limit to top 5 items
  const displayOpportunities = data.opportunities ? data.opportunities.slice(0, 5) : []
  const displayEditOpportunities = editData.opportunities ? editData.opportunities.slice(0, 5) : []

  // Regular content
  const regularContent = (
    <div>
      {isOpportunitiesEmpty ? (
        <div className="text-center py-12 text-gray-500 text-lg">No opportunities data present</div>
      ) : (
        <div className="border border-[#ced7db] rounded-sm overflow-hidden">
          <div className="grid grid-cols-3 bg-[#002169] text-white font-medium text-lg">
            <div className="p-4 border-r border-[#35454c]">Opportunity Areas</div>
            <div className="p-4 border-r border-[#35454c]">Detail</div>
            <div className="p-4">Rationale</div>
          </div>

          {displayOpportunities.map((opportunity, index) => (
            <div key={index} className="grid grid-cols-3 border-t border-[#ced7db]">
              {index === 0 || displayOpportunities[index - 1].area !== opportunity.area ? (
                <div className="bg-[#002169] text-white p-4 flex items-center">
                  <h3 className="font-medium text-lg">{opportunity.area || ""}</h3>
                </div>
              ) : (
                <div className="bg-[#002169] text-white p-4"></div>
              )}

              <div className="p-4 border-l border-[#ced7db]">
                <ul className="list-disc pl-5 space-y-4">
                  <li className="text-[#35454c]">{opportunity.detail || ""}</li>
                </ul>
              </div>

              <div className="p-4 border-l border-[#ced7db]">
                <ul className="list-disc pl-5 space-y-4">
                  <li className="text-[#35454c]">{opportunity.rationale || ""}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Editable content
  const editableContent = (
    <div>
      <div className="space-y-6">
        {displayEditOpportunities.map((opportunity, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-1">
            <div className="flex justify-between">
              <h3 className="text-gray-700 text-lg font-medium">Opportunity #{index + 1}</h3>
              <button onClick={() => removeOpportunity(index)} className="text-red-500 hover:text-red-700">
                <TrashIcon size={18} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Area:</label>
              <input
                type="text"
                value={opportunity.area || ""}
                onChange={(e) => updateOpportunity(index, "area", e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detail:</label>
              <textarea
                value={opportunity.detail || ""}
                onChange={(e) => updateOpportunity(index, "detail", e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rationale:</label>
              <textarea
                value={opportunity.rationale || ""}
                onChange={(e) => updateOpportunity(index, "rationale", e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                rows={2}
              />
            </div>
          </div>
        ))}

        {displayEditOpportunities.length < 5 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={addOpportunity}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Opportunity
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <SectionLayout
      title="Opportunity Areas"
      sourceText={sourceText}
      onSave={saveChanges}
      editableContent={editableContent}
    >
      {regularContent}
    </SectionLayout>
  )
}

