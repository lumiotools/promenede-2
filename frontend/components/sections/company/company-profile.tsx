/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type {
  CompanyProfiles,
  Firmographic,
  KeyFinancials,
  ProductService,
} from "@/types/company";
import type {
  InstitutionalHolder,
  MajorHolders,
  ShareholderData,
} from "@/types/shareholder";
import { Edit, Save, X, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

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

  console.log("Company Profile", initialData);
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
        month: "long",
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

  // Calculate quarterly data for 2024 with null checks
  const q2024Data =
    incomeStatements
      ?.filter(
        (statement) =>
          statement &&
          statement.period_type &&
          statement.period_type.startsWith("q") &&
          statement.period_end_date &&
          statement.period_end_date.startsWith("2024")
      )
      .sort((a, b) => {
        if (!a.period_end_date || !b.period_end_date) return 0;
        return (
          new Date(a.period_end_date).getTime() -
          new Date(b.period_end_date).getTime()
        );
      }) || [];

  // Calculate total for 2024 quarters with null checks
  const q2024Revenue = q2024Data.reduce(
    (sum, quarter) => sum + (quarter.revenue || 0),
    0
  );
  const q2024OperatingProfit = q2024Data.reduce(
    (sum, quarter) => sum + (quarter.ebit || 0),
    0
  );
  const q2024NetIncome = q2024Data.reduce(
    (sum, quarter) => sum + (quarter.net_income || 0),
    0
  );

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

  // Calculate total shares and percentage with null checks
  const totalShares = institutionalHolders.reduce(
    (sum, holder) => sum + (holder.Shares || 0),
    0
  );
  const totalPercentage = institutionalHolders.reduce(
    (sum, holder) => sum + (holder.pctHeld || 0),
    0
  );

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

  const updateMajorHoldersField = (
    field: keyof MajorHolders,
    value: number | null
  ) => {
    if (!editData?.shareholder_data) return;

    const newEditData = { ...editData };

    if (!newEditData.shareholder_data.major_holders) {
      newEditData.shareholder_data.major_holders = {
        insidersPercentHeld: null,
        institutionsPercentHeld: null,
        institutionsFloatPercentHeld: null,
        institutionsCount: null,
      };
    }

    newEditData.shareholder_data.major_holders[field] =
      typeof value === "string" ? Number(value) : value;

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

  const addInstitutionalHolder = () => {
    const newEditData = { ...editData };

    if (!newEditData.shareholder_data) {
      newEditData.shareholder_data = createEmptyShareholderData();
    }

    if (!newEditData.shareholder_data.institutional_holders) {
      newEditData.shareholder_data.institutional_holders = [];
    }

    newEditData.shareholder_data.institutional_holders.push({
      "Date Reported": new Date().toISOString().split("T")[0],
      Holder: "",
      pctHeld: 0,
      Shares: 0,
      Value: 0,
      pctChange: 0,
    });

    setEditData(newEditData);
  };

  const removeInstitutionalHolder = (index: number) => {
    const newEditData = { ...editData };
    if (!newEditData.shareholder_data?.institutional_holders) return;

    newEditData.shareholder_data.institutional_holders.splice(index, 1);
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

  return (
    <div className="w-full max-w-full bg-white">
      <h1 className="text-4xl font-medium text-[#475467] mb-6">
        Company Profile
      </h1>

      <div className="border-t border-[#e5e7eb] mb-6">
        {firmographic.legal_name || "N/A"}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Firmographic Table */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-base font-medium text-[#475467]">
                Firmographic
              </h2>
              {isEditing.firmographic ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => saveChanges("firmographic")}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span className="text-xs">Save</span>
                  </button>
                  <button
                    onClick={() => cancelEditing("firmographic")}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-xs">Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing("firmographic")}
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
                        value={editData?.firmographic?.legal_name || ""}
                        onChange={(e) =>
                          updateFirmographicField("legal_name", e.target.value)
                        }
                      />
                    ) : (
                      firmographic.legal_name || "N/A"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">
                    Incorporation
                  </td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editData?.firmographic?.incorporation_date || ""}
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
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">
                    HQ Address
                  </td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editData?.firmographic?.hq_address || ""}
                        onChange={(e) =>
                          updateFirmographicField("hq_address", e.target.value)
                        }
                      />
                    ) : (
                      firmographic.hq_address || "N/A"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">
                    CEO
                  </td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Enter CEO name"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">
                    Revenue
                  </td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={
                            fiscalYears.length > 0 &&
                            fiscalYears[0].revenue !== null
                              ? fiscalYears[0].revenue
                              : 0
                          }
                          disabled
                        />
                        <span className="text-xs text-gray-500">
                          (Edit in Financials section)
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
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">
                    FTE#
                  </td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
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
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">
                    Products/Services
                  </td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <textarea
                        className="w-full p-1 border border-gray-300 rounded"
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
          </div>

          {/* Institutional Holders Table */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-base font-medium text-[#475467]">
                Institutional Holders
              </h2>
              {isEditing.shareholders ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => addInstitutionalHolder()}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-xs">Add</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing("shareholders")}
                  className="text-[#8097a2] hover:text-[#475467]"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#002169] text-white">
                  <th className="py-3 px-4 text-left font-medium">Holder</th>
                  <th className="py-3 px-4 text-right font-medium">Shares</th>
                  <th className="py-3 px-4 text-right font-medium">% Held</th>
                  <th className="py-3 px-4 text-right font-medium">Value</th>
                  <th className="py-3 px-4 text-right font-medium">% Change</th>
                  <th className="py-3 px-4 text-right font-medium">Date</th>
                  {isEditing.shareholders && (
                    <th className="py-3 px-4 text-center font-medium">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(isEditing.shareholders &&
                editData?.shareholder_data?.institutional_holders
                  ? editData.shareholder_data.institutional_holders
                  : institutionalHolders
                ).map((holder, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
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
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-right text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded text-right"
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
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-right text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          step="0.01"
                          className="w-full p-1 border border-gray-300 rounded text-right"
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
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-right text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded text-right"
                          value={holder.Value || 0}
                          onChange={(e) =>
                            updateInstitutionalHolderField(
                              index,
                              "Value",
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      ) : (
                        formatCurrency(holder.Value)
                      )}
                    </td>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-right text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          step="0.01"
                          className="w-full p-1 border border-gray-300 rounded text-right"
                          value={holder.pctChange || 0}
                          onChange={(e) =>
                            updateInstitutionalHolderField(
                              index,
                              "pctChange",
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      ) : (
                        `${holder.pctChange?.toFixed(2) || 0}%`
                      )}
                    </td>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-right text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="date"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={holder["Date Reported"] || ""}
                          onChange={(e) =>
                            updateInstitutionalHolderField(
                              index,
                              "Date Reported",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        formatDate(holder["Date Reported"])
                      )}
                    </td>
                    {isEditing.shareholders && (
                      <td className="py-3 px-4 border-t border-[#e5e7eb] text-center">
                        <button
                          onClick={() => removeInstitutionalHolder(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                <tr>
                  <td className="py-3 px-4 font-medium border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    Total
                  </td>
                  <td className="py-3 px-4 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-right text-black">
                    {isEditing.shareholders &&
                    editData?.shareholder_data?.institutional_holders
                      ? editData.shareholder_data.institutional_holders
                          .reduce((sum, h) => sum + (h.Shares || 0), 0)
                          .toLocaleString()
                      : totalShares.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-right text-black">
                    {isEditing.shareholders &&
                    editData?.shareholder_data?.institutional_holders
                      ? editData.shareholder_data.institutional_holders
                          .reduce((sum, h) => sum + (h.pctHeld || 0), 0)
                          .toFixed(2) + "%"
                      : totalPercentage.toFixed(2) + "%"}
                  </td>
                  <td className="py-3 px-4 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-right text-black">
                    {isEditing.shareholders &&
                    editData?.shareholder_data?.institutional_holders
                      ? formatCurrency(
                          editData.shareholder_data.institutional_holders.reduce(
                            (sum, h) => sum + (h.Value || 0),
                            0
                          )
                        )
                      : formatCurrency(
                          institutionalHolders.reduce(
                            (sum, h) => sum + (h.Value || 0),
                            0
                          )
                        )}
                  </td>
                  <td
                    className="py-3 px-4 border-t-2 border-t-[#002169] text-right"
                    colSpan={isEditing.shareholders ? 3 : 2}
                  ></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Key Financials Table */}
        <div className="border border-[#e5e7eb] rounded-md overflow-hidden h-fit">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-base font-medium text-[#475467]">
              Key Financials
            </h2>
            {isEditing.financials ? (
              <div className="flex gap-2">
                <button
                  onClick={() => saveChanges("financials")}
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-xs">Save</span>
                </button>
                <button
                  onClick={() => cancelEditing("financials")}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  <span className="text-xs">Cancel</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEditing("financials")}
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
                  <th className="py-3 px-4 text-left font-medium">
                    (&apos;000)
                  </th>
                  {fiscalYears.map((year, index) => (
                    <th
                      key={index}
                      className="py-3 px-4 text-center font-medium"
                    >
                      {year?.period_display_end_date || "N/A"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">
                    Operating Revenue
                  </td>
                  {fiscalYears.map((year, index) => (
                    <td
                      key={index}
                      className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black"
                    >
                      {formatCurrency(year?.revenue)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">
                    Operating Profit
                  </td>
                  {fiscalYears.map((year, index) => (
                    <td
                      key={index}
                      className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black"
                    >
                      {formatCurrency(year?.ebit)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">
                    EBITDA
                  </td>
                  {fiscalYears.map((year, index) => (
                    <td
                      key={index}
                      className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black"
                    >
                      {year?.ebitda ? formatCurrency(year.ebitda) : "N/A"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">
                    PAT
                  </td>
                  {fiscalYears.map((year, index) => (
                    <td
                      key={index}
                      className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black"
                    >
                      {formatCurrency(year?.net_income)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">
                    Revenue Growth
                  </td>
                  {fiscalYears.map((_, index) => (
                    <td
                      key={index}
                      className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black"
                    >
                      {isEditing.financials ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-center"
                          placeholder="%"
                        />
                      ) : annualGrowthRates[index]?.value ? (
                        `${(annualGrowthRates[index]?.value || 0).toFixed(1)}%`
                      ) : (
                        "N/A"
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">
                    PER
                  </td>
                  {fiscalYears.map((_, index) => (
                    <td
                      key={index}
                      className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black"
                    >
                      {isEditing.financials ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-center"
                        />
                      ) : keyFinancials.per?.value ? (
                        keyFinancials.per.value.toFixed(2)
                      ) : (
                        "N/A"
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 border-t text-black border-r border-[#e5e7eb]">
                    # of Users
                  </td>
                  {fiscalYears.map((_, index) => (
                    <td
                      key={index}
                      className="py-3 px-4 border-t border-r border-[#e5e7eb] text-center text-black"
                    >
                      {isEditing.financials ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-center"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
