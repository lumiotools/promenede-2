"use client";

import React from "react";
import { CalendarDays, Eye, Clock, FileText, FileSpreadsheet, Share2, Mail } from "lucide-react";
import { format } from "date-fns";

interface ReportHeaderProps {
  title: string;
  date?: Date;
  searchCriteria?: string;
  pagesViewed?: number;
  manHoursSaved?: number;
}

const ReportHeader = ({
  title,
  date = new Date(),
  searchCriteria = "",
  pagesViewed = 10000,
  manHoursSaved = 20,
}: ReportHeaderProps) => {
  return (
    <div className="pt-4 pb-4 px-6 border-b border-gray-200">
      {/* Top User Info */}
      <div className="flex justify-end gap-3 mb-4">
        {/* Email Badge */}
        <div className="flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-3 py-1.5 text-sm">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>customer@promenade-ai.com</span>
        </div>

        {/* Credits Badge */}
        <div className="flex items-center gap-2 bg-yellow-50 text-gray-800 rounded-full px-3 py-1.5 text-sm font-medium">
          <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-white">
            ●
          </div>
          <span>8 Credits</span>
        </div>
      </div>

      {/* Report Title */}
      <h1 className="text-xl font-semibold text-gray-800 mb-3">{title}</h1>

      {/* Info Bar */}
      <div className="flex items-center justify-between">
        {/* Left Section - Date & Search Criteria */}
        <div className="flex items-center gap-6 text-gray-600">
          {/* Date */}
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span className="text-sm">As of {format(date, "dd MMM yyyy")}</span>
          </div>

          {/* Search Criteria */}
          {searchCriteria && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Search Criteria:</span>
              <span className="bg-gray-100 px-3 py-0.5 rounded-full font-medium text-gray-700">{searchCriteria}</span>
            </div>
          )}
        </div>

        {/* Right Section - Stats & Buttons */}
        <div className="flex items-center gap-3">
          {/* Stats Container */}
          <div className="flex items-center gap-3 border border-[#D0D5DD] rounded-lg px-4 py-1 text-gray-700">
            {/* Pages Viewed */}
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-green-600" />
              <span className="text-sm">{pagesViewed.toLocaleString()} pages viewed</span>
            </div>

            {/* Separator */}
            <span className="text-gray-300">|</span>

            {/* Man Hours Saved */}
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{manHoursSaved} man-hrs saved</span>
            </div>
          </div>

          {/* Export PDF Button */}
          <button className="flex items-center gap-2 text-sm bg-white border border-[#D0D5DD] px-3 py-1.5 rounded-md hover:bg-gray-100 transition">
            <FileText className="h-4 w-4 text-red-500" />
            <span className='text-[#344054]'>Export</span>
          </button>

          {/* Export Excel Button */}
          <button className="flex items-center gap-2 text-sm bg-white border border-[#D0D5DD] px-3 py-1.5 rounded-md hover:bg-gray-100 transition">
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            <span className='text-[#344054]'>Export</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center gap-2 text-sm bg-gray-700 text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
