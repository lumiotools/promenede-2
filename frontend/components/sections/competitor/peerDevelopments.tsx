"use client";

import { useState } from "react";
import { competitiveAnalysis as initialData } from "./competitorData";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { CompanyData, CompanyTrafficData } from "@/types/competitor";
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

export default function PeerDevelopmentsPage() {
  const [data, setData] = useState(initialData.peerDevelopments);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState(initialData.peerDevelopments);

  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    setData(editData);
    setIsEditing(false);
  };

  const updateCompanyData = (
    section: "fundingVsFounded" | "webtrafficVsFounded",
    isCompany: boolean,
    index: number,
    field: keyof CompanyData | keyof CompanyTrafficData,
    value: string | number
  ): void => {
    const newData = { ...editData };

    if (isCompany) {
      if (section === "fundingVsFounded") {
        if (
          field === "totalFunding" &&
          typeof value === "string" &&
          value !== "N/A"
        ) {
          newData[section].companyData[field] = Number(value);
        } else {
          newData[section].companyData[field as keyof CompanyData] =
            value as never;
        }
      } else {
        if (
          field === "monthlyTraffic" &&
          typeof value === "string" &&
          value !== "N/A"
        ) {
          newData[section].companyData[field] = Number(value);
        } else {
          newData[section].companyData[field as keyof CompanyTrafficData] =
            value as never;
        }
      }
    } else {
      if (section === "fundingVsFounded") {
        if (
          field === "totalFunding" &&
          typeof value === "string" &&
          value !== "N/A"
        ) {
          newData[section].competitorsData[index][field] = Number(value);
        } else {
          newData[section].competitorsData[index][field as keyof CompanyData] =
            value as never;
        }
      } else {
        if (
          field === "monthlyTraffic" &&
          typeof value === "string" &&
          value !== "N/A"
        ) {
          newData[section].competitorsData[index][field] = Number(value);
        } else {
          newData[section].competitorsData[index][
            field as keyof CompanyTrafficData
          ] = value as never;
        }
      }
    }

    setEditData(newData);
  };

  // Add new competitor to funding vs founded section
  const addFundingCompetitor = (): void => {
    const newData = { ...editData };
    newData.fundingVsFounded.competitorsData.push({
      name: "New Competitor",
      foundedYear: "2020",
      totalFunding: 0,
    });
    setEditData(newData);
  };

  // Add new competitor to web traffic vs founded section
  const addTrafficCompetitor = (): void => {
    const newData = { ...editData };
    newData.webtrafficVsFounded.competitorsData.push({
      name: "New Competitor",
      foundedYear: "2020",
      monthlyTraffic: 0,
    });
    setEditData(newData);
  };

  // Remove competitor from funding vs founded section
  const removeFundingCompetitor = (index: number): void => {
    const newData = { ...editData };
    newData.fundingVsFounded.competitorsData.splice(index, 1);
    setEditData(newData);
  };

  // Remove competitor from web traffic vs founded section
  const removeTrafficCompetitor = (index: number): void => {
    const newData = { ...editData };
    newData.webtrafficVsFounded.competitorsData.splice(index, 1);
    setEditData(newData);
  };

  // Prepare data for funding vs founded year chart
  const fundingChartData = {
    datasets: [
      {
        label: data.fundingVsFounded.companyData.name,
        data: [
          {
            x: data.fundingVsFounded.companyData.foundedYear,
            y:
              typeof data.fundingVsFounded.companyData.totalFunding === "number"
                ? data.fundingVsFounded.companyData.totalFunding / 1000000
                : 0,
          },
        ],
        backgroundColor: "#1ba9f5",
        borderColor: "#1ba9f5",
      },
      ...data.fundingVsFounded.competitorsData.map((competitor, index) => ({
        label: competitor.name,
        data: [
          {
            x: competitor.foundedYear === "N/A" ? 0 : competitor.foundedYear,
            y:
              typeof competitor.totalFunding === "number"
                ? competitor.totalFunding / 1000000
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
        label: data.webtrafficVsFounded.companyData.name,
        data: [
          {
            x: data.webtrafficVsFounded.companyData.foundedYear,
            y:
              typeof data.webtrafficVsFounded.companyData.monthlyTraffic ===
              "number"
                ? data.webtrafficVsFounded.companyData.monthlyTraffic / 1000000
                : 0,
          },
        ],
        backgroundColor: "#1ba9f5",
        borderColor: "#1ba9f5",
      },
      ...data.webtrafficVsFounded.competitorsData.map((competitor, index) => ({
        label: competitor.name,
        data: [
          {
            x: competitor.foundedYear === "N/A" ? 0 : competitor.foundedYear,
            y:
              typeof competitor.monthlyTraffic === "number"
                ? competitor.monthlyTraffic / 1000000
                : 0,
          },
        ],
        backgroundColor: index === 0 ? "#fa0c00" : "#00bfb3",
        borderColor: index === 0 ? "#fa0c00" : "#00bfb3",
      })),
    ],
  };

  const chartOptions = {
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
                    value={editData.fundingVsFounded.companyData.name}
                    onChange={(e) =>
                      updateCompanyData(
                        "fundingVsFounded",
                        true,
                        0,
                        "name",
                        e.target.value
                      )
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
                    value={editData.fundingVsFounded.companyData.foundedYear}
                    onChange={(e) =>
                      updateCompanyData(
                        "fundingVsFounded",
                        true,
                        0,
                        "foundedYear",
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
                  <input
                    type="text"
                    value={editData.fundingVsFounded.companyData.totalFunding}
                    onChange={(e) =>
                      updateCompanyData(
                        "fundingVsFounded",
                        true,
                        0,
                        "totalFunding",
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
              {editData.fundingVsFounded.competitorsData.map(
                (competitor, index) => (
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
                        value={competitor.name}
                        onChange={(e) =>
                          updateCompanyData(
                            "fundingVsFounded",
                            false,
                            index,
                            "name",
                            e.target.value
                          )
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
                        value={competitor.foundedYear}
                        onChange={(e) =>
                          updateCompanyData(
                            "fundingVsFounded",
                            false,
                            index,
                            "foundedYear",
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
                          value={competitor.totalFunding}
                          onChange={(e) =>
                            updateCompanyData(
                              "fundingVsFounded",
                              false,
                              index,
                              "totalFunding",
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
                )
              )}
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
                        {data.fundingVsFounded.companyData.name}
                      </td>
                      <td className="p-2 border border-[#ced7db]">
                        {data.fundingVsFounded.companyData.foundedYear || "N/A"}
                      </td>
                      <td className="p-2 border border-[#ced7db]">
                        {formatNumber(
                          data.fundingVsFounded.companyData.totalFunding
                        )}
                      </td>
                    </tr>
                    {data.fundingVsFounded.competitorsData.map(
                      (competitor, index) => (
                        <tr key={index}>
                          <td className="p-2 border border-[#ced7db]">
                            {competitor.name}
                          </td>
                          <td className="p-2 border border-[#ced7db]">
                            {competitor.foundedYear || "N/A"}
                          </td>
                          <td className="p-2 border border-[#ced7db]">
                            {formatNumber(competitor.totalFunding)}
                          </td>
                        </tr>
                      )
                    )}
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
                    value={editData.webtrafficVsFounded.companyData.name}
                    onChange={(e) =>
                      updateCompanyData(
                        "webtrafficVsFounded",
                        true,
                        0,
                        "name",
                        e.target.value
                      )
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
                    value={editData.webtrafficVsFounded.companyData.foundedYear}
                    onChange={(e) =>
                      updateCompanyData(
                        "webtrafficVsFounded",
                        true,
                        0,
                        "foundedYear",
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
                  <input
                    type="text"
                    value={
                      editData.webtrafficVsFounded.companyData.monthlyTraffic
                    }
                    onChange={(e) =>
                      updateCompanyData(
                        "webtrafficVsFounded",
                        true,
                        0,
                        "monthlyTraffic",
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
              {editData.webtrafficVsFounded.competitorsData.map(
                (competitor, index) => (
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
                        value={competitor.name}
                        onChange={(e) =>
                          updateCompanyData(
                            "webtrafficVsFounded",
                            false,
                            index,
                            "name",
                            e.target.value
                          )
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
                        value={competitor.foundedYear}
                        onChange={(e) =>
                          updateCompanyData(
                            "webtrafficVsFounded",
                            false,
                            index,
                            "foundedYear",
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
                          value={competitor.monthlyTraffic}
                          onChange={(e) =>
                            updateCompanyData(
                              "webtrafficVsFounded",
                              false,
                              index,
                              "monthlyTraffic",
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
                )
              )}
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
                        {data.webtrafficVsFounded.companyData.name}
                      </td>
                      <td className="p-2 border border-[#ced7db]">
                        {data.webtrafficVsFounded.companyData.foundedYear ||
                          "N/A"}
                      </td>
                      <td className="p-2 border border-[#ced7db]">
                        {formatNumber(
                          data.webtrafficVsFounded.companyData.monthlyTraffic
                        )}
                      </td>
                    </tr>
                    {data.webtrafficVsFounded.competitorsData.map(
                      (competitor, index) => (
                        <tr key={index}>
                          <td className="p-2 border border-[#ced7db]">
                            {competitor.name}
                          </td>
                          <td className="p-2 border border-[#ced7db]">
                            {competitor.foundedYear || "N/A"}
                          </td>
                          <td className="p-2 border border-[#ced7db]">
                            {formatNumber(competitor.monthlyTraffic)}
                          </td>
                        </tr>
                      )
                    )}
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
