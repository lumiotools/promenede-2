"use client"

import { useEffect, useRef } from "react"

interface BarChartProps {
  data: {
    labels: string[]
    values: number[]
  }
  height?: number
  width?: number
  color?: string
  yAxisLabel?: string
  maxValue?: number
}

export function BarChart({ 
  data, 
  height = 200, 
  width = 400,
  color = "#002169",
  yAxisLabel = "USD (billion)",
  maxValue
}: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set dimensions
    const padding = { top: 20, right: 20, bottom: 40, left: 60 }
    const chartWidth = canvas.width - padding.left - padding.right
    const chartHeight = canvas.height - padding.top - padding.bottom
    
    // Find max value for scaling
    const calculatedMaxValue = maxValue || Math.max(...data.values) * 1.2
    
    // Draw y-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, canvas.height - padding.bottom)
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()
    
    // Draw x-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, canvas.height - padding.bottom)
    ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom)
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()
    
    // Draw y-axis labels
    const yAxisSteps = 5
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = (calculatedMaxValue / yAxisSteps) * i
      const y = canvas.height - padding.bottom - (i / yAxisSteps) * chartHeight
      
      // Draw grid line
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(canvas.width - padding.right, y)
      ctx.strokeStyle = "#f2f4f7"
      ctx.stroke()
      
      // Draw label
      ctx.fillStyle = "#475467"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      ctx.fillText(value.toFixed(0), padding.left - 5, y + 3)
    }
    
    // Draw y-axis label
    ctx.save()
    ctx.translate(15, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = "#475467"
    ctx.font = "11px Arial"
    ctx.textAlign = "center"
    ctx.fillText(yAxisLabel, 0, 0)
    ctx.restore()
    
    // Draw bars
    const barWidth = (chartWidth / data.labels.length) * 0.6
    const barSpacing = (chartWidth / data.labels.length) * 0.4
    
    data.values.forEach((value, index) => {
      const barHeight = (value / calculatedMaxValue) * chartHeight
      const x = padding.left + (index * (barWidth + barSpacing)) + barSpacing / 2
      const y = canvas.height - padding.bottom - barHeight
      
      // Draw bar
      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // Draw label
      ctx.fillStyle = "#475467"
      ctx.font = "11px Arial"
      ctx.textAlign = "center"
      ctx.fillText(data.labels[index], x + barWidth / 2, canvas.height - padding.bottom + 15)
    })
    
    // Draw "Year" label at the bottom
    ctx.fillStyle = "#475467"
    ctx.font = "11px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Year", canvas.width - padding.right - 20, canvas.height - 10)
    
  }, [data, height, width, color, yAxisLabel, maxValue])
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      className="w-full h-auto"
    />
  )
}
