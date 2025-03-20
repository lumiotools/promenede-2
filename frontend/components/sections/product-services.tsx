"use client"

import { useEffect, useState } from "react"
import { Edit } from "lucide-react"

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
  const [selectedCategory, setSelectedCategory] = useState<string>("")

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

  if (loading) {
    return <div className="p-6">Loading products & services data...</div>
  }

  if (error || !data) {
    return <div className="p-6 text-red-500">{error || "Failed to load products data"}</div>
  }

  const selectedProducts = data.products[selectedCategory] || []

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Product & Services</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      <div className="mx-10">
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb]">
            <h2 className="text-base font-medium text-[#475467]">Product & Services</h2>
            <button className="text-[#8097a2]">
              <Edit className="h-4 w-4" />
            </button>
          </div>

          <div className="flex">
            {/* Left column - Categories */}
            <div className="w-[240px] bg-[#002169] text-white">
              {data.categories.map((category, index) => (
                <div
                  key={index}
                  className={`p-4 cursor-pointer hover:bg-[#0a3183] transition-colors ${
                    selectedCategory === category ? "bg-[#0a3183]" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </div>
              ))}
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
                      <span className="font-medium">{product.name}:</span>{" "}
                      {product.description.map((desc, descIndex) => (
                        <span key={descIndex}>{desc}</span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

