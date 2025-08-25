import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Brush } from "lucide-react";
import { useCanvasStore } from "@/stores/canvas/use-canvas-store";

export const BrushSizeControl = React.memo(() => {
  const { brushSize, setBrushSize } = useCanvasStore();
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-2xl border min-w-fit">
      <Brush className="w-4 h-4" />
      <Label className="text-sm whitespace-nowrap">حجم الفرشاة</Label>
      <Slider
        value={[brushSize]}
        onValueChange={([value]) => setBrushSize(value)}
        min={1}
        max={20}
        step={1}
        className="w-32"
      />
      <span className="text-sm w-6 text-center">{brushSize}</span>
    </div>
  );
});

BrushSizeControl.displayName = "BrushSizeControl";
