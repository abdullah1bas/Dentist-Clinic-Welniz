import { useRef, useEffect } from "react";
import { DrawingCanvas } from "./dental-annotated/drawing-canvas";
import { useCanvasDrawing } from "@/hooks/use-canvas-drawing";
import { NoteDialog } from "./dental-annotated/note-dialog";
import { DentalChartHeader } from "./dental-annotated/dental-chart-header";
import { DentalChartToolbar } from "./dental-annotated/dental-chart-toolbar";
import { DentalChartStats } from "./dental-annotated/dental-chart-stats";
import { useCanvasStore } from "@/stores/use-canvas-store";
import { useUIStore } from "@/stores/uiStore";

export default function DentalChartPage() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const bgImageRef = useRef(null);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  // Patient data
  const { setSelectedPatient } = useUIStore();

  // 📌 canvas store
  const { zoom, offset } = useCanvasStore();

  const { drawBase, snapshot } =
    useCanvasDrawing(canvasRef, bgImageRef, offset, zoom);

  // Load patient data
  useEffect(() => {
    const patientData = localStorage.getItem("selectedPatient");
    if (patientData) {
      try {
        setSelectedPatient(JSON.parse(patientData));
      } catch (error) {
        console.error("Error parsing patient data:", error);
      }
    }
  }, [setSelectedPatient]);

  // تحميل صورة الخلفية من المشروع (ثابتة)
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      bgImageRef.current = img;
      drawBase();
    };
    img.src = "/dental-chart.svg"; // ✅ ثابتة
  }, [drawBase]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <DentalChartHeader />

      <div className="max-w-7xl mx-auto p-4">
        <DentalChartToolbar {...{bgImageRef, canvasRef, overlayRef}}
        />

        <div className="mt-4">
          <DrawingCanvas
            canvasRef={canvasRef}
            dragOffset={dragOffset}
            overlayRef={overlayRef}
            snapshot={snapshot}
          />
        </div>

        <DentalChartStats />
      </div>

      <NoteDialog />
    </div>
  );
}
