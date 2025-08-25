import React, { useCallback, useMemo, useRef } from "react";
import { useNotesStore } from "@/stores/canvas/use-notes-chart-store";
import NotesChart from "./notes-chart";
import PointerDragging from "./pointer-dragging";
import { MODES, posFromEvent } from "@/lib/dental-chart-utils";
import { useCanvasStore } from "@/stores/canvas/use-canvas-store";
import { useCanvasHandlers } from "@/hooks/use-canvas-handlers";
import { useNotesDataStore } from "@/stores/canvas/use-notes-store";

export const DrawingCanvas = React.memo(({ canvasRef, dragOffset, overlayRef, snapshot, drawbase }) => {

  // داخل DentalChartPage / DrawingCanvas component (أعلى مكان تعريف noteDragHandlers)
  const rafRef = useRef(null);
  const pendingPosRef = useRef(null);
  const noteBoxSizeRef = useRef({ w: 0, h: 0 })
  
  // 📌 notes store
  const {  draggingNoteId, setDraggingNoteId, setDblPoint,  setEditingNoteId ,setNoteDraft ,setShowNoteDialog } = useNotesStore();
  const { notes, updateNote } = useNotesDataStore();

  const {offset, zoom, setZoom, activeMode , setOffset} = useCanvasStore();

  const { handlePointerDown, handlePointerMove, handlePointerUp } = useCanvasHandlers(canvasRef, snapshot, setOffset, dragOffset)

  // useEffect(() => {
  //   const el = rafRef?.current || canvasRef?.current;
  //   if (!el) return;

  //   const wheelHandler = (ev) => {
  //     // فقط لمن في وضع PAN نمنع السلوك الافتراضي
  //     if (activeMode !== MODES.PAN) return;
  //     ev.preventDefault();
  //     const delta = ev.deltaY > 0 ? 0.9 : 1.1;
  //     setZoom((z) => Math.max(0.5, Math.min(3, z * delta)));
  //   };

  //   el.addEventListener("wheel", wheelHandler, { passive: false });
  //   return () => el.removeEventListener("wheel", wheelHandler, { passive: false });
  // }, [canvasRef, rafRef, activeMode, setZoom]);

  const noteDragHandlers = useMemo(() => ({
    onStart: (e, id) => {
      // نتأكد إن فيه نوت
      const note = notes.find((n) => n.id === id);
      if (!note) return;

      // set dragging id
      setDraggingNoteId(id);

      // نقطة البداية (بالـ canvas coordinates)
      const pt = posFromEvent(e, offset, canvasRef, zoom);

      // حفظ الـ offset الداخلي بين مؤشر الماوس ومكان الصندوق
      dragOffset.current = { dx: pt.x - note.boxX, dy: pt.y - note.boxY };

      // قياس حجم صندوق النوت (CSS pixels -> نُحوّله لوحدات الـ canvas بقسمة على zoom)
      // e.currentTarget هنا يجب أن يكون العنصر اللي بدأنا منه السحب (Note div)
      try {
        const el = e.currentTarget || e.target;
        const rect = el.getBoundingClientRect();
        noteBoxSizeRef.current = { w: rect.width / Math.max(zoom, 0.0001), h: rect.height / Math.max(zoom, 0.0001) };
      } catch {
        // لو مافيش قدرة على القياس نخلي قيم إفتراضية
        noteBoxSizeRef.current = { w: 150 / Math.max(zoom, 0.0001), h: 80 / Math.max(zoom, 0.0001) };
      }
    },

    onMove: (e) => {
      if (!draggingNoteId) return;

      // نحسب موقع الماوس داخل الـ canvas (canvas coordinates)
      const pt = posFromEvent(e, offset, canvasRef, zoom);

      // نحدد الإحداثيات الجديدة للصندوق قبل الـ clamp
      let newBoxX = pt.x - dragOffset.current.dx;
      let newBoxY = pt.y - dragOffset.current.dy;

      // قياسات الـ canvas الحقيقية (بكسل داخلية)
      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasW = canvas.width;
      const canvasH = canvas.height;

      // حجم الصندوق بوحدات canvas
      const boxW = noteBoxSizeRef.current.w || 150;
      const boxH = noteBoxSizeRef.current.h || 80;

      // clamp داخل حدود الـ canvas (نمنع خروج الصندوق)
      newBoxX = Math.max(0, Math.min(canvasW - boxW, newBoxX));
      newBoxY = Math.max(0, Math.min(canvasH - boxH, newBoxY));

      // جدولة التحديث عبر RAF (نحدّث الـ store مرة للفريم بدل لكل حدث)
      pendingPosRef.current = { boxX: newBoxX, boxY: newBoxY };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingPosRef.current && draggingNoteId) {
            // نُحدّث فقط boxX/boxY لأن الـ anchor (note.x/note.y) يظل ثابتًا عادة
            updateNote(draggingNoteId, {
              boxX: pendingPosRef.current.boxX,
              boxY: pendingPosRef.current.boxY,
            });
          }
          pendingPosRef.current = null;
          rafRef.current = null;
        });
      }
    },

    onEnd: () => {
      // flush أي تحديث متبقي
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (pendingPosRef.current && draggingNoteId) {
        updateNote(draggingNoteId, {
          boxX: pendingPosRef.current.boxX,
          boxY: pendingPosRef.current.boxY,
        });
        pendingPosRef.current = null;
      }

      // نظف حالة السحب
      setDraggingNoteId(null);
    },
  }), [notes, draggingNoteId, setDraggingNoteId, updateNote, dragOffset, canvasRef, offset, zoom]);


  const handleMouseMove = useCallback(
    (e) => {
      handlePointerMove(e, drawbase);
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
      if (activeMode !== MODES.PAN) return;
      e.preventDefault();
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
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
        />

        <svg
          ref={overlayRef}
          className="absolute inset-0 size-full pointer-events-none bg-background/30"
          // viewBox={`0 0 1000 600`}
          preserveAspectRatio="xMidYMid meet"
        >
          {notes.map((note) => (
            <PointerDragging key={note.id} note={note} canvasRef={canvasRef} />
          ))}
        </svg>

        <NotesChart onStart={noteDragHandlers.onStart} canvasRef={canvasRef} />
      </div>
    );
  }
);
