"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const dummyData = [
  {
    category: "Company",
    tenure: 3.2,
    experience: 3.1,
    combined: 3.3,
  },
  {
    category: "Peer Average",
    tenure: 2.5,
    experience: 2.6,
    combined: 2.7,
  },
];

export function LeadershipExecutives() {
  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <h1 className="text-4xl font-medium text-[#475467]">Organization: Leadership & Executives</h1>
      <div className="border-t border-[#e5e7eb] mb-6"></div>

      {/* Company Tenure Section */}
      <h2 className="text-xl font-medium text-[#475467] mx-10">Company tenure</h2>

      {/* Cards Section */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-10">
        {["Average Tenure at current company", "Average years of experience", "Combined Experience"].map(
          (title, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-[#e5e7eb] text-center">
              <h3 className="text-[#475467] text-sm font-medium">{title}</h3>
            </div>
          )
        )}
      </div>

      {/* Charts Section 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-10">
        {["tenure", "experience", "combined"].map((key, index) => (
          <div key={index} className="bg-[#f9fafb] p-6 rounded-lg shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fill: "#475467" }} />
                <YAxis domain={[0, 5]} tick={{ fill: "#475467" }} />
                <Tooltip />
                <ReferenceLine y={2} label="Average" stroke="#8097a2" strokeDasharray="3 3" />
                <Bar dataKey={key} fill="#002169" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div> */}

      <div className='text-center'>No Data Available</div>

      {/* Footer Source */}
      <div className="text-xs text-[#8097a2] italic mt-4">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  );
}
