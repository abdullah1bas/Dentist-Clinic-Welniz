"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Save, Printer } from "lucide-react"

export const DentalChartHeader = ({ selectedPatient, onPrint, onSave }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              رجوع
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <Home className="w-4 h-4 mr-2" />
              الرئيسية
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">مخطط الأسنان التفاعلي</h1>
            {selectedPatient && <p className="text-sm text-gray-600">المريض: {selectedPatient.name}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              طباعة
            </Button>
            <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              حفظ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
