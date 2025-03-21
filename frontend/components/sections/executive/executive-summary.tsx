/* eslint-disable @typescript-eslint/no-unused-vars */
import { BarChart } from "@/components/ui/bar-chart";
import { SectionHeader } from "@/components/ui/section-header";
import { ExecutiveSummaryTitle } from "@/types/executive";
import { useEffect, useState } from "react";

type ExecutiveSummaryProps = {
  initialData?: ExecutiveSummaryTitle;
};

export function ExecutiveSummary({ initialData }: ExecutiveSummaryProps) {
  const [data, setData] = useState<ExecutiveSummaryTitle | undefined>(
    initialData
  );
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  console.log("Executive summary", initialData);

  return (
    <div className="w-full max-w-full bg-white">
      <SectionHeader title="Executive Summary" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - 7/12 width */}
        <div className="col-span-7">
          <div className="grid grid-rows-2 gap-6 h-full">
            <div className="grid grid-cols-7 gap-6">
              {/* Company Overview Table */}
              <div className="col-span-4 border border-[#e5e7eb] rounded-md overflow-hidden">
                <div className="p-4 border-b border-[#e5e7eb]">
                  <h2 className="text-base font-medium text-[#475467]">
                    Company Overview
                  </h2>
                </div>

                <div>
                  <div className="grid grid-cols-12 border-b border-[#e5e7eb]">
                    <div className="col-span-3 p-4 border-r border-[#e5e7eb]">
                      <h3 className="text-sm font-medium text-[#475467]">
                        Industry
                      </h3>
                    </div>

                    <div className="col-span-9 p-4">
                      <ul className="list-none">
                        <li className="flex text-sm text-[#475467]">
                          <span className="mr-2">•</span>
                          <span>
                            The global robotic process automation (RPA) market
                            is valued at $3,661.89 million in 2023.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-12">
                    <div className="col-span-3 p-4 border-r border-[#e5e7eb]">
                      <h3 className="text-sm font-medium text-[#475467]">
                        Topic Tags
                      </h3>
                    </div>

                    <div className="col-span-9 p-4">
                      <ul className="list-none">
                        <li className="flex text-sm text-[#475467]">
                          <span className="mr-2">•</span>
                          <span>
                            The global robotic process automation (RPA) market
                            is valued at $3,661.89 million in 2023.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Data Table */}
              <div className="col-span-3 border border-[#e5e7eb] rounded-md overflow-hidden">
                <div className="grid grid-cols-2 border-b border-[#e5e7eb]">
                  <div className="p-4 border-r border-[#e5e7eb]">
                    <h3 className="text-sm font-medium text-[#475467]">
                      Market Cap
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-[#475467]">151,480.5</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-[#e5e7eb]">
                  <div className="p-4 border-r border-[#e5e7eb]">
                    <h3 className="text-sm font-medium text-[#475467]">
                      Total Enterprise Value
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-[#475467]">151,480.5</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-[#e5e7eb]">
                  <div className="p-4 border-r border-[#e5e7eb]">
                    <h3 className="text-sm font-medium text-[#475467]">
                      Total Enterprise Value
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-[#475467]">151,480.5</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-[#e5e7eb]">
                  <div className="p-4 border-r border-[#e5e7eb]">
                    <h3 className="text-sm font-medium text-[#475467]">
                      Total Enterprise Value
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-[#475467]">151,480.5</p>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="p-4 border-r border-[#e5e7eb]">
                    <h3 className="text-sm font-medium text-[#475467]">
                      Total Enterprise Value
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-[#475467]">151,480.5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Financial Highlights Table */}
            <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
              <div className="p-4 border-b border-[#e5e7eb]">
                <h2 className="text-base font-medium text-[#475467]">
                  Financial Highlights{" "}
                  <span className="text-sm font-normal">$ in millions</span>
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#002169] text-white">
                      <th className="py-2 px-4 text-left text-sm font-medium">
                        Market
                      </th>
                      <th className="py-2 px-4 text-center text-sm font-medium">
                        FY 2019
                      </th>
                      <th className="py-2 px-4 text-center text-sm font-medium">
                        FY 2020
                      </th>
                      <th className="py-2 px-4 text-center text-sm font-medium">
                        FY 2021
                      </th>
                      <th className="py-2 px-4 text-center text-sm font-medium">
                        FY 2022
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="py-2 px-4 text-sm text-[#475467] font-medium border border-[#e5e7eb]">
                        Income Statement
                      </td>
                      <td className="py-2 px-4 border border-[#e5e7eb]"></td>
                      <td className="py-2 px-4 border border-[#e5e7eb]"></td>
                      <td className="py-2 px-4 border border-[#e5e7eb]"></td>
                      <td className="py-2 px-4 border border-[#e5e7eb]"></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-sm text-[#475467] border border-[#e5e7eb]">
                        Total Enterprise Value
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-sm text-[#475467] border border-[#e5e7eb]">
                        Total Enterprise Value
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-2 px-4 text-sm text-[#475467] font-medium border border-[#e5e7eb]">
                        Balance Sheet
                      </td>
                      <td className="py-2 px-4 border border-[#e5e7eb]"></td>
                      <td className="py-2 px-4 border border-[#e5e7eb]"></td>
                      <td className="py-2 px-4 border border-[#e5e7eb]"></td>
                      <td className="py-2 px-4 border border-[#e5e7eb]"></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-sm text-[#475467] border border-[#e5e7eb]">
                        Total Enterprise Value
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-sm text-[#475467] border border-[#e5e7eb]">
                        Total Enterprise Value
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                      <td className="py-2 px-4 text-sm text-[#475467] text-center border border-[#e5e7eb]">
                        151,480.5
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 text-xs text-[#8097a2]">
                Source: 1.PromenadeAI, 2.[User Company Name] Analysis
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Business Description and Bar Chart - 5/12 width, spans 2 rows */}
        <div className="col-span-5 flex flex-col h-full">
          <div className=" h-full flex flex-col">
            <h2 className="text-base font-medium text-[#475467] mb-4">
              Business Description
            </h2>
            {/* <p className="text-sm text-[#475467] mb-8">
              {data?.title || "No business description available"}
            </p> */}

            <div className="mt-auto mb-10">
              <h3 className="text-base font-medium mb-4 text-[#475467]">
                Financial Data($M)
              </h3>
              <div className="h-64">
                <BarChart
                  data={{
                    labels: ["Market Cap", "TEV", "Total Capital"],
                    values: [800, 550, 1200],
                  }}
                  color="#002169"
                  height={200}
                  yAxisLabel="USD (billion)"
                  maxValue={1500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
