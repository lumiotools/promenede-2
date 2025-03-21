"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportOptions {
  title?: string;
  author?: string;
  subject?: string;
}

export async function exportToPDF(options: ExportOptions = {}) {
  try {
    // Create a new PDF document in landscape orientation
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Set document properties
    if (options.title) pdf.setProperties({ title: options.title });
    if (options.author) pdf.setProperties({ author: options.author });
    if (options.subject) pdf.setProperties({ subject: options.subject });

    // Get all sections
    const sections = document.querySelectorAll("section[id]");

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

    // Temporarily hide sidebar and expand main content
    if (sidebar) sidebar.style.display = "none";
    if (mainContent) {
      mainContent.style.width = "100vw";
      mainContent.style.padding = "0";
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

        // Get section title for header
        const sectionId = section.getAttribute("id") || "";
        const sectionTitle =
          section.querySelector("h2")?.textContent || sectionId;

        // Store original section styles
        const originalWidth = (section as HTMLElement).style.width;
        const originalPosition = (section as HTMLElement).style.position;
        const originalOverflow = (section as HTMLElement).style.overflow;
        const originalPadding = (section as HTMLElement).style.padding;

        // Temporarily modify section for better capture
        (section as HTMLElement).style.width = "100vw";
        (section as HTMLElement).style.position = "relative";
        (section as HTMLElement).style.overflow = "visible";
        (section as HTMLElement).style.padding = "20px";

        // Expand all card elements to full width
        const cards = section.querySelectorAll(
          ".card"
        ) as NodeListOf<HTMLElement>;
        const originalCardWidths: string[] = [];

        cards.forEach((card) => {
          originalCardWidths.push(card.style.width);
          card.style.width = "100%";
        });

        // Capture section as image
        const canvas = await html2canvas(section as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#f7f9f9",
          width: window.innerWidth,
          height: (section as HTMLElement).scrollHeight,
          windowWidth: window.innerWidth,
          windowHeight: (section as HTMLElement).scrollHeight,
        });

        // Restore original styles
        (section as HTMLElement).style.width = originalWidth;
        (section as HTMLElement).style.position = originalPosition;
        (section as HTMLElement).style.overflow = originalOverflow;
        (section as HTMLElement).style.padding = originalPadding;

        // Restore card widths
        cards.forEach((card, index) => {
          card.style.width = originalCardWidths[index];
        });

        // Convert canvas to image data
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // Calculate dimensions to fit the page
        const imgWidth = pageWidth - 10; // 5mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add section title as header
        pdf.setFontSize(16);
        pdf.setTextColor(53, 69, 76); // #35454c
        pdf.text(sectionTitle, 5, 10);

        // Add image to page
        const xPos = 5; // 5mm from left
        const yPos = 15; // Below the header

        // If image is too tall, scale it to fit
        if (imgHeight > pageHeight - 25) {
          const scaleFactor = (pageHeight - 25) / imgHeight;
          pdf.addImage(
            imgData,
            "JPEG",
            xPos,
            yPos,
            imgWidth * scaleFactor,
            imgHeight * scaleFactor
          );
        } else {
          pdf.addImage(imgData, "JPEG", xPos, yPos, imgWidth, imgHeight);
        }

        // Add page number
        const pageNum = pdf.getCurrentPageInfo().pageNumber;
        pdf.setFontSize(10);
        pdf.setTextColor(128, 151, 162); // #8097a2
        pdf.text(`Page ${pageNum}`, pageWidth - 15, pageHeight - 5);
      } catch (error) {
        console.error("Error processing section:", error);
        pdf.setFontSize(12);
        pdf.setTextColor(211, 82, 48); // #d35230
        pdf.text("Error capturing this section", 10, 50);
      }
    }

    // Restore original styles
    if (sidebar) sidebar.style.display = originalSidebarDisplay;
    if (mainContent) {
      mainContent.style.width = originalMainWidth;
      mainContent.style.padding = originalMainPadding;
    }

    // Save the PDF
    pdf.save(`Promenade-Report-${new Date().toISOString().split("T")[0]}.pdf`);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}
