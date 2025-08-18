import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDentalStore } from "@/stores/dental-store"
import { Stethoscope, FileText, QrCode, Printer, User } from "lucide-react"
import QRCode from "qrcode"

export function PatientActions({ selectedPatient }) {
  const { setIsPrescriptionDialogOpen, setIsDentalChartOpen, setSelectedPatient, clinicLogo } = useDentalStore()
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  const generateQRCode = async () => {
    try {
      const patientName = selectedPatient?.name || "مريض جديد"
      const patientId = selectedPatient?.id || "NEW"
      const currentDate = new Date().toLocaleDateString("ar-EG")
      const qrData = `${patientName}\nID: ${patientId}\n${currentDate}`

      const url = await QRCode.toDataURL(qrData, { width: 200, margin: 1 })
      setQrCodeUrl(url)
    } catch (err) {
      console.error(err)
    }
  }

  const printPatientCard = () => {
    if (!selectedPatient) {
      alert("يرجى حفظ بيانات المريض أولاً")
      return
    }

    const printWindow = window.open("", "_blank")
    const currentDate = new Date().toLocaleDateString("ar-EG")

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>بطاقة المريض</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px; margin: 0; width: 85mm; height: 54mm; font-size: 10px; }
            .card { border: 2px solid #333; border-radius: 8px; padding: 8px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
            .header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 5px; }
            .logo { max-width: 40px; max-height: 40px; margin-bottom: 3px; }
            .clinic-name { font-size: 12px; font-weight: bold; margin: 0; }
            .content { flex: 1; display: flex; justify-content: space-between; }
            .patient-info { flex: 1; }
            .patient-name { font-size: 14px; font-weight: bold; margin-bottom: 3px; }
            .patient-details { font-size: 9px; line-height: 1.3; }
            .qr-section { width: 50px; text-align: center; }
            .qr-code { width: 45px; height: 45px; }
            .footer { text-align: center; font-size: 8px; color: #666; border-top: 1px solid #ccc; padding-top: 3px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              ${clinicLogo ? `<img src="${clinicLogo}" alt="شعار العيادة" class="logo" />` : ""}
              <h3 class="clinic-name">عيادة الأسنان</h3>
            </div>
            <div class="content">
              <div class="patient-info">
                <div class="patient-name">${selectedPatient.name}</div>
                <div class="patient-details">
                  <div>رقم المريض: ${selectedPatient.id}</div>
                  <div>الهاتف: ${selectedPatient.phone}</div>
                </div>
              </div>
              ${qrCodeUrl ? `<div class="qr-section"><img src="${qrCodeUrl}" alt="QR Code" class="qr-code" /></div>` : ""}
            </div>
            <div class="footer">${currentDate}</div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleAction = (action) => {
    if (!selectedPatient) {
      alert("يرجى حفظ بيانات المريض أولاً")
      return
    }

    setSelectedPatient(selectedPatient)

    if (action === "prescription") {
      setIsPrescriptionDialogOpen(true)
    } else if (action === "dental-chart") {
      setIsDentalChartOpen(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          الإجراءات السريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAction("dental-chart")}
            className="h-20 flex flex-col gap-2 bg-blue-50 hover:bg-blue-100"
          >
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <span className="text-sm">مخطط الأسنان</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleAction("prescription")}
            className="h-20 flex flex-col gap-2 bg-green-50 hover:bg-green-100"
          >
            <FileText className="w-6 h-6 text-green-600" />
            <span className="text-sm">الروشتة الطبية</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={generateQRCode}
            className="h-20 flex flex-col gap-2 bg-purple-50 hover:bg-purple-100"
          >
            <QrCode className="w-6 h-6 text-purple-600" />
            <span className="text-sm">إنشاء QR Code</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={printPatientCard}
            className="h-20 flex flex-col gap-2 bg-orange-50 hover:bg-orange-100"
          >
            <Printer className="w-6 h-6 text-orange-600" />
            <span className="text-sm">طباعة البطاقة</span>
          </Button>
        </div>

        {qrCodeUrl && (
          <div className="mt-6 text-center">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="mx-auto w-32 h-32" />
            <p className="text-sm text-gray-600 mt-2">QR Code للمريض</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
