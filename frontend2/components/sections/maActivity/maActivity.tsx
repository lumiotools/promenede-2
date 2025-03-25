"use client"

import type { Acquisition, MAActivity } from "@/types/maActivity"
import type React from "react"
import { useState, useEffect } from "react"
import { PencilIcon, PlusIcon, XIcon, Trash2Icon } from "lucide-react"
import { SectionLayout } from "@/components/ui/section-layout"

// Default state for the component
const defaultState: MAActivity = {
  acquisitions: [],
  acquired_by: null,
}

// Helper function to format currency values
const formatCurrency = (value: number | null | undefined, currency = "$"): string => {
  if (value === null || value === undefined) return "N/A"

  if (value >= 1000000000) {
    return `${currency}${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `${currency}${(value / 1000000).toFixed(1)}M`
  } else {
    return `${currency}${value.toLocaleString()}`
  }
}

// Helper to format dates
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "N/A"

  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (e) {
    return "N/A"
  }
}

type MaActivityProps = {
  initialData?: MAActivity
}

// Extended acquisition type with additional fields for UI
interface ExtendedAcquisition extends Acquisition {
  description?: string
  dealType?: string
}

const MAStrategyPage: React.FC<MaActivityProps> = ({ initialData = defaultState }: MaActivityProps) => {
  // Ensure acquisitions exists and is an array
  const safeAcquisitions = initialData?.acquisitions || []

  // Initialize with extended data
  const getExtendedData = (acquisitionsData: Acquisition[]): ExtendedAcquisition[] => {
    return acquisitionsData.map((acquisition) => ({
      ...acquisition,
      description: "Technology company acquisition",
      dealType: "Acquisition",
    }))
  }

  const [data, setData] = useState<ExtendedAcquisition[]>(getExtendedData(safeAcquisitions))
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editData, setEditData] = useState<ExtendedAcquisition[]>(getExtendedData(safeAcquisitions))
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  // Update data when initialData changes
  useEffect(() => {
    if (!initialData) return

    console.log("M&A strategy initialData update:", initialData)

    // Ensure acquisitions exists and is an array
    const updatedAcquisitions = initialData.acquisitions || []

    // Update the state with the new extended data
    const extendedData = getExtendedData(updatedAcquisitions)
    setData(extendedData)

    // If we're not in edit mode, also update the edit data
    if (!isEditing) {
      setEditData(extendedData)
    }
  }, [initialData, isEditing])

  const startEditing = (): void => {
    setIsEditing(true)
    // Create a deep copy to avoid reference issues
    setEditData(JSON.parse(JSON.stringify(data)))
  }

  const cancelEditing = (): void => {
    setIsEditing(false)
  }

  const saveChanges = (): void => {
    // Create UserAttachment entity
    const userAttachment = {
      name: "mastrategy-page-bb518e2683M9irxk9vJWzQQgv2XP8T.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mastrategy-page-bb518e2683M9irxk9vJWzQQgv2XP8T.tsx",
    }

    console.log("Creating UserAttachment:", userAttachment)
    setData(editData)
    setIsEditing(false)

    // Update the source text to include the user
    setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update")
  }

  const updateAcquisition = (index: number, field: keyof ExtendedAcquisition, value: string | number): void => {
    const newData = [...editData]

    // Handle property name mapping
    if (field === "acquiree_name") {
      newData[index].acquiree_name = value as string
    } else if (field === "announced_date") {
      newData[index].announced_date = value as string
    } else {
      // For other fields, directly update
      newData[index][field] = value as never // Type assertion needed due to generic update
    }

    setEditData(newData)
  }

  const addAcquisition = (): void => {
    const newData = [...editData]
    newData.push({
      acquiree_name: "New Company",
      announced_date: new Date().toISOString().split("T")[0],
      price: 0,
      currency: "$",
      description: "New acquisition",
      dealType: "Acquisition",
    })
    setEditData(newData)
  }

  const removeAcquisition = (index: number): void => {
    const newData = [...editData]
    newData.splice(index, 1)
    setEditData(newData)
  }

  // Only display top 5 acquisitions
  const displayAcquisitions = isEditing ? editData.slice(0, 5) : data.slice(0, 5)

  return (
    <SectionLayout title="M&A Strategy" source={sourceText}>
      {!isEditing ? (
        <button
          onClick={startEditing}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={saveChanges}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Save
          </button>
          <button
            onClick={cancelEditing}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
          >
            <XIcon className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      )}

      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h2 className="text-gray-700 text-xl font-medium">Acquisition History</h2>
          {isEditing && (
            <button
              onClick={addAcquisition}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Acquisition
            </button>
          )}
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-white">
              <th className="p-3 text-left font-medium border-b border-gray-200">Name</th>
              <th className="p-3 text-left font-medium border-b border-gray-200">Deal Date</th>
              <th className="p-3 text-left font-medium border-b border-gray-200">Deal Value</th>
              {isEditing && <th className="p-3 text-center font-medium border-b border-gray-200 w-16">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {displayAcquisitions.length === 0 ? (
              <tr>
                <td colSpan={isEditing ? 4 : 3} className="p-3 text-center text-gray-500">
                  No acquisitions available
                </td>
              </tr>
            ) : (
              displayAcquisitions.map((acquisition, index) => (
                <tr key={index} className="border-t border-gray-200">
                  {isEditing ? (
                    <>
                      <td className="p-3">
                        <input
                          type="text"
                          value={acquisition.acquiree_name || ""}
                          onChange={(e) => updateAcquisition(index, "acquiree_name", e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={acquisition.announced_date || ""}
                          onChange={(e) => updateAcquisition(index, "announced_date", e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <select
                            value={acquisition.currency || "$"}
                            onChange={(e) => updateAcquisition(index, "currency", e.target.value)}
                            className="border border-gray-300 p-1 rounded mr-2 w-16"
                          >
                            <option value="$">$</option>
                            <option value="€">€</option>
                            <option value="£">£</option>
                            <option value="¥">¥</option>
                          </select>
                          <input
                            type="number"
                            value={acquisition.price || 0}
                            onChange={(e) => updateAcquisition(index, "price", Number.parseFloat(e.target.value))}
                            className="flex-1 border border-gray-300 p-1 rounded"
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => removeAcquisition(index)} className="text-red-500 hover:text-red-700">
                          <Trash2Icon className="h-5 w-5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{acquisition.acquiree_name || "N/A"}</td>
                      <td className="p-3">{formatDate(acquisition.announced_date)}</td>
                      <td className="p-3">{formatCurrency(acquisition.price, acquisition.currency || "$")}</td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  )
}

export default MAStrategyPage

