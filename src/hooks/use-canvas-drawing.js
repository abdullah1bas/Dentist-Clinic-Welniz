
import { useState, useCallback } from "react"

// hook مسئول عن رسم الكانفاس والخلفية
export const useCanvasDrawing = (canvasRef, bgImageRef, offset, zoom) => {
  const [history, setHistory] = useState([])

  // رسم الخلفية + أي محتوى موجود
  const drawBase = useCallback(() => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  // الحفاظ على الأبعاد الأصلية للكانفاس
  canvas.width = 1000;
  canvas.height = 700;
  
  ctx.save();
  ctx.translate(offset.x, offset.y);
  ctx.scale(zoom, zoom);
  
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1000 / zoom, 700 / zoom);
  
  const img = bgImageRef.current;
  if (img) {
    const scale = Math.min(1000 / img.width, 700 / img.height) * zoom;
    const iw = img.width * scale;
    const ih = img.height * scale;
    const ix = (1000 - iw) / 2 / zoom;
    const iy = (700 - ih) / 2 / zoom;
    
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, ix, iy, iw, ih);
  }
  
  ctx.restore();
}, [canvasRef, bgImageRef, offset, zoom]);

  // snapshot للحفظ في history عشان التراجع
  const snapshot = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setHistory((prev) => [...prev.slice(-9), data]) // احتفاظ بآخر 10 خطوات
    } catch (error) {
      console.warn("Failed to create snapshot:", error)
    }
  }, [canvasRef])

  // استرجاع آخر خطوة (undo)
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

  // مسح الرسم
  const clearDrawing = useCallback(() => {
    drawBase()
    setHistory([])
  }, [drawBase])

  return { drawBase, snapshot, restore, clearDrawing, canUndo: history.length > 0 }
}
