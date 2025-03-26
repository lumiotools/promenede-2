"use client";

import type { KeyMember } from "@/types/employeeTrend";
import { useState, useEffect } from "react";
import { Linkedin } from "lucide-react";
import { SectionLayout } from "@/components/ui/section-layout";

// Default empty state
const defaultState: KeyMember[] = [];

interface EmployeeKeyMembersProps {
  initialData?: KeyMember[] | null;
}

export function EmployeeKeyMembers({
  initialData = defaultState,
}: EmployeeKeyMembersProps) {
  const [members, setMembers] = useState<KeyMember[]>(initialData || []);

  useEffect(() => {
    // Update state when initialData changes
    if (initialData) {
      setMembers(initialData);
    }
  }, [initialData]);

  // Helper function to check if a string is valid and not empty
  const isValidString = (str: string | null | undefined): boolean => {
    return str !== null && str !== undefined && str.trim() !== "";
  };

  // Ensure members is always an array
  const safeMembers = Array.isArray(members) ? members : [];

  // Filter members with valid data (name and position title)
  const validMembers = safeMembers.filter(
    (member) =>
      isValidString(member.member_full_name) &&
      isValidString(member.member_position_title)
  );

  // Limit to top 9 members for display
  const displayMembers = validMembers.slice(0, 9);

  return (
    <SectionLayout
      title="Organization: Key Members"
      sourceText="Source: Coresignal, OpenAI"
    >
      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMembers.length > 0 ? (
          // Display members if available
          displayMembers.map((member) => (
            <div
              key={member.member_id ?? "undefined-key"}
              className="bg-[#f8f9fa] border border-[#e5e7eb] p-5 rounded-lg shadow-sm relative"
            >
              {/* Member Name */}
              <h3 className="text-xl font-semibold text-[#35454c] mb-1">
                {member.member_full_name || "Unnamed Member"}
              </h3>

              {/* Position Title */}
              <p className="text-[#57727e] mb-3">
                {member.member_position_title || "No Position"}
              </p>

              {/* Experience */}
              {member.member_experience &&
                member.member_experience.length > 0 && (
                  <p className="text-[#57727e] mb-3">
                    {member.member_experience[0]}
                    {member.member_experience.length > 1 && (
                      <span className="text-[#57727e] text-sm">
                        {" "}
                        +{member.member_experience.length - 1} more
                      </span>
                    )}
                  </p>
                )}

              {/* Education */}
              {member.member_education &&
                member.member_education.length > 0 && (
                  <p className="text-[#57727e]">
                    {member.member_education[0]}
                    {member.member_education.length > 1 && (
                      <span className="text-[#57727e] text-sm">
                        {" "}
                        +{member.member_education.length - 1} more
                      </span>
                    )}
                  </p>
                )}

              {/* LinkedIn Icon - Only show if URL exists */}
              {isValidString(member.member_linkedin_url) && (
                <a
                  href={member.member_linkedin_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-5 right-5 border border-[#e5e7eb] rounded-md p-2 bg-white hover:bg-gray-100 transition-colors"
                  aria-label={`LinkedIn profile for ${member.member_full_name}`}
                >
                  <Linkedin size={20} className="text-[#0A66C2]" />
                </a>
              )}
            </div>
          ))
        ) : (
          // Display placeholder cards when no data is present
          <>
            <div className="bg-[#f8f9fa] border border-[#e5e7eb] p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-40">
              <p className="text-center text-[#8097a2] font-medium">
                No data present
              </p>
            </div>
            <div className="bg-[#f8f9fa] border border-[#e5e7eb] p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-40">
              <p className="text-center text-[#8097a2] font-medium">
                No data present
              </p>
            </div>
            <div className="bg-[#f8f9fa] border border-[#e5e7eb] p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-40">
              <p className="text-center text-[#8097a2] font-medium">
                No data present
              </p>
            </div>
          </>
        )}
      </div>

      {/* Show total count if more than 9 members */}
      {validMembers.length > 9 && (
        <p className="text-sm text-[#57727e] mt-4">
          Showing 9 of {validMembers.length} key members
        </p>
      )}
    </SectionLayout>
  );
}
