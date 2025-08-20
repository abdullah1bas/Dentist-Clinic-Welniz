
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TOOTH_CONDITIONS = [
  { id: "healthy", color: "#10b981", label: "سليم" },
  { id: "caries", color: "#ef4444", label: "تسوس" },
  { id: "filled", color: "#3b82f6", label: "حشو" },
  { id: "crown", color: "#f59e0b", label: "تاج" },
  { id: "missing", color: "#6b7280", label: "مفقود" },
  { id: "root_canal", color: "#8b5cf6", label: "علاج جذور" },
  { id: "implant", color: "#059669", label: "زراعة" },
]

export function DentalChartStats({ teethConditions = {} }) {
  const getConditionCount = (conditionId) => {
    return Object.values(teethConditions).filter((condition) => condition === conditionId).length
  }

  const totalTeeth = Object.keys(teethConditions).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>إحصائيات الأسنان</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4 mb-4">
          {TOOTH_CONDITIONS.map((condition) => {
            const count = getConditionCount(condition.id)
            return (
              <div key={condition.id} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold mb-1" style={{ color: condition.color }}>
                  {count}
                </div>
                <div className="text-xs text-gray-600">{condition.label}</div>
              </div>
            )
          })}
        </div>

        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-semibold text-blue-600">إجمالي الأسنان المسجلة: {totalTeeth}</div>
        </div>

        <div className="mt-4 pt-4 border-t text-sm text-gray-500 text-center">
          آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
        </div>
      </CardContent>
    </Card>
  )
}
