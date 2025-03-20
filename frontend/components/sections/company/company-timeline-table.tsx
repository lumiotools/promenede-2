"use client"

import { useEffect, useState } from "react"
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react'

interface TimelineEvent {
  date: string
  event: string | null
  description: string
}

export function CompanyTimelineTable() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TimelineEvent[] | null>(null)
  const [editData, setEditData] = useState<TimelineEvent[] | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching company timeline data...")
        const response = await fetch("/paypal.json")

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }

        const jsonData = await response.json()

        // Check if timeline data exists
        if (jsonData?.data?.company_timeline && Array.isArray(jsonData.data.company_timeline)) {
          // Filter out events with null event property
          const timelineEvents = jsonData.data.company_timeline
            .filter((item: any) => item.event !== null)
            .map((item: any) => ({
              date: item.date,
              event: item.event,
              description: item.description || "",
            }))

          setData(timelineEvents)
        } else {
          // Use fallback data if timeline data is not available
          setData([])
        }
      } catch (error) {
        console.error("Error fetching timeline data:", error)
        setError("Failed to load timeline data")

        // Set fallback data
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format date to MM/YY format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        // If date is invalid, try to parse it from different formats
        if (dateString.includes(".")) {
          const parts = dateString.split(".")
          if (parts.length >= 2) {
            return `${parts[1]}/${parts[0].substring(2)}`
          }
        }
        return dateString
      }

      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear().toString().substring(2)
      return `${month}/${year}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  // Start editing mode
  const startEditing = () => {
    setIsEditing(true)
    setEditData(JSON.parse(JSON.stringify(data)))
  }

  // Cancel editing and revert changes
  const cancelEditing = () => {
    setIsEditing(false)
    setEditData(null)
  }

  // Save changes
  const saveChanges = () => {
    if (editData) {
      setData(editData)
    }
    setIsEditing(false)
  }

  // Update a field in a timeline event
  const updateField = (index: number, field: keyof TimelineEvent, value: string) => {
    if (!editData) return

    const newEditData = [...editData]
    if (field === 'event') {
      newEditData[index][field] = value || null
    } else {
      // @ts-ignore - Type mismatch for string fields
      newEditData[index][field] = value
    }
    setEditData(newEditData)
  }

  // Add a new timeline event
  const addTimelineEvent = () => {
    if (!editData) return

    const newEvent: TimelineEvent = {
      date: new Date().toISOString().split('T')[0],
      event: "",
      description: ""
    }

    setEditData([...editData, newEvent])
  }

  // Remove a timeline event
  const removeTimelineEvent = (index: number) => {
    if (!editData) return

    const newEditData = [...editData]
    newEditData.splice(index, 1)
    setEditData(newEditData)
  }

  if (loading) {
    return <div className="p-6">Loading company timeline data...</div>
  }

  if (error && !data) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  // Ensure data is available
  if (!data || data.length === 0) {
    return <div className="p-6">No company timeline data available</div>
  }

  // Use editData when in editing mode, otherwise use data
  const displayData = isEditing ? editData : data

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Company Timeline (table)</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      {/* Timeline Table */}
      <div className="border border-[#e5e7eb] rounded-md overflow-hidden mx-10">
        <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb]">
          <h2 className="text-base font-medium text-[#475467]">Company Timeline</h2>
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={saveChanges} 
                className="text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                <span className="text-xs">Save</span>
              </button>
              <button 
                onClick={cancelEditing} 
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                <span className="text-xs">Cancel</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={startEditing} 
              className="text-[#8097a2] hover:text-[#475467]"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="py-3 px-4 text-left font-medium border-r border-[#1a3573] w-16">#</th>
                <th className="py-3 px-4 text-left font-medium border-r border-[#1a3573] w-32">MM/YY</th>
                <th className="py-3 px-4 text-left font-medium border-r border-[#1a3573]">Partner</th>
                <th className="py-3 px-4 text-left font-medium">Detail</th>
                {isEditing && <th className="py-3 px-4 text-center font-medium w-16">Action</th>}
              </tr>
            </thead>
            <tbody>
              {displayData?.map((event, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}>
                  <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">{index + 1}</td>
                  <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">
                    {isEditing ? (
                      <input
                        type="date"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={event.date}
                        onChange={(e) => updateField(index, 'date', e.target.value)}
                      />
                    ) : (
                      formatDate(event.date)
                    )}
                  </td>
                  <td className="py-3 px-4 border-r border-[#e5e7eb] text-[#475467]">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={event.event || ""}
                        onChange={(e) => updateField(index, 'event', e.target.value)}
                      />
                    ) : (
                      event.event
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#475467]">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={event.description}
                        onChange={(e) => updateField(index, 'description', e.target.value)}
                      />
                    ) : (
                      event.description
                    )}
                  </td>
                  {isEditing && (
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => removeTimelineEvent(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {/* Add empty rows to match the design if needed */}
              {!isEditing && displayData && displayData.length < 5 &&
                Array.from({ length: 5 - displayData.length }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className="py-3 px-4 border-r border-[#e5e7eb]"></td>
                    <td className="py-3 px-4 border-r border-[#e5e7eb]"></td>
                    <td className="py-3 px-4 border-r border-[#e5e7eb]"></td>
                    <td className="py-3 px-4"></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Add new event button when in edit mode */}
        {isEditing && (
          <div className="p-4 border-t border-[#e5e7eb] flex justify-center">
            <button
              onClick={addTimelineEvent}
              className="flex items-center gap-1 text-[#002169] hover:text-[#1a3573] font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Add Timeline Event</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}
