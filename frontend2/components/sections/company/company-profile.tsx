"use client";

import type {
  CompanyProfiles,
  Firmographic,
  KeyFinancials,
  ProductService,
} from "@/types/company";
import type { InstitutionalHolder, ShareholderData } from "@/types/shareholder";
import { Edit, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionLayout } from "@/components/ui/section-layout";

// Modify the CompanyProfileProps type to match the actual data structure
type CompanyProfileProps = {
  initialData?: CompanyProfiles;
};

// Define consistent data structure to be used in the component
interface NormalizedCompanyData {
  firmographic: Firmographic;
  key_financials: KeyFinancials;
  shareholder_data: ShareholderData;
}

export default function CompanyProfile({ initialData }: CompanyProfileProps) {
  // Transform the data to ensure consistent structure
  const transformData = (
    data: CompanyProfiles | undefined | null
  ): NormalizedCompanyData => {
    if (!data) return createEmptyCompanyProfile();

    // Check if data already has the expected structure
    if (data.firmographic || data.key_financials) {
      // Check if the data has the new shareholder_data structure
      if (data.shareholders) {
        return {
          firmographic: data.firmographic || createEmptyFirmographic(),
          key_financials: data.key_financials || createEmptyKeyFinancials(),
          shareholder_data: data.shareholders || createEmptyShareholderData(),
        };
      }

      // If it doesn't have shareholder data, create empty shareholder data
      return {
        firmographic: data.firmographic || createEmptyFirmographic(),
        key_financials: data.key_financials || createEmptyKeyFinancials(),
        shareholder_data: createEmptyShareholderData(),
      };
    }

    // Handle other data formats or create empty data
    return createEmptyCompanyProfile();
  };

  // Add these helper functions after transformData:
  const createEmptyFirmographic = (): Firmographic => ({
    name: null,
    legal_name: null,
    incorporation_date: null,
    hq_address: null,
    hq_city: null,
    hq_state: null,
    hq_country: null,
    industry: null,
    type: null,
    revenue_range: null,
    employees_count: null,
    products_services: [],
    description: null,
  });

  const createEmptyKeyFinancials = (): KeyFinancials => ({
    income_statements: [],
    operating_revenue: [],
    operating_profit: [],
    ebitda: [],
    net_income: [],
    revenue_growth: [],
    per: null,
  });

  const createEmptyShareholderData = (): ShareholderData => ({
    major_holders: {
      insidersPercentHeld: null,
      institutionsPercentHeld: null,
      institutionsFloatPercentHeld: null,
      institutionsCount: null,
    },
    institutional_holders: [],
  });

  const createEmptyCompanyProfile = (): NormalizedCompanyData => ({
    firmographic: createEmptyFirmographic(),
    key_financials: createEmptyKeyFinancials(),
    shareholder_data: createEmptyShareholderData(),
  });

  // Initialize state with transformed initialData if provided
  const [data, setData] = useState<NormalizedCompanyData>(
    transformData(initialData)
  );
  const [editData, setEditData] = useState<NormalizedCompanyData>(
    transformData(initialData)
  );

  // Fetch data if not provided as initialData
  useEffect(() => {
    if (initialData) {
      const transformed = transformData(initialData);
      setData(transformed);
      setEditData(transformed);
    }
  }, [initialData]);

  const [isEditing, setIsEditing] = useState({
    firmographic: false,
    shareholders: false,
    financials: false,
  });

  // Update these lines to use the new structure:
  const firmographic = data.firmographic || createEmptyFirmographic();
  const keyFinancials = data.key_financials || createEmptyKeyFinancials();
  const incomeStatements = keyFinancials.income_statements || [];
  const revenueGrowth = keyFinancials.revenue_growth || [];
  const shareholderData = data.shareholder_data || createEmptyShareholderData();
  const majorHolders = shareholderData.major_holders || {
    insidersPercentHeld: null,
    institutionsPercentHeld: null,
    institutionsFloatPercentHeld: null,
    institutionsCount: null,
  };
  const institutionalHolders = shareholderData.institutional_holders || [];

  // Format date with null check
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format currency with null check
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };

  // Get annual revenue growth rates with null checks
  const annualGrowthRates =
    revenueGrowth?.filter(
      (growth) =>
        growth &&
        growth.previous_period &&
        growth.current_period &&
        growth.previous_period.endsWith("-12-31") &&
        growth.current_period.endsWith("-12-31")
    ) || [];

  // Handle editing functions
  const startEditing = (section: keyof typeof isEditing) => {
    setIsEditing({ ...isEditing, [section]: true });
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const cancelEditing = (section: keyof typeof isEditing) => {
    setIsEditing({ ...isEditing, [section]: false });
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const saveChanges = (section: keyof typeof isEditing) => {
    setData(editData);
    setIsEditing({ ...isEditing, [section]: false });
  };

  const updateFirmographicField = (
    field: keyof Firmographic,
    value: string | number
  ) => {
    if (!editData?.firmographic) return;

    const newEditData = { ...editData };

    // Check if field is employees_count which is numeric
    if (field === "employees_count") {
      newEditData.firmographic[field] =
        typeof value === "string" ? Number(value) : value;
    } else {
      // Handle all other string fields
      (newEditData.firmographic[field] as string | null) = value as
        | string
        | null;
    }

    setEditData(newEditData);
  };

  const updateInstitutionalHolderField = (
    index: number,
    field: keyof InstitutionalHolder,
    value: string | number | null
  ) => {
    if (!editData?.shareholder_data?.institutional_holders) return;

    const newEditData = { ...editData };
    const holders = newEditData.shareholder_data.institutional_holders;

    if (!holders || !holders[index]) return;

    if (
      field === "Shares" ||
      field === "Value" ||
      field === "pctHeld" ||
      field === "pctChange"
    ) {
      holders[index][field] = typeof value === "string" ? Number(value) : value;
    } else {
      holders[index][field] = value as string | null;
    }

    setEditData(newEditData);
  };

  // Define fiscalYears based on incomeStatements
  const fiscalYears = [...(incomeStatements || [])].sort((a, b) => {
    if (!a?.period_end_date || !b?.period_end_date) return 0;
    return (
      new Date(b.period_end_date).getTime() -
      new Date(a.period_end_date).getTime()
    );
  });

  // Get the last 3 fiscal years for display
  const lastThreeFiscalYears = fiscalYears.slice(0, 3);

  // Get fiscal year labels (FY22, FY23, FY24)
  const getFiscalYearLabel = (year: any) => {
    if (!year?.period_end_date) return "N/A";
    try {
      const date = new Date(year.period_end_date);
      return `FY${date.getFullYear().toString().slice(2)}`;
    } catch (error) {
      return "N/A";
    }
  };

  // Check if data exists for each section
  const hasFirmographicData =
    firmographic.legal_name ||
    firmographic.incorporation_date ||
    firmographic.hq_address ||
    firmographic.employees_count ||
    (firmographic.products_services &&
      firmographic.products_services.length > 0);

  const hasFinancialData =
    lastThreeFiscalYears.length > 0 ||
    annualGrowthRates.length > 0 ||
    keyFinancials.per?.value;

  const hasShareholderData = institutionalHolders.length > 0;

  return (
    <SectionLayout
      title="Company Profile"
      sourceText="Source: Coresignal, Yahoo Finance"
    >
      <div className="w-full space-y-4 overflow-hidden">
        {/* Top row: Firmographic and Key Financials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Firmographic */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-2 bg-gray-50">
              <h2 className="text-sm font-medium text-[#475467]">
                Firmographic
              </h2>
              {isEditing.firmographic ? (
                <div className="hidden flex gap-2">
                  <button
                    onClick={() => saveChanges("firmographic")}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Save className="h-3 w-3" />
                    <span className="text-xs">Save</span>
                  </button>
                  <button
                    onClick={() => cancelEditing("firmographic")}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    <span className="text-xs">Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing("firmographic")}
                  className="hidden text-[#8097a2] hover:text-[#475467]"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
            </div>

            {!hasFirmographicData ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No data available for Firmographic
              </div>
            ) : (
              <table className="w-full border-collapse text-xs">
                <tbody>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 w-[120px] border-t border-[#e5e7eb]">
                      Company Name
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {isEditing.firmographic ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          value={editData?.firmographic?.legal_name || ""}
                          onChange={(e) =>
                            updateFirmographicField(
                              "legal_name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        firmographic.legal_name || "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      Incorporation
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {isEditing.firmographic ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          value={
                            editData?.firmographic?.incorporation_date || ""
                          }
                          onChange={(e) =>
                            updateFirmographicField(
                              "incorporation_date",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        formatDate(firmographic.incorporation_date)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      HQ Address
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {isEditing.firmographic ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          value={editData?.firmographic?.hq_address || ""}
                          onChange={(e) =>
                            updateFirmographicField(
                              "hq_address",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        firmographic.hq_address || "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      CEO
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {isEditing.firmographic ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          placeholder="Enter CEO name"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      Revenue
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {isEditing.firmographic ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="w-full p-1 border border-gray-300 rounded text-xs"
                            value={
                              fiscalYears.length > 0 &&
                              fiscalYears[0].revenue !== null
                                ? fiscalYears[0].revenue
                                : 0
                            }
                            disabled
                          />
                          <span className="text-xs text-gray-500">
                            (Edit in Financials)
                          </span>
                        </div>
                      ) : fiscalYears.length > 0 ? (
                        `${formatCurrency(fiscalYears[0].revenue)} (${
                          fiscalYears[0].period_display_end_date || "N/A"
                        })`
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      FTE#
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {isEditing.firmographic ? (
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          value={editData?.firmographic?.employees_count || 0}
                          onChange={(e) =>
                            updateFirmographicField(
                              "employees_count",
                              Number.parseInt(e.target.value)
                            )
                          }
                        />
                      ) : (
                        (firmographic.employees_count || 0).toLocaleString()
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#002169] text-white py-1 px-2 border-t border-[#e5e7eb]">
                      Products/Services
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-black">
                      {isEditing.firmographic ? (
                        <textarea
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          value={
                            editData?.firmographic?.products_services
                              ?.filter((ps) => ps && ps.value !== null)
                              .map((ps) => ps.value)
                              .join(", ") || ""
                          }
                          onChange={(e) => {
                            const values = e.target.value
                              .split(",")
                              .map((v) => v.trim());
                            const newProducts: ProductService[] = values.map(
                              (value, i) => ({
                                uuid:
                                  editData?.firmographic?.products_services?.[i]
                                    ?.uuid || `new-${i}`,
                                value,
                                image_id: null,
                                permalink: null,
                                entity_def_id: null,
                              })
                            );
                            const newEditData = { ...editData };
                            if (newEditData?.firmographic) {
                              newEditData.firmographic.products_services =
                                newProducts;
                              setEditData(newEditData);
                            }
                          }}
                        />
                      ) : (
                        (firmographic.products_services || [])
                          .filter((ps) => ps && ps.value !== null)
                          .map((ps) => ps?.value)
                          .join(", ") || "N/A"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Key Financials */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-2 bg-gray-50">
              <h2 className="text-sm font-medium text-[#475467]">
                Key Financials
              </h2>
              {isEditing.financials ? (
                <div className="hidden flex gap-2">
                  <button
                    onClick={() => saveChanges("financials")}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Save className="h-3 w-3" />
                    <span className="text-xs">Save</span>
                  </button>
                  <button
                    onClick={() => cancelEditing("financials")}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    <span className="text-xs">Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing("financials")}
                  className="hidden text-[#8097a2] hover:text-[#475467]"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
            </div>

            {!hasFinancialData ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No data available for Key Financials
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#002169] text-white">
                      <th className="py-1 px-2 text-left font-medium">
                        (&apos;000)
                      </th>
                      {/* Use fiscal year labels or default to FY22, FY23, FY24 if no data */}
                      {lastThreeFiscalYears.length > 0 ? (
                        lastThreeFiscalYears.map((year, index) => (
                          <th
                            key={index}
                            className="py-1 px-2 text-center font-medium"
                          >
                            {getFiscalYearLabel(year)}
                          </th>
                        ))
                      ) : (
                        <>
                          <th className="py-1 px-2 text-center font-medium">
                            FY22
                          </th>
                          <th className="py-1 px-2 text-center font-medium">
                            FY23
                          </th>
                          <th className="py-1 px-2 text-center font-medium">
                            FY24
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        Operating Revenue
                      </td>
                      {lastThreeFiscalYears.length > 0 ? (
                        lastThreeFiscalYears.map((year, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {formatCurrency(year?.revenue)}
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        Operating Profit
                      </td>
                      {lastThreeFiscalYears.length > 0 ? (
                        lastThreeFiscalYears.map((year, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {formatCurrency(year?.ebit)}
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        EBITDA
                      </td>
                      {lastThreeFiscalYears.length > 0 ? (
                        lastThreeFiscalYears.map((year, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {year?.ebitda ? formatCurrency(year.ebitda) : "N/A"}
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        PAT
                      </td>
                      {lastThreeFiscalYears.length > 0 ? (
                        lastThreeFiscalYears.map((year, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {formatCurrency(year?.net_income)}
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        Revenue Growth
                      </td>
                      {annualGrowthRates.length > 0 ? (
                        annualGrowthRates.slice(0, 3).map((growth, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {growth?.value
                              ? `${growth.value.toFixed(1)}%`
                              : "N/A"}
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        PER
                      </td>
                      {lastThreeFiscalYears.length > 0 ? (
                        lastThreeFiscalYears.map((_, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            {keyFinancials.per?.value
                              ? keyFinancials.per.value.toFixed(2)
                              : "N/A"}
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td className="py-1 px-2 border-t text-black border-r border-[#e5e7eb]">
                        # of Users
                      </td>
                      {lastThreeFiscalYears.length > 0 ? (
                        lastThreeFiscalYears.map((_, index) => (
                          <td
                            key={index}
                            className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black"
                          >
                            N/A
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                          <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-center text-black">
                            N/A
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Bottom row: Shareholders */}
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-2 bg-gray-50">
            <h2 className="text-sm font-medium text-[#475467]">Shareholders</h2>
            {isEditing.shareholders ? (
              <div className="hidden flex gap-2">
                <button
                  onClick={() => saveChanges("shareholders")}
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                >
                  <Save className="h-3 w-3" />
                  <span className="text-xs">Save</span>
                </button>
                <button
                  onClick={() => cancelEditing("shareholders")}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  <span className="text-xs">Cancel</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEditing("shareholders")}
                className="hidden text-[#8097a2] hover:text-[#475467]"
              >
                <Edit className="h-3 w-3" />
              </button>
            )}
          </div>

          {!hasShareholderData ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No data available for Shareholders
            </div>
          ) : (
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#002169] text-white">
                  <th className="py-1 px-2 text-left font-medium">Name</th>
                  <th className="py-1 px-2 text-right font-medium">
                    # of Shares
                  </th>
                  <th className="py-1 px-2 text-right font-medium">%</th>
                  <th className="py-1 px-2 text-center font-medium">Types</th>
                </tr>
              </thead>
              <tbody>
                {/* Limit to top 5 shareholders */}
                {(isEditing.shareholders &&
                editData?.shareholder_data?.institutional_holders
                  ? editData.shareholder_data.institutional_holders.slice(0, 5)
                  : institutionalHolders.slice(0, 5)
                ).map((holder, index) => (
                  <tr key={index}>
                    <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          value={holder.Holder || ""}
                          onChange={(e) =>
                            updateInstitutionalHolderField(
                              index,
                              "Holder",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        holder.Holder || "N/A"
                      )}
                    </td>
                    <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-right text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded text-right text-xs"
                          value={holder.Shares || 0}
                          onChange={(e) =>
                            updateInstitutionalHolderField(
                              index,
                              "Shares",
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      ) : (
                        (holder.Shares || 0).toLocaleString()
                      )}
                    </td>
                    <td className="py-1 px-2 border-t border-r border-[#e5e7eb] text-right text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          step="0.01"
                          className="w-full p-1 border border-gray-300 rounded text-right text-xs"
                          value={holder.pctHeld || 0}
                          onChange={(e) =>
                            updateInstitutionalHolderField(
                              index,
                              "pctHeld",
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      ) : (
                        `${holder.pctHeld?.toFixed(2) || 0}%`
                      )}
                    </td>
                    <td className="py-1 px-2 border-t border-[#e5e7eb] text-center text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-center text-xs"
                          placeholder="Type"
                        />
                      ) : (
                        "Institutional"
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-1 px-2 font-medium border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    Total
                  </td>
                  <td className="py-1 px-2 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-right text-black">
                    {isEditing.shareholders &&
                    editData?.shareholder_data?.institutional_holders
                      ? editData.shareholder_data.institutional_holders
                          .slice(0, 5)
                          .reduce((sum, h) => sum + (h.Shares || 0), 0)
                          .toLocaleString()
                      : institutionalHolders
                          .slice(0, 5)
                          .reduce((sum, h) => sum + (h.Shares || 0), 0)
                          .toLocaleString()}
                  </td>
                  <td className="py-1 px-2 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-right text-black">
                    {isEditing.shareholders &&
                    editData?.shareholder_data?.institutional_holders
                      ? editData.shareholder_data.institutional_holders
                          .slice(0, 5)
                          .reduce((sum, h) => sum + (h.pctHeld || 0), 0)
                          .toFixed(2) + "%"
                      : institutionalHolders
                          .slice(0, 5)
                          .reduce((sum, h) => sum + (h.pctHeld || 0), 0)
                          .toFixed(2) + "%"}
                  </td>
                  <td className="py-1 px-2 border-t-2 border-t-[#002169] text-center text-black"></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SectionLayout>
  );
}
