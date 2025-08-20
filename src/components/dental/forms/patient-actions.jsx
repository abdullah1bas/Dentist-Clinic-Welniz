import { useUIStore } from '@/stores/uiStore';
import React, { useState } from 'react'
import { Upload, X, Stethoscope, FileText, QrCode, User } from "lucide-react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function PatientActions({formData, updateFormData}) {
  console.log(formData);
  const { selectedPatient } = useUIStore();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const navigate = useNavigate();
  const handleImageUpload = (e) => {
  const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updateFormData("profileImage", "");
  };

  const generateQRCode = async () => {
    try {
      const qrData = `Patient: ${formData.name}\nID: ${
        selectedPatient?.id || "NEW"
      }\nPhone: ${formData.phone}\nToz feek`;
      const url = await QRCode.toDataURL(qrData);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const printPatientData = () => {
    const printWindow = window.open("", "_blank");
    const currentDate = new Date().toLocaleDateString("ar-EG");

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>بيانات المريض</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .patient-info { margin-bottom: 20px; }
            .qr-code { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>بيانات المريض</h1>
            <p>التاريخ: ${currentDate}</p>
          </div>
          <div class="patient-info">
            <h2>${formData.name}</h2>
            <p><strong>رقم المريض:</strong> ${selectedPatient?.id || "جديد"}</p>
            <p><strong>الهاتف:</strong> ${formData.phone}</p>
            <p><strong>العنوان:</strong> ${formData.address}</p>
            <p><strong>المهنة:</strong> ${formData.occupation}</p>
            <p><strong>العمر:</strong> ${formData.age} سنة</p>
            <p><strong>الجنس:</strong> ${formData.gender}</p>
          </div>
          ${
            qrCodeUrl
              ? `<div class="qr-code"><img src="${qrCodeUrl}" alt="QR Code" /></div>`
              : ""
          }
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  return (
    <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            الصورة الشخصية والإجراءات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {formData.profileImage ? (
                  <>
                    <img
                      src={formData.profileImage || "/placeholder.svg"}
                      alt="صورة المريض"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-8 h-8 p-0"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <label htmlFor="profile-upload" className="cursor-pointer">
                <Button variant="outline" className="bg-transparent" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.profileImage ? "تغيير الصورة" : "رفع صورة"}
                  </span>
                </Button>
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPatient && <Button onClick={() => navigate(`/dental-annotated`)}
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <span className="text-sm">مخطط الأسنان</span>
              </Button>}

              <Button
                variant="outline" onClick={() => navigate(`/prescriptions`)}
                className="h-20 flex flex-col gap-2 bg-green-50 hover:bg-green-100 border-green-200"
              >
                <FileText className="w-6 h-6 text-green-600" />
                <span className="text-sm">الروشتة الطبية</span>
              </Button>

              <Button
                variant="outline"
                onClick={generateQRCode}
                className="h-20 flex flex-col gap-2 bg-purple-50 hover:bg-purple-100 border-purple-200"
              >
                <QrCode className="w-6 h-6 text-purple-600" />
                <span className="text-sm">إنشاء QR Code</span>
              </Button>

              <Button
                variant="outline"
                onClick={printPatientData}
                className="h-20 flex flex-col gap-2 bg-orange-50 hover:bg-orange-100 border-orange-200"
              >
                <FileText className="w-6 h-6 text-orange-600" />
                <span className="text-sm">طباعة البيانات</span>
              </Button>
            </div>
          </div>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="mt-6 text-center">
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt="QR Code"
                className="mx-auto w-32 h-32"
              />
              <p className="text-sm text-gray-600 mt-2">QR Code للمريض</p>
            </div>
          )}
        </CardContent>
      </Card>
  )
}

export default PatientActions