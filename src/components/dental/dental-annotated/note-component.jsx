
import React from "react"

export const Note = React.memo(({ note, zoom, offset, onStartDrag, onEdit }) => (
  <div
    className="absolute pointer-events-auto"
    style={{
      left: note.boxX * zoom + offset.x,
      top: note.boxY * zoom + offset.y,
      transform: `scale(${Math.max(0.8, zoom)})`,
      transformOrigin: "top left",
    }}
    onMouseDown={(e) => onStartDrag(e, note.id)}
  >
    <div
      className="border rounded-xl shadow-lg p-3 text-sm max-w-[220px] cursor-move transition-all hover:shadow-xl"
      style={{
        backgroundColor: note.color || "#fef9c3",
        borderColor: note.color ? `${note.color}99` : "#fde68a",
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onEdit(note.id)
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
))

Note.displayName = "Note"
