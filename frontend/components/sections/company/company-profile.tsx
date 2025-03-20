"use client"

import { Edit, Save, X } from 'lucide-react'
import { useEffect, useState } from "react"

interface IncomeStatement {
  cost_of_goods_sold: number
  cost_of_goods_sold_currency: string
  ebit: number
  ebitda: number | null
  ebitda_margin: number | null
  ebit_margin: number
  earnings_per_share: number
  gross_profit: number
  gross_profit_margin: number
  income_tax_expense: number
  interest_expense: number | null
  interest_income: number | null
  net_income: number
  period_display_end_date: string
  period_end_date: string
  period_type: string
  pre_tax_profit: number
  revenue: number
  total_operating_expense: number
}

interface FinancialValue {
  value: number | null
  currency: string
  date: string
}

interface RevenueGrowth {
  value: number
  previous_period: string
  current_period: string
}

interface PER {
  value: number
  closing_price: number
  eps: number
  date: string
}

interface ProductService {
  uuid: string
  value: string
  image_id: string
  permalink: string
  entity_def_id: string
}

interface Shareholder {
  name: string
  shares: number
  percentage: number
  type: string
}

interface CompanyData {
  company_name: string
  data: {
    company_profile: {
      firmographic: {
        name: string
        legal_name: string
        incorporation_date: string
        hq_address: string
        hq_city: string
        hq_state: string
        hq_country: string
        industry: string
        type: string
        revenue_range: {
          source_4_annual_revenue_range: {
            annual_revenue_range_from: number
            annual_revenue_range_to: number | null
            annual_revenue_range_currency: string
          }
          source_6_annual_revenue_range: null
        }
        employees_count: number
        products_services: ProductService[]
        description: string
      }
      key_financials: {
        income_statements: IncomeStatement[]
        operating_revenue: FinancialValue[]
        operating_profit: FinancialValue[]
        ebitda: FinancialValue[]
        net_income: FinancialValue[]
        per: PER
        revenue_growth: RevenueGrowth[]
      }
      shareholders: Shareholder[]
    }
    company_overview: {
      business_model: string
      products_brands: string[]
      customers: string[]
      description_enriched: string | null
    }
  }
}

