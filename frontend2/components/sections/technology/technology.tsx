"use client";

import { useState, useEffect } from "react";
import { SectionLayout } from "@/components/ui/section-layout";
import type { KeyTechnology } from "@/types/technology";

interface TechnologyProps {
  initialData?: KeyTechnology | null;
}

export default function TechnologyComponent({ initialData }: TechnologyProps) {
  const [data, setData] = useState<KeyTechnology | null>(null);
  const [sourceText, setSourceText] = useState<string>(
    "Source: 1.PromenadeAI, 2.Company Reports"
  );

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleSave = (editedData: KeyTechnology) => {
    setData(editedData);
    // Here you would typically send the data to an API
  };

  return (
    <SectionLayout
      title="Technology Stack"
      sourceText={sourceText}
      initialData={data}
      onSave={handleSave}
    >
      {!data ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No technology data available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Technology Count */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold text-gray-800">
                Technology Overview
              </h3>
              <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {data.num_technologies} Technologies
              </div>
            </div>
            <p className="text-xs text-gray-600">
              The company utilizes a diverse technology stack across various
              domains including infrastructure, development, analytics, and
              business operations. Below is a breakdown of the key technologies
              used.
            </p>
          </div>

          {/* Technologies Grid */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Key Technologies
            </h3>
            {data.technologies_used && data.technologies_used.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.technologies_used.slice(0, 30).map((tech, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded border border-gray-200"
                  >
                    <h4 className="text-sm font-medium text-gray-700 capitalize">
                      {tech.technology}
                    </h4>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>
                        First verified: {formatDate(tech.first_verified_at)}
                      </span>
                      <span>
                        Last verified: {formatDate(tech.last_verified_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">
                No technology information available
              </p>
            )}
            {data.technologies_used && data.technologies_used.length > 30 && (
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  Showing 30 of {data.technologies_used.length} technologies
                </p>
              </div>
            )}
          </div>

          {/* Technology Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Development Technologies
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {data.technologies_used
                  ?.filter((tech) => isDevTechnology(tech.technology || ""))
                  .slice(0, 10)
                  .map((tech, index) => (
                    <div
                      key={index}
                      className="bg-white p-2 rounded border border-gray-200 text-xs"
                    >
                      {tech.technology}
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Cloud & Infrastructure
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {data.technologies_used
                  ?.filter((tech) => isCloudTechnology(tech.technology || ""))
                  .slice(0, 10)
                  .map((tech, index) => (
                    <div
                      key={index}
                      className="bg-white p-2 rounded border border-gray-200 text-xs"
                    >
                      {tech.technology}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Technology Adoption Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Recent Technology Adoptions
            </h3>
            <div className="space-y-3">
              {data.technologies_used
                ?.sort((a, b) => {
                  const dateA = a.first_verified_at
                    ? new Date(a.first_verified_at).getTime()
                    : 0;
                  const dateB = b.first_verified_at
                    ? new Date(b.first_verified_at).getTime()
                    : 0;
                  return dateB - dateA;
                })
                .slice(0, 5)
                .map((tech, index) => (
                  <div
                    key={index}
                    className={index > 0 ? "pt-2 border-t border-gray-200" : ""}
                  >
                    <h4 className="text-sm font-medium text-gray-700 capitalize">
                      {tech.technology}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      First verified: {formatDate(tech.first_verified_at)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  );
}

// Helper functions
function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isDevTechnology(tech: string): boolean {
  const devTechs = [
    "javascript",
    "react",
    "angular",
    "vue",
    "node",
    "python",
    "java",
    "ruby",
    "php",
    "typescript",
    "django",
    "flask",
    "spring",
    "laravel",
    "rails",
    "express",
    "dotnet",
    "c#",
    "c++",
    "golang",
    "kotlin",
    "swift",
    "flutter",
    "react native",
    "xamarin",
    "unity",
    "jquery",
    "bootstrap",
    "tailwind",
  ];
  return devTechs.some((devTech) => tech.toLowerCase().includes(devTech));
}

function isCloudTechnology(tech: string): boolean {
  const cloudTechs = [
    "aws",
    "amazon",
    "azure",
    "microsoft azure",
    "google cloud",
    "gcp",
    "cloud",
    "kubernetes",
    "docker",
    "terraform",
    "serverless",
    "lambda",
    "s3",
    "ec2",
    "rds",
    "dynamodb",
    "cloudfront",
    "cloudflare",
    "heroku",
    "netlify",
    "vercel",
    "digitalocean",
    "linode",
    "openstack",
    "vmware",
    "virtualization",
  ];
  return cloudTechs.some((cloudTech) => tech.toLowerCase().includes(cloudTech));
}
