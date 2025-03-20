"use client";

// import { useState } from "react";
import { Linkedin } from "lucide-react";

interface KeyMember {
  member_id: number;
  member_full_name: string;
  member_position_title: string;
}

const keyMembers: KeyMember[] = [
  { member_id: 339042175, member_full_name: "Priya Radhakrishnan", member_position_title: "Principal Data Scientist" },
  { member_id: 342681091, member_full_name: "Matthew Polach", member_position_title: "Boss" },
  { member_id: 347239552, member_full_name: "Doug Neal", member_position_title: "Principal Security Program Manager" },
  { member_id: 349418568, member_full_name: "Charu Tiwari", member_position_title: "Principal Applied Scientist" },
  { member_id: 354061779, member_full_name: "Brian Schilling-george", member_position_title: "Director, Executive Productions" },
  { member_id: 355292824, member_full_name: "Annie Chen", member_position_title: "Director Business Planning" },
  { member_id: 356327235, member_full_name: "Daniel Carpenter", member_position_title: "Principal Software Engineer" },
  { member_id: 356611700, member_full_name: "Graham Wong", member_position_title: "Principal Software Engineering Lead" },
  { member_id: 235395857, member_full_name: "Jon Caruana", member_position_title: "Principal Software Development Engineer" },
  { member_id: 241310471, member_full_name: "Michael Hilsdale", member_position_title: "Principal Software Engineer" },
  { member_id: 242935784, member_full_name: "Andrea Katsivelis", member_position_title: "Global GPS Lead For Microsoft Global Commercial Accessibility Program" },
];

export function EmployeeKeyMembers() {
  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <h1 className="text-4xl font-medium text-[#475467]">Organization: Key Members</h1>
      <div className="border-t border-[#e5e7eb] mb-6"></div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-10">
        {keyMembers.map((member) => (
          <div key={member.member_id} className="border border-[#e5e7eb] p-6 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-[#2d3748]">{member.member_full_name}</h3>
              <p className="text-sm text-[#475467] mt-1">{member.member_position_title}</p>
              <p className="text-xs text-[#8097a2] mt-2">MBA Yale, B.Tech MIT</p>
            </div>
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
              <Linkedin size={18} className="text-[#475467]" />
            </a>
          </div>
        ))}
      </div>

      {/* Footer Source */}
      <div className="text-xs text-[#8097a2] italic mt-4">Source: 1.PromenadeAI, 2.Crunchbase</div>
    </div>
  );
}
