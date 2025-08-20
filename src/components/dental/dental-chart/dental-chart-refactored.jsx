import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUIStore } from "@/stores/uiStore"
import { Save, RotateCcw, X, Printer } from "lucide-react"
import { DentalChartCanvas } from "./dental-chart-canvas"
import { DentalChartToolbar } from "./dental-chart-toolbar"
import { DentalChartNotes } from "./dental-chart-notes"
import { DentalChartStats } from "./dental-chart-stats"
import { NoteDialog } from "./note-dialog"

export function DentalChartRefactored() {
  const { isDentalChartOpen, setIsDentalChartOpen, selectedPatient } = useUIStore()
  const canvasRef = useRef(null)
  const [selectedTool, setSelectedTool] = useState("healthy")
  const [notes, setNotes] = useState([])
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteText, setNoteText] = useState("")
  const [noteColor, setNoteColor] = useState("#fef9c3")
  const [teethConditions, setTeethConditions] = useState({})

  const handleCanvasClick = useCallback((event) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Add note at clicked position
    setSelectedNote({ x, y })
    setShowNoteDialog(true)
  }, [])

  const addNote = useCallback(() => {
    if (!selectedNote || !noteText.trim()) return

    const newNote = {
      id: Date.now().toString(),
      text: noteText.trim(),
      x: selectedNote.x,
      y: selectedNote.y,
      color: noteColor,
    }

    setNotes((prev) => [...prev, newNote])
    setShowNoteDialog(false)
    setNoteText("")
    setSelectedNote(null)
  }, [selectedNote, noteText, noteColor])

  const handlePrint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>مخطط الأسنان - ${selectedPatient?.name || "مريض"}</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; font-family: Arial, sans-serif; }
              .header { margin-bottom: 20px; }
              .chart-container { border: 2px solid #333; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>مخطط الأسنان</h2>
              <p>المريض: ${selectedPatient?.name || "غير محدد"}</p>
              <p>التاريخ: ${new Date().toLocaleDateString("ar-SA")}</p>
            </div>
            <div class="chart-container">
              <p>تم حفظ مخطط الأسنان بنجاح</p>
              <p>عدد الملاحظات: ${notes.length}</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [selectedPatient?.name, notes.length])

  const handleSave = useCallback(() => {
    // Save locally for now
    console.log("Saving dental chart:", {
      patient: selectedPatient?.name,
      notes,
      teethConditions,
      timestamp: new Date().toISOString(),
    })

    handlePrint()
    alert("تم حفظ مخطط الأسنان بنجاح!")
  }, [selectedPatient?.name, notes, teethConditions, handlePrint])

  const resetChart = useCallback(() => {
    setNotes([])
    setTeethConditions({})
    setSelectedTool("healthy")
  }, [])

  if (!isDentalChartOpen) return null

  return (
    <Dialog open={isDentalChartOpen} onOpenChange={() => setIsDentalChartOpen(false)}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>مخطط الأسنان - {selectedPatient?.name || "مريض جديد"}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsDentalChartOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <DentalChartToolbar selectedTool={selectedTool} onToolChange={setSelectedTool} />

          <Card>
            <CardHeader>
              <CardTitle>مخطط الأسنان التفاعلي</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <DentalChartCanvas
                ref={canvasRef}
                selectedTool={selectedTool}
                onClick={handleCanvasClick}
                teethConditions={teethConditions}
                onTeethConditionChange={setTeethConditions}
              />
              <DentalChartNotes notes={notes} />
            </CardContent>
          </Card>

          <DentalChartStats teethConditions={teethConditions} />

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetChart} className="text-red-600 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              إعادة تعيين
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDentalChartOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                طباعة
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                حفظ وطباعة
              </Button>
            </div>
          </div>
        </div>

        <NoteDialog
          isOpen={showNoteDialog}
          onClose={() => setShowNoteDialog(false)}
          noteText={noteText}
          noteColor={noteColor}
          onTextChange={setNoteText}
          onColorChange={setNoteColor}
          onSave={addNote}
        />
      </DialogContent>
    </Dialog>
  )
}
