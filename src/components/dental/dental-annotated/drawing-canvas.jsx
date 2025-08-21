import React, { useCallback } from "react"
import { Note } from "./note-component"

export const DrawingCanvas = React.memo(
  ({
    canvasRef,
    overlayRef,
    notes,
    zoom,
    offset,
    activeMode,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    onDoubleClick,
    onNoteDrag,
    onNoteEdit,
  }) => {
    const handleMouseMove = useCallback(
      (e) => {
        onPointerMove(e)
        onNoteDrag.onMove(e)
      },
      [onPointerMove, onNoteDrag.onMove],
    )

    const handleMouseUp = useCallback(
      (e) => {
        onPointerUp(e)
        onNoteDrag.onEnd()
      },
      [onPointerUp, onNoteDrag.onEnd],
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
            height: "100%"
          }}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onWheel={onWheel}
          onDoubleClick={onDoubleClick}
        />

        <svg
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none bg-background/30"
          viewBox={`0 0 1000 700`}
          preserveAspectRatio="xMidYMid meet"
        >
          {notes.map((note) => (
            <g key={note.id}>
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
          ))}
        </svg>

        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            zoom={zoom}
            offset={offset}
            onStartDrag={onNoteDrag.onStart}
            onEdit={onNoteEdit}
          />
        ))}
      </div>
    )
  },
)