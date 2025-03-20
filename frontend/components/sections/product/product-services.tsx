"use client"

import { useEffect, useState } from "react"
import { Edit, Save, X, Plus, Trash2 } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"

interface Product {
  name: string
  description: string[]
}

interface ProductsData {
  categories: string[]
  products: Record<string, Product[]>
}

export function ProductsServices() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ProductsData | null>(null)
  const [editData, setEditData] = useState<ProductsData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newProductName, setNewProductName] = useState("")
  const [newProductDescription, setNewProductDescription] = useState("")

  useEffect(() => {
    // In a real implementation, you would fetch this data from an API
    // For now, we'll use hardcoded data that matches the image
    const mockData: ProductsData = {
      categories: ["Automation & AI products", "Product B", "Product C"],
      products: {
        "Automation & AI products": [
          {
            name: "AI Agent Studio",
            description: [
              "AI Agent studio is low-code workspace for creating and managing custom AI Agents to responsibly execute cognitive tasks within enterprise automation workflows",
            ],
          },
          {
            name: "Automator AI",
            description: ["Automator AI is a set of AI"],
          },
        ],
        "Product B": [
          {
            name: "Product B1",
            description: ["Description for Product B1 goes here", "Additional details about Product B1"],
          },
        ],
        "Product C": [
          {
            name: "Product C1",
            description: ["Description for Product C1 goes here"],
          },
        ],
      },
    }

    setData(mockData)
    setSelectedCategory(mockData.categories[0])
    setLoading(false)
  }, [])

  // Start editing mode
  const startEditing = () => {
    setIsEditing(true)
    setEditData(JSON.parse(JSON.stringify(data)))
  }

  // Cancel editing and revert changes
  const cancelEditing = () => {
    setIsEditing(false)
    setEditData(null)
    setNewCategoryName("")
    setNewProductName("")
    setNewProductDescription("")
  }

  // Save changes
  const saveChanges = () => {
    if (editData) {
      setData(editData)
      setSelectedCategory(editData.categories.includes(selectedCategory) ? selectedCategory : editData.categories[0])
    }
    setIsEditing(false)
    setNewCategoryName("")
    setNewProductName("")
    setNewProductDescription("")
  }

  // Update product name
  const updateProductName = (categoryName: string, index: number, newName: string) => {
    if (!editData) return

    const newEditData = { ...editData }
    newEditData.products[categoryName][index].name = newName
    setEditData(newEditData)
  }

  // Update product description
  const updateProductDescription = (categoryName: string, productIndex: number, descIndex: number, newDesc: string) => {
    if (!editData) return

    const newEditData = { ...editData }
    newEditData.products[categoryName][productIndex].description[descIndex] = newDesc
    setEditData(newEditData)
  }

  // Add description to a product
  const addDescriptionToProduct = (categoryName: string, productIndex: number) => {
    if (!editData) return

    const newEditData = { ...editData }
    newEditData.products[categoryName][productIndex].description.push("")
    setEditData(newEditData)
  }

  // Remove description from a product
  const removeDescriptionFromProduct = (categoryName: string, productIndex: number, descIndex: number) => {
    if (!editData) return

    const newEditData = { ...editData }
    newEditData.products[categoryName][productIndex].description.splice(descIndex, 1)
    setEditData(newEditData)
  }

  // Add new product to category
  const addProductToCategory = (categoryName: string) => {
    if (!editData || !newProductName.trim()) return

    const newEditData = { ...editData }
    newEditData.products[categoryName].push({
      name: newProductName,
      description: [newProductDescription || ""],
    })
    setEditData(newEditData)
    setNewProductName("")
    setNewProductDescription("")
  }

  // Remove product from category
  const removeProductFromCategory = (categoryName: string, productIndex: number) => {
    if (!editData) return

    const newEditData = { ...editData }
    newEditData.products[categoryName].splice(productIndex, 1)
    setEditData(newEditData)
  }

  // Add new category
  const addCategory = () => {
    if (!editData || !newCategoryName.trim()) return

    const newEditData = { ...editData }
    newEditData.categories.push(newCategoryName)
    newEditData.products[newCategoryName] = []
    setEditData(newEditData)
    setSelectedCategory(newCategoryName)
    setNewCategoryName("")
  }

  // Remove category
  const removeCategory = (categoryName: string) => {
    if (!editData || editData.categories.length <= 1) return

    const newEditData = { ...editData }
    const categoryIndex = newEditData.categories.indexOf(categoryName)
    newEditData.categories.splice(categoryIndex, 1)
    delete newEditData.products[categoryName]
    setEditData(newEditData)
    setSelectedCategory(newEditData.categories[0])
  }

  // Rename category
  const renameCategory = (oldName: string, newName: string) => {
    if (!editData || !newName.trim() || oldName === newName) return

    const newEditData = { ...editData }
    const categoryIndex = newEditData.categories.indexOf(oldName)
    newEditData.categories[categoryIndex] = newName
    newEditData.products[newName] = [...newEditData.products[oldName]]
    delete newEditData.products[oldName]
    setEditData(newEditData)
    setSelectedCategory(newName)
  }

  if (loading) {
    return <div className="p-6">Loading products & services data...</div>
  }

  if (error || !data) {
    return <div className="p-6 text-red-500">{error || "Failed to load products data"}</div>
  }

  // Use editData when in editing mode, otherwise use data
  const displayData = isEditing ? editData : data
  const selectedProducts = displayData?.products[selectedCategory] || []

  return (
    <div className="space-y-6 bg-white">
     
     <h1 className="text-4xl font-medium text-[#475467]">Products and Services</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      <div className="mx-10">
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb]">
            <h2 className="text-base font-medium text-[#475467]">Product & Services</h2>
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={saveChanges} className="text-green-600 hover:text-green-800 flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  <span className="text-xs">Save</span>
                </button>
                <button onClick={cancelEditing} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  <span className="text-xs">Cancel</span>
                </button>
              </div>
            ) : (
              <button onClick={startEditing} className="text-[#8097a2] hover:text-[#475467]">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex">
            {/* Left column - Categories */}
            <div className="w-[240px] bg-[#002169] text-white">
              {displayData?.categories.map((category, index) => (
                <div key={index} className="relative">
                  {isEditing ? (
                    <div className={`p-4 ${selectedCategory === category ? "bg-[#0a3183]" : ""}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => renameCategory(category, e.target.value)}
                          className="w-full p-1 bg-[#0a3183] text-white border border-[#1a3573] rounded"
                          onClick={() => setSelectedCategory(category)}
                        />
                        <button onClick={() => removeCategory(category)} className="text-red-300 hover:text-red-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`p-4 cursor-pointer hover:bg-[#0a3183] transition-colors ${
                        selectedCategory === category ? "bg-[#0a3183]" : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </div>
                  )}
                </div>
              ))}

              {/* Add new category input */}
              {isEditing && (
                <div className="p-4 border-t border-[#1a3573]">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name"
                      className="w-full p-1 bg-[#0a3183] text-white border border-[#1a3573] rounded"
                    />
                    <button
                      onClick={addCategory}
                      className="text-green-300 hover:text-green-100"
                      disabled={!newCategoryName.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Descriptions */}
            <div className="flex-1">
              <div className="p-4 border-b border-[#e5e7eb] bg-[#f9fafb]">
                <h3 className="font-medium text-[#475467]">Description</h3>
              </div>

              <div className="p-4">
                <ul className="list-disc pl-5 space-y-4">
                  {selectedProducts.map((product, productIndex) => (
                    <li key={productIndex} className="text-[#475467]">
                      {isEditing ? (
                        <div className="flex flex-col gap-2 -ml-5">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => updateProductName(selectedCategory, productIndex, e.target.value)}
                              className="font-medium p-1 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => removeProductFromCategory(selectedCategory, productIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {product.description.map((desc, descIndex) => (
                            <div key={descIndex} className="flex items-center gap-2 ml-5">
                              <input
                                type="text"
                                value={desc}
                                onChange={(e) =>
                                  updateProductDescription(selectedCategory, productIndex, descIndex, e.target.value)
                                }
                                className="w-full p-1 border border-gray-300 rounded"
                              />
                              {product.description.length > 1 && (
                                <button
                                  onClick={() =>
                                    removeDescriptionFromProduct(selectedCategory, productIndex, descIndex)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            onClick={() => addDescriptionToProduct(selectedCategory, productIndex)}
                            className="ml-5 text-blue-500 hover:text-blue-700 flex items-center gap-1 w-fit"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Description</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium">{product.name}:</span>{" "}
                          {product.description.map((desc, descIndex) => (
                            <span key={descIndex}>{desc}</span>
                          ))}
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Add new product form */}
                {isEditing && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-[#475467] mb-2">Add New Product</h4>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="Product name"
                        className="p-2 border border-gray-300 rounded"
                      />
                      <textarea
                        value={newProductDescription}
                        onChange={(e) => setNewProductDescription(e.target.value)}
                        placeholder="Product description"
                        className="p-2 border border-gray-300 rounded"
                        rows={2}
                      />
                      <button
                        onClick={() => addProductToCategory(selectedCategory)}
                        className="bg-[#002169] text-white py-2 px-4 rounded flex items-center gap-2 w-fit"
                        disabled={!newProductName.trim()}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Product</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

