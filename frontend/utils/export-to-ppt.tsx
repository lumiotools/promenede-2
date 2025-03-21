"use client"

import pptxgen from "pptxgenjs"

interface ExportOptions {
  title?: string
  author?: string
  company?: string
}

export async function exportToPowerPoint(options: ExportOptions = {}) {
  // Create a new PowerPoint presentation
  const pptx = new pptxgen()

  // Set presentation properties
  pptx.layout = "LAYOUT_16x9"
  if (options.title) pptx.title = options.title
  if (options.author) pptx.author = options.author
  if (options.company) pptx.company = options.company

  // Get all sections
  const sections = document.querySelectorAll("section[id]")

  // For each section, create a slide
  for (const section of sections) {
    const sectionId = section.getAttribute("id") || ""
    const sectionTitle = section.querySelector("h2")?.textContent || sectionId

    // Create a new slide
    const slide = pptx.addSlide()

    // Add title
    slide.addText(sectionTitle, {
      x: 0.5,
      y: 0.5,
      w: "90%",
      fontSize: 24,
      bold: true,
      color: "35454C",
    })

    try {
      // Capture section as image
      const canvas = await html2canvas(section as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f7f9f9",
        x: 0,
        y: 0,
        width: section.clientWidth,
        height: section.clientHeight,
        windowWidth: section.clientWidth,
        windowHeight: section.clientHeight,
      })

      // Convert canvas to base64 image
      const imgData = canvas.toDataURL("image/png")

      // Add image to slide (position below title)
      slide.addImage({
        data: imgData,
        x: 0.5,
        y: 1.2,
        w: "90%",
        h: "80%",
      })
    } catch (error) {
      console.error("Error capturing section:", error)

      // Add error text if image capture fails
      slide.addText("Error capturing section content", {
        x: 0.5,
        y: 2,
        fontSize: 14,
        color: "FF0000",
      })
    }
  }

  // Save the presentation
  pptx.writeFile({ fileName: `Promenade-Report-${new Date().toISOString().split("T")[0]}.pptx` })
}

// This function is a placeholder for the html2canvas library
// In a real implementation, you would import the actual html2canvas library
async function html2canvas(element: HTMLElement, options: any): Promise<HTMLCanvasElement> {
  // This is just a placeholder - in a real implementation, you would use the actual html2canvas library
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    canvas.width = element.clientWidth * (options.scale || 1)
    canvas.height = element.clientHeight * (options.scale || 1)
    resolve(canvas)
  })
}

