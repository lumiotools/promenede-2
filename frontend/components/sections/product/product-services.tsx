"use client"

import { useState, useEffect } from "react"
import { Edit, Save, X, Plus, Trash2 } from "lucide-react"

// Define the Product and Category types
type ProductService = {
  uuid: string | null
  value: string | null
  image_id?: string | null
  permalink?: string | null
  entity_def_id?: string | null
}

type ProductsServicesItem = {
  details: ProductService[]
  launch_timeline: any[] // You might want to define a more specific type here
  pricing_available: boolean | null
  free_trial_available: boolean | null
  demo_available: boolean | null
  product_reviews: {
    count: number
    score: number
    by_month: { product_reviews_score: number; date: string }[]
    distribution: {
      [key: string]: number
    }
  }
}

type ProductsServicesProps = {
  initialData?: ProductsServicesItem
}

export default function ProductsServices({ initialData }: ProductsServicesProps) {
  // State to manage loading state until the client-side is ready
  const [isClient, setIsClient] = useState(false)

  // Initialize state with initialData if provided, otherwise use defaultData
  const [data, setData] = useState<ProductsServicesItem | undefined>(initialData)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editMode, setEditMode] = useState<{
    active: boolean
    categoryIndex: number | null
    productIndex: number | null
    field: "categoryName" | "productName" | "productDescription" | null
  }>({
    active: false,
    categoryIndex: null,
    productIndex: null,
    field: null,
  })

  const [editValue, setEditValue] = useState("")

  // Fetch data if not provided as initialData
  useEffect(() => {
    setIsClient(true)
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])

  console.log("Product Services:", initialData)

  // Start editing a specific field
  const startEditing = (
    categoryIndex: number,
    productIndex: number | null,
    field: "categoryName" | "productName" | "productDescription"
  ) => {
    let initialValue = ""

    if (field === "categoryName") {
      initialValue = data?.details[categoryIndex].value || ""
    } else if (productIndex !== null) {
      if (field === "productName") {
        initialValue = data?.details[categoryIndex].value || ""
      }
    }

    setEditValue(initialValue)
    setEditMode({
      active: true,
      categoryIndex,
      productIndex,
      field,
    })
  }

  // Save the edited value
  const saveEdit = () => {
    if (!editMode.active || editMode.categoryIndex === null || !data) return

    const newData = { ...data }
    if (editMode.field === "categoryName") {
      newData.details[editMode.categoryIndex].value = editValue
    } else if (editMode.productIndex !== null) {
      if (editMode.field === "productName") {
        newData.details[editMode.categoryIndex].value = editValue
      }
    }

    setData(newData)
    cancelEdit()
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditMode({
      active: false,
      categoryIndex: null,
      productIndex: null,
      field: null,
    })
    setEditValue("")
  }

  // Render a loading state if we are still waiting for client-side hydration
  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-4xl font-medium text-[#475467]">Products and Services</h1>
      <div className="border-t border-[#e5e7eb] mb-6"></div>

      <div className="mx-10">
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb]">
            <h2 className="text-base font-medium text-[#475467]">Product & Services</h2>
            <button
              className={`${editMode.active ? "text-blue-600" : "text-[#8097a2]"} hover:text-[#475467] flex items-center gap-1`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {editMode.active ? (
                <>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-800 flex items-center gap-1">
                      <Save className="h-4 w-4" />
                      <span className="text-xs">Save</span>
                    </button>
                    <button onClick={cancelEdit} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      <span className="text-xs">Cancel</span>
                    </button>
                  </div>
                </>
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Render Product Categories and Features */}
          {data?.details.map((product, productIndex) => (
            <div key={productIndex} className="flex">
              <div className="w-[240px] bg-[#002169] text-white p-6">
                {editMode.active && editMode.productIndex === productIndex && editMode.field === "categoryName" ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full p-1 text-black rounded"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="text-green-400 hover:text-green-300">
                        <Save className="h-4 w-4" />
                      </button>
                      <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer">
                    <span onClick={() => startEditing(productIndex, null, "categoryName")}>
                      {product.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="text-[#475467]">
                  <p>{product.description}</p>
                  {/* You can add more fields or details here */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}
