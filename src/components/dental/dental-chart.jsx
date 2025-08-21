
import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { DrawingCanvas } from "./dental-annotated/drawing-canvas"
import { useCanvasDrawing } from "@/hooks/use-canvas-drawing"
import { NoteDialog } from "./dental-annotated/note-dialog"
import { createFallbackSvg, exportCanvasToPNG, MODES, uid, CANVAS_SIZE } from "@/lib/dental-chart-utils"
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

  // تحميل صورة الخلفية من المشروع (ثابتة)
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      bgImageRef.current = img;
      drawBase();
    };
    img.src = "/dental-chart.svg"; // ✅ ثابتة
  }, [drawBase]);

  // event helper → يجيب مكان الماوس بالنسبة للكانفاس
  const posFromEvent = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    // حساب نسبة القياس بناءً على الحجم الحقيقي والعرض المعروض
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left - offset.x) * scaleX / zoom,
      y: (e.clientY - rect.top - offset.y) * scaleY / zoom,
    };
  }, [canvasRef, offset, zoom]);

  // الضغط بالماوس (يبدأ الرسم أو التحريك)
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

  // التحريك بالماوس
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

  // رفع الماوس → إنهاء الرسم/التحريك
  const handlePointerUp = useCallback(() => {
    setIsDrawing(false)
  }, [])

  // تكبير/تصغير بالرول (zoom in/out) → يمنع سكرول الصفحة
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
      <DentalChartHeader />

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

      <article className="w-full h-screen bg-background">
        <img className="size-full" src="/dental-chart.svg" alt="" />
      </article>
    </div>
  )
}