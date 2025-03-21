import React, { useState } from "react";

// Define types for our data
export interface MetricCard {
  id: string;
  value: string | number | null;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface CaseStudy {
  id: string;
  companyName: string | null;
  description: string | null;
  results: string[] | null;
  additionalInfo?: string | null;
  link?: string | null;
}

export interface CustomerSuccessData {
  metrics: MetricCard[];
  caseStudies: CaseStudy[];
}

// Sample initial data
// const initialData: CustomerSuccessData = {
//   metrics: [
//     {
//       id: "fte-saved",
//       value: 4500,
//       label: "FTFEs Saved",
//       suffix: "",
//     },
//     {
//       id: "ai-call-volume",
//       value: 700,
//       label: "Saving AI call volume prediction",
//       suffix: "hrs",
//     },
//     {
//       id: "mobile-service",
//       value: 50,
//       label: "Reduction in mobile service registration",
//       suffix: "%",
//     },
//     {
//       id: "recruitment-hours",
//       value: 85,
//       label: "Reduction in recruitment hours",
//       suffix: "%",
//     },
//     {
//       id: "gen-ai-proposals",
//       value: 52,
//       label: "Gen AI proposals",
//       suffix: "K",
//     },
//   ],
//   caseStudies: [
//     {
//       id: "softbank",
//       companyName: "SoftBank",
//       description:
//         "a key Automation Anywhere partner, underwent a strategic automation journey that yielded impressive results",
//       results: [
//         "4.5K Full-Time Equivalent (FTE) savings",
//         "Improved employee experience",
//         "Successful automation of cross-functional business processes",
//         "Integration of RPA and AI for comprehensive process automation",
//       ],
//       additionalInfo:
//         "SoftBank's approach included a strategic overhaul of business processes and significant investment in employee training to foster a digitally savvy workforce",
//       link: "5",
//     },
//   ],
// };
const initialData: CustomerSuccessData = {
  metrics: [
    {
      id: "",
      value: 0,
      label: "",
      suffix: "",
    },
  ],
  caseStudies: [
    {
      id: "",
      companyName: "",
      description: "",
      results: [""],
      additionalInfo: "",
      link: "",
    },
  ],
};

// Helper function to format metric values
const formatMetricValue = (
  value: string | number | null,
  prefix?: string,
  suffix?: string
): string => {
  if (value === null) return "N/A";
  return `${prefix || ""}${value}${suffix || ""}`;
};

const CustomerSuccessPage: React.FC = () => {
  const [data, setData] = useState<CustomerSuccessData>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<CustomerSuccessData>(initialData);

  // Start editing mode
  const startEditing = (): void => {
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(data)));
  };

  // Cancel editing (discard changes)
  const cancelEditing = (): void => {
    setIsEditing(false);
  };

  // Save changes
  const saveChanges = (): void => {
    setData(editData);
    setIsEditing(false);
  };

  // Update metric card data
  const updateMetric = (
    id: string,
    field: keyof MetricCard,
    value: string | number | null
  ): void => {
    const newData = { ...editData };
    const metricIndex = newData.metrics.findIndex((metric) => metric.id === id);

    if (metricIndex !== -1) {
      newData.metrics[metricIndex] = {
        ...newData.metrics[metricIndex],
        [field]: value,
      };
      setEditData(newData);
    }
  };

  // Update case study data
  const updateCaseStudy = (
    id: string,
    field: keyof CaseStudy,
    value: string | string[] | null
  ): void => {
    const newData = { ...editData };
    const caseStudyIndex = newData.caseStudies.findIndex(
      (study) => study.id === id
    );

    if (caseStudyIndex !== -1) {
      newData.caseStudies[caseStudyIndex] = {
        ...newData.caseStudies[caseStudyIndex],
        [field]: value,
      };
      setEditData(newData);
    }
  };

  // Update case study result (specific array item)
  const updateCaseStudyResult = (
    caseStudyId: string,
    resultIndex: number,
    value: string
  ): void => {
    const newData = { ...editData };
    const caseStudyIndex = newData.caseStudies.findIndex(
      (study) => study.id === caseStudyId
    );

    if (caseStudyIndex !== -1 && newData.caseStudies[caseStudyIndex].results) {
      const newResults = [
        ...(newData.caseStudies[caseStudyIndex].results || []),
      ];
      newResults[resultIndex] = value;
      newData.caseStudies[caseStudyIndex].results = newResults;
      setEditData(newData);
    }
  };

  // Add new result item to case study
  const addCaseStudyResult = (caseStudyId: string): void => {
    const newData = { ...editData };
    const caseStudyIndex = newData.caseStudies.findIndex(
      (study) => study.id === caseStudyId
    );

    if (caseStudyIndex !== -1) {
      const newResults = [
        ...(newData.caseStudies[caseStudyIndex].results || []),
      ];
      newResults.push("New result");
      newData.caseStudies[caseStudyIndex].results = newResults;
      setEditData(newData);
    }
  };

  // Remove result item from case study
  const removeCaseStudyResult = (
    caseStudyId: string,
    resultIndex: number
  ): void => {
    const newData = { ...editData };
    const caseStudyIndex = newData.caseStudies.findIndex(
      (study) => study.id === caseStudyId
    );

    if (caseStudyIndex !== -1 && newData.caseStudies[caseStudyIndex].results) {
      const newResults = [
        ...(newData.caseStudies[caseStudyIndex].results || []),
      ];
      newResults.splice(resultIndex, 1);
      newData.caseStudies[caseStudyIndex].results = newResults;
      setEditData(newData);
    }
  };

  // Add new metric card
  const addMetric = (): void => {
    const newData = { ...editData };
    const newId = `metric-${Date.now()}`;

    newData.metrics.push({
      id: newId,
      value: 0,
      label: "New Metric",
      suffix: "",
    });

    setEditData(newData);
  };

  // Remove metric card
  const removeMetric = (id: string): void => {
    const newData = { ...editData };
    const metricIndex = newData.metrics.findIndex((metric) => metric.id === id);

    if (metricIndex !== -1) {
      newData.metrics.splice(metricIndex, 1);
      setEditData(newData);
    }
  };

  // Add new case study
  const addCaseStudy = (): void => {
    const newData = { ...editData };
    const newId = `case-study-${Date.now()}`;

    newData.caseStudies.push({
      id: newId,
      companyName: "New Company",
      description: "Description of the company's success story",
      results: ["First result"],
      additionalInfo: null,
      link: null,
    });

    setEditData(newData);
  };

  // Remove case study
  const removeCaseStudy = (id: string): void => {
    const newData = { ...editData };
    const caseStudyIndex = newData.caseStudies.findIndex(
      (study) => study.id === id
    );

    if (caseStudyIndex !== -1) {
      newData.caseStudies.splice(caseStudyIndex, 1);
      setEditData(newData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-gray-700 text-5xl font-normal">
          Customer Success & Strategic Growth
        </h1>
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save
            </button>
            <button
              onClick={cancelEditing}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 mb-8"></div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {isEditing ? (
          <>
            {editData.metrics.map((metric) => (
              <div
                key={metric.id}
                className="p-6 bg-gray-50 rounded-lg relative"
              >
                <button
                  onClick={() => removeMetric(metric.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <input
                      type="text"
                      className="w-16 p-1 border border-gray-300 rounded text-center text-2xl font-medium"
                      value={metric.prefix || ""}
                      onChange={(e) =>
                        updateMetric(metric.id, "prefix", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="w-24 p-1 border border-gray-300 rounded text-center text-2xl font-medium mx-1"
                      value={metric.value === null ? "" : metric.value}
                      onChange={(e) => {
                        const newValue =
                          e.target.value === ""
                            ? null
                            : isNaN(Number(e.target.value))
                            ? e.target.value
                            : Number(e.target.value);
                        updateMetric(metric.id, "value", newValue);
                      }}
                    />
                    <input
                      type="text"
                      className="w-16 p-1 border border-gray-300 rounded text-center text-2xl font-medium"
                      value={metric.suffix || ""}
                      onChange={(e) =>
                        updateMetric(metric.id, "suffix", e.target.value)
                      }
                    />
                  </div>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded text-center text-sm text-gray-600"
                    value={metric.label}
                    onChange={(e) =>
                      updateMetric(metric.id, "label", e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <div
              onClick={addMetric}
              className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Add Metric</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {data.metrics.map((metric) => (
              <div key={metric.id} className="p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <h2 className="text-3xl font-medium mb-2">
                    {formatMetricValue(
                      metric.value,
                      metric.prefix,
                      metric.suffix
                    )}
                  </h2>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Case Studies */}
      <div className="mb-8">
        {isEditing ? (
          <>
            {editData.caseStudies.map((caseStudy) => (
              <div
                key={caseStudy.id}
                className="p-6 bg-gray-50 rounded-lg mb-4 relative"
              >
                <button
                  onClick={() => removeCaseStudy(caseStudy.id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={caseStudy.companyName || ""}
                    onChange={(e) =>
                      updateCaseStudy(
                        caseStudy.id,
                        "companyName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={caseStudy.description || ""}
                    onChange={(e) =>
                      updateCaseStudy(
                        caseStudy.id,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Results
                    </label>
                    <button
                      type="button"
                      onClick={() => addCaseStudyResult(caseStudy.id)}
                      className="text-blue-700 text-sm flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Result
                    </button>
                  </div>
                  {(caseStudy.results || []).map((result, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded mr-2"
                        value={result}
                        onChange={(e) =>
                          updateCaseStudyResult(
                            caseStudy.id,
                            idx,
                            e.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeCaseStudyResult(caseStudy.id, idx)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={caseStudy.additionalInfo || ""}
                    onChange={(e) =>
                      updateCaseStudy(
                        caseStudy.id,
                        "additionalInfo",
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={caseStudy.link || ""}
                    onChange={(e) =>
                      updateCaseStudy(caseStudy.id, "link", e.target.value)
                    }
                    placeholder="Enter link or reference"
                  />
                </div>
              </div>
            ))}
            <div
              onClick={addCaseStudy}
              className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Add Case Study</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {data.caseStudies.map((caseStudy) => (
              <div key={caseStudy.id} className="mb-8">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-2/3">
                    <h2 className="text-xl font-medium text-gray-700 mb-2">
                      {caseStudy.companyName || "N/A"}
                      <span className="text-gray-600 font-normal ml-2">
                        {caseStudy.description || ""}
                        {caseStudy.link && (
                          <a
                            href={`#${caseStudy.link}`}
                            className="text-blue-700 ml-1 underline"
                          >
                            {caseStudy.link}
                          </a>
                        )}
                      </span>
                    </h2>

                    <ul className="list-disc pl-5 mt-4 space-y-2">
                      {(caseStudy.results || []).map((result, idx) => (
                        <li key={idx} className="text-gray-700">
                          {result}
                        </li>
                      ))}
                    </ul>

                    {caseStudy.additionalInfo && (
                      <p className="mt-4 text-gray-600">
                        {caseStudy.additionalInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-8 text-gray-500 text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
};

export default CustomerSuccessPage;
