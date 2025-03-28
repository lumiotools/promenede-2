"use client";

import { useEffect, useState } from "react";
import { PencilIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
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
import { SectionLayout } from "@/components/ui/section-layout";
import type { PeerDevelopments } from "@/types/competitor";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type PeerDevelopmentsProps = {
  initialData?: PeerDevelopments[] | null | undefined;
};

// Define strongly typed default values
const defaultPeerDevelopment: PeerDevelopments = {
  name: "",
  founded_year: "",
  total_funding: 0,
  currency: "$",
  web_traffic: 0,
  logo: null,
};

export default function PeerDevelopmentsPage({
  initialData = [],
}: PeerDevelopmentsProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sourceText, setSourceText] = useState<string>("Source: Coresignal");
  const [data, setData] = useState<PeerDevelopments[]>([]);
  const [editData, setEditData] = useState<PeerDevelopments[]>([]);

  // Ensure the data is properly formatted and safe to use
  useEffect(() => {
    if (!initialData || !Array.isArray(initialData)) {
      setData([]);
      return;
    }

    console.log("peer development initialData update:", initialData);

    // Process the data to ensure all values are properly formatted
    const processedData = initialData.map((item) => ({
      name: item.name || "",
      founded_year: item.founded_year || "",
      total_funding: parseNumericValue(item.total_funding),
      currency: item.currency || "$",
      web_traffic: parseNumericValue(item.web_traffic),
      logo: item.logo || null,
    }));

    setData(processedData);
  }, [initialData]);

  // Parse numeric values from either string or number
  const parseNumericValue = (value: string | number | null): number => {
    if (value === null || value === undefined) return 0;

    if (typeof value === "number") return value;

    // Try to convert string to number
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Format numbers for display
  const formatNumber = (value: number | string | null): string => {
    const numValue = parseNumericValue(value);

    if (numValue >= 1000000000) {
      return `${(numValue / 1000000000).toFixed(1)}B`;
    } else if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`;
    } else {
      return numValue.toString();
    }
  };

  const startEditing = (): void => {
    setIsEditing(true);
    // Create a deep copy to avoid reference issues
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  const saveChanges = (): void => {
    // Create UserAttachment entity
    const userAttachment = {
      name: "peer-developments-page-updated.tsx",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peer-developments-page-updated.tsx",
    };

    console.log("Creating UserAttachment:", userAttachment);
    setData(editData);
    setIsEditing(false);

    // Update the source text to include the user
    setSourceText("Source: Coresignal, User Update");
  };

  // Update a field for a specific peer
  const updatePeerField = (
    index: number,
    field: keyof PeerDevelopments,
    value: string | number
  ): void => {
    const newData = [...editData];

    if (!newData[index]) return;

    if (field === "total_funding" || field === "web_traffic") {
      // For numeric fields, try to parse as number
      newData[index][field] = value;
    } else {
      newData[index][field] = value as never;
    }

    setEditData(newData);
  };

  // Add a new peer
  const addPeer = (): void => {
    const newData = [...editData];
    newData.push({ ...defaultPeerDevelopment, name: "New Company" });
    setEditData(newData);
  };

  // Remove a peer
  const removePeer = (index: number): void => {
    const newData = [...editData];
    newData.splice(index, 1);
    setEditData(newData);
  };

  // Display only top 5 peers
  const displayPeers = (isEditing ? editData : data).slice(0, 5);

  // Get company data (the first entry) and competitor data (the rest)
  const companyData =
    displayPeers.length > 0 ? displayPeers[0] : defaultPeerDevelopment;
  const competitorData = displayPeers.slice(1);

  // Calculate the highest funding value to set chart scale
  const highestFunding = Math.max(
    parseNumericValue(companyData.total_funding),
    ...competitorData.map((comp) => parseNumericValue(comp.total_funding))
  );

  // Calculate the highest web traffic value to set chart scale
  const highestTraffic = Math.max(
    parseNumericValue(companyData.web_traffic),
    ...competitorData.map((comp) => parseNumericValue(comp.web_traffic))
  );

  // Get display name function - returns name if logo not valid
  const getDisplayName = (peer: PeerDevelopments): string => {
    return peer.name || "Unnamed Company";
  };

  // Prepare data for funding vs founded year chart
  const fundingChartData = {
    datasets: [
      {
        label: getDisplayName(companyData),
        data: [
          {
            x: companyData.founded_year || "N/A",
            y: parseNumericValue(companyData.total_funding) / 1000000,
          },
        ],
        backgroundColor: "#1ba9f5",
        borderColor: "#1ba9f5",
        pointRadius: 8,
      },
      ...competitorData.map((competitor, index) => ({
        label: getDisplayName(competitor),
        data: [
          {
            x: competitor.founded_year || "N/A",
            y: parseNumericValue(competitor.total_funding) / 1000000,
          },
        ],
        backgroundColor: index === 0 ? "#fa0c00" : "#00bfb3",
        borderColor: index === 0 ? "#fa0c00" : "#00bfb3",
        pointRadius: 8,
      })),
    ],
  };

  // Prepare data for web traffic vs founded year chart
  const trafficChartData = {
    datasets: [
      {
        label: getDisplayName(companyData),
        data: [
          {
            x: companyData.founded_year || "N/A",
            y: parseNumericValue(companyData.web_traffic) / 1000000,
          },
        ],
        backgroundColor: "#1ba9f5",
        borderColor: "#1ba9f5",
        pointRadius: 8,
      },
      ...competitorData.map((competitor, index) => ({
        label: getDisplayName(competitor),
        data: [
          {
            x: competitor.founded_year || "N/A",
            y: parseNumericValue(competitor.web_traffic) / 1000000,
          },
        ],
        backgroundColor: index === 0 ? "#fa0c00" : "#00bfb3",
        borderColor: index === 0 ? "#fa0c00" : "#00bfb3",
        pointRadius: 8,
      })),
    ],
  };

  // Chart options based on the highest values
  const fundingChartOptions: ChartOptions<"scatter"> = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Funding (Millions)",
        },
        max: Math.ceil(highestFunding / 1000000) + 1, // Round up to the next million
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: {
            dataset: { label?: string };
            parsed: { x: string | number; y: number };
          }) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            const year = context.parsed.x;
            return `${label} (${year}): $${value}M`;
          },
        },
      },
      legend: {
        position: "top",
      },
    },
    maintainAspectRatio: false,
  };

  const trafficChartOptions: ChartOptions<"scatter"> = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Web Traffic (Millions)",
        },
        max: Math.ceil(highestTraffic / 1000000) + 1, // Round up to the next million
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: {
            dataset: { label?: string };
            parsed: { x: string | number; y: number };
          }) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            const year = context.parsed.x;
            return `${label} (${year}): ${value}M visitors`;
          },
        },
      },
      legend: {
        position: "top",
      },
    },
    maintainAspectRatio: false,
  };

  // Check if logo string contains http or https
  const isValidLogoUrl = (logo: string | null): boolean => {
    if (!logo) return false;
    return logo.startsWith("http://") || logo.startsWith("https://");
  };

  return (
    <SectionLayout title="Peer Developments" sourceText={sourceText}>
      <div className="flex justify-between items-center mb-2">
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="hidden bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={cancelEditing}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="border border-gray-200 rounded-sm overflow-hidden p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-700 text-xl font-medium">
              Peer Companies
            </h2>
            <button
              onClick={addPeer}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Peer
            </button>
          </div>

          <table className="w-full border-collapse mb-4">
            <thead>
              <tr style={{ backgroundColor: "#002169", color: "white" }}>
                <th className="p-3 text-left font-medium">Company</th>
                <th className="p-3 text-left font-medium">Founded</th>
                <th className="p-3 text-left font-medium">Total Funding</th>
                <th className="p-3 text-left font-medium">Currency</th>
                <th className="p-3 text-left font-medium">Web Traffic</th>
                <th className="p-3 text-left font-medium">Logo URL</th>
                <th className="p-3 text-center font-medium w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayPeers.map((peer, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 border border-gray-200">
                    <input
                      type="text"
                      value={peer.name || ""}
                      onChange={(e) =>
                        updatePeerField(index, "name", e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-3 border border-gray-200">
                    <input
                      type="text"
                      value={peer.founded_year || ""}
                      onChange={(e) =>
                        updatePeerField(index, "founded_year", e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-3 border border-gray-200">
                    <input
                      type="text"
                      value={peer.total_funding || ""}
                      onChange={(e) =>
                        updatePeerField(index, "total_funding", e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-3 border border-gray-200">
                    <select
                      value={peer.currency || "$"}
                      onChange={(e) =>
                        updatePeerField(index, "currency", e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded"
                    >
                      <option value="$">$</option>
                      <option value="€">€</option>
                      <option value="£">£</option>
                      <option value="¥">¥</option>
                    </select>
                  </td>
                  <td className="p-3 border border-gray-200">
                    <input
                      type="text"
                      value={peer.web_traffic || ""}
                      onChange={(e) =>
                        updatePeerField(index, "web_traffic", e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-3 border border-gray-200">
                    <input
                      type="text"
                      value={peer.logo || ""}
                      onChange={(e) =>
                        updatePeerField(index, "logo", e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="p-3 text-center border border-gray-200">
                    <button
                      onClick={() => removePeer(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={index === 0 && displayPeers.length === 1}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Funding vs Founded Year Chart */}
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <div
              className="p-3 border-b border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <h2 className="text-gray-800 text-xl font-medium">
                Funding vs Founded Year
              </h2>
            </div>
            <div className="h-[350px] p-4">
              {displayPeers.length > 0 ? (
                <Scatter
                  data={fundingChartData}
                  options={fundingChartOptions}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No peer data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Web Traffic vs Founded Year Chart */}
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <div
              className="p-3 border-b border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <h2 className="text-gray-800 text-xl font-medium">
                Web Traffic vs Founded Year
              </h2>
            </div>
            <div className="h-[350px] p-4">
              {displayPeers.length > 0 ? (
                <Scatter
                  data={trafficChartData}
                  options={trafficChartOptions}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No peer data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
