import { MODES, posFromEvent } from "@/lib/dental-chart-utils"
import { useCanvasStore } from "@/stores/use-canvas-store"
import { useCallback } from "react"

export const useCanvasHandlers = (canvasRef, snapshot, setOffset, dragOffset) => { 

    const { activeMode, zoom, offset, isDrawing, setIsDrawing, brushSize, drawColor } = useCanvasStore();
     
    // الضغط بالماوس (يبدأ الرسم أو التحريك)
    const handlePointerDown = useCallback((e) => {
        if (activeMode === MODES.DRAW) {
        setIsDrawing(true)
        snapshot()
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        const { x, y } = posFromEvent(e, offset, canvasRef, zoom)
        ctx.beginPath()
        ctx.moveTo(x, y)
        } else if (activeMode === MODES.PAN) {
        setIsDrawing(true)
        const { x, y } = posFromEvent(e, offset, canvasRef, zoom)
        dragOffset.current = { dx: x * zoom - offset.x, dy: y * zoom - offset.y }
        }
    }, [activeMode, snapshot, offset, zoom, canvasRef, dragOffset, setIsDrawing],
    )
    
    // التحريك بالماوس
    const handlePointerMove = useCallback((e) => {
        if (activeMode === MODES.DRAW && isDrawing) {
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        const { x, y } = posFromEvent(e, offset, canvasRef, zoom)
        ctx.lineTo(x, y)
        ctx.strokeStyle = drawColor
        ctx.lineWidth = brushSize
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
        } else if (activeMode === MODES.PAN && isDrawing) {
        const { x, y } = posFromEvent(e, offset, canvasRef, zoom)
        const newOffset = {
            x: x * zoom - dragOffset.current.dx,
            y: y * zoom - dragOffset.current.dy,
        }
        setOffset(newOffset)
        }
    }, [activeMode, isDrawing, drawColor, brushSize, zoom, canvasRef, dragOffset, offset, setOffset],
    )
    
    // رفع الماوس → إنهاء الرسم/التحريك
    const handlePointerUp = useCallback(() => {
    setIsDrawing(false)
    }, [setIsDrawing])

    return {handlePointerDown, handlePointerMove, handlePointerUp}
 }