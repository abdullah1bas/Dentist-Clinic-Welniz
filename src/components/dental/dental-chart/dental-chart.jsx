
import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUIStore } from "@/stores/uiStore"
import { Save, RotateCcw, X, Printer, Plus } from "lucide-react"

export function DentalChart() {
  const { isDentalChartOpen, setIsDentalChartOpen, selectedPatient } = useUIStore()
  const canvasRef = useRef(null)
  const [selectedTool, setSelectedTool] = useState("healthy")
  const [notes, setNotes] = useState([])
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [notePosition, setNotePosition] = useState({ x: 0, y: 0 })

  const TOOTH_CONDITIONS = [
    { id: "healthy", color: "#10b981", label: "سليم" },
    { id: "caries", color: "#ef4444", label: "تسوس" },
    { id: "filled", color: "#3b82f6", label: "حشو" },
    { id: "crown", color: "#f59e0b", label: "تاج" },
    { id: "missing", color: "#6b7280", label: "مفقود" },
    { id: "root_canal", color: "#8b5cf6", label: "علاج جذور" },
    { id: "implant", color: "#059669", label: "زراعة" },
  ]

  const handleCanvasClick = useCallback((event) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setNotePosition({ x, y })
    setShowNoteDialog(true)
  }, [])

  const addNote = useCallback(() => {
    if (!noteText.trim()) return

    const newNote = {
      id: Date.now().toString(),
      text: noteText.trim(),
      x: notePosition.x,
      y: notePosition.y,
      color: "#fef9c3",
      timestamp: new Date().toISOString(),
    }

    setNotes((prev) => [...prev, newNote])
    setShowNoteDialog(false)
    setNoteText("")
  }, [noteText, notePosition])

  const handleSave = useCallback(() => {
    console.log("حفظ مخطط الأسنان:", {
      patient: selectedPatient?.name,
      notes,
      timestamp: new Date().toISOString(),
    })

    alert("تم حفظ مخطط الأسنان بنجاح!")
    handlePrint()
  }, [selectedPatient?.name, notes])

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>مخطط الأسنان</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                text-align: center; 
                direction: rtl;
              }
              .header { margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .chart-area { 
                border: 2px solid #333; 
                padding: 20px; 
                margin: 20px 0;
                min-height: 400px;
                background: #f9f9f9;
              }
              .notes { text-align: right; margin-top: 20px; }
              .note-item { 
                background: #fff3cd; 
                border: 1px solid #ffeaa7; 
                padding: 10px; 
                margin: 10px 0; 
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>مخطط الأسنان</h1>
              <h2>المريض: ${selectedPatient?.name || "غير محدد"}</h2>
              <p>التاريخ: ${new Date().toLocaleDateString("ar-SA")}</p>
              <p>الطبيب: د. محمد صادق</p>
            </div>
            
            <div class="chart-area">
              <h3>مخطط الأسنان التفاعلي</h3>
              <p>تم توثيق حالة الأسنان والملاحظات</p>
              <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                <div style="text-align: center;">
                  <div style="width: 100px; height: 50px; border: 2px solid #333; border-radius: 50px 50px 0 0; margin: 0 auto;"></div>
                  <p>الفك العلوي</p>
                </div>
                <div style="text-align: center;">
                  <div style="width: 100px; height: 50px; border: 2px solid #333; border-radius: 0 0 50px 50px; margin: 0 auto;"></div>
                  <p>الفك السفلي</p>
                </div>
              </div>
            </div>

            ${
              notes.length > 0
                ? `
              <div class="notes">
                <h3>الملاحظات الطبية:</h3>
                ${notes
                  .map(
                    (note, index) => `
                  <div class="note-item">
                    <strong>ملاحظة ${index + 1}:</strong> ${note.text}
                  </div>
                `,
                  )
                  .join("")}
              </div>
            `
                : ""
            }

            <div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px;">
              <p>عيادة الأسنان الذكية - د. محمد صادق</p>
              <p>تم الطباعة في: ${new Date().toLocaleString("ar-SA")}</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [selectedPatient?.name, notes])

  const resetChart = () => {
    setNotes([])
    setSelectedTool("healthy")
  }

  if (!isDentalChartOpen) return null

  return (
    <>
      <Dialog open={isDentalChartOpen} onOpenChange={setIsDentalChartOpen}>
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
            {/* Toolbar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 self-center ml-4">اختر حالة السن:</span>
                  {TOOTH_CONDITIONS.map((condition) => (
                    <Button
                      key={condition.id}
                      variant={selectedTool === condition.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool(condition.id)}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: condition.color }} />
                      {condition.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dental Chart */}
            <Card>
              <CardHeader>
                <CardTitle>مخطط الأسنان التفاعلي</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div
                  ref={canvasRef}
                  className="relative border-2 border-gray-300 rounded-lg bg-white cursor-crosshair min-h-[400px] flex items-center justify-center"
                  onClick={handleCanvasClick}
                  style={{
                    backgroundImage: "url(/dental-chart.svg)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Dental Chart Visual */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="mb-8">
                      <div className="w-64 h-32 border-4 border-blue-600 rounded-t-full flex items-center justify-center bg-blue-50">
                        <span className="text-blue-800 font-semibold">الفك العلوي</span>
                      </div>
                    </div>
                    <div>
                      <div className="w-64 h-32 border-4 border-green-600 rounded-b-full flex items-center justify-center bg-green-50">
                        <span className="text-green-800 font-semibold">الفك السفلي</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes Overlay */}
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="absolute bg-yellow-200 border border-yellow-400 rounded p-2 text-xs shadow-lg max-w-48"
                      style={{
                        left: `${note.x}%`,
                        top: `${note.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="font-semibold text-yellow-800 mb-1">ملاحظة</div>
                      <div className="text-yellow-900">{note.text}</div>
                    </div>
                  ))}

                  <div className="absolute top-2 left-2 bg-white/90 p-2 rounded text-xs text-gray-600">
                    انقر لإضافة ملاحظة • الأداة المحددة: {TOOTH_CONDITIONS.find((t) => t.id === selectedTool)?.label}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الأسنان</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-4 mb-4">
                  {TOOTH_CONDITIONS.map((condition) => (
                    <div key={condition.id} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold mb-1" style={{ color: condition.color }}>
                        0
                      </div>
                      <div className="text-xs text-gray-600">{condition.label}</div>
                    </div>
                  ))}
                </div>

                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">عدد الملاحظات: {notes.length}</div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
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
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة ملاحظة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">نص الملاحظة</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="اكتب الملاحظة هنا..."
                className="w-full mt-2 p-2 border rounded-md min-h-[100px]"
                autoFocus
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={addNote} disabled={!noteText.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة الملاحظة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
