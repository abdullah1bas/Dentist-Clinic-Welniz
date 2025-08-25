import React from "react";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/stores/canvas/use-canvas-store";

const DEFAULT_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#0ea5e9",
  "#8b5cf6",
  "#000000",
];

export const ColorPalette = React.memo(() => {
  const {drawColor, setDrawColor} = useCanvasStore();
  return (
    <div className="flex items-center gap-1 rounded-2xl p-1 border">
      {DEFAULT_COLORS.map((color) => (
        <Button
          key={color}
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 rounded-full border"
          style={{
            backgroundColor: color,
            outline:
              drawColor === color ? "3px solid rgba(0,0,0,0.2)" : "none",
          }}
          onClick={() => setDrawColor(color)}
          title={color}
        />
      ))}
      <input
        type="color"
        value={drawColor}
        onChange={(e) => setDrawColor(e.target.value)}
        className="w-8 h-8 rounded-full border cursor-pointer"
        title="اختر لونًا"
      />
    </div>
  );
});

ColorPalette.displayName = "ColorPalette";
