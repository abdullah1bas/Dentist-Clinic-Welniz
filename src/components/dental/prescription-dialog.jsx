import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDentalStore } from "@/stores/dental-store"
import { Save, Printer, X, Upload } from "lucide-react"
import { useState } from "react"

export function PrescriptionDialog() {
  const {
    isPrescriptionDialogOpen,
    setIsPrescriptionDialogOpen,
    selectedPatient,
    addPrescription,
    clinicLogo,
    setClinicLogo,
  } = useDentalStore()
  const [doctorSignature, setDoctorSignature] = useState("")

  const form = useForm({
    defaultValues: {
      patientName: selectedPatient?.name || "",
      patientAge: selectedPatient?.age?.toString() || "",
      diagnosis: "",
      medications: "",
      instructions: "",
      doctorName: selectedPatient?.doctor || "د. محمد صادق",
      date: new Date().toISOString().split("T")[0],
    },
  })

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setClinicLogo(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setDoctorSignature(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data) => {
    if (selectedPatient) {
      addPrescription(selectedPatient.id, { ...data, clinicLogo, doctorSignature })
    }
    handleClose()
  }

  const handlePrint = () => {
    const data = form.getValues()
    const printWindow = window.open("", "_blank")

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>روشتة طبية</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; background: white; }
            .prescription { max-width: 800px; margin: 0 auto; border: 2px solid #333; padding: 20px; background: white; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { max-width: 100px; max-height: 100px; margin-bottom: 10px; }
            .clinic-name { font-size: 24px; font-weight: bold; margin: 10px 0; }
            .patient-info { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .rx-header { font-size: 36px; font-weight: bold; color: #0066cc; margin: 20px 0 15px 0; }
            .diagnosis { margin-bottom: 20px; padding: 10px; background: #f0f8ff; border-radius: 5px; }
            .medications { margin-bottom: 20px; min-height: 200px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; line-height: 1.8; font-size: 16px; white-space: pre-line; }
            .instructions { margin-bottom: 20px; padding: 10px; background: #fff8dc; border-radius: 5px; }
            .footer { display: flex; justify-content: space-between; align-items: end; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            .signature { text-align: center; }
            .signature img { max-width: 150px; max-height: 80px; margin-bottom: 10px; }
            .signature-line { height: 60px; border-bottom: 1px solid #333; width: 200px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="prescription">
            <div class="header">
              ${clinicLogo ? `<img src="${clinicLogo}" alt="شعار العيادة" class="logo" />` : ""}
              <div class="clinic-name">عيادة الأسنان</div>
              <div>استشاري طب وجراحة الفم والأسنان</div>
            </div>
            
            <div class="patient-info">
              <div><strong>اسم المريض:</strong> ${data.patientName}</div>
              <div><strong>العمر:</strong> ${data.patientAge} سنة</div>
              <div><strong>التاريخ:</strong> ${data.date}</div>
            </div>

            ${data.diagnosis ? `<div class="diagnosis"><strong>التشخيص:</strong><br>${data.diagnosis}</div>` : ""}

            <div class="rx-header">℞</div>
            <div class="medications">${data.medications || "لم يتم تحديد أدوية"}</div>

            ${data.instructions ? `<div class="instructions"><strong>تعليمات:</strong><br>${data.instructions}</div>` : ""}

            <div class="footer">
              <div class="signature">
                ${doctorSignature ? `<img src="${doctorSignature}" alt="توقيع الطبيب" />` : '<div class="signature-line"></div>'}
                <div><strong>${data.doctorName}</strong></div>
              </div>
              <div>${data.date}</div>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleClose = () => {
    setIsPrescriptionDialogOpen(false)
    form.reset()
    setDoctorSignature("")
  }

  return (
    <Dialog open={isPrescriptionDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>روشتة طبية</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Clinic Logo */}
            <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
              {clinicLogo ? (
                <img
                  src={clinicLogo || "/placeholder.svg"}
                  alt="شعار العيادة"
                  className="mx-auto max-w-24 max-h-24 mb-2"
                />
              ) : (
                <div className="py-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">شعار العيادة</p>
                </div>
              )}
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {clinicLogo ? "تغيير الشعار" : "رفع الشعار"}
                  </span>
                </Button>
              </label>
              <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المريض</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العمر</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Diagnosis */}
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التشخيص</FormLabel>
                  <FormControl>
                    <Textarea placeholder="التشخيص الطبي..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Medications */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-blue-600">℞</span>
                <FormLabel className="text-lg">الأدوية</FormLabel>
              </div>
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="• الدواء الأول&#10;• الدواء الثاني&#10;• الدواء الثالث"
                        className="min-h-[150px] text-lg leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Instructions */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعليمات للمريض</FormLabel>
                  <FormControl>
                    <Textarea placeholder="تعليمات خاصة للمريض..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Doctor Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الطبيب</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>توقيع الطبيب</FormLabel>
                {doctorSignature ? (
                  <div className="relative">
                    <img
                      src={doctorSignature || "/placeholder.svg"}
                      alt="توقيع الطبيب"
                      className="max-w-24 max-h-12 border rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 w-5 h-5 p-0"
                      onClick={() => setDoctorSignature("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded p-2 text-center">
                    <label htmlFor="signature-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          رفع التوقيع
                        </span>
                      </Button>
                    </label>
                    <input
                      id="signature-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                طباعة
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  حفظ الروشتة
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
