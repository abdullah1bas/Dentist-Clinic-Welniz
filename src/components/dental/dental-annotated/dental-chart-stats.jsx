import { MODES } from "./mode-selector"

export const DentalChartStats = ({ notes, zoom, brushSize, activeMode }) => {
  const getModeText = (mode) => {
    switch (mode) {
      case MODES.DRAW:
        return "رسم"
      case MODES.NOTE:
        return "ملاحظات"
      case MODES.PAN:
        return "تكبير/تحريك"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border text-center">
        <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
        <div className="text-sm text-gray-600">عدد الملاحظات</div>
      </div>
      <div className="bg-white p-4 rounded-lg border text-center">
        <div className="text-2xl font-bold text-green-600">{Math.round(zoom * 100)}%</div>
        <div className="text-sm text-gray-600">مستوى التكبير</div>
      </div>
      <div className="bg-white p-4 rounded-lg border text-center">
        <div className="text-2xl font-bold text-purple-600">{brushSize}px</div>
        <div className="text-sm text-gray-600">حجم الفرشاة</div>
      </div>
      <div className="bg-white p-4 rounded-lg border text-center">
        <div className="text-sm font-bold text-orange-600">{getModeText(activeMode)}</div>
        <div className="text-sm text-gray-600">الوضع النشط</div>
      </div>
    </div>
  )
}
