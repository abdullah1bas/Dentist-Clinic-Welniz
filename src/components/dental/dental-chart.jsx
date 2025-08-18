import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDentalStore } from "@/stores/dental-store"
import { Save, RotateCcw, X } from "lucide-react"

const TOOTH_CONDITIONS = {
  healthy: { color: "#ffffff", label: "سليم" },
  caries: { color: "#ff4444", label: "تسوس" },
  filled: { color: "#4444ff", label: "حشو" },
  crown: { color: "#ffaa00", label: "تاج" },
  missing: { color: "#888888", label: "مفقود" },
  root_canal: { color: "#aa44aa", label: "علاج جذور" },
  implant: { color: "#00aa44", label: "زراعة" },
}

export function DentalChart() {
  const { isDentalChartOpen, setIsDentalChartOpen, selectedPatient, updateDentalChart } = useDentalStore()
  const [selectedCondition, setSelectedCondition] = useState("healthy")
  const [toothStates, setToothStates] = useState(selectedPatient?.dentalChart || {})

  const handleToothClick = (toothId) => {
    setToothStates((prev) => ({ ...prev, [toothId]: selectedCondition }))
  }

  const handleSave = () => {
    if (selectedPatient) {
      updateDentalChart(selectedPatient.id, toothStates)
    }
    setIsDentalChartOpen(false)
  }

  const getToothColor = (toothId) => {
    const condition = toothStates[toothId] || "healthy"
    return TOOTH_CONDITIONS[condition]?.color || "#ffffff"
  }

  return (
    <Dialog open={isDentalChartOpen} onOpenChange={() => setIsDentalChartOpen(false)}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>مخطط الأسنان - {selectedPatient?.name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsDentalChartOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Condition Selector */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
            {Object.entries(TOOTH_CONDITIONS).map(([key, condition]) => (
              <Button
                key={key}
                variant={selectedCondition === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCondition(key)}
                className="flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: condition.color }} />
                {condition.label}
              </Button>
            ))}
          </div>

          {/* Dental Chart */}
          <div className="bg-white rounded-lg border p-4">
            <svg viewBox="0 0 800 400" className="w-full h-auto max-h-96">
              {/* Upper Jaw */}
              <text x="400" y="30" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">
                الفك العلوي
              </text>

              {/* Upper Right */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((tooth) => (
                <g key={`upper-right-${tooth}`}>
                  <circle
                    cx={400 + tooth * 40}
                    cy={80}
                    r={18}
                    fill={getToothColor(`upper-right-${tooth}`)}
                    stroke="#333"
                    strokeWidth="2"
                    onClick={() => handleToothClick(`upper-right-${tooth}`)}
                    className="hover:stroke-blue-500 hover:stroke-4 cursor-pointer"
                  />
                  <text
                    x={400 + tooth * 40}
                    y={85}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#333"
                    className="pointer-events-none"
                  >
                    {tooth}
                  </text>
                </g>
              ))}

              {/* Upper Left */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((tooth) => (
                <g key={`upper-left-${tooth}`}>
                  <circle
                    cx={400 - tooth * 40}
                    cy={80}
                    r={18}
                    fill={getToothColor(`upper-left-${tooth}`)}
                    stroke="#333"
                    strokeWidth="2"
                    onClick={() => handleToothClick(`upper-left-${tooth}`)}
                    className="hover:stroke-blue-500 hover:stroke-4 cursor-pointer"
                  />
                  <text
                    x={400 - tooth * 40}
                    y={85}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#333"
                    className="pointer-events-none"
                  >
                    {tooth}
                  </text>
                </g>
              ))}

              {/* Lower Jaw */}
              <text x="400" y="370" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">
                الفك السفلي
              </text>

              {/* Lower Right */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((tooth) => (
                <g key={`lower-right-${tooth}`}>
                  <circle
                    cx={400 + tooth * 40}
                    cy={320}
                    r={18}
                    fill={getToothColor(`lower-right-${tooth}`)}
                    stroke="#333"
                    strokeWidth="2"
                    onClick={() => handleToothClick(`lower-right-${tooth}`)}
                    className="hover:stroke-blue-500 hover:stroke-4 cursor-pointer"
                  />
                  <text
                    x={400 + tooth * 40}
                    y={325}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#333"
                    className="pointer-events-none"
                  >
                    {tooth}
                  </text>
                </g>
              ))}

              {/* Lower Left */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((tooth) => (
                <g key={`lower-left-${tooth}`}>
                  <circle
                    cx={400 - tooth * 40}
                    cy={320}
                    r={18}
                    fill={getToothColor(`lower-left-${tooth}`)}
                    stroke="#333"
                    strokeWidth="2"
                    onClick={() => handleToothClick(`lower-left-${tooth}`)}
                    className="hover:stroke-blue-500 hover:stroke-4 cursor-pointer"
                  />
                  <text
                    x={400 - tooth * 40}
                    y={325}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#333"
                    className="pointer-events-none"
                  >
                    {tooth}
                  </text>
                </g>
              ))}

              {/* Center Line */}
              <line x1="400" y1="50" x2="400" y2="350" stroke="#666" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {Object.entries(TOOTH_CONDITIONS).map(([key, condition]) => {
              const count = Object.values(toothStates).filter((state) => state === key).length
              return (
                <div key={key} className="text-center p-2 bg-white rounded border">
                  <div className="text-lg font-bold" style={{ color: condition.color }}>
                    {count}
                  </div>
                  <div className="text-xs text-gray-600">{condition.label}</div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setToothStates({})} className="text-red-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              إعادة تعيين
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDentalChartOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                حفظ المخطط
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