export function CompanyProfile() {
  const [data, setData] = useState<CompanyData | null>(null)
  const [editData, setEditData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState({
    firmographic: false,
    shareholders: false,
    financials: false
  })

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
        setEditData(JSON.parse(JSON.stringify(jsonData)))
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

  if (!data || !editData) {
    return <div className="p-6">Error loading company data</div>
  }

  // Get fiscal year data
  const fiscalYears = data.data.company_profile.key_financials.income_statements
    .filter((statement) => statement.period_type === "fiscal_year")
    .sort((a, b) => new Date(b.period_end_date).getTime() - new Date(a.period_end_date).getTime())

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(value)
  }

  // Calculate quarterly data for 2024
  const q2024Data = data.data.company_profile.key_financials.income_statements
    .filter((statement) => statement.period_type.startsWith("q") && statement.period_end_date.startsWith("2024"))
    .sort((a, b) => new Date(a.period_end_date).getTime() - new Date(b.period_end_date).getTime())

  // Calculate total for 2024 quarters
  const q2024Revenue = q2024Data.reduce((sum, quarter) => sum + quarter.revenue, 0)
  const q2024OperatingProfit = q2024Data.reduce((sum, quarter) => sum + quarter.ebit, 0)
  const q2024NetIncome = q2024Data.reduce((sum, quarter) => sum + quarter.net_income, 0)

  // Get annual revenue growth rates
  const annualGrowthRates = data.data.company_profile.key_financials.revenue_growth.filter(
    (growth) => growth.previous_period.endsWith("-12-31") && growth.current_period.endsWith("-12-31"),
  )

  // Default shareholders if empty
  const shareholders = data.data.company_profile.shareholders

  // Calculate total shares and percentage
  const totalShares = shareholders.reduce((sum, shareholder) => sum + shareholder.shares, 0)
  const totalPercentage = shareholders.reduce((sum, shareholder) => sum + shareholder.percentage, 0)

  // Handle editing functions
  const startEditing = (section: keyof typeof isEditing) => {
    setIsEditing({...isEditing, [section]: true})
    setEditData(JSON.parse(JSON.stringify(data)))
  }

  const cancelEditing = (section: keyof typeof isEditing) => {
    setIsEditing({...isEditing, [section]: false})
    setEditData(JSON.parse(JSON.stringify(data)))
  }

  const saveChanges = (section: keyof typeof isEditing) => {
    setData(editData)
    setIsEditing({...isEditing, [section]: false})
  }

  const updateFirmographicField = (field: string, value: string | number) => {
    if (!editData) return
    
    const newEditData = {...editData}
    // @ts-ignore - Dynamic property access
    newEditData.data.company_profile.firmographic[field] = value
    setEditData(newEditData)
  }

  const updateShareholderField = (index: number, field: keyof Shareholder, value: string | number) => {
    if (!editData) return
    
    const newEditData = {...editData}
    if (field === 'shares' || field === 'percentage') {
      newEditData.data.company_profile.shareholders[index][field] = Number(value)
    } else {
      // @ts-ignore - Type mismatch for string fields
      newEditData.data.company_profile.shareholders[index][field] = value
    }
    setEditData(newEditData)
  }

  return (
    <div className="w-full max-w-full bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">Company Profile</h1>

      <div className="border-t border-[#e5e7eb] mb-6">{data.data.company_profile.firmographic.legal_name}</div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Firmographic Table */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-base font-medium text-[#475467]">Firmographic</h2>
              {isEditing.firmographic ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => saveChanges('firmographic')} 
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span className="text-xs">Save</span>
                  </button>
                  <button 
                    onClick={() => cancelEditing('firmographic')} 
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-xs">Cancel</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => startEditing('firmographic')} 
                  className="text-[#8097a2] hover:text-[#475467]"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>

            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 w-[200px] border-t border-[#e5e7eb]">
                    Company Name
                  </td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editData.data.company_profile.firmographic.legal_name}
                        onChange={(e) => updateFirmographicField('legal_name', e.target.value)}
                      />
                    ) : (
                      data.data.company_profile.firmographic.legal_name
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">Incorporation</td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editData.data.company_profile.firmographic.incorporation_date}
                        onChange={(e) => updateFirmographicField('incorporation_date', e.target.value)}
                      />
                    ) : (
                      formatDate(data.data.company_profile.firmographic.incorporation_date)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">HQ Address</td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editData.data.company_profile.firmographic.hq_address}
                        onChange={(e) => updateFirmographicField('hq_address', e.target.value)}
                      />
                    ) : (
                      data.data.company_profile.firmographic.hq_address
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">CEO</td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Enter CEO name"
                      />
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">Revenue</td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={fiscalYears.length > 0 ? fiscalYears[0].revenue : 0}
                          disabled
                        />
                        <span className="text-xs text-gray-500">(Edit in Financials section)</span>
                      </div>
                    ) : (
                      fiscalYears.length > 0
                        ? `${formatCurrency(fiscalYears[0].revenue)} (${fiscalYears[0].period_display_end_date})`
                        : "N/A"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">FTE#</td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editData.data.company_profile.firmographic.employees_count}
                        onChange={(e) => updateFirmographicField('employees_count', parseInt(e.target.value))}
                      />
                    ) : (
                      data.data.company_profile.firmographic.employees_count.toLocaleString()
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">Products/Services</td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <textarea
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editData.data.company_profile.firmographic.products_services.map(ps => ps.value).join(", ")}
                        onChange={(e) => {
                          const values = e.target.value.split(",").map(v => v.trim())
                          const newProducts = values.map((value, i) => ({
                            uuid: editData.data.company_profile.firmographic.products_services[i]?.uuid || `new-${i}`,
                            value,
                            image_id: "",
                            permalink: "",
                            entity_def_id: ""
                          }))
                          const newEditData = {...editData}
                          newEditData.data.company_profile.firmographic.products_services = newProducts
                          setEditData(newEditData)
                        }}
                      />
                    ) : (
                      data.data.company_profile.firmographic.products_services.map((ps) => ps.value).join(", ")
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Shareholders Table */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-base font-medium text-[#475467]">Shareholders</h2>
              {isEditing.shareholders ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => saveChanges('shareholders')} 
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span className="text-xs">Save</span>
                  </button>
                  <button 
                    onClick={() => cancelEditing('shareholders')} 
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-xs">Cancel</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => startEditing('shareholders')} 
                  className="text-[#8097a2] hover:text-[#475467]"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#002169] text-white">
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium"># of Shares</th>
                  <th className="py-3 px-4 text-left font-medium">%</th>
                  <th className="py-3 px-4 text-left font-medium">Types</th>
                </tr>
              </thead>
              <tbody>
                {(isEditing.shareholders ? editData : data).data.company_profile.shareholders.map((shareholder, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={shareholder.name}
                          onChange={(e) => updateShareholderField(index, 'name', e.target.value)}
                        />
                      ) : (
                        shareholder.name
                      )}
                    </td>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={shareholder.shares}
                          onChange={(e) => updateShareholderField(index, 'shares', parseInt(e.target.value))}
                        />
                      ) : (
                        shareholder.shares.toLocaleString()
                      )}
                    </td>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          step="0.01"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={shareholder.percentage}
                          onChange={(e) => updateShareholderField(index, 'percentage', parseFloat(e.target.value))}
                        />
                      ) : (
                        `${shareholder.percentage}%`
                      )}
                    </td>
                    <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={shareholder.type}
                          onChange={(e) => updateShareholderField(index, 'type', e.target.value)}
                        />
                      ) : (
                        shareholder.type
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 px-4 font-medium border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    Total
                  </td>
                  <td className="py-3 px-4 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    {isEditing.shareholders ? 
                      editData.data.company_profile.shareholders.reduce((sum, s) => sum + s.shares, 0).toLocaleString() :
                      totalShares.toLocaleString()
                    }
                  </td>
                  <td className="py-3 px-4 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    {isEditing.shareholders ? 
                      editData.data.company_profile.shareholders.reduce((sum, s) => sum + s.percentage, 0).toFixed(1) + "%" :
                      totalPercentage.toFixed(1) + "%"
                    }
                  </td>
                  <td className="py-3 px-4 border-t-2 border-t-[#002169]"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Key Financials Table */}
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden h-fit">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-base font-medium text-[#475467]">Key Financials</h2>
            {isEditing.financials ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => saveChanges('financials')} 
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-xs">Save</span>
                </button>
                <button 
                  onClick={() => cancelEditing('financials')} 
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  <span className="text-xs">Cancel</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => startEditing('financials')} 
                className="text-[#8097a2] hover:text-[#475467]"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#002169] text-white">
                <th className="py-3 px-4 text-left font-medium">('000)</th>
                {fiscalYears.map((year, index) => (
                  <th key={index} className="py-3 px-4 text-center font-medium">
                    {year.period_display_end_date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">Operating Revenue</td>
                {fiscalYears.map((year, index) => (
                  <td key={index} className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                    {formatCurrency(year.revenue)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">Operating Profit</td>
                {fiscalYears.map((year, index) => (
                  <td key={index} className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                    {formatCurrency(year.ebit)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">EBITDA</td>
                {fiscalYears.map((year, index) => (
                  <td key={index} className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                    {year.ebitda ? formatCurrency(year.ebitda) : "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">PAT</td>
                {fiscalYears.map((year, index) => (
                  <td key={index} className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                    {formatCurrency(year.net_income)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">Revenue Growth</td>
                <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" placeholder="%" />
                  ) : ""}
                </td>
                <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" placeholder="%" />
                  ) : ""}
                </td>
                <td className="py-3 px-4 border-t border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" placeholder="%" />
                  ) : ""}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">PER</td>
                <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" />
                  ) : ""}
                </td>
                <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" />
                  ) : ""}
                </td>
                <td className="py-3 px-4 border-t border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" />
                  ) : ""}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]"># of Users</td>
                <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" />
                  ) : ""}
                </td>
                <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" />
                  ) : ""}
                </td>
                <td className="py-3 px-4 border-t border-[#e5e7eb] text-center text-black">
                  {isEditing.financials ? (
                    <input type="text" className="w-full p-1 border border-gray-300 rounded text-center" />
                  ) : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}
