import React from "react";
import { Brush, StickyNote, Move } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODES } from "@/lib/dental-chart-utils";
import { useCanvasStore } from "@/stores/use-canvas-store";

export const ModeSelector = React.memo(() => {
  const {activeMode, setActiveMode} = useCanvasStore();
  return (
    <Tabs value={activeMode} onValueChange={setActiveMode} className="w-fit">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value={MODES.DRAW} className="flex items-center gap-2">
          <Brush className="w-4 h-4" />
          رسم
        </TabsTrigger>
        <TabsTrigger value={MODES.NOTE} className="flex items-center gap-2">
          <StickyNote className="w-4 h-4" />
          ملاحظات
        </TabsTrigger>
        <TabsTrigger value={MODES.PAN} className="flex items-center gap-2">
          <Move className="w-4 h-4" />
          تكبير/تحريك
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
});
