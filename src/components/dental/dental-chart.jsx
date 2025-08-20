
import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { CANVAS_SIZE, DrawingCanvas } from "./dental-annotated/drawing-canvas"
import { useCanvasDrawing } from "@/hooks/use-canvas-drawing"
import { NoteDialog } from "./dental-annotated/note-dialog"
import { MODES } from "./dental-annotated/mode-selector"
import { createFallbackSvg, exportCanvasToPNG, uid } from "@/lib/dental-chart-utils"
import { DentalChartHeader } from "./dental-annotated/dental-chart-header"
import { DentalChartToolbar } from "./dental-annotated/dental-chart-toolbar"
import { DentalChartStats } from "./dental-annotated/dental-chart-stats"


export default function DentalChartPage() {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const bgImageRef = useRef(null)
  const dragOffset = useRef({ dx: 0, dy: 0 })

  // Patient data
  const [selectedPatient, setSelectedPatient] = useState(null)

  // Canvas state
  const [bgUrl, setBgUrl] = useState("/dental-chart.svg")
  const [notes, setNotes] = useState([])
  const [activeMode, setActiveMode] = useState(MODES.DRAW)
  const [color, setColor] = useState("#0ea5e9")
  const [brushSize, setBrushSize] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Note dialog state
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [noteDraft, setNoteDraft] = useState("")
  const [noteColor, setNoteColor] = useState("#fef9c3")
  const [dblPoint, setDblPoint] = useState(null)
  const [draggingNoteId, setDraggingNoteId] = useState(null)

  const { drawBase, snapshot, restore, clearDrawing, canUndo } = useCanvasDrawing(
    canvasRef,
    bgImageRef,
    CANVAS_SIZE,
    offset,
    zoom,
  )

  // Load patient data
  useEffect(() => {
    const patientData = localStorage.getItem("selectedPatient")
    if (patientData) {
      try {
        setSelectedPatient(JSON.parse(patientData))
      } catch (error) {
        console.error("Error parsing patient data:", error)
      }
    }
  }, [])

  // Load background image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      bgImageRef.current = img
      drawBase()
    }
    img.onerror = () => {
      const fallbackImg = new Image()
      fallbackImg.onload = () => {
        bgImageRef.current = fallbackImg
        drawBase()
      }
      fallbackImg.src = createFallbackSvg()
    }
    img.src = bgUrl
  }, [bgUrl, drawBase])

  // Event handlers
  const posFromEvent = useCallback(
    (e) => {
      const rect = e.target.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left - offset.x) / zoom,
        y: (e.clientY - rect.top - offset.y) / zoom,
      }
    },
    [offset, zoom],
  )

  const handlePointerDown = useCallback(
    (e) => {
      if (activeMode === MODES.DRAW) {
        setIsDrawing(true)
        snapshot()
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        const { x, y } = posFromEvent(e)
        ctx.beginPath()
        ctx.moveTo(x, y)
      } else if (activeMode === MODES.PAN) {
        setIsDrawing(true)
        const { x, y } = posFromEvent(e)
        dragOffset.current = { dx: x * zoom - offset.x, dy: y * zoom - offset.y }
      }
    },
    [activeMode, posFromEvent, snapshot, offset, zoom],
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (activeMode === MODES.DRAW && isDrawing) {
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        const { x, y } = posFromEvent(e)
        ctx.lineTo(x, y)
        ctx.strokeStyle = color
        ctx.lineWidth = brushSize
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      } else if (activeMode === MODES.PAN && isDrawing) {
        const { x, y } = posFromEvent(e)
        const newOffset = {
          x: x * zoom - dragOffset.current.dx,
          y: y * zoom - dragOffset.current.dy,
        }
        setOffset(newOffset)
      }
    },
    [activeMode, isDrawing, posFromEvent, color, brushSize, zoom],
  )

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const handleWheel = useCallback(
    (e) => {
      if (activeMode !== MODES.PAN) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom((prevZoom) => Math.max(0.5, Math.min(3, prevZoom * delta)))
    },
    [activeMode],
  )

  const handleDoubleClick = useCallback(
    (e) => {
      if (activeMode !== MODES.NOTE) return
      const { x, y } = posFromEvent(e)
      setDblPoint({ x, y })
      setEditingNoteId(null)
      setNoteDraft("")
      setShowNoteDialog(true)
    },
    [activeMode, posFromEvent],
  )

  // Note handlers
  const saveNote = useCallback(() => {
    if (editingNoteId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNoteId ? { ...note, text: noteDraft.trim() || "ملاحظة بدون نص", color: noteColor } : note,
        ),
      )
    } else if (dblPoint) {
      const newNote = {
        id: uid(),
        x: dblPoint.x,
        y: dblPoint.y,
        boxX: dblPoint.x + 30,
        boxY: dblPoint.y + 30,
        text: noteDraft.trim() || "ملاحظة بدون نص",
        color: noteColor,
      }
      setNotes((prev) => [...prev, newNote])
    }

    setShowNoteDialog(false)
    setNoteDraft("")
    setDblPoint(null)
    setEditingNoteId(null)
  }, [editingNoteId, dblPoint, noteDraft, noteColor])

  const deleteNote = useCallback(() => {
    if (!editingNoteId) return
    setNotes((prev) => prev.filter((note) => note.id !== editingNoteId))
    setShowNoteDialog(false)
    setEditingNoteId(null)
    setNoteDraft("")
  }, [editingNoteId])

  const openEditDialog = useCallback(
    (id) => {
      const note = notes.find((n) => n.id === id)
      if (!note) return
      setEditingNoteId(id)
      setNoteDraft(note.text)
      setNoteColor(note.color || "#fef9c3")
      setShowNoteDialog(true)
    },
    [notes],
  )

  // Note drag handlers
  const onStartDragBox = useCallback(
    (e, id) => {
      e.stopPropagation()
      const note = notes.find((n) => n.id === id)
      if (!note) return
      setDraggingNoteId(id)
      const pt = posFromEvent(e)
      dragOffset.current = { dx: pt.x - note.boxX, dy: pt.y - note.boxY }
    },
    [notes, posFromEvent],
  )

  const onMoveDragBox = useCallback(
    (e) => {
      if (!draggingNoteId) return
      const pt = posFromEvent(e)
      setNotes((prev) =>
        prev.map((note) =>
          note.id === draggingNoteId
            ? {
                ...note,
                boxX: pt.x - dragOffset.current.dx,
                boxY: pt.y - dragOffset.current.dy,
              }
            : note,
        ),
      )
    },
    [draggingNoteId, posFromEvent],
  )

  const onEndDragBox = useCallback(() => {
    setDraggingNoteId(null)
  }, [])

  // Action handlers
  const handleExport = useCallback(() => {
    exportCanvasToPNG(canvasRef, overlayRef, `dental-chart-${selectedPatient?.name || "patient"}`)
  }, [selectedPatient])

  const onUploadBackground = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBgUrl(reader.result)
    reader.readAsDataURL(file)
  }, [])

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>مخطط الأسنان - ${selectedPatient?.name || "مريض"}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; direction: rtl; margin: 0; }
              .header { margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .chart-area { border: 2px solid #333; padding: 20px; margin: 20px 0; min-height: 400px; background: #f9f9f9; }
              .notes { text-align: right; margin-top: 20px; }
              .note-item { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>مخطط الأسنان التفاعلي</h1>
              <h2>المريض: ${selectedPatient?.name || "غير محدد"}</h2>
              <p>التاريخ: ${new Date().toLocaleDateString("ar-SA")}</p>
            </div>
            <div class="chart-area">
              <h3>مخطط الأسنان مع الملاحظات</h3>
              <p>عدد الملاحظات: ${notes.length}</p>
            </div>
            ${
              notes.length > 0
                ? `
              <div class="notes">
                <h3>الملاحظات الطبية:</h3>
                ${notes
                  .map(
                    (note, index) => `
                  <div class="note-item">
                    <strong>ملاحظة ${index + 1}:</strong> ${note.text}
                  </div>
                `,
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [selectedPatient, notes])

  const handleSave = useCallback(() => {
    const chartData = {
      patient: selectedPatient,
      notes,
      zoom,
      offset,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem(`dental-chart-${selectedPatient?.id || "temp"}`, JSON.stringify(chartData))
    alert("تم حفظ مخطط الأسنان بنجاح!")
    handlePrint()
  }, [selectedPatient, notes, zoom, offset, handlePrint])

  const noteDragHandlers = useMemo(
    () => ({
      onStart: onStartDragBox,
      onMove: onMoveDragBox,
      onEnd: onEndDragBox,
    }),
    [onStartDragBox, onMoveDragBox, onEndDragBox],
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <DentalChartHeader selectedPatient={selectedPatient} onPrint={handlePrint} onSave={handleSave} />

      <div className="max-w-7xl mx-auto p-4">
        <DentalChartToolbar
          color={color}
          onColorChange={setColor}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          activeMode={activeMode}
          onModeChange={setActiveMode}
          onUndo={restore}
          onClearDrawing={clearDrawing}
          onClearNotes={() => setNotes([])}
          onUploadBackground={onUploadBackground}
          onExport={handleExport}
          canUndo={canUndo}
        />

        <div className="mt-4">
          <DrawingCanvas
            canvasRef={canvasRef}
            overlayRef={overlayRef}
            notes={notes}
            zoom={zoom}
            offset={offset}
            activeMode={activeMode}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            onNoteDrag={noteDragHandlers}
            onNoteEdit={openEditDialog}
          />
        </div>

        <DentalChartStats notes={notes} zoom={zoom} brushSize={brushSize} activeMode={activeMode} />
      </div>

      <NoteDialog
        isOpen={showNoteDialog}
        onClose={() => setShowNoteDialog(false)}
        noteText={noteDraft}
        noteColor={noteColor}
        isEditing={!!editingNoteId}
        onSave={saveNote}
        onDelete={deleteNote}
        onTextChange={setNoteDraft}
        onColorChange={setNoteColor}
      />
    </div>
  )
}