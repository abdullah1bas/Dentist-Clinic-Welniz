
import { forwardRef, useEffect, useRef, useImperativeHandle } from "react"

export const DentalChartCanvas = forwardRef(
  ({ selectedTool, onClick, teethConditions, onTeethConditionChange }, ref) => {
    const canvasRef = useRef(null)
    const backgroundImageRef = useRef(null)

    useImperativeHandle(ref, () => canvasRef.current, [])

    useEffect(() => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      // Set canvas size
      canvas.width = 1000
      canvas.height = 600

      // Load and draw the fixed dental chart background
      const img = new Image()
      img.onload = () => {
        backgroundImageRef.current = img
        drawBackground()
      }
      img.onerror = () => {
        // If SVG fails to load, draw a simple dental chart
        drawSimpleDentalChart()
      }
      img.src = "/dental-chart.svg"

      const drawBackground = () => {
        if (!backgroundImageRef.current) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw white background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw the dental chart with better visibility
        ctx.globalAlpha = 0.9
        ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1.0

        // Add grid overlay for better annotation
        drawGrid()
      }

      const drawSimpleDentalChart = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw white background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw simple dental chart representation
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 2

        // Upper jaw
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2 - 100, 200, 0, Math.PI)
        ctx.stroke()

        // Lower jaw
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2 + 100, 200, Math.PI, 2 * Math.PI)
        ctx.stroke()

        // Draw teeth positions
        drawTeethPositions()
        drawGrid()
      }

      const drawTeethPositions = () => {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Upper teeth
        for (let i = 0; i < 16; i++) {
          const angle = (i * Math.PI) / 15 - Math.PI / 2
          const x = centerX + Math.cos(angle) * 180
          const y = centerY - 100 + Math.sin(angle) * 180

          ctx.fillStyle = "#e5e7eb"
          ctx.beginPath()
          ctx.arc(x, y, 12, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()
        }

        // Lower teeth
        for (let i = 0; i < 16; i++) {
          const angle = (i * Math.PI) / 15 + Math.PI / 2
          const x = centerX + Math.cos(angle) * 180
          const y = centerY + 100 + Math.sin(angle) * 180

          ctx.fillStyle = "#e5e7eb"
          ctx.beginPath()
          ctx.arc(x, y, 12, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()
        }
      }

      const drawGrid = () => {
        ctx.strokeStyle = "#f3f4f6"
        ctx.lineWidth = 0.5
        ctx.setLineDash([2, 2])

        // Draw vertical lines
        for (let x = 0; x <= canvas.width; x += 50) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }

        // Draw horizontal lines
        for (let y = 0; y <= canvas.height; y += 50) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }

        ctx.setLineDash([])
      }

      // Try to load SVG first, fallback to simple chart
      drawSimpleDentalChart()
    }, [])

    const handleCanvasClick = (event) => {
      if (onClick) {
        onClick(event)
      }
    }

    return (
      <div className="relative border rounded-lg overflow-hidden bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          className="w-full h-auto cursor-crosshair"
          onClick={handleCanvasClick}
          style={{ maxHeight: "500px" }}
        />
        <div className="absolute top-2 left-2 bg-white/90 p-2 rounded text-xs text-gray-600">
          انقر لإضافة ملاحظة • الأداة المحددة: {selectedTool}
        </div>
      </div>
    )
  },
)

DentalChartCanvas.displayName = "DentalChartCanvas"
