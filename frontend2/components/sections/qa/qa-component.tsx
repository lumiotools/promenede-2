"use client"

import { useEffect, useState } from "react"
import { PlusIcon, TrashIcon } from "lucide-react"
import type { QAItem } from "@/types/qa"
import { SectionLayout } from "@/components/ui/section-layout"

// Initial QA data
type QAProps = {
  initialData?: QAItem[]
}

export default function QAComponent({ initialData = [] }: QAProps) {
  const [qaData, setQaData] = useState<QAItem[]>(initialData)
  const [editData, setEditData] = useState<QAItem[]>(initialData || [])
  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  // Fix: Only include initialData in the dependency array
  useEffect(() => {
    // Only update state if initialData changes and is different from current state
    if (JSON.stringify(initialData) !== JSON.stringify(qaData)) {
      setQaData(initialData)
      setEditData(initialData || [])
    }
  }, [initialData])

  const saveChanges = (): void => {
    // Create UserAttachment entity
    const userAttachment = {
      name: "qa-component-mxW7m4ypuvj5UDPAYcM1jKFEpJnmwe.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peer-developments-page-mxW7m4ypuvj5UDPAYcM1jKFEpJnmwe.tsx",
    }

    console.log("Creating UserAttachment:", userAttachment)

    setQaData(editData)

    // Update the source text to include the user
    setSourceText("Source: 1.PromenadeAI, 2.Crunchbase, 3.User Update")
  }

  const updateQA = (index: number, field: keyof QAItem, value: string): void => {
    const newData = [...editData]
    newData[index][field] = value
    setEditData(newData)
  }

  const addQA = (): void => {
    const newData = [...editData]
    newData.push({
      question: "New Question",
      answer: "New Answer",
    })
    setEditData(newData)
  }

  const removeQA = (index: number): void => {
    const newData = [...editData]
    newData.splice(index, 1)
    setEditData(newData)
  }

  // Check if QA data is empty
  const isQADataEmpty = !qaData || qaData.length === 0

  // Get only top 5 items for display
  const displayQAData = qaData.slice(0, 6)
  const displayEditData = editData.slice(0, 6)

  // Regular content
  const regularContent = (
    <div>
      {isQADataEmpty ? (
        <div className="text-center py-12 text-gray-500 text-lg">No Q&A data present</div>
      ) : (
        <div>
          {displayQAData.map((item, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-gray-700 text-xl font-normal mb-1">{item.question || ""}</h3>

              <ul className="space-y-6">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 ">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                  </div>
                  <div>
                    <span className="text-gray-600">{item.answer || ""}</span>
                  </div>
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Editable content
  const editableContent = (
    <div className="space-y-6">
      {displayEditData.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-1">
          <div className="flex justify-between ">
            <h3 className="text-gray-700 text-lg font-medium">Q&A Item #{index + 1}</h3>
            <button onClick={() => removeQA(index)} className="text-red-500 hover:text-red-700">
              <TrashIcon size={18} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Question:</label>
            <textarea
              value={item.question || ""}
              onChange={(e) => updateQA(index, "question", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer:</label>
            <textarea
              value={item.answer || ""}
              onChange={(e) => updateQA(index, "answer", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
          </div>
        </div>
      ))}

      {editData.length < 5 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={addQA}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Q&A Item
          </button>
        </div>
      )}
    </div>
  )

  return (
    <SectionLayout title="Q&A" sourceText={sourceText} onSave={saveChanges} editableContent={editableContent}>
      {regularContent}
    </SectionLayout>
  )
}

