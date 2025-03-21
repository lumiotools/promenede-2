/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { KeyMember } from "@/types/employeeTrend";
import { useState, useEffect } from "react";
import {
  Linkedin,
  Edit,
  Plus,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Default empty state
const defaultState: KeyMember[] = [];

interface EmployeeKeyMembersProps {
  initialData?: KeyMember[] | null;
}

export function EmployeeKeyMembers({
  initialData = defaultState,
}: EmployeeKeyMembersProps) {
  const [members, setMembers] = useState<KeyMember[]>(initialData || []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState<KeyMember>({
    member_id: null,
    member_full_name: "",
    member_position_title: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    // Update state when initialData changes
    console.log("employee key members", initialData);
    if (initialData) {
      setMembers(initialData);
      setCurrentPage(1); // Reset to first page when data changes
    }
  }, [initialData]);

  const handleEdit = (id: number | null) => {
    if (id === null) return;
    setEditingId(id);
  };

  const handleSave = (id: number | null) => {
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setNewMember({
      member_id: null,
      member_full_name: "",
      member_position_title: "",
    });
  };

  const handleChange = (
    id: number | null,
    field: keyof KeyMember,
    value: string
  ) => {
    if (id === null) {
      // Updating new member
      setNewMember((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      // Updating existing member
      setMembers((prev) =>
        prev.map((member) =>
          member.member_id === id ? { ...member, [field]: value } : member
        )
      );
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
  };

  const handleSaveNew = () => {
    // Generate a temporary ID (in a real app, this would come from the backend)
    const tempId = Math.max(0, ...members.map((m) => m.member_id || 0)) + 1;

    const memberToAdd = {
      ...newMember,
      member_id: tempId,
    };

    setMembers((prev) => [...prev, memberToAdd]);
    setIsAdding(false);
    setNewMember({
      member_id: null,
      member_full_name: "",
      member_position_title: "",
    });

    // If we have exactly itemsPerPage*n items, move to the next page
    if (members.length % itemsPerPage === 0) {
      setCurrentPage(Math.ceil((members.length + 1) / itemsPerPage));
    }
  };

  // Ensure members is always an array
  const safeMembers = Array.isArray(members) ? members : [];

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(safeMembers.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = safeMembers.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-medium text-[#475467]">
          Organization: Key Members
        </h1>
        <Button
          onClick={handleAddNew}
          className="bg-[#002169] hover:bg-[#001a54]"
          disabled={isAdding}
        >
          <Plus size={16} className="mr-2" /> Add Member
        </Button>
      </div>
      <div className="border-t border-[#e5e7eb] mb-6"></div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMembers.length > 0 ? (
          // Display members if available
          currentMembers.map((member) => (
            <div
              key={member.member_id ?? "undefined-key"}
              className="border border-[#e5e7eb] p-4 rounded-lg shadow-sm"
            >
              {editingId === member.member_id ? (
                // Edit Mode
                <div className="space-y-3">
                  <Input
                    value={member.member_full_name || ""}
                    onChange={(e) =>
                      handleChange(
                        member.member_id,
                        "member_full_name",
                        e.target.value
                      )
                    }
                    placeholder="Full Name"
                    className="w-full"
                  />
                  <Input
                    value={member.member_position_title || ""}
                    onChange={(e) =>
                      handleChange(
                        member.member_id,
                        "member_position_title",
                        e.target.value
                      )
                    }
                    placeholder="Position Title"
                    className="w-full"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X size={14} className="mr-1" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(member.member_id)}
                      className="bg-[#002169] hover:bg-[#001a54]"
                    >
                      <Check size={14} className="mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2d3748]">
                      {member.member_full_name || "Unnamed Member"}
                    </h3>
                    <p className="text-sm text-[#475467] mt-1">
                      {member.member_position_title || "No Position"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(member.member_id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                      <Edit size={16} className="text-[#475467]" />
                    </button>
                    <a
                      href="#"
                      className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                      <Linkedin size={16} className="text-[#475467]" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          // Display placeholder cards when no data is present
          <>
            <div className="border border-[#e5e7eb] p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-32">
              <p className="text-center text-[#8097a2] font-medium">
                No data present
              </p>
            </div>
            <div className="border border-[#e5e7eb] p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-32">
              <p className="text-center text-[#8097a2] font-medium">
                No data present
              </p>
            </div>
            <div className="border border-[#e5e7eb] p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-32">
              <p className="text-center text-[#8097a2] font-medium">
                No data present
              </p>
            </div>
          </>
        )}

        {/* Add New Member Card */}
        {isAdding && (
          <div className="border border-[#e5e7eb] p-4 rounded-lg shadow-sm border-dashed">
            <div className="space-y-3">
              <Input
                value={newMember.member_full_name || ""}
                onChange={(e) =>
                  handleChange(null, "member_full_name", e.target.value)
                }
                placeholder="Full Name"
                className="w-full"
              />
              <Input
                value={newMember.member_position_title || ""}
                onChange={(e) =>
                  handleChange(null, "member_position_title", e.target.value)
                }
                placeholder="Position Title"
                className="w-full"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X size={14} className="mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNew}
                  className="bg-[#002169] hover:bg-[#001a54]"
                  disabled={!newMember.member_full_name}
                >
                  <Check size={14} className="mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {safeMembers.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-3"
          >
            <ChevronLeft size={18} />
          </Button>

          {/* Page numbers */}
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;

              // Logic to show pages around current page
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 ${
                    currentPage === pageNum ? "bg-[#002169]" : ""
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}

      {/* Footer Source */}
      <div className="text-xs text-[#8097a2] italic mt-4">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
