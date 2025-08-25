import { MODES } from "@/lib/dental-chart-utils";
import { create } from "zustand";

// Canvas store
export const useCanvasStore = create((set) => ({
  bgUrl: "/dental-chart.svg",
  zoom: 1,
  offset: { x: 0, y: 0 },
  drawColor: "#0ea5e9",
  brushSize: 3,
  isDrawing: false,
  activeMode: MODES.DRAW,
  
  setBgUrl: (url) => set(() => ({ bgUrl: url })),
  setZoom: (z) => set(() => ({ zoom: z })),
  setOffset: (o) => set(() => ({ offset: o })),
  setDrawColor: (c) => set(() => ({ drawColor: c })),
  setBrushSize: (s) => set(() => ({ brushSize: s })),
  setIsDrawing: (v) => set(() => ({ isDrawing: v })),
  setActiveMode: (m) => set(()=> ({activeMode: m}))
}));