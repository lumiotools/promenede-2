"use client";

export function EmployeeReviewsTable() {
  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <h1 className="text-4xl font-medium text-[#475467]">
        Organization: Employee reviews by topic area
      </h1>
      <div className="border-t border-[#e5e7eb] my-6"></div>

      {/* Table Section */}
      {/* <div className="overflow-x-auto rounded-lg border border-gray-200 mx-15">
        <table className="w-full border-collapse">
          {/* Table Head *
          <thead>
            <tr className="bg-[#002169] text-white text-left">
              <th className="px-6 py-3 font-medium">
                Compensations & Benefits <br />
                <span className="text-sm font-normal">48 Reviews</span>
              </th>
              <th className="px-6 py-4 font-medium">Growth & Well Being</th>
            </tr>
          </thead>

          {/* Table Body 
          <tbody className="text-[#475467]">
            <tr className="border-t border-gray-300">
              <td className="px-6 py-2">
                • Large Scale <br />
                • Competitive Pay <br />
                • Lots of interesting technology
              </td>
              <td className="px-6 ">
                The reviews frequently mention competitive compensation packages and benefits
                offered by Automation Anywhere, with some employees noting it as a standout
                positive factor.
              </td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="px-6 py-2">
                "Good package in city <br />
                Good company and atmosphere <br />
                Stock Options"
              </td>
              <td className="px-6">
                Salaries are described as good to high, with benefits including health insurance,
                stock options, bonuses, and other forms of monetary appreciation.
              </td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="px-6 py-2">
                "Good package in city <br />
                Good company and atmosphere <br />
                Stock Options"
              </td>
              <td className="px-6">
                Several reviews highlight the consistency and punctuality of pay, along with
                opportunities for overtime compensation in certain roles.
              </td>
            </tr>
           
          </tbody>
        </table>
      </div> */}

      <div className='text-center'>No Data Available</div>

      {/* Footer Source */}
      <div className="text-xs text-gray-500 italic mt-6">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
