/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Plus, ExternalLink, Loader2 } from "lucide-react";
import { LaunchTimelineItem } from "@/types/company";

interface ProductTimelineTableProps {
  initialData?: LaunchTimelineItem[] | null | undefined;
}

export function ProductTimelineTable({
  initialData,
}: ProductTimelineTableProps) {
  const [timelineData, setTimelineData] = useState<LaunchTimelineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<LaunchTimelineItem | null>(
    null
  );
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      if (initialData && initialData.length > 0) {
        setTimelineData(initialData);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [initialData]);

  const handleEditClick = (item: LaunchTimelineItem, index: number) => {
    setCurrentItem(item);
    setCurrentIndex(index);
    setIsNewItem(false);
    setIsEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentItem({
      productName: null,
      description: null,
      referenceLink: null,
      date: null,
    });
    setIsNewItem(true);
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    if (currentItem) {
      if (isNewItem) {
        setTimelineData([...timelineData, currentItem]);
      } else if (currentIndex >= 0) {
        const updatedData = [...timelineData];
        updatedData[currentIndex] = currentItem;
        setTimelineData(updatedData);
      }
    }
    setIsEditDialogOpen(false);
  };

  const getYear = (dateString: string | null): string => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).getFullYear().toString();
    } catch (e) {
      return "Invalid date";
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#002169]" />
        <p className="mt-2 text-[#35454c]">Loading product timeline...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-medium text-[#35454c]">
          Product Timeline
        </h2>
        <Button
          onClick={handleAddClick}
          className="bg-[#002169] hover:bg-[#156082]"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="border rounded-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-[#35454c]">
            Product Timeline
          </h3>
          <Button variant="ghost" size="icon">
            <Pencil className="h-5 w-5 text-[#57727e]" />
          </Button>
        </div>

        {timelineData.length === 0 ? (
          <div className="p-8 text-center text-[#57727e]">
            No product timeline data available
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#002169]">
              <TableRow>
                <TableHead className="text-white font-medium w-16 text-center">
                  #
                </TableHead>
                <TableHead className="text-white font-medium">Year</TableHead>
                <TableHead className="text-white font-medium">
                  Product Launches
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timelineData.map((item, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-[#ced7db]/20 cursor-pointer"
                  onClick={() => handleEditClick(item, index)}
                >
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{getYear(item.date)}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">
                        {item.productName || "Not available"}
                      </span>
                      {item.description && (
                        <p className="text-[#57727e] mt-1">
                          {item.description}
                        </p>
                      )}
                      {item.referenceLink && (
                        <a
                          href={item.referenceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#156082] hover:underline flex items-center mt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          <span>link</span>
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="text-[#57727e] text-sm mt-4">
        Source: Apple Product Launches
      </p>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isNewItem ? "Add New Product" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="productName" className="text-right">
                Product Name
              </label>
              <Input
                id="productName"
                value={currentItem?.productName || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem!,
                    productName: e.target.value || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Release Date
              </label>
              <Input
                id="date"
                type="date"
                value={currentItem?.date?.split("T")[0] || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem!,
                    date: e.target.value || null,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Textarea
                id="description"
                value={currentItem?.description || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem!,
                    description: e.target.value || null,
                  })
                }
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="referenceLink" className="text-right">
                Reference Link
              </label>
              <Input
                id="referenceLink"
                value={currentItem?.referenceLink || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem!,
                    referenceLink: e.target.value || null,
                  })
                }
                className="col-span-3"
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#002169] hover:bg-[#156082]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
