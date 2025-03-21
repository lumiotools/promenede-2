"use client"

interface CompanyData {
  name: string
  description: string
}

interface GroupStructureData {
  parent_company: CompanyData | null
  subsidiaries: CompanyData[]
}

export function GroupStructure() {
  // Define the company structure data directly
  const groupData: GroupStructureData = {
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
  }

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-4xl font-medium text-[#475467]">Group Structure</h1>

      <div className="border-t border-[#e5e7eb] mb-6"></div>

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

        {/* Child Companies */}
        <div className="flex justify-between w-full max-w-4xl mt-12">
          {groupData.subsidiaries.map((subsidiary, index) => (
            <div key={index} className="w-52 bg-[#f5f7fa] rounded-md p-4 flex flex-col items-center">
              <div className="text-[#475467] font-medium mb-2">{subsidiary.name}</div>
              <div className="w-full bg-[#d9e0e8] rounded-md p-4 text-center text-[#475467]">
                {subsidiary.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-[#8097a2] italic mt-4">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  )
}

