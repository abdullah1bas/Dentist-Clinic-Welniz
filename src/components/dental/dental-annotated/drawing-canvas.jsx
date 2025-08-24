import React, { useCallback, useMemo, useRef } from "react";
import { useNotesStore } from "@/stores/use-notes-chart-store";
import NotesChart from "./notes-chart";
import PointerDragging from "./pointer-dragging";
import { MODES, posFromEvent } from "@/lib/dental-chart-utils";
import { useCanvasStore } from "@/stores/use-canvas-store";
import { useCanvasHandlers } from "@/hooks/use-canvas-handlers";

export const DrawingCanvas = React.memo(({ canvasRef, dragOffset, overlayRef, snapshot, }) => {

  // اضف هذه الرفات بالقرب من بداية المكون
  const rafRef = useRef(null);
  const pendingPosRef = useRef(null);
  
  // 📌 notes store
  const { 
    notes, updateNote, draggingNoteId, setDraggingNoteId, setDblPoint,  setEditingNoteId ,setNoteDraft ,setShowNoteDialog
  } = useNotesStore();
  const {offset, zoom, setZoom, activeMode , setOffset} = useCanvasStore();

  const { handlePointerDown, handlePointerMove, handlePointerUp } = useCanvasHandlers(canvasRef, snapshot, setOffset, dragOffset)

  const noteDragHandlers = useMemo(
    () => ({
      onStart: (e, id) => {
        console.log("onStart", { id });
        const note = notes.find((n) => n.id === id);
        if (!note) return;
        setDraggingNoteId(id);
        const pt = posFromEvent(e, offset, canvasRef, zoom);
        console.log("start pt", pt);
        console.log("note before start", notes.find(n => n.id === id));
        dragOffset.current = { dx: pt.x - note.boxX, dy: pt.y - note.boxY };
        console.log("dragOffset.current set to", dragOffset.current);
      },

      onMove: (e) => {
        if (!draggingNoteId) return
        const pt = posFromEvent(e, offset, canvasRef, zoom)
        const newBox = { x: pt.x - dragOffset.current.dx, y: pt.y - dragOffset.current.dy }

        // احفظ آخر موضع
        pendingPosRef.current = newBox

        // لو مافيش raf مجدول، جدوله
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            // استعمال آخر قيمة محفوظة فقط مرة لكل إطار
            const latest = pendingPosRef.current
            if (latest) {
              updateNote(draggingNoteId, { boxX: latest.x, boxY: latest.y })
            }
            rafRef.current = null
          })
        }
      },

      onEnd: () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
        // flush final pos if موجود
        if (pendingPosRef.current) {
          updateNote(draggingNoteId, { boxX: pendingPosRef.current.x, boxY: pendingPosRef.current.y })
          pendingPosRef.current = null
        }
        setDraggingNoteId(null)
      }
    }),
    [notes, draggingNoteId, setDraggingNoteId, updateNote, dragOffset, canvasRef, offset, zoom]
  );

  const handleMouseMove = useCallback(
    (e) => {
      handlePointerMove(e);
      noteDragHandlers.onMove(e);
    },
    [handlePointerMove, noteDragHandlers]
  );

  const handleMouseUp = useCallback(
    (e) => {
      handlePointerUp(e);
      noteDragHandlers.onEnd();
    },
    [handlePointerUp, noteDragHandlers]
  );
  // تكبير/تصغير بالرول (zoom in/out) → يمنع سكرول الصفحة
  const handleWheel = useCallback(
    (e) => {
      if (activeMode !== MODES.PAN) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom((prevZoom) => Math.max(0.5, Math.min(3, prevZoom * delta)))
    },
    [activeMode, setZoom],
  )

  const handleDoubleClick = useCallback(
    (e) => {
      if (activeMode !== MODES.NOTE) return
      const { x, y } = posFromEvent(e, offset, canvasRef, zoom)
      setDblPoint({ x, y })
      setEditingNoteId(null)
      setNoteDraft("")
      setShowNoteDialog(true)
    },
    [activeMode, canvasRef, offset, setDblPoint, setEditingNoteId, setNoteDraft, setShowNoteDialog, zoom ],
  )

    return (
      <div
        className="relative w-full h-60 sm:h-96 md:h-screen overflow-hidden rounded-2xl border shadow-inner select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair"
          style={{
            cursor: activeMode === "pan" ? "grab" : "crosshair",
            width: "100%",
            height: "100%",
          }}
          onMouseDown={handlePointerDown}
          // onMouseMove={handlePointerMove}
          // onMouseUp={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
        />

        <svg
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none bg-background/30"
          viewBox={`0 0 1000 700`}
          preserveAspectRatio="xMidYMid meet"
        >
          {notes.map((note) => (
            <PointerDragging key={note.id} note={note} />
          ))}
        </svg>

        <NotesChart onStart={noteDragHandlers.onStart} />
      </div>
    );
  }
);
