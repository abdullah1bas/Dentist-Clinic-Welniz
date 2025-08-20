import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ColorPalette } from "./color-palette"
import { BrushSizeControl } from "./brush-size-control"
import { ModeSelector } from "./mode-selector"
import { ActionButtons } from "./action-buttons"

export const DentalChartToolbar = ({
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  activeMode,
  onModeChange,
  onUndo,
  onClearDrawing,
  onClearNotes,
  onUploadBackground,
  onExport,
  canUndo,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">أدوات الرسم والتعليق</CardTitle>
        <div className="flex flex-wrap items-center gap-4">
          <ColorPalette selectedColor={color} onColorChange={onColorChange} />
          <BrushSizeControl brushSize={brushSize} onBrushSizeChange={onBrushSizeChange} />
          <ModeSelector activeMode={activeMode} onModeChange={onModeChange} />
          <ActionButtons
            onUndo={onUndo}
            onClearDrawing={onClearDrawing}
            onClearNotes={onClearNotes}
            onUploadBackground={onUploadBackground}
            onExport={onExport}
            canUndo={canUndo}
          />
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>وضع الرسم:</strong> اختر لون وحجم الفرشاة ثم ارسم على المخطط.
            <br />
            <strong>وضع الملاحظات:</strong> انقر نقرتين على أي موضع لإضافة ملاحظة قابلة للسحب.
            <br />
            <strong>وضع التكبير/التحريك:</strong> استخدم عجلة الفأرة للتكبير أو اسحب للتحريك.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
