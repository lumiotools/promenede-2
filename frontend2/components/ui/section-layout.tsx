"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define an interface for the render props function
interface RenderProps {
  isEditing: boolean;
  editData: any;
  setEditData: (data: any) => void;
}

// Extend the children type to allow both ReactNode and function
type ChildrenType = ReactNode | ((props: RenderProps) => ReactNode);

interface SectionLayoutProps {
  title: string;
  children: ChildrenType;
  onSave?: (editData: any) => void;
  initialData?: any;
  sourceText?: string;
  className?: string;
  showEditButton?: boolean;
}

export function SectionLayout({
  title,
  children,
  onSave,
  initialData,
  sourceText = "",
  className = "",
  showEditButton = true,
}: SectionLayoutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(initialData);
  const [currentSourceText, setCurrentSourceText] = useState(sourceText);

  // Update editData when initialData changes
  useEffect(() => {
    if (initialData && !isEditing) {
      setEditData(initialData);
    }
  }, [initialData, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(initialData);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editData);
    }
    setIsEditing(false);

    // Update source text to include user update if it doesn't already have it
    if (!currentSourceText.includes("User Update")) {
      setCurrentSourceText(`${sourceText}, 3.User Update`);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(initialData);
  };

  return (
    <div className="w-full lg:max-w-6xl lg:mx-auto">
      <div
        className={`w-full flex flex-col bg-white p-4 ${className}`}
        style={{
          height: "100%",
          aspectRatio: "16/9",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="flex-grow overflow-auto pb-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-semibold text-[#445963]">{title}</h1>
            {showEditButton && (
              <>
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="hidden border-[#156082] text-[#156082] h-8 text-xs"
                  >
                    <Edit className="mr-1 h-3 w-3" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="hidden border-red-500 text-red-500 h-8 text-xs"
                    >
                      <X className="mr-1 h-3 w-3" /> Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="hidden bg-[#156082] hover:bg-[#092a38] h-8 text-xs"
                    >
                      <Save className="mr-1 h-3 w-3" /> Save
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-[#ced7db] mb-3"></div>

          {/* Check if children is a function and call it with props if it is */}
          {typeof children === "function"
            ? children({ isEditing, editData, setEditData })
            : children}
        </div>

        {/* Footer with source text, always at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 py-2 px-4 text-xs text-[#475467] bg-white">
          {currentSourceText}
        </div>
      </div>
    </div>
  );
}
