
import { useState, useCallback } from "react"

export const useCanvasDrawing = (canvasRef, bgImageRef, size, offset, zoom) => {
  const [history, setHistory] = useState([])

  const drawBase = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    canvas.width = size.width
    canvas.height = size.height

    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size.width / zoom, size.height / zoom)

    const img = bgImageRef.current
    if (img) {
      const scale = Math.min(size.width / img.width, size.height / img.height) * zoom
      const iw = img.width * scale
      const ih = img.height * scale
      const ix = (size.width - iw) / 2 / zoom
      const iy = (size.height - ih) / 2 / zoom

      ctx.imageSmoothingEnabled = true
      ctx.drawImage(img, ix, iy, iw, ih)
    }

    ctx.restore()
  }, [canvasRef, bgImageRef, size, offset, zoom])

  const snapshot = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setHistory((prev) => [...prev.slice(-9), data])
    } catch (error) {
      console.warn("Failed to create snapshot:", error)
    }
  }, [canvasRef])

  const restore = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || history.length === 0) return

    setHistory((prev) => {
      const newHistory = prev.slice(0, -1)
      const lastSnapshot = prev[prev.length - 1]

      drawBase()
      ctx.putImageData(lastSnapshot, offset.x, offset.y)

      return newHistory
    })
  }, [canvasRef, history, drawBase, offset])

  const clearDrawing = useCallback(() => {
    drawBase()
    setHistory([])
  }, [drawBase])

  return { drawBase, snapshot, restore, clearDrawing, canUndo: history.length > 0 }
}
