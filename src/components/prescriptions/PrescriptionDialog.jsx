"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Printer, Pill, Upload, X } from "lucide-react"
import { MedicineDialog } from "./medicine-dialog"

export function PrescriptionDialog({ open, onOpenChange, prescription }) {
  const [isMedicineDialogOpen, setIsMedicineDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    clinicLogo: "",
    date: new Date().toISOString().split("T")[0],
    patientName: prescription?.patientName || "",
    gender: prescription?.gender || "",
    age: prescription?.age?.toString() || "",
    diagnosis: prescription?.diagnosis || "",
    prescription: "",
    doctorName: prescription?.doctorName || "",
    doctorSignature: "",
  })

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePrescriptionChange = (e) => {
    const value = e.target.value
    const lines = value.split("\n")
    const formattedLines = lines.map((line, index) => {
      if (index > 0 && line.trim() && !line.trim().startsWith("*")) {
        return `* ${line.trim()}`
      }
      return line
    })
    handleInputChange("prescription", formattedLines.join("\n"))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const textarea = e.currentTarget
      const cursorPosition = textarea.selectionStart
      const value = textarea.value
      const beforeCursor = value.substring(0, cursorPosition)
      const afterCursor = value.substring(cursorPosition)
      const newValue = beforeCursor + "\n* " + afterCursor

      handleInputChange("prescription", newValue)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 3
      }, 0)

      e.preventDefault()
    }
  }

  const handleAddMedicine = (medicine) => {
    const currentPrescription = formData.prescription
    const newLine = currentPrescription ? "\n* " + medicine : "* " + medicine
    handleInputChange("prescription", currentPrescription + newLine)
  }

  const handleSave = () => {
    console.log("Saving prescription:", formData)
    onOpenChange(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const removeImage = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }))
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:shadow-none">
          <div className="bg-white print:p-0" id="prescription-form">
            {/* Clinic Logo - Full Width */}
            {formData.clinicLogo ? (
              <div className="relative w-full mb-6 print:mb-4">
                <img
                  src={formData.clinicLogo || "/placeholder.svg"}
                  alt="شعار العيادة"
                  className="w-full h-32 object-contain print:h-24"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 print:hidden"
                  onClick={() => removeImage("clinicLogo")}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center mb-6 print:hidden">
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="border-dashed border-2 h-32 w-full hover:bg-zinc-50 flex items-center justify-center rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-zinc-400" />
                      <span className="text-zinc-600">تحميل شعار العيادة</span>
                      <span className="text-xs text-zinc-400">سيظهر بعرض كامل في أعلى الروشتة</span>
                    </div>
                  </div>
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "clinicLogo")}
                  className="hidden"
                />
              </div>
            )}

            {/* Patient Information - Side by Side for Print */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2 print:mb-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  التاريخ
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="print:border-0 print:border-b-2 print:border-gray-400 print:rounded-none print:bg-transparent print:px-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-sm font-medium">
                  اسم المريض
                </Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  placeholder="اسم المريض"
                  className="print:border-0 print:border-b-2 print:border-gray-400 print:rounded-none print:bg-transparent print:px-1"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">الجنس</Label>
                <div className="print:hidden">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر الجنس</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div className="hidden print:block">
                  <div className="border-0 border-b-2 border-gray-400 pb-1 min-h-[2rem] flex items-center px-1">
                    {formData.gender}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  العمر
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="العمر"
                  className="print:border-0 print:border-b-2 print:border-gray-400 print:rounded-none print:bg-transparent print:px-1"
                />
              </div>
            </div>

            {/* Diagnosis */}
            <div className="space-y-2 mb-6 print:mb-4">
              <Label htmlFor="diagnosis" className="text-sm font-medium">
                التشخيص
              </Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                placeholder="وصف حالة المريض والتشخيص..."
                className="min-h-[80px] print:border-2 print:border-gray-400 print:rounded-none print:bg-transparent print:p-2"
              />
            </div>

            {/* Prescription Section */}
            <div className="space-y-2 mb-6 print:mb-4">
              <div className="flex items-center gap-2 mb-4 print:mb-2">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg print:bg-blue-600 print:text-white">
                  ℞
                </div>
                <Label className="text-lg font-semibold">العلاج الموصوف</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsMedicineDialogOpen(true)}
                  className="mr-auto print:hidden"
                >
                  <Pill className="w-4 h-4 mr-2" />
                  إضافة دواء
                </Button>
              </div>

              <Textarea
                value={formData.prescription}
                onChange={handlePrescriptionChange}
                onKeyDown={handleKeyDown}
                placeholder="* ابدأ بكتابة الأدوية والتعليمات..."
                className="min-h-[200px] font-mono text-base leading-relaxed print:border-2 print:border-gray-400 print:rounded-none print:bg-transparent print:p-2"
              />
            </div>

            {/* Doctor Info and Signature */}
            <div className="flex justify-between items-end pt-8 border-t print:pt-4 print:border-t-2 print:border-gray-400">
              <div className="space-y-2">
                <Label htmlFor="doctorName" className="text-sm font-medium">
                  اسم الطبيب
                </Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange("doctorName", e.target.value)}
                  placeholder="اسم الطبيب"
                  className="w-48 print:border-0 print:border-b-2 print:border-gray-400 print:rounded-none print:bg-transparent print:px-1"
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">توقيع الطبيب</p>
                <div className="relative w-40 h-16 border-b-2 border-gray-300 flex items-center justify-center">
                  {formData.doctorSignature ? (
                    <>
                      <img
                        src={formData.doctorSignature || "/placeholder.svg"}
                        alt="توقيع الطبيب"
                        className="h-12 w-auto cursor-pointer print:h-10"
                        onClick={() => document.getElementById("signature-upload").click()}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 print:hidden"
                        onClick={() => removeImage("doctorSignature")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <label htmlFor="signature-upload" className="cursor-pointer print:hidden">
                      <div className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-800">
                        <Upload className="w-4 h-4" />
                        تحميل التوقيع
                      </div>
                    </label>
                  )}
                  <input
                    id="signature-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "doctorSignature")}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">التاريخ</p>
                <p className="font-semibold">{formData.date}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 print:hidden">
            <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              حفظ
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1 bg-transparent">
              <Printer className="w-4 h-4 mr-2" />
              طباعة
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MedicineDialog
        open={isMedicineDialogOpen}
        onOpenChange={setIsMedicineDialogOpen}
        onAddMedicine={handleAddMedicine}
      />
    </>
  )
}
