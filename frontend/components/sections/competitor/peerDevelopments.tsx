/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import {
  CompanyData,
  CompanyTrafficData,
  CompetitiveAnalysis,
} from "@/types/competitor";

// Define types for competitive analysis data

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format numbers
const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === "N/A") return "N/A";
  if (typeof num === "string") return num;
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

type PeerDevelopmentsProps = {
  initialData?: CompetitiveAnalysis;
};

// Define strongly typed default values
const defaultFundingCompanyData: CompanyData = {
  monthly_traffic: 0,
  name: "",
  founded_year: "",
  total_funding: 0,
};

const defaultTrafficCompanyData: CompanyTrafficData = {
  name: "",
  founded_year: "",
  monthly_traffic: 0,
};

const defaultState: CompetitiveAnalysis = {
  landscape: [],
  competitors: [],
  competitors_websites: [],
  financial_comparables: [],
  peer_developments: {
    funding_vs_founded: {
      company_data: defaultFundingCompanyData,
      competitors_data: [],
    },
    webtraffic_vs_founded: {
      company_data: defaultTrafficCompanyData,
      competitors_data: [],
    },
  },
};

export default function PeerDevelopmentsPage({
  initialData = defaultState,
}: PeerDevelopmentsProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Ensure initialData is not null and has expected structure
  const safeInitialData = initialData || defaultState;

  // Ensure peer_developments exists with proper structure
  const safePeerDevelopments = safeInitialData.peer_developments || {
    funding_vs_founded: {
      company_data: defaultFundingCompanyData,
      competitors_data: [],
    },
    webtraffic_vs_founded: {
      company_data: defaultTrafficCompanyData,
      competitors_data: [],
    },
  };

  // Ensure funding_vs_founded exists with proper structure
  const safeFundingVsFounded = safePeerDevelopments.funding_vs_founded || {
    company_data: defaultFundingCompanyData,
    competitors_data: [],
  };

  // Ensure webtraffic_vs_founded exists with proper structure
  const safeWebtrafficVsFounded =
    safePeerDevelopments.webtraffic_vs_founded || {
      company_data: defaultTrafficCompanyData,
      competitors_data: [],
    };

  // Ensure company_data exists in both sections with correct types\
  const safeFundingCompanyData: CompanyData =
    safeFundingVsFounded.company_data || defaultFundingCompanyData;
  const safeWebtrafficCompanyData: CompanyTrafficData =
    safeWebtrafficVsFounded.company_data || defaultTrafficCompanyData;

  // Ensure competitors_data arrays exist in both sections
  const safeFundingCompetitorsData: CompanyData[] =
    safeFundingVsFounded.competitors_data || [];
  const safeWebtrafficCompetitorsData: CompanyTrafficData[] =
    safeWebtrafficVsFounded.competitors_data || [];

  const [data, setData] = useState<CompetitiveAnalysis>({
    ...safeInitialData,
    competitors: safeInitialData.competitors || [],
    competitors_websites: safeInitialData.competitors_websites || [],
    peer_developments: {
      funding_vs_founded: {
        company_data: safeFundingCompanyData,
        competitors_data: safeFundingCompetitorsData,
      },
      webtraffic_vs_founded: {
        company_data: safeWebtrafficCompanyData,
        competitors_data: safeWebtrafficCompetitorsData,
      },
    },
  });
  useEffect(() => {
    if (!initialData) return; // Ensure initialData exists before updating

    console.log("peer development initialData update:", initialData);

    // Create a properly structured data object with all the necessary defaults
    const updatedData = {
      ...initialData,
      competitors: initialData.competitors || [],
      competitors_websites: initialData.competitors_websites || [],
      peer_developments: initialData.peer_developments || {
        funding_vs_founded: {
          company_data: defaultFundingCompanyData,
          competitors_data: [],
        },
        webtraffic_vs_founded: {
          company_data: defaultTrafficCompanyData,
          competitors_data: [],
        },
      },
    };

    // Completely replace the state with the new data
    setData(updatedData);
  }, [initialData]); // Only depend on initialData

  // Create separate state for editing different sections
  const [editData, setEditData] = useState({
    funding_vs_founded: {
      company_data: { ...safeFundingCompanyData },
      competitors_data: [...safeFundingCompetitorsData],
    },
    webtraffic_vs_founded: {
      company_data: { ...safeWebtrafficCompanyData },
      competitors_data: [...safeWebtrafficCompetitorsData],
    },
  });

  const startEditing = (): void => {
    setIsEditing(true);

    // Create a deep copy to avoid reference issues
    const dataCopy = data.peer_developments
      ? JSON.parse(JSON.stringify(data.peer_developments))
      : JSON.parse(
          JSON.stringify({
            funding_vs_founded: {
              company_data: defaultFundingCompanyData,
              competitors_data: [],
            },
            webtraffic_vs_founded: {
              company_data: defaultTrafficCompanyData,
              competitors_data: [],
            },
          })
        );

    // Ensure the structure is maintained after parsing
    const editDataWithDefaults = {
      funding_vs_founded: {
        company_data: dataCopy.funding_vs_founded?.company_data || {
          ...defaultFundingCompanyData,
        },
        competitors_data: dataCopy.funding_vs_founded?.competitors_data || [],
      },
      webtraffic_vs_founded: {
        company_data: dataCopy.webtraffic_vs_founded?.company_data || {
          ...defaultTrafficCompanyData,
        },
        competitors_data:
          dataCopy.webtraffic_vs_founded?.competitors_data || [],
      },
    };

    setEditData(editDataWithDefaults);
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    const updatedData = { ...data };
    updatedData.peer_developments = editData;
    setData(updatedData);
    setIsEditing(false);
  };

  // Type-safe update function for company data
  const updateFundingCompanyData = (
    field: keyof CompanyData,
    value: string | number
  ): void => {
    const newData = { ...editData };

    if (!newData.funding_vs_founded) {
      newData.funding_vs_founded = {
        company_data: { ...defaultFundingCompanyData },
        competitors_data: [],
      };
    }

    if (!newData.funding_vs_founded.company_data) {
      newData.funding_vs_founded.company_data = {
        ...defaultFundingCompanyData,
      };
    }

    if (
      field === "total_funding" &&
      typeof value === "string" &&
      value !== "N/A"
    ) {
      newData.funding_vs_founded.company_data[field] = Number(value);
    } else {
      newData.funding_vs_founded.company_data[field] = value as never;
    }

    setEditData(newData);
  };

  // Type-safe update function for traffic company data
  const updateTrafficCompanyData = (
    field: keyof CompanyTrafficData,
    value: string | number
  ): void => {
    const newData = { ...editData };

    if (!newData.webtraffic_vs_founded) {
      newData.webtraffic_vs_founded = {
        company_data: { ...defaultTrafficCompanyData },
        competitors_data: [],
      };
    }

    if (!newData.webtraffic_vs_founded.company_data) {
      newData.webtraffic_vs_founded.company_data = {
        ...defaultTrafficCompanyData,
      };
    }

    if (
      field === "monthly_traffic" &&
      typeof value === "string" &&
      value !== "N/A"
    ) {
      newData.webtraffic_vs_founded.company_data[field] = Number(value);
    } else {
      newData.webtraffic_vs_founded.company_data[field] = value as never;
    }

    setEditData(newData);
  };

  // Type-safe update function for funding competitor data
  const updateFundingCompetitor = (
    index: number,
    field: keyof CompanyData,
    value: string | number
  ): void => {
    const newData = { ...editData };

    if (!newData.funding_vs_founded) {
      newData.funding_vs_founded = {
        company_data: { ...defaultFundingCompanyData },
        competitors_data: [],
      };
    }

    if (!newData.funding_vs_founded.competitors_data) {
      newData.funding_vs_founded.competitors_data = [];
    }

    if (!newData.funding_vs_founded.competitors_data[index]) {
      return;
    }

    if (
      field === "total_funding" &&
      typeof value === "string" &&
      value !== "N/A"
    ) {
      newData.funding_vs_founded.competitors_data[index][field] = Number(value);
    } else {
      newData.funding_vs_founded.competitors_data[index][field] =
        value as never;
    }

    setEditData(newData);
  };

  // Type-safe update function for traffic competitor data
  const updateTrafficCompetitor = (
    index: number,
    field: keyof CompanyTrafficData,
    value: string | number
  ): void => {
    const newData = { ...editData };

    if (!newData.webtraffic_vs_founded) {
      newData.webtraffic_vs_founded = {
        company_data: { ...defaultTrafficCompanyData },
        competitors_data: [],
      };
    }

    if (!newData.webtraffic_vs_founded.competitors_data) {
      newData.webtraffic_vs_founded.competitors_data = [];
    }

    if (!newData.webtraffic_vs_founded.competitors_data[index]) {
      return;
    }

    if (
      field === "monthly_traffic" &&
      typeof value === "string" &&
      value !== "N/A"
    ) {
      newData.webtraffic_vs_founded.competitors_data[index][field] =
        Number(value);
    } else {
      newData.webtraffic_vs_founded.competitors_data[index][field] =
        value as never;
    }

    setEditData(newData);
  };

  // Add new competitor to funding vs founded section
  const addFundingCompetitor = (): void => {
    const newData = { ...editData };

    if (!newData.funding_vs_founded) {
      newData.funding_vs_founded = {
        company_data: { ...defaultFundingCompanyData },
        competitors_data: [],
      };
    }

    if (!newData.funding_vs_founded.competitors_data) {
      newData.funding_vs_founded.competitors_data = [];
    }

    newData.funding_vs_founded.competitors_data.push({
      monthly_traffic: 0,
      name: "New Competitor",
      founded_year: "2020",
      total_funding: 0,
    });

    setEditData(newData);
  };

  // Add new competitor to web traffic vs founded section
  const addTrafficCompetitor = (): void => {
    const newData = { ...editData };

    if (!newData.webtraffic_vs_founded) {
      newData.webtraffic_vs_founded = {
        company_data: { ...defaultTrafficCompanyData },
        competitors_data: [],
      };
    }

    if (!newData.webtraffic_vs_founded.competitors_data) {
      newData.webtraffic_vs_founded.competitors_data = [];
    }

    newData.webtraffic_vs_founded.competitors_data.push({
      name: "New Competitor",
      founded_year: "2020",
      monthly_traffic: 0,
    });

    setEditData(newData);
  };

  // Remove competitor from funding vs founded section
  const removeFundingCompetitor = (index: number): void => {
    const newData = { ...editData };

    if (
      !newData.funding_vs_founded ||
      !newData.funding_vs_founded.competitors_data
    ) {
      return;
    }

    newData.funding_vs_founded.competitors_data.splice(index, 1);
    setEditData(newData);
  };

  // Remove competitor from web traffic vs founded section
  const removeTrafficCompetitor = (index: number): void => {
    const newData = { ...editData };

    if (
      !newData.webtraffic_vs_founded ||
      !newData.webtraffic_vs_founded.competitors_data
    ) {
      return;
    }

    newData.webtraffic_vs_founded.competitors_data.splice(index, 1);
    setEditData(newData);
  };

  // Safely access the required data for charts
  const fundingCompanyData: CompanyData =
    data.peer_developments?.funding_vs_founded?.company_data ||
    defaultFundingCompanyData;

  const fundingCompetitorsData: CompanyData[] =
    data.peer_developments?.funding_vs_founded?.competitors_data || [];

  const trafficCompanyData: CompanyTrafficData =
    data.peer_developments?.webtraffic_vs_founded?.company_data ||
    defaultTrafficCompanyData;

  const trafficCompetitorsData: CompanyTrafficData[] =
    data.peer_developments?.webtraffic_vs_founded?.competitors_data || [];

  // Prepare data for funding vs founded year chart
  const fundingChartData = {
    datasets: [
      {
        label: fundingCompanyData.name || "Company",
        data: [
          {
            x: fundingCompanyData.founded_year || "N/A",
            y:
              typeof fundingCompanyData.total_funding === "number"
                ? fundingCompanyData.total_funding / 1000000
                : 0,
          },
        ],
        backgroundColor: "#1ba9f5",
        borderColor: "#1ba9f5",
      },
      ...fundingCompetitorsData.map((competitor, index) => ({
        label: competitor.name || `Competitor ${index + 1}`,
        data: [
          {
            x:
              competitor.founded_year === "N/A"
                ? 0
                : competitor.founded_year || "",
            y:
              typeof competitor.total_funding === "number"
                ? competitor.total_funding / 1000000
                : 0,
          },
        ],
        backgroundColor: index === 0 ? "#fa0c00" : "#00bfb3",
        borderColor: index === 0 ? "#fa0c00" : "#00bfb3",
      })),
    ],
  };

  // Prepare data for web traffic vs founded year chart
  const trafficChartData = {
    datasets: [
      {
        label: trafficCompanyData.name || "Company",
        data: [
          {
            x: trafficCompanyData.founded_year || "N/A",
            y:
              typeof trafficCompanyData.monthly_traffic === "number"
                ? trafficCompanyData.monthly_traffic / 1000000
                : 0,
          },
        ],
        backgroundColor: "#1ba9f5",
        borderColor: "#1ba9f5",
      },
      ...trafficCompetitorsData.map((competitor, index) => ({
        label: competitor.name || `Competitor ${index + 1}`,
        data: [
          {
            x:
              competitor.founded_year === "N/A"
                ? 0
                : competitor.founded_year || "",
            y:
              typeof competitor.monthly_traffic === "number"
                ? competitor.monthly_traffic / 1000000
                : 0,
          },
        ],
        backgroundColor: index === 0 ? "#fa0c00" : "#00bfb3",
        borderColor: index === 0 ? "#fa0c00" : "#00bfb3",
      })),
    ],
  };

  const chartOptions: ChartOptions<"scatter"> = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Millions",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: {
            dataset: { label?: string };
            parsed: { y: number };
          }) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value}M`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Safely access edit data
  const editFundingCompanyData: CompanyData =
    editData.funding_vs_founded?.company_data || defaultFundingCompanyData;
  const editFundingCompetitorsData: CompanyData[] =
    editData.funding_vs_founded?.competitors_data || [];
  const editTrafficCompanyData: CompanyTrafficData =
    editData.webtraffic_vs_founded?.company_data || defaultTrafficCompanyData;
  const editTrafficCompetitorsData: CompanyTrafficData[] =
    editData.webtraffic_vs_founded?.competitors_data || [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#445963] text-6xl font-normal">
          Peer Developments
        </h1>
        {!isEditing ? (
          <Button
            onClick={startEditing}
            className="bg-[#156082] hover:bg-[#092a38] text-white"
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={saveChanges}
              className="bg-[#156082] hover:bg-[#092a38] text-white"
            >
              <SaveIcon className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button
              onClick={cancelEditing}
              variant="outline"
              className="border-[#ced7db] text-[#445963]"
            >
              <XIcon className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        )}
      </div>
      <div className="border-t border-[#ced7db] mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Funding vs Founded Year Section */}
        <div className="border border-[#ced7db] rounded-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-[#ced7db]">
            <h2 className="text-[#445963] text-xl font-medium">
              Funding Vs Founded Year
            </h2>
            {isEditing && (
              <Button
                onClick={addFundingCompetitor}
                size="sm"
                className="bg-[#156082] hover:bg-[#092a38] text-white"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Competitor
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="p-4">
              <h3 className="font-medium text-[#445963] mb-2">Company Data</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-[#57727e] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editFundingCompanyData.name || ""}
                    onChange={(e) =>
                      updateFundingCompanyData("name", e.target.value)
                    }
                    className="w-full border border-[#ced7db] p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57727e] mb-1">
                    Founded Year
                  </label>
                  <input
                    type="text"
                    value={editFundingCompanyData.founded_year || ""}
                    onChange={(e) =>
                      updateFundingCompanyData("founded_year", e.target.value)
                    }
                    className="w-full border border-[#ced7db] p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57727e] mb-1">
                    Total Funding
                  </label>
                  <input
                    type="text"
                    value={editFundingCompanyData.total_funding || 0}
                    onChange={(e) =>
                      updateFundingCompanyData("total_funding", e.target.value)
                    }
                    className="w-full border border-[#ced7db] p-2 rounded"
                  />
                </div>
              </div>

              <h3 className="font-medium text-[#445963] mb-2">
                Competitors Data
              </h3>
              {editFundingCompetitorsData.map((competitor, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 mb-4 relative"
                >
                  <div>
                    <label className="block text-sm text-[#57727e] mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={competitor.name || ""}
                      onChange={(e) =>
                        updateFundingCompetitor(index, "name", e.target.value)
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#57727e] mb-1">
                      Founded Year
                    </label>
                    <input
                      type="text"
                      value={competitor.founded_year || ""}
                      onChange={(e) =>
                        updateFundingCompetitor(
                          index,
                          "founded_year",
                          e.target.value
                        )
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#57727e] mb-1">
                      Total Funding
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={competitor.total_funding || 0}
                        onChange={(e) =>
                          updateFundingCompetitor(
                            index,
                            "total_funding",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                      <button
                        onClick={() => removeFundingCompetitor(index)}
                        className="ml-2 text-[#445963] hover:text-red-500"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="h-[400px] p-4">
                <Scatter data={fundingChartData} options={chartOptions} />
              </div>

              <div className="p-4 border-t border-[#ced7db]">
                <h3 className="font-medium text-[#445963] mb-2">Data Table</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f7]">
                      <th className="p-2 text-left text-[#445963] border border-[#ced7db]">
                        Company
                      </th>
                      <th className="p-2 text-left text-[#445963] border border-[#ced7db]">
                        Founded Year
                      </th>
                      <th className="p-2 text-left text-[#445963] border border-[#ced7db]">
                        Total Funding
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[#ced7db]">
                        {fundingCompanyData.name || "N/A"}
                      </td>
                      <td className="p-2 border border-[#ced7db]">
                        {fundingCompanyData.founded_year || "N/A"}
                      </td>
                      <td className="p-2 border border-[#ced7db]">
                        {formatNumber(fundingCompanyData.total_funding)}
                      </td>
                    </tr>
                    {fundingCompetitorsData.map((competitor, index) => (
                      <tr key={index}>
                        <td className="p-2 border border-[#ced7db]">
                          {competitor.name || "N/A"}
                        </td>
                        <td className="p-2 border border-[#ced7db]">
                          {competitor.founded_year || "N/A"}
                        </td>
                        <td className="p-2 border border-[#ced7db]">
                          {formatNumber(competitor.total_funding)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Web Traffic vs Founded Year Section */}
        <div className="border border-[#ced7db] rounded-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-[#ced7db]">
            <h2 className="text-[#445963] text-xl font-medium">
              Web Traffic Vs Founded Year
            </h2>
            {isEditing && (
              <Button
                onClick={addTrafficCompetitor}
                size="sm"
                className="bg-[#156082] hover:bg-[#092a38] text-white"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Competitor
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="p-4">
              <h3 className="font-medium text-[#445963] mb-2">Company Data</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-[#57727e] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editTrafficCompanyData.name || ""}
                    onChange={(e) =>
                      updateTrafficCompanyData("name", e.target.value)
                    }
                    className="w-full border border-[#ced7db] p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57727e] mb-1">
                    Founded Year
                  </label>
                  <input
                    type="text"
                    value={editTrafficCompanyData.founded_year || ""}
                    onChange={(e) =>
                      updateTrafficCompanyData("founded_year", e.target.value)
                    }
                    className="w-full border border-[#ced7db] p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57727e] mb-1">
                    Monthly Traffic
                  </label>
                  <input
                    type="text"
                    value={editTrafficCompanyData.monthly_traffic || 0}
                    onChange={(e) =>
                      updateTrafficCompanyData(
                        "monthly_traffic",
                        e.target.value
                      )
                    }
                    className="w-full border border-[#ced7db] p-2 rounded"
                  />
                </div>
              </div>

              <h3 className="font-medium text-[#445963] mb-2">
                Competitors Data
              </h3>
              {editTrafficCompetitorsData.map((competitor, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 mb-4 relative"
                >
                  <div>
                    <label className="block text-sm text-[#57727e] mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={competitor.name || ""}
                      onChange={(e) =>
                        updateTrafficCompetitor(index, "name", e.target.value)
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#57727e] mb-1">
                      Founded Year
                    </label>
                    <input
                      type="text"
                      value={competitor.founded_year || ""}
                      onChange={(e) =>
                        updateTrafficCompetitor(
                          index,
                          "founded_year",
                          e.target.value
                        )
                      }
                      className="w-full border border-[#ced7db] p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#57727e] mb-1">
                      Monthly Traffic
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={competitor.monthly_traffic || 0}
                        onChange={(e) =>
                          updateTrafficCompetitor(
                            index,
                            "monthly_traffic",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#ced7db] p-2 rounded"
                      />
                      <button
                        onClick={() => removeTrafficCompetitor(index)}
                        className="ml-2 text-[#445963] hover:text-red-500"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="h-[400px] p-4">
                <Scatter data={trafficChartData} options={chartOptions} />
              </div>

              <div className="p-4 border-t border-[#ced7db]">
                <h3 className="font-medium text-[#445963] mb-2">Data Table</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f7]">
                      <th className="p-2 text-left text-[#445963] border border-[#ced7db]">
                        Company
                      </th>
                      <th className="p-2 text-left text-[#445963] border border-[#ced7db]">
                        Founded Year
                      </th>
                      <th className="p-2 text-left text-[#445963] border border-[#ced7db]">
                        Monthly Traffic
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[#ced7db]">
                        {trafficCompanyData.name || "N/A"}
                      </td>
                      <td className="p-2 border border-[#ced7db]">
                        {trafficCompanyData.founded_year || "N/A"}
                      </td>
                      <td className="p-2 border border-[#ced7db]">
                        {formatNumber(trafficCompanyData.monthly_traffic)}
                      </td>
                    </tr>
                    {trafficCompetitorsData.map((competitor, index) => (
                      <tr key={index}>
                        <td className="p-2 border border-[#ced7db]">
                          {competitor.name || "N/A"}
                        </td>
                        <td className="p-2 border border-[#ced7db]">
                          {competitor.founded_year || "N/A"}
                        </td>
                        <td className="p-2 border border-[#ced7db]">
                          {formatNumber(competitor.monthly_traffic)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
