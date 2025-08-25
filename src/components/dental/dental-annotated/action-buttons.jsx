import React, { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Undo, Eraser, Trash2, Upload, Download } from "lucide-react"
import { useCanvasDrawing } from "@/hooks/use-canvas-drawing";
import { useCanvasStore } from "@/stores/canvas/use-canvas-store";
import { useNotesStore } from "@/stores/canvas/use-notes-chart-store";
import { useUIStore } from "@/stores/uiStore";
import { exportCanvasToPNG } from "@/lib/dental-chart-utils";

export const ActionButtons = React.memo(({ overlayRef, canvasRef, bgImageRef, }) => {
    // 📌 canvas store
    const { zoom, offset } = useCanvasStore();

    // 📌 notes store
    const { clearNotes } = useNotesStore();
    
    // Patient data
    const { selectedPatient } = useUIStore();

    const { restore, clearDrawing, canUndo } =
        useCanvasDrawing(canvasRef, bgImageRef, offset, zoom);

    // Action handlers
    const handleExport = useCallback(() => {
      exportCanvasToPNG(canvasRef, overlayRef, `dental-chart-${selectedPatient?.name || "patient"}`)
    }, [selectedPatient, canvasRef, overlayRef, ]);


    return(
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={restore} disabled={!canUndo} title="تراجع">
        <Undo className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={clearDrawing} title="مسح الرسم">
        <Eraser className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={clearNotes} title="مسح الملاحظات">
        <Trash2 className="w-4 h-4" />
      </Button>

      <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
        <Download className="w-4 h-4 mr-2" />
        حفظ كصورة
      </Button>
    </div>
  )},
)

ActionButtons.displayName = "ActionButtons"
