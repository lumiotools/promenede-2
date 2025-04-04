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
    // Create a PDF with exact 16:9 dimensions
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 167], // Exact 16:9 ratio (297mm width)
    });

    // Set document properties
    if (options.title) pdf.setProperties({ title: options.title });
    if (options.author) pdf.setProperties({ author: options.author });
    if (options.subject) pdf.setProperties({ subject: options.subject });

    // Store original body styles
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const originalHeight = document.body.style.height;
    const originalBackground = document.body.style.background;

    // Get all sections or only selected sections
    const allSections = document.querySelectorAll("section[id]");
    const sections = options.selectedSections
      ? Array.from(allSections).filter((section) =>
          options.selectedSections?.includes(section.getAttribute("id") || "")
        )
      : Array.from(allSections);

    // Store all original section styles
    const originalStyles = new Map();
    sections.forEach((section) => {
      const el = section as HTMLElement;
      originalStyles.set(el, {
        display: el.style.display,
        visibility: el.style.visibility,
        position: el.style.position,
        width: el.style.width,
        height: el.style.height,
        margin: el.style.margin,
        padding: el.style.padding,
        background: el.style.background,
        overflow: el.style.overflow,
        zIndex: el.style.zIndex,
      });
    });

    // Hide all sections initially
    sections.forEach((section) => {
      const el = section as HTMLElement;
      el.style.display = "none";
    });

    // PDF dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // For monitoring progress
    let processedCount = 0;
    const totalSections = sections.length;

    // Set body for capture
    document.body.style.overflow = "hidden";
    document.body.style.position = "relative";
    document.body.style.width = "100vw";
    document.body.style.height = "100vh";
    document.body.style.background = "white";

    // Process each section sequentially with proper waiting
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i] as HTMLElement;
      const sectionId = section.id || `section-${i}`;

      try {
        // Add a new page for each section except the first
        if (i > 0) {
          pdf.addPage([297, 167], "landscape");
        }

        console.log(
          `Processing section ${i + 1}/${sections.length}: ${sectionId}`
        );

        // Hide all sections and only show current one
        sections.forEach((s) => {
          (s as HTMLElement).style.display = "none";
        });

        // Prepare the section for capture
        section.style.display = "block";
        section.style.visibility = "visible";
        section.style.position = "absolute";
        section.style.top = "0";
        section.style.left = "0";
        section.style.width = "100vw";
        section.style.height = "100vh";
        section.style.margin = "0";
        section.style.padding = "0";
        section.style.background = "white";
        section.style.overflow = "hidden";
        section.style.zIndex = "9999";

        // Force layout recalculation
        void section.offsetHeight;

        // Wait for layout and any potential animations/transitions
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Render all charts and images completely
        const chartsAndImages = section.querySelectorAll("canvas, img, svg");
        // Ensure all images are loaded
        await Promise.all(
          Array.from(chartsAndImages).map((el) => {
            if (el.tagName.toLowerCase() === "img") {
              const img = el as HTMLImageElement;
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if image fails
              });
            }
            return Promise.resolve();
          })
        );

        // Wait a bit more for any dynamic content
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Take screenshot
        const canvas = await html2canvas(section, {
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          backgroundColor: "white",
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          width: window.innerWidth,
          height: window.innerHeight,
          // Crucial for rendering all elements including charts
          onclone: (clonedDoc) => {
            const clonedSection = clonedDoc.getElementById(sectionId);
            if (clonedSection) {
              const el = clonedSection as HTMLElement;
              el.style.display = "block";
              el.style.visibility = "visible";
              el.style.position = "absolute";
              el.style.top = "0";
              el.style.left = "0";
              el.style.width = "100vw";
              el.style.height = "100vh";
              el.style.margin = "0";
              el.style.padding = "0";
              el.style.background = "white";
              el.style.overflow = "visible"; // Allow overflow during capture
              el.style.zIndex = "9999";
              el.style.transform = "none";

              // Make sure all elements inside are visible
              Array.from(el.querySelectorAll("*")).forEach((child: Element) => {
                (child as HTMLElement).style.visibility = "visible";
                (child as HTMLElement).style.opacity = "1";
              });

              // Fix for body
              clonedDoc.body.style.margin = "0";
              clonedDoc.body.style.padding = "0";
              clonedDoc.body.style.overflow = "hidden";
              clonedDoc.body.style.background = "white";

              // Make sure charts and graphs are captured
              const charts = el.querySelectorAll("canvas, svg");
              charts.forEach((chart) => {
                (chart as HTMLElement).style.display = "block";
                (chart as HTMLElement).style.visibility = "visible";
                (chart as HTMLElement).style.opacity = "1";
              });
            }
          },
        });

        // Add to PDF - fill entire page
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);

        processedCount++;
        console.log(`Completed ${processedCount}/${totalSections} sections`);
      } catch (error) {
        console.error(`Error processing section ${sectionId}:`, error);
      } finally {
        // Restore section to original state
        if (originalStyles.has(section)) {
          const origStyle = originalStyles.get(section);
          Object.keys(origStyle).forEach((key) => {
            section.style[key as any] = origStyle[key];
          });
        }
      }
    }

    // Restore all sections to original state
    sections.forEach((section) => {
      const el = section as HTMLElement;
      if (originalStyles.has(el)) {
        const origStyle = originalStyles.get(el);
        Object.keys(origStyle).forEach((key) => {
          el.style[key as any] = origStyle[key];
        });
      }
    });

    // Restore body to original state
    document.body.style.overflow = originalOverflow;
    document.body.style.position = originalPosition;
    document.body.style.width = originalWidth;
    document.body.style.height = originalHeight;
    document.body.style.background = originalBackground;

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
