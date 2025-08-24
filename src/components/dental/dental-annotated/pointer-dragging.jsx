import { useCanvasStore } from "@/stores/use-canvas-store";
import React from "react";

function PointerDragging({ note }) {
  const { zoom, offset } = useCanvasStore();
  return (
    <g>
      <circle
        cx={note.x * zoom + offset.x}
        cy={note.y * zoom + offset.y}
        r={5}
        fill="#ef4444"
        className="drop-shadow-sm"
      />
      <line
        x1={note.x * zoom + offset.x}
        y1={note.y * zoom + offset.y}
        x2={note.boxX * zoom + offset.x}
        y2={note.boxY * zoom + offset.y}
        stroke="#111827"
        strokeWidth={1.5}
        strokeDasharray="3,3"
      />
    </g>
  );
}

export default PointerDragging;
