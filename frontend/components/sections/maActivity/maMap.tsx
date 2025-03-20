/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

// Define interfaces for type safety
export interface Acquisition {
  id: string;
  acquireeName: string;
  announcedDate: string | null;
  price: number | null;
  currency: string;
  logo?: string | null;
  description?: string | null;
  dealType?: string | null;
  category?: string | null; // Category field to group acquisitions
}

export interface AcquiredBy {
  acquirerName: string;
  announcedDate: string | null;
  price: number | null;
  currency: string;
  logo?: string | null;
  description?: string | null;
  dealType?: string | null;
}

export interface MAActivity {
  acquisitions: Acquisition[];
  acquiredBy?: AcquiredBy | null;
}

// Sample data with categories for the M&A Map
const initialData: { acquisitions: Acquisition[] } = {
  acquisitions: [
    {
      id: "1",
      acquireeName: "Fortressiq",
      announcedDate: "2021-05-12",
      price: 250000000,
      currency: "$",
      description: "Strategic acquisition to expand market presence",
      dealType: "Acquisition",
      category: "Enterprise Business Automation",
    },
    {
      id: "2",
      acquireeName: "Cathyos Labs",
      announcedDate: "2019-09-18",
      price: 180000000,
      currency: "$",
      description: "Enhancing technology automation solutions",
      dealType: "Acquisition",
      category: "Technology & Automation solutions",
    },
    {
      id: "3",
      acquireeName: "Klevops",
      announcedDate: "2019-03-30",
      price: null,
      currency: "$",
      description: "Human-to-bot collaboration software",
      dealType: "Partnership",
      category: "Human-to-bot collaboration software",
    },
  ],
};

// Helper function to format year only from date string
const formatYear = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  } catch (e) {
    return "";
  }
};

// Main component
const MAMapPage: React.FC = () => {
  const [data] = useState<Acquisition[]>(initialData.acquisitions);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <h1 className="text-5xl font-normal text-gray-700 mb-4">M&A Map</h1>

      <div className="border-t border-gray-300 mb-8"></div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-medium text-gray-700 mb-6">
          M & A Investment Map
        </h2>

        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl">
            {/* Company logo/name on the left */}
            <div className="absolute left-0 top-1/3 transform -translate-y-1/2">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 w-48">
                <div className="flex items-center justify-center">
                  <div className="h-16 w-16 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="h-12 w-12">
                      <path
                        d="M20,80 Q50,20 80,80"
                        stroke="#F97316"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle cx="80" cy="80" r="8" fill="#F97316" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Acquisition categories and companies */}
            <div className="ml-64">
              {data.map((acquisition, index) => (
                <div key={acquisition.id} className="mb-16 relative">
                  {/* Category box */}
                  <div className="bg-gray-200 p-3 rounded-lg w-64 mb-4">
                    <p className="text-gray-700">
                      {acquisition.category || "Uncategorized"}
                    </p>
                  </div>

                  {/* Horizontal line from left to category */}
                  <div
                    className="absolute left-0 top-6 w-16 h-0.5 bg-gray-400"
                    style={{ left: "-16px" }}
                  ></div>

                  {/* Horizontal line from category to company */}
                  <div
                    className="absolute right-0 top-6 w-16 h-0.5 bg-gray-400"
                    style={{ left: "calc(100% + 0px)" }}
                  ></div>

                  {/* Company box */}
                  <div
                    className="absolute top-0 flex items-center"
                    style={{ left: "calc(100% + 16px)" }}
                  >
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 w-48">
                      <div className="flex items-center">
                        {/* Company logo placeholder */}
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs text-blue-500 font-medium">
                            {acquisition.acquireeName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-700">
                            {acquisition.acquireeName}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatYear(acquisition.announcedDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-gray-500 text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
};

export default MAMapPage;
