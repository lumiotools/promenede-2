/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  CompanyProfiles,
  Firmographic,
  KeyFinancials,
  ProductService,
} from "@/types/company";
import { Edit, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

// Define interface for shareholder data
interface Shareholder {
  name: string | null;
  shares: number | null;
  percentage: number | null;
  type: string | null;
}

// Modify the CompanyProfileProps type to match the actual data structure
type CompanyProfileProps = {
  initialData?:
    | CompanyProfiles
    | {
        data: {
          company_profile: {
            firmographic: Firmographic;
            key_financials: KeyFinancials;
            shareholders: Shareholder[];
          };
        };
      };
};

// Define consistent data structure to be used in the component
interface NormalizedCompanyData {
  data: {
    company_profile: {
      firmographic: Firmographic;
      key_financials: KeyFinancials;
      shareholders: Shareholder[];
    };
  };
}

export default function CompanyProfile({ initialData }: CompanyProfileProps) {
  // Transform the data to ensure consistent structure
  type CompanyDataInput =
    | NormalizedCompanyData
    | CompanyProfiles
    | undefined
    | null;

  const transformData = (data: CompanyDataInput): NormalizedCompanyData => {
    if (!data) return createEmptyCompanyProfile();

    // Check if data already has the expected structure
    if ("data" in data && data.data && data.data.company_profile) {
      return data as NormalizedCompanyData;
    }

    // Transform the shareholders array from string[] to Shareholder[]
    let transformedShareholders: Shareholder[] = [];
    if ("shareholders" in data && Array.isArray(data.shareholders)) {
      // Convert string[] to Shareholder[] if needed
      transformedShareholders = data.shareholders.map((item) => {
        if (typeof item === "string") {
          // Convert string to Shareholder object
          return {
            name: item,
            shares: null,
            percentage: null,
            type: null,
          };
        } else {
          // Item is already a Shareholder object
          return item as Shareholder;
        }
      });
    }

    // Transform the data to match the expected structure
    return {
      data: {
        company_profile: {
          firmographic:
            ("firmographic" in data ? data.firmographic : null) ||
            createEmptyFirmographic(),
          key_financials:
            ("key_financials" in data ? data.key_financials : null) ||
            createEmptyKeyFinancials(),
          shareholders: transformedShareholders,
        },
      },
    };
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

  const createEmptyCompanyProfile = (): NormalizedCompanyData => ({
    data: {
      company_profile: {
        firmographic: createEmptyFirmographic(),
        key_financials: createEmptyKeyFinancials(),
        shareholders: [],
      },
    },
  });

  // Initialize state with transformed initialData if provided
  const [data, setData] = useState<NormalizedCompanyData>(
    initialData ? transformData(initialData) : createEmptyCompanyProfile()
  );
  const [editData, setEditData] = useState<NormalizedCompanyData>(
    initialData ? transformData(initialData) : createEmptyCompanyProfile()
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

  // Ensure we have the required data structure
  const companyProfile = data.data.company_profile;

  // Update these lines to use the companyProfile variable:
  const firmographic = companyProfile.firmographic || createEmptyFirmographic();
  const keyFinancials =
    companyProfile.key_financials || createEmptyKeyFinancials();
  const incomeStatements = keyFinancials.income_statements || [];
  const revenueGrowth = keyFinancials.revenue_growth || [];
  const shareholders = companyProfile.shareholders || [];

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
  const q2024Data = incomeStatements
    .filter(
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
    });

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
  const annualGrowthRates = revenueGrowth.filter(
    (growth) =>
      growth &&
      growth.previous_period &&
      growth.current_period &&
      growth.previous_period.endsWith("-12-31") &&
      growth.current_period.endsWith("-12-31")
  );

  // Calculate total shares and percentage with null checks
  const totalShares = shareholders.reduce(
    (sum, shareholder) => sum + (shareholder.shares || 0),
    0
  );
  const totalPercentage = shareholders.reduce(
    (sum, shareholder) => sum + (shareholder.percentage || 0),
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
    if (!editData?.data?.company_profile?.firmographic) return;

    const newEditData = { ...editData };

    // Check if field is employees_count which is numeric
    if (field === "employees_count") {
      newEditData.data.company_profile.firmographic[field] =
        typeof value === "string" ? Number(value) : value;
    } else {
      // Handle all other string fields
      (newEditData.data.company_profile.firmographic[field] as string | null) =
        value as string | null;
    }

    setEditData(newEditData);
  };

  const updateShareholderField = (
    index: number,
    field: keyof Shareholder,
    value: string | number
  ) => {
    if (!editData?.data?.company_profile?.shareholders) return;

    const newEditData = { ...editData };
    if (field === "shares" || field === "percentage") {
      newEditData.data.company_profile.shareholders[index][field] =
        typeof value === "string" ? Number(value) : value;
    } else if (field === "name" || field === "type") {
      newEditData.data.company_profile.shareholders[index][field] = value as
        | string
        | null;
    }
    setEditData(newEditData);
  };
  // Define fiscalYears based on incomeStatements
  const fiscalYears = [...incomeStatements].sort((a, b) => {
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
                        value={
                          editData?.data?.company_profile?.firmographic
                            ?.legal_name || ""
                        }
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
                        value={
                          editData?.data?.company_profile?.firmographic
                            ?.incorporation_date || ""
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
                  <td className="bg-[#002169] text-white py-3 px-4 border-t border-[#e5e7eb]">
                    HQ Address
                  </td>
                  <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                    {isEditing.firmographic ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={
                          editData?.data?.company_profile?.firmographic
                            ?.hq_address || ""
                        }
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
                        value={
                          editData?.data?.company_profile?.firmographic
                            ?.employees_count || 0
                        }
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
                          editData?.data?.company_profile?.firmographic?.products_services
                            ?.filter((ps) => ps.value !== null)
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
                                editData?.data?.company_profile?.firmographic
                                  ?.products_services?.[i]?.uuid || `new-${i}`,
                              value,
                              image_id: null,
                              permalink: null,
                              entity_def_id: null,
                            })
                          );
                          const newEditData = { ...editData };
                          if (
                            newEditData?.data?.company_profile?.firmographic
                          ) {
                            newEditData.data.company_profile.firmographic.products_services =
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

          {/* Shareholders Table */}
          <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-base font-medium text-[#475467]">
                Shareholders
              </h2>
              {isEditing.shareholders ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => saveChanges("shareholders")}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span className="text-xs">Save</span>
                  </button>
                  <button
                    onClick={() => cancelEditing("shareholders")}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-xs">Cancel</span>
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
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">
                    # of Shares
                  </th>
                  <th className="py-3 px-4 text-left font-medium">%</th>
                  <th className="py-3 px-4 text-left font-medium">Types</th>
                </tr>
              </thead>
              <tbody>
                {(isEditing.shareholders &&
                editData?.data?.company_profile?.shareholders
                  ? editData.data.company_profile.shareholders
                  : shareholders
                ).map((shareholder, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={shareholder.name || ""}
                          onChange={(e) =>
                            updateShareholderField(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        shareholder.name || "N/A"
                      )}
                    </td>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={shareholder.shares || 0}
                          onChange={(e) =>
                            updateShareholderField(
                              index,
                              "shares",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                        />
                      ) : (
                        (shareholder.shares || 0).toLocaleString()
                      )}
                    </td>
                    <td className="py-3 px-4 border-t border-r border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="number"
                          step="0.01"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={shareholder.percentage || 0}
                          onChange={(e) =>
                            updateShareholderField(
                              index,
                              "percentage",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      ) : (
                        `${shareholder.percentage || 0}%`
                      )}
                    </td>
                    <td className="py-3 px-4 border-t border-[#e5e7eb] text-black">
                      {isEditing.shareholders ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={shareholder.type || ""}
                          onChange={(e) =>
                            updateShareholderField(
                              index,
                              "type",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        shareholder.type || "N/A"
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 px-4 font-medium border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    Total
                  </td>
                  <td className="py-3 px-4 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    {isEditing.shareholders &&
                    editData?.data?.company_profile?.shareholders
                      ? editData.data.company_profile.shareholders
                          .reduce((sum, s) => sum + (s.shares || 0), 0)
                          .toLocaleString()
                      : totalShares.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-t-2 border-r border-t-[#002169] border-r-[#e5e7eb] text-black">
                    {isEditing.shareholders &&
                    editData?.data?.company_profile?.shareholders
                      ? editData.data.company_profile.shareholders
                          .reduce((sum, s) => sum + (s.percentage || 0), 0)
                          .toFixed(1) + "%"
                      : totalPercentage.toFixed(1) + "%"}
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
