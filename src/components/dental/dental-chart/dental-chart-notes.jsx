"use client"

export function DentalChartNotes({ notes }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        {notes.map((note) => (
          <g key={note.id}>
            {/* Note point */}
            <circle
              cx={note.x}
              cy={note.y}
              r={4}
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth={2}
              className="drop-shadow-sm"
            />

            {/* Connection line */}
            <line
              x1={note.x}
              y1={note.y}
              x2={note.x + 100}
              y2={note.y - 50}
              stroke="#374151"
              strokeWidth={1}
              strokeDasharray="3,3"
            />

            {/* Note box */}
            <foreignObject x={note.x + 105} y={note.y - 70} width={200} height={40} className="pointer-events-auto">
              <div
                className="p-2 rounded-lg shadow-lg text-xs border max-w-full"
                style={{
                  backgroundColor: note.color || "#fef9c3",
                  borderColor: note.color ? `${note.color}99` : "#fde68a",
                }}
              >
                <div className="font-medium text-amber-800 mb-1">ملاحظة</div>
                <div className="text-amber-900 whitespace-pre-wrap break-words">{note.text || "—"}</div>
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  )
}
