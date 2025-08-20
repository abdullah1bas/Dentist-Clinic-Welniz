import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Upload, FileText, Stethoscope, X } from "lucide-react"
import { useUIStore } from "@/stores/uiStore"
import { usePatientsStore } from "@/stores/patientsStore"
import { useConstantsStore } from "@/stores/constantsStore"

export function CasePresentationSection({ formData, updateFormData }) {
  const { doctors } = useConstantsStore();
  const { addCaseNote } = usePatientsStore();
  const { selectedPatient } = useUIStore();
  const [newNote, setNewNote] = useState("")

  const handleTeethCountChange = (position, value) => {
    const newTeethAffected = {
      ...formData.teethAffected,
      [position]: Number.parseInt(value) || 0,
    }
    updateFormData("teethAffected", newTeethAffected)
  }

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedPatient) return

    const note = {
      note: newNote,
      date: new Date().toISOString().split("T")[0],
    }

    addCaseNote(selectedPatient.id, note)
    setNewNote("")
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateFormData("drawingImage", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeDrawingImage = () => {
    updateFormData("drawingImage", "")
  }

  const printCasePresentation = () => {
    const printWindow = window.open("", "_blank")
    const currentDate = new Date().toLocaleDateString("ar-EG")
    const totalTeeth = Object.values(formData.teethAffected).reduce((sum, count) => sum + count, 0)

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>عرض الحالة</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section h3 { background: #f0f0f0; padding: 10px; margin-bottom: 15px; border-right: 4px solid #007bff; }
            .teeth-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .teeth-section { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .notes-list { list-style: none; padding: 0; }
            .notes-list li { background: #f9f9f9; margin-bottom: 10px; padding: 10px; border-radius: 5px; }
            .drawing-image { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>عرض الحالة الطبية</h1>
            <p>التاريخ: ${currentDate}</p>
          </div>
          
          <div class="section">
            <h3>بيانات المريض</h3>
            <p><strong>الاسم:</strong> ${formData.name}</p>
            <p><strong>رقم الحالة:</strong> ${selectedPatient?.id || "جديد"}</p>
            <p><strong>الطبيب المسؤول:</strong> ${formData.doctor}</p>
          </div>

          <div class="section">
            <h3>الأسنان المتضررة</h3>
            <div class="teeth-grid">
              <div class="teeth-section">
                <h4>الفك العلوي</h4>
                <p>الجانب الأيسر: ${formData.teethAffected.upperLeft} أسنان</p>
                <p>الجانب الأيمن: ${formData.teethAffected.upperRight} أسنان</p>
              </div>
              <div class="teeth-section">
                <h4>الفك السفلي</h4>
                <p>الجانب الأيسر: ${formData.teethAffected.lowerLeft} أسنان</p>
                <p>الجانب الأيمن: ${formData.teethAffected.lowerRight} أسنان</p>
              </div>
            </div>
            <p><strong>إجمالي الأسنان المتضررة:</strong> ${totalTeeth} سن</p>
          </div>

          ${
            selectedPatient?.caseNotes && selectedPatient.caseNotes.length > 0
              ? `
            <div class="section">
              <h3>ملاحظات الحالة</h3>
              <ul class="notes-list">
                ${selectedPatient.caseNotes
                  .map(
                    (note) => `
                  <li>
                    <strong>${note.date}:</strong> ${note.note}
                  </li>
                `,
                  )
                  .join("")}
              </ul>
            </div>
          `
              : ""
          }

          ${
            formData.drawingImage
              ? `
            <div class="section">
              <h3>الرسم التوضيحي</h3>
              <img src="${formData.drawingImage}" alt="رسم توضيحي" class="drawing-image" />
            </div>
          `
              : ""
          }
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      {/* Doctor and Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            معلومات الحالة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>الطبيب المسؤول</Label>
              <Select value={formData.doctor} onValueChange={(value) => updateFormData("doctor", value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={printCasePresentation}
                variant="outline"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                طباعة عرض الحالة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teeth Affected */}
      <Card>
        <CardHeader>
          <CardTitle>الأسنان المتضررة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="upperLeft">الفك العلوي - يسار</Label>
              <Input
                id="upperLeft"
                type="number"
                min="0"
                max="8"
                value={formData.teethAffected.upperLeft}
                onChange={(e) => handleTeethCountChange("upperLeft", e.target.value)}
                className="bg-white text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upperRight">الفك العلوي - يمين</Label>
              <Input
                id="upperRight"
                type="number"
                min="0"
                max="8"
                value={formData.teethAffected.upperRight}
                onChange={(e) => handleTeethCountChange("upperRight", e.target.value)}
                className="bg-white text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowerLeft">الفك السفلي - يسار</Label>
              <Input
                id="lowerLeft"
                type="number"
                min="0"
                max="8"
                value={formData.teethAffected.lowerLeft}
                onChange={(e) => handleTeethCountChange("lowerLeft", e.target.value)}
                className="bg-white text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowerRight">الفك السفلي - يمين</Label>
              <Input
                id="lowerRight"
                type="number"
                min="0"
                max="8"
                value={formData.teethAffected.lowerRight}
                onChange={(e) => handleTeethCountChange("lowerRight", e.target.value)}
                className="bg-white text-center"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">إجمالي الأسنان المتضررة:</span>
              <Badge variant="default" className="text-lg px-3 py-1">
                {Object.values(formData.teethAffected).reduce((sum, count) => sum + count, 0)} سن
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drawing Image */}
      <Card>
        <CardHeader>
          <CardTitle>الرسم التوضيحي</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.drawingImage ? (
            <div className="relative">
              <img
                src={formData.drawingImage || "/placeholder.svg"}
                alt="رسم توضيحي"
                className="w-full max-w-md mx-auto rounded-lg border"
              />
              <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeDrawingImage}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">لا يوجد رسم توضيحي</p>
              <label htmlFor="drawing-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    رفع صورة للرسم عليها
                  </span>
                </Button>
              </label>
              <input id="drawing-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Case Notes */}
      <Card>
        <CardHeader>
          <CardTitle>ملاحظات الحالة</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Note */}
          <div className="flex gap-2 mb-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="إضافة ملاحظة جديدة..."
              className="flex-1 bg-white"
              rows={2}
            />
            <Button onClick={handleAddNote} className="bg-green-600 hover:bg-green-700" disabled={!newNote.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Notes List */}
          {selectedPatient?.caseNotes && selectedPatient.caseNotes.length > 0 ? (
            <div className="space-y-3">
              {selectedPatient.caseNotes.map((note) => (
                <div key={note.id} className="bg-gray-50 p-4 rounded-lg border-r-4 border-blue-500">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {note.date}
                    </Badge>
                  </div>
                  <p className="text-gray-800">{note.note}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد ملاحظات لهذه الحالة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
