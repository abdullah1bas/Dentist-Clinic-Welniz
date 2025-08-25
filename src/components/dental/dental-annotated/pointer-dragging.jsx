// PointerDragging.jsx
import React, { useCallback } from "react";
import { useCanvasStore } from "@/stores/canvas/use-canvas-store";

function PointerDragging({ note, canvasRef }) {
  const { zoom, offset } = useCanvasStore();

  // نفس تحويل canvasToCss الموجود في Note
  const canvasToCss = useCallback((canvasX, canvasY) => {
    const canvas = canvasRef?.current;
    if (!canvas) return { x: 0, y: 0, rectWidth: 0, rectHeight: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(rect.width, 1);
    const scaleY = canvas.height / Math.max(rect.height, 1);

    // client offset inside container (left/top) for a canvas coordinate:
    const clientX = offset.x + (canvasX * zoom) / scaleX;
    const clientY = offset.y + (canvasY * zoom) / scaleY;

    return { x: clientX, y: clientY, rectWidth: rect.width, rectHeight: rect.height };
  }, [canvasRef, offset, zoom]);

  // حساب موضع الدائرة وموضع الصندوق (CSS pixels)
  const anchor = canvasToCss(note.x, note.y); // نقطة الدائرة (anchor)
  const boxPoint = canvasToCss(note.boxX, note.boxY); // موضع الركن العلوي للصندوق (CSS px)

  // إذا القيم غير صحيحة نتجنّب رسمها
  if (!isFinite(anchor.x) || !isFinite(anchor.y) || !isFinite(boxPoint.x) || !isFinite(boxPoint.y)) {
    return null; // أو ترجع <g/> فارغ
  }

    // استخدم أبعاد الصندوق المخزنة في note (boxW, boxH) — إذا غير موجودة استعمل افتراض
  const boxW = note.boxW ?? 150;
  const boxH = note.boxH ?? 80;

  // مركز الصندوق (CSS pixels)
  const boxCenterX = boxPoint.x + boxW / 2;
  const boxCenterY = boxPoint.y + boxH / 2;

  // لو بتحب تشوف القيم لتصحيح الأخطاء
  // console.log('anchor', anchor, 'box', boxPoint, 'note', note)

  // console.log('canvas rect', canvasRef.current?.getBoundingClientRect())
  // console.log('anchor css', anchor) // من canvasToCss(note.x, note.y)
  // console.log('box css', boxPoint)  // من canvasToCss(note.boxX, note.boxY)
  // console.log('note stored units', note.x, note.y, note.boxX, note.boxY, 'zoom', zoom, 'offset', offset)


  return (
    <g>
      {/* نستخدم نفس إحداثيات CSS داخل الـ SVG إذا كان الـ svg مُصمّم ليقبل إحداثيات CSS pixels */}
      <circle cx={anchor.x} cy={anchor.y} r={5} fill="#ef4444" className="drop-shadow-sm" />
      <line
        x1={anchor.x}
        y1={anchor.y}
        x2={boxCenterX}
        y2={boxCenterY}
        stroke="#111827"
        strokeWidth={1.5}
        strokeDasharray="3,3"
      />
    </g>
  );
}

export default PointerDragging;
