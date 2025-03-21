"use client";

export function EmployeeReviewImprovements() {
  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <h1 className="text-4xl font-medium text-[#475467]">Organization: Employee Reviews</h1>
      <div className="border-t border-[#e5e7eb] my-6"></div>

      {/* Areas of Improvement Section */}
      <div className="bg-[#f9fafb] p-6 rounded-lg mx-10">
        <h2 className="text-xl font-medium text-[#475467] mb-4">Areas of Improvement</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#475467]">
          {/* Column 1 */}
          <div className="space-y-3">
            <p><strong>• Severe Job Insecurity:</strong> Frequent layoffs occur with little to no notice, often leaving employees with only hours to prepare for their termination. This reflects a lack of consideration for employees’ well-being and causes significant anxiety among the workforce.</p>

            <p><strong>• Ineffective Leadership:</strong> Leadership is perceived as disconnected and lacks direction, leading to constant changes in strategy and high turnover in executive positions. Many employees feel that current leadership does not allow executives to implement their expertise.</p>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <p><strong>• Toxic Work Environment:</strong> The work culture is described as toxic with high levels of favoritism, bullying, and a lack of respect for employees. Many employees feel demoralized and unsupported, which contributes to high attrition rates.</p>

            <p><strong>• Inadequate Compensation and Recognition:</strong> Employees report a lack of monetary appreciation for their work, with significant disparities in compensation. Many feel that the company prioritizes profits over employee satisfaction.</p>

            <p><strong>• Disregard for Employee Rights:</strong> Employees express concerns over the lack of professional ethics, especially during layoffs. There is a call for transparency in processes such as appraisals and severance packages, indicating a need for better treatment.</p>
          </div>
        </div>
      </div>

      {/* Footer Source */}
      <div className="text-xs text-[#8097a2] italic mt-6">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  );
}
