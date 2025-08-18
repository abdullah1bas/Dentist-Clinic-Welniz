import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDentalStore } from "@/stores/dental-store"
import { PatientInfoSection } from "./case-sections/patient-info-section"
import { FinanceSection } from "./case-sections/finance-section"
import { ExpensesSection } from "./case-sections/expenses-section"
import { CasePresentationSection } from "./case-sections/case-presentation-section"
import { Save, Trash2, X } from "lucide-react"

export function CaseDialog() {
  console.log('caseDialog')
  const {
    isDialogOpen,
    setIsDialogOpen,
    selectedPatient,
    setSelectedPatient,
    addPatient,
    updatePatient,
    deletePatient,
  } = useDentalStore()

  const [activeTab, setActiveTab] = useState("patient-info")
  const [formData, setFormData] = useState({
    // Patient Info
    name: "",
    phone: "",
    address: "",
    occupation: "",
    gender: "ذكر",
    age: "",
    systemicConditions: "",
    notes: "",
    category: "علاج تحفظي",
    profileImage: "",

    // Finance
    totalAmount: "",
    currency: "EGP",
    treatmentDescription: "",

    // Case Presentation
    doctor: "د. محمد صادق",
    teethAffected: {
      upperLeft: 0,
      upperRight: 0,
      lowerLeft: 0,
      lowerRight: 0,
    },
    drawingImage: "",
  })

  // Initialize form data when dialog opens
  useState(() => {
    if (selectedPatient) {
      setFormData({
        name: selectedPatient.name || "",
        phone: selectedPatient.phone || "",
        address: selectedPatient.address || "",
        occupation: selectedPatient.occupation || "",
        gender: selectedPatient.gender || "ذكر",
        age: selectedPatient.age?.toString() || "",
        systemicConditions: selectedPatient.systemicConditions || "",
        notes: selectedPatient.notes || "",
        category: selectedPatient.category || "علاج تحفظي",
        profileImage: selectedPatient.profileImage || "",
        totalAmount: selectedPatient.totalAmount?.toString() || "",
        currency: selectedPatient.currency || "EGP",
        treatmentDescription: selectedPatient.treatmentDescription || "",
        doctor: selectedPatient.doctor || "د. محمد صادق",
        teethAffected: selectedPatient.teethAffected || {
          upperLeft: 0,
          upperRight: 0,
          lowerLeft: 0,
          lowerRight: 0,
        },
        drawingImage: selectedPatient.drawingImage || "",
      })
    } else {
      // Reset form for new patient
      setFormData({
        name: "",
        phone: "",
        address: "",
        occupation: "",
        gender: "ذكر",
        age: "",
        systemicConditions: "",
        notes: "",
        category: "علاج تحفظي",
        profileImage: "",
        totalAmount: "",
        currency: "EGP",
        treatmentDescription: "",
        doctor: "د. محمد صادق",
        teethAffected: {
          upperLeft: 0,
          upperRight: 0,
          lowerLeft: 0,
          lowerRight: 0,
        },
        drawingImage: "",
      })
    }
  }, [selectedPatient, isDialogOpen])

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("يرجى إدخال اسم المريض")
      return
    }

    const patientData = {
      ...formData,
      age: Number.parseInt(formData.age) || 0,
      totalAmount: Number.parseFloat(formData.totalAmount) || 0,
      remainingAmount: Number.parseFloat(formData.totalAmount) || 0,
      paidAmount: 0,
      payments: selectedPatient?.payments || [],
      expenses: selectedPatient?.expenses || [],
      caseNotes: selectedPatient?.caseNotes || [],
    }

    if (selectedPatient) {
      updatePatient(selectedPatient.id, patientData)
    } else {
      addPatient(patientData)
    }

    handleClose()
  }

  const handleDelete = () => {
    if (selectedPatient && confirm("هل أنت متأكد من حذف هذه الحالة؟")) {
      deletePatient(selectedPatient.id)
      handleClose()
    }
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setSelectedPatient(null)
    setActiveTab("patient-info")
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{selectedPatient ? "تعديل الحالة" : "حالة جديدة"}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="patient-info">معلومات المريض</TabsTrigger>
              <TabsTrigger value="finance">المالية</TabsTrigger>
              <TabsTrigger value="expenses">المصروفات</TabsTrigger>
              <TabsTrigger value="case-presentation">عرض الحالة</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="patient-info" className="mt-0">
                <PatientInfoSection
                  formData={formData}
                  updateFormData={updateFormData}
                  selectedPatient={selectedPatient}
                />
              </TabsContent>

              <TabsContent value="finance" className="mt-0">
                <FinanceSection formData={formData} updateFormData={updateFormData} selectedPatient={selectedPatient} />
              </TabsContent>

              <TabsContent value="expenses" className="mt-0">
                <ExpensesSection selectedPatient={selectedPatient} />
              </TabsContent>

              <TabsContent value="case-presentation" className="mt-0">
                <CasePresentationSection
                  formData={formData}
                  updateFormData={updateFormData}
                  selectedPatient={selectedPatient}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div>
            {selectedPatient && (
              <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                حذف الحالة
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              {selectedPatient ? "حفظ التعديلات" : "حفظ الحالة"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
