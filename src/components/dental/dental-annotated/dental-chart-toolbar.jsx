import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPalette } from "./color-palette";
import { BrushSizeControl } from "./brush-size-control";
import { ModeSelector } from "./mode-selector";
import { ActionButtons } from "./action-buttons";

export const DentalChartToolbar = ({ bgImageRef, canvasRef, overlayRef }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">أدوات الرسم والتعليق</CardTitle>
        <div className="flex flex-wrap items-center gap-4">
          <ColorPalette />
          <BrushSizeControl />
          <ModeSelector />
          <ActionButtons {...{ overlayRef, canvasRef, bgImageRef }} />
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>وضع الرسم:</strong> اختر لون وحجم الفرشاة ثم ارسم على
            المخطط.
            <br />
            <strong>وضع الملاحظات:</strong> انقر نقرتين على أي موضع لإضافة
            ملاحظة قابلة للسحب.
            <br />
            <strong>وضع التكبير/التحريك:</strong> استخدم عجلة الفأرة للتكبير أو
            اسحب للتحريك.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
