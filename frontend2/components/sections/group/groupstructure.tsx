"use client"

import { useState } from "react"
import { SectionLayout } from "@/components/ui/section-layout"

interface CompanyData {
  name: string
  description: string
}

interface GroupStructureData {
  parent_company: CompanyData | null
  subsidiaries: CompanyData[]
}

export default function GroupStructure() {
  // Define the company structure data directly
  const [groupData, setGroupData] = useState<GroupStructureData>({
    parent_company: {
      name: "Parent Company",
      description: "Description",
    },
    subsidiaries: [
      { name: "Child Company 1", description: "Description 1" },
      { name: "Child Company 2", description: "Description 2" },
      { name: "Child Company 3", description: "Description 3" },
      { name: "Child Company 4", description: "Description 4" },
    ],
  })

  const [sourceText, setSourceText] = useState<string>("Source: 1.PromenadeAI, 2.Crunchbase")

  return (
    <SectionLayout title="Group Structure" sourceText={sourceText}>
      <div className="relative flex flex-col items-center">
        {/* Parent Company */}
        <div className="w-60 bg-[#f5f7fa] rounded-md p-4 flex flex-col items-center">
          <div className="text-[#475467] font-medium mb-2">{groupData.parent_company?.name}</div>
          <div className="w-full bg-[#d9e0e8] rounded-md p-4 text-center text-[#475467]">
            {groupData.parent_company?.description}
          </div>
        </div>

        {/* Vertical line from parent to horizontal line */}
        <div className="h-12 w-0.5 bg-black"></div>

        {/* Horizontal line connecting all children */}
        <div className="relative w-full max-w-4xl h-0.5 bg-black">
          {/* Vertical lines to each child */}
          <div className="absolute left-0 w-0.5 h-12 bg-black" style={{ left: "12.5%" }}></div>
          <div className="absolute left-0 w-0.5 h-12 bg-black" style={{ left: "37.5%" }}></div>
          <div className="absolute left-0 w-0.5 h-12 bg-black" style={{ left: "62.5%" }}></div>
          <div className="absolute left-0 w-0.5 h-12 bg-black" style={{ left: "87.5%" }}></div>
        </div>

        {/* Child Companies - limit to top 4 */}
        <div className="flex justify-between w-full max-w-4xl mt-12">
          {groupData.subsidiaries.slice(0, 4).map((subsidiary, index) => (
            <div key={index} className="w-52 bg-[#f5f7fa] rounded-md p-4 flex flex-col items-center">
              <div className="text-[#475467] font-medium mb-2">{subsidiary.name}</div>
              <div className="w-full bg-[#d9e0e8] rounded-md p-4 text-center text-[#475467]">
                {subsidiary.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  )
}

