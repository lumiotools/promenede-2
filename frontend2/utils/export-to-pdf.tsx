"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportOptions {
  title?: string;
  author?: string;
  subject?: string;
  companyName?: string;
  selectedSections?: string[];
}

export async function exportToPDF(options: ExportOptions = {}) {
  try {
    // Create a new PDF document in landscape orientation (16:9 aspect ratio)
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Set document properties
    if (options.title) pdf.setProperties({ title: options.title });
    if (options.author) pdf.setProperties({ author: options.author });
    if (options.subject) pdf.setProperties({ subject: options.subject });

    // Get all sections or only selected sections
    const allSections = document.querySelectorAll("section[id]");
    const sections = options.selectedSections
      ? Array.from(allSections).filter((section) =>
          options.selectedSections?.includes(section.getAttribute("id") || "")
        )
      : allSections;

    // PDF dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Get sidebar and main content elements
    const sidebar = document.querySelector(".sidebar") as HTMLElement;
    const mainContent = document.querySelector("main") as HTMLElement;

    // Store original styles to restore later
    const originalSidebarDisplay = sidebar ? sidebar.style.display : "";
    const originalMainWidth = mainContent ? mainContent.style.width : "";
    const originalMainPadding = mainContent ? mainContent.style.padding : "";
    const originalMainOverflow = mainContent ? mainContent.style.overflow : "";

    // Temporarily hide sidebar and adjust main content for full screen capture
    if (sidebar) sidebar.style.display = "none";
    if (mainContent) {
      mainContent.style.width = "100vw";
      mainContent.style.padding = "0";
      mainContent.style.overflow = "visible";
    }

    // For each section, create a page
    let isFirstPage = true;

    for (const section of sections) {
      try {
        // If not the first page, add a new page
        if (!isFirstPage) {
          pdf.addPage("a4", "landscape");
        } else {
          isFirstPage = false;
        }

        // Store original section styles
        const originalDisplay = (section as HTMLElement).style.display;
        const originalWidth = (section as HTMLElement).style.width;
        const originalHeight = (section as HTMLElement).style.height;
        const originalPosition = (section as HTMLElement).style.position;
        const originalOverflow = (section as HTMLElement).style.overflow;
        const originalPadding = (section as HTMLElement).style.padding;
        const originalMargin = (section as HTMLElement).style.margin;
        const originalBorder = (section as HTMLElement).style.border;

        // Temporarily modify section for full screen capture
        // Force 16:9 aspect ratio
        const aspectRatio = 16 / 9;
        const sectionWidth = window.innerWidth;
        const sectionHeight = sectionWidth / aspectRatio;

        // Apply styles for full screen capture
        (section as HTMLElement).style.display = "block";
        (section as HTMLElement).style.width = `${sectionWidth}px`;
        (section as HTMLElement).style.height = `${sectionHeight}px`;
        (section as HTMLElement).style.position = "relative";
        (section as HTMLElement).style.overflow = "visible";
        (section as HTMLElement).style.padding = "0";
        (section as HTMLElement).style.margin = "0";
        (section as HTMLElement).style.border = "none";

        // Expand all card elements to fit content
        const cards = section.querySelectorAll(
          ".card"
        ) as NodeListOf<HTMLElement>;
        const originalCardWidths: string[] = [];
        const originalCardHeights: string[] = [];
        const originalCardPaddings: string[] = [];
        const originalCardMargins: string[] = [];

        cards.forEach((card) => {
          originalCardWidths.push(card.style.width);
          originalCardHeights.push(card.style.height);
          originalCardPaddings.push(card.style.padding);
          originalCardMargins.push(card.style.margin);

          card.style.width = "100%";
          card.style.height = "auto";
          card.style.padding = "0";
          card.style.margin = "0";
        });

        // Capture section as image
        const canvas = await html2canvas(section as HTMLElement, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: null, // Transparent background
          width: sectionWidth,
          height: sectionHeight,
          windowWidth: sectionWidth,
          windowHeight: sectionHeight,
        });

        // Restore original section styles
        (section as HTMLElement).style.display = originalDisplay;
        (section as HTMLElement).style.width = originalWidth;
        (section as HTMLElement).style.height = originalHeight;
        (section as HTMLElement).style.position = originalPosition;
        (section as HTMLElement).style.overflow = originalOverflow;
        (section as HTMLElement).style.padding = originalPadding;
        (section as HTMLElement).style.margin = originalMargin;
        (section as HTMLElement).style.border = originalBorder;

        // Restore card styles
        cards.forEach((card, index) => {
          card.style.width = originalCardWidths[index];
          card.style.height = originalCardHeights[index];
          card.style.padding = originalCardPaddings[index];
          card.style.margin = originalCardMargins[index];
        });

        // Convert canvas to image data
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // Add image to page - fit exactly to page dimensions with no margins
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
      } catch (error) {
        console.error("Error processing section:", error);
      }
    }

    // Restore original styles
    if (sidebar) sidebar.style.display = originalSidebarDisplay;
    if (mainContent) {
      mainContent.style.width = originalMainWidth;
      mainContent.style.padding = originalMainPadding;
      mainContent.style.overflow = originalMainOverflow;
    }

    // Save the PDF
    pdf.save(
      `Promenade-Report-${options.companyName ?? "Company"}-${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}
