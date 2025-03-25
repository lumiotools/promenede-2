/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  CalendarDays,
  Eye,
  Clock,
  FileText,
  FileSpreadsheet,
  Share2,
  Mail,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Github,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import type { CompanyData } from "@/types/apiResponse";
import type { CompanyUrls } from "@/types/company";

interface ReportHeaderProps {
  title: string;
  date?: Date;
  searchCriteria?: string;
  pagesViewed?: number;
  manHoursSaved?: number;
  initialData: CompanyData | null | undefined;
}

const ReportHeader = ({
  title,
  date = new Date(),
  searchCriteria = "",
  pagesViewed = 10000,
  manHoursSaved = 20,
  initialData,
}: ReportHeaderProps) => {
  // Extract company URLs from initialData if available
  const companyUrls: CompanyUrls | null = initialData?.urls || null;

  // Get company name from initialData if available
  const companyName =
    initialData?.company_profile?.firmographic?.name ||
    initialData?.company_profile?.firmographic?.legal_name ||
    searchCriteria ||
    "Company";

  // Format website URL for display
  const formatWebsiteUrl = (url: string | null): string => {
    if (!url) return "N/A";
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  };

  // Check if a social media URL exists
  const hasSocialMedia = (urls: string[] | null): boolean => {
    return urls !== null && urls.length > 0 && urls[0] !== "";
  };

  // Check if a single social media URL exists (for linkedin_url which is string | null)
  const hasSingleSocialMedia = (url: string | null): boolean => {
    return url !== null && url !== "";
  };

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

      {/* Report Title and Company Info */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

          {/* Company Website and Social Links */}
          {companyUrls && (
            <div className="flex items-center gap-3 mt-1">
              {companyUrls.company_url && (
                <a
                  href={companyUrls.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-[#156082] hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{formatWebsiteUrl(companyUrls.company_url)}</span>
                </a>
              )}

              <div className="flex items-center gap-2">
                {hasSingleSocialMedia(companyUrls.linkedin_url) && (
                  <a
                    href={companyUrls.linkedin_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#156082] hover:text-[#092a38]"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}

                {hasSocialMedia(companyUrls.facebook_url) && (
                  <a
                    href={companyUrls.facebook_url?.[0] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#156082] hover:text-[#092a38]"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}

                {hasSocialMedia(companyUrls.twitter_url) && (
                  <a
                    href={companyUrls.twitter_url?.[0] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#156082] hover:text-[#092a38]"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}

                {hasSocialMedia(companyUrls.youtube_url) && (
                  <a
                    href={companyUrls.youtube_url?.[0] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#156082] hover:text-[#092a38]"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                )}

                {hasSocialMedia(companyUrls.instagram_url) && (
                  <a
                    href={companyUrls.instagram_url?.[0] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#156082] hover:text-[#092a38]"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}

                {hasSocialMedia(companyUrls.github_url) && (
                  <a
                    href={companyUrls.github_url?.[0] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#156082] hover:text-[#092a38]"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}

                {hasSocialMedia(companyUrls.discord_url) && (
                  <a
                    href={companyUrls.discord_url?.[0] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#156082] hover:text-[#092a38]"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Company Logo Placeholder */}
        {companyUrls?.image_url ? (
          <img
            src={companyUrls.image_url || "/placeholder.svg"}
            alt={`${companyName} logo`}
            className="h-12 w-auto object-contain"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            {companyName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

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
          {initialData?.company_profile.firmographic?.name && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Search Criteria:</span>
              <span className="bg-gray-100 px-3 py-0.5 rounded-full font-medium text-gray-700">
                {initialData?.company_profile.firmographic?.name}
              </span>
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
              <span className="text-sm">
                {pagesViewed.toLocaleString()} pages viewed
              </span>
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
            <span className="text-[#344054]">Export</span>
          </button>

          {/* Export Excel Button */}
          <button className="flex items-center gap-2 text-sm bg-white border border-[#D0D5DD] px-3 py-1.5 rounded-md hover:bg-gray-100 transition">
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            <span className="text-[#344054]">Export</span>
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
