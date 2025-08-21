import React from "react"
import { Button } from "@/components/ui/button"
import { Undo, Eraser, Trash2, Upload, Download } from "lucide-react"

export const ActionButtons = React.memo(
  ({ onUndo, onClearDrawing, onClearNotes, onExport, canUndo }) => (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo} title="تراجع">
        <Undo className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onClearDrawing} title="مسح الرسم">
        <Eraser className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onClearNotes} title="مسح الملاحظات">
        <Trash2 className="w-4 h-4" />
      </Button>

      <Button onClick={onExport} className="bg-green-600 hover:bg-green-700">
        <Download className="w-4 h-4 mr-2" />
        حفظ كصورة
      </Button>
    </div>
  ),
)

ActionButtons.displayName = "ActionButtons"
