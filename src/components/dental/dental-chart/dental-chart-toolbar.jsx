"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const TOOTH_CONDITIONS = [
  { id: "healthy", color: "#10b981", label: "سليم" },
  { id: "caries", color: "#ef4444", label: "تسوس" },
  { id: "filled", color: "#3b82f6", label: "حشو" },
  { id: "crown", color: "#f59e0b", label: "تاج" },
  { id: "missing", color: "#6b7280", label: "مفقود" },
  { id: "root_canal", color: "#8b5cf6", label: "علاج جذور" },
  { id: "implant", color: "#059669", label: "زراعة" },
]

export function DentalChartToolbar({ selectedTool, onToolChange }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 self-center ml-4">اختر حالة السن:</span>
          {TOOTH_CONDITIONS.map((condition) => (
            <Button
              key={condition.id}
              variant={selectedTool === condition.id ? "default" : "outline"}
              size="sm"
              onClick={() => onToolChange(condition.id)}
              className="flex items-center gap-2"
            >
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: condition.color }} />
              {condition.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
