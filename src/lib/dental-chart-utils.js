export const uid = () => Math.random().toString(36).slice(2, 9)

export const createFallbackSvg = () => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <defs>
        <pattern id='g' width='20' height='20' patternUnits='userSpaceOnUse'>
          <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#ddd' stroke-width='1'/>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='white'/>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='20'>
        ضع صورة مخطط الأسنان أو استخدم الزر بالأسفل
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

export const exportCanvasToPNG = async (canvasRef, overlayRef, filename = "dental-chart") => {
  const canvas = canvasRef.current
  const svg = overlayRef.current
  if (!canvas || !svg) return

  try {
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)
    const svgImg = new Image()

    await new Promise((resolve) => {
      svgImg.onload = resolve
      svgImg.src = svgUrl
    })

    const outputCanvas = document.createElement("canvas")
    outputCanvas.width = canvas.width
    outputCanvas.height = canvas.height
    const ctx = outputCanvas.getContext("2d")

    ctx.drawImage(canvas, 0, 0)
    ctx.drawImage(svgImg, 0, 0)

    const link = document.createElement("a")
    link.download = `${filename}-${Date.now()}.png`
    link.href = outputCanvas.toDataURL("image/png")
    link.click()

    URL.revokeObjectURL(svgUrl)
  } catch (error) {
    console.error("Export failed:", error)
  }
}

// event helper → يجيب مكان الماوس بالنسبة للكانفاس
export const posFromEvent = (e , offset, canvasRef, zoom) => {
  const canvas = canvasRef?.current;
  if (!canvas) return { x: 0, y: 0 };
  
  const rect = canvas.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
  
  // حساب نسبة القياس بناءً على الحجم الحقيقي والعرض المعروض
  // safety: avoid division by zero
  const scaleX = canvas.width / Math.max(rect.width, 1);
  const scaleY = canvas.height / Math.max(rect.height, 1);

  // support touch events too
  const clientX = (e?.clientX ?? (e?.touches?.[0]?.clientX)) ?? 0;
  const clientY = (e?.clientY ?? (e?.touches?.[0]?.clientY)) ?? 0;

  const x = ((clientX - rect.left - (offset?.x ?? 0)) * scaleX) / Math.max(zoom, 0.0001);
  const y = ((clientY - rect.top - (offset?.y ?? 0)) * scaleY) / Math.max(zoom, 0.0001);
  
  if (!isFinite(x) || !isFinite(y)) return { x: 0, y: 0 };
  return { x, y };
};

export const MODES = { DRAW: "draw", NOTE: "note", PAN: "pan" };
export const CANVAS_SIZE = { width: 1000, height: 700 };