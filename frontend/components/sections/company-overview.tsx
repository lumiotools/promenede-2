"use client"

import Image from "next/image"
import { Edit } from "lucide-react"
import { useEffect, useState } from "react"

interface CompanyData {
  company_name: string
  data: {
    company_profile: {
      firmographic: {
        description: string
      }
    }
    company_overview: {
      business_model: string
      products_brands: string[]
      customers: string[]
      description_enriched: string | null
    }
  }
}

export function CompanyOverview() {
  const [data, setData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Use a more specific path to ensure we're accessing the file correctly
        const response = await fetch("/paypal.json")

        // Check if the response is OK before trying to parse JSON
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }

        const jsonData = await response.json()
        setData(jsonData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Set a default data structure if fetch fails
        
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading company data...</div>
  }

  if (!data) {
    return <div className="p-6">Error loading company data</div>
  }

  // Default products/brands if empty
  const productsBrands =
    Array.isArray(data.data.company_overview.products_brands) && data.data.company_overview.products_brands.length > 0
      ? data.data.company_overview.products_brands
          .map((product) =>
            typeof product === "object" && product !== null && "value" in product
              ? product.value
              : typeof product === "string"
                ? product
                : "",
          )
          .filter(Boolean)
      : ["PayPal", "Venmo", "Braintree", "Xoom", "Honey", "Zettle"]

  // Get first sentence of description
  const firstSentence = data.data.company_profile.firmographic.description.split(".")[0] + "."

  // Get business model description
  const businessModelDesc =
    data.data.company_overview.description_enriched;

  return (
    <div className="w-full max-w-full bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Company Overview</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Left Column - Company Image */}
        <div>
          <Image
            src="/companyoverview.png"
            alt="PayPal Website"
            width={600}
            height={350}
            className="w-full h-auto rounded-md border border-[#e5e7eb]"
            priority={true}
          />
        </div>

        {/* Right Column - Overview Table */}
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-base font-medium text-[#475467]">Overview</h2>
            <button className="text-[#8097a2]">
              <Edit className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2">
            <div className="bg-[#002169] text-white">
              <div className="py-[82px] px-4 flex items-center">
                <span>Business Model</span>
              </div>
              <div className="py-[82px] px-4 flex items-center border-t border-[#1a3573]">
                <span>Products/Brands</span>
              </div>
              <div className="py-[82px] px-4 flex items-center border-t border-[#1a3573]">
                <span>Customers</span>
              </div>
            </div>
            <div>
              <div className="py-3 px-4 border-b border-[#e5e7eb]">
                <span>Description</span>
              </div>
              <div className="py-3 px-4 border-b border-[#e5e7eb] h-[164px] overflow-auto">
                <p className="text-sm">{firstSentence || "N.A"}</p>
              </div>
              <div className="py-3 px-4 border-b border-[#e5e7eb] h-[164px] overflow-auto">
                <p className="text-sm">{businessModelDesc || "N.A"}</p>
              </div>
              <div className="py-3 px-4 h-[164px] overflow-auto">
                <ul className="text-sm list-disc pl-4 space-y-1">
                  {productsBrands.map((product, index) => (
                    <li key={index}>{product}</li>
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

