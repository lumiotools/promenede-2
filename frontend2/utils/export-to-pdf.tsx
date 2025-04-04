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
    if (options.title) pdf.setProperties({ title: options.title })
    if (options.author) pdf.setProperties({ author: options.author })
    if (options.subject) pdf.setProperties({ subject: options.subject })

    // Get all sections or only selected sections
    const allSections = document.querySelectorAll("section[id]")
    const sections = options.selectedSections
      ? Array.from(allSections).filter((section) =>
          options.selectedSections?.includes(section.getAttribute("id") || ""),
        )
      : allSections

    // PDF dimensions
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Get sidebar and main content elements
    const sidebar = document.querySelector(".sidebar") as HTMLElement
    const mainContent = document.querySelector("main") as HTMLElement

    // Store original styles to restore later
    const originalSidebarDisplay = sidebar ? sidebar.style.display : ""
    const originalMainWidth = mainContent ? mainContent.style.width : ""
    const originalMainPadding = mainContent ? mainContent.style.padding : ""

    // Temporarily hide sidebar and expand main content
    if (sidebar) sidebar.style.display = "none"
    if (mainContent) {
      mainContent.style.width = "100vw"
      mainContent.style.padding = "0"
    }

    // For each section, create a page
    let isFirstPage = true

    for (const section of sections) {
      try {
        // If not the first page, add a new page
        if (!isFirstPage) {
          pdf.addPage([297, 167], "landscape")
        } else {
          isFirstPage = false
        }

        // Get section title for header
        const sectionId = section.getAttribute("id") || ""
        const sectionTitle =
          section.querySelector("h2")?.textContent || section.querySelector("h1")?.textContent || sectionId

        // Store original section styles
        const originalWidth = (section as HTMLElement).style.width
        const originalPosition = (section as HTMLElement).style.position
        const originalOverflow = (section as HTMLElement).style.overflow
        const originalPadding = (section as HTMLElement).style.padding

        // Temporarily modify section for better capture
        ;(section as HTMLElement).style.width = "100vw"
        ;(section as HTMLElement).style.position = "relative"
        ;(section as HTMLElement).style.overflow = "visible"
        ;(section as HTMLElement).style.padding = "20px"
        ;(section as HTMLElement).style.backgroundColor = "white"

        // Expand all card elements to full width
        const cards = section.querySelectorAll(".card") as NodeListOf<HTMLElement>
        const originalCardWidths: string[] = []

        cards.forEach((card) => {
          originalCardWidths.push(card.style.width)
          card.style.width = "100%"
        })

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
        })

        // Restore original styles
        ;(section as HTMLElement).style.width = originalWidth
        ;(section as HTMLElement).style.position = originalPosition
        ;(section as HTMLElement).style.overflow = originalOverflow
        ;(section as HTMLElement).style.padding = originalPadding

        // Restore card widths
        cards.forEach((card, index) => {
          card.style.width = originalCardWidths[index]
        })
        // Convert canvas to image data
        const imgData = canvas.toDataURL("image/jpeg", 1.0)

        // Get dimensions and aspect ratios
        const canvasAspectRatio = canvas.width / canvas.height
        const pageAspectRatio = pageWidth / pageHeight
        
        // Use a fixed margin percentage that's smaller
        const marginPercent = 0.02 // 2% margin instead of 5%
        const margin = Math.min(pageWidth, pageHeight) * marginPercent
        
        // Calculate dimensions with minimal scaling
        let xPos = margin
        let yPos = margin
        let finalWidth = pageWidth - (margin * 2)
        let finalHeight = finalWidth / canvasAspectRatio
        
        // Check if the height exceeds the page
        if (finalHeight > (pageHeight - (margin * 2))) {
            // Adjust based on height constraints
            finalHeight = pageHeight - (margin * 2)
            finalWidth = finalHeight * canvasAspectRatio
            // Center horizontally
            xPos = (pageWidth - finalWidth) / 2
        }
        
        // Ensure we're using at least 95% of available page space
        const minScale = 0.95
        const currentScale = Math.min(
            finalWidth / (pageWidth - (margin * 2)),
            finalHeight / (pageHeight - (margin * 2))
        )
        
        if (currentScale < minScale) {
            // Increase dimensions to use more space
            const scaleFactor = minScale / currentScale
            finalWidth *= scaleFactor
            finalHeight *= scaleFactor
            // Recenter
            xPos = (pageWidth - finalWidth) / 2
            yPos = (pageHeight - finalHeight) / 2
        }
        
        // Add the image with calculated dimensions and position
        pdf.addImage(imgData, "JPEG", xPos, yPos, finalWidth, finalHeight)

        // Add page number
        const pageNum = pdf.getCurrentPageInfo().pageNumber
        pdf.setFontSize(10)
        pdf.setTextColor(128, 151, 162) // #8097a2
        pdf.text(`Page ${pageNum}`, pageWidth - 15, pageHeight - 5)
      } catch (error) {
        console.error("Error processing section:", error)
        pdf.setFontSize(12)
        pdf.setTextColor(211, 82, 48) // #d35230
        pdf.text("Error capturing this section", 10, 50)
      }
    }

    // Restore original styles
    if (sidebar) sidebar.style.display = originalSidebarDisplay
    if (mainContent) {
      mainContent.style.width = originalMainWidth
      mainContent.style.padding = originalMainPadding
    }

    // Save the PDF
    pdf.save(`Promenade-Report-${options.companyName ?? "Company"}-${new Date().toISOString().split("T")[0]}.pdf`)

    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    return false
  }
}

