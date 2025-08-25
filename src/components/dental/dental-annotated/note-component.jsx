import { useNotesDataStore } from "@/stores/canvas/use-notes-store";
import React, { useRef, useLayoutEffect, useState, useCallback } from "react";

export const Note = React.memo(({ note, zoom, offset, canvasRef, onStartDrag, onEdit }) => {
  const elRef = useRef(null);
  const [cssPos, setCssPos] = useState({ left: 0, top: 0 });
  const [boxSize, setBoxSize] = useState({ w: 150, h: 80 }); // افتراض أولي

  const updateNote = useNotesDataStore((s) => s.updateNote);

  const canvasToCss = useCallback((canvasX, canvasY) => {
    const canvas = canvasRef?.current;
    if (!canvas) return { x: 0, y: 0, rectWidth: 0, rectHeight: 0 };

    const rect = canvas.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0, rectWidth: rect?.width ?? 0, rectHeight: rect?.height ?? 0 };

    const scaleX = canvas.width / Math.max(rect.width, 1);
    const scaleY = canvas.height / Math.max(rect.height, 1);

    const clientX = (offset?.x ?? 0) + ((Number(canvasX) * zoom) / scaleX);
    const clientY = (offset?.y ?? 0) + ((Number(canvasY) * zoom) / scaleY);

    if (!isFinite(clientX) || !isFinite(clientY)) return { x: 0, y: 0, rectWidth: rect.width, rectHeight: rect.height };
    return { x: clientX, y: clientY, rectWidth: rect.width, rectHeight: rect.height };
  }, [canvasRef, offset, zoom]);


  // قياس حجم الصندوق الحقيقي (CSS pixels) وإعادة حساب الموقع عند mount أو تغيّر zoom/offset/note
  useLayoutEffect(() => {
    const el = elRef.current;
    const canvas = canvasRef?.current;
    if (!el || !canvas) return;

    const elRect = el.getBoundingClientRect();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(rect.width, 1);
    const scaleY = canvas.height / Math.max(rect.height, 1);

    // نحول الحجم إلى canvas units لو احتجنا، لكن هنا نحتاج CSS size للـ clamp
    const cssW = elRect.width;
    const cssH = elRect.height;
    setBoxSize({ w: cssW, h: cssH });

    // حفظ مقاسات الصندوق في الستورد لكي تستخدمها مكونات أخرى (مثل PointerDragging)
    updateNote(note.id, { boxW: cssW, boxH: cssH });

    // نحسب الموضع المعروض (CSS px داخل الحاوية) ثم نطبق clamp
    const { x, y, rectWidth, rectHeight } = canvasToCss(note.boxX, note.boxY);

    // clamp داخل مساحة العرض (rectWidth/rectHeight)
    const clampedLeft = Math.max(0, Math.min(rectWidth - cssW, x));
    const clampedTop = Math.max(0, Math.min(rectHeight - cssH, y));

    setCssPos({ left: clampedLeft, top: clampedTop });
  }, [note.boxX, note.boxY, zoom, offset, canvasRef, canvasToCss]);

  // أثناء السحب قد تحتاج تحديث سريع للموضع بصرياً قبل تحديث الستيت المركزي؛
  // لكن هنا نترك ذلك للهاندلرز المركزية (مثل onMove + RAF) حتى لا نغير المنطق الأساسي.

  return (
    <div
      ref={elRef}
      className="absolute pointer-events-auto"
      style={{
        left: cssPos.left,
        top: cssPos.top,
        // نلغي transform: scale أثناء العرض الافتراضي لتبسيط الحسابات:
        transform: undefined,
        transformOrigin: "top left",
        touchAction: "none",
      }}
      onMouseDown={(e) => onStartDrag(e, note.id)}
    >
      <div
        className="border rounded-xl shadow-lg p-3 text-sm max-w-[220px] cursor-move transition-all hover:shadow-xl"
        style={{
          backgroundColor: note.noteColor || "#fef9c3",
          borderColor: note.noteColor ? `${note.noteColor}99` : "#fde68a",
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEdit(note.id);
        }}
      >
        <div className="font-medium mb-1" style={{ color: "#78350f" }}>
          ملاحظة
        </div>
        <div className="whitespace-pre-wrap text-xs" style={{ color: "#7c2d12" }}>
          {note.text || "—"}
        </div>
      </div>
    </div>
  );
});

Note.displayName = "Note";
