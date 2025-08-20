import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Brush, 
  StickyNote, 
  Move, 
  Undo, 
  Eraser, 
  Trash2, 
  Upload, 
  Download,
  ZoomIn,
  RotateCcw
} from 'lucide-react';

// Constants
const CANVAS_SIZE = { width: 1000, height: 700 };
const DEFAULT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#0ea5e9", "#8b5cf6", "#000000"];
const MODES = { DRAW: 'draw', NOTE: 'note', PAN: 'pan' };

// Helper functions
const uid = () => Math.random().toString(36).slice(2, 9);
const createFallbackSvg = () => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <defs>
        <pattern id='g' width='20' height='20' patternUnits='userSpaceOnUse'>
          <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#ddd' stroke-width='1'/>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='white'/>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='20'>
        ضع صورة مخطط الأسنان أو استخدم الزر بالأسفل
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

// Color Palette Component
const ColorPalette = React.memo(({ selectedColor, onColorChange }) => (
  <div className="flex items-center gap-1 rounded-2xl p-1 border">
    {DEFAULT_COLORS.map((color) => (
      <Button
        key={color}
        variant="ghost"
        size="sm"
        className="w-6 h-6 p-0 rounded-full border"
        style={{ 
          backgroundColor: color,
          outline: selectedColor === color ? "3px solid rgba(0,0,0,0.2)" : "none" 
        }}
        onClick={() => onColorChange(color)}
        title={color}
      />
    ))}
    <input
      type="color"
      value={selectedColor}
      onChange={(e) => onColorChange(e.target.value)}
      className="w-8 h-8 rounded-full border cursor-pointer"
      title="اختر لونًا"
    />
  </div>
));

// Brush Size Control
const BrushSizeControl = React.memo(({ brushSize, onBrushSizeChange }) => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-2xl border min-w-fit">
    <Brush className="w-4 h-4" />
    <Label className="text-sm whitespace-nowrap">حجم الفرشاة</Label>
    <Slider
      value={[brushSize]}
      onValueChange={([value]) => onBrushSizeChange(value)}
      min={1}
      max={20}
      step={1}
      className="w-32"
    />
    <span className="text-sm w-6 text-center">{brushSize}</span>
  </div>
));

// Mode Selector
const ModeSelector = React.memo(({ activeMode, onModeChange }) => (
  <Tabs value={activeMode} onValueChange={onModeChange} className="w-fit">
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
));

// Action Buttons
const ActionButtons = React.memo(({ 
  onUndo, 
  onClearDrawing, 
  onClearNotes, 
  onUploadBackground, 
  onExport,
  canUndo 
}) => (
  <div className="flex items-center gap-2">
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onUndo} 
      disabled={!canUndo}
      title="تراجع"
    >
      <Undo className="w-4 h-4" />
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClearDrawing} 
      title="مسح الرسم"
    >
      <Eraser className="w-4 h-4" />
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClearNotes} 
      title="مسح الملاحظات"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
    <Button variant="outline" size="sm" asChild>
      <label className="cursor-pointer">
        <input 
          type="file" 
          accept="image/*,.svg" 
          className="hidden" 
          onChange={onUploadBackground} 
        />
        <Upload className="w-4 h-4 mr-2" />
        صورة الخلفية
      </label>
    </Button>
    <Button onClick={onExport} className="bg-green-600 hover:bg-green-700">
      <Download className="w-4 h-4 mr-2" />
      حفظ كصورة
    </Button>
  </div>
));

// Note Dialog Component
const NoteDialog = React.memo(({ 
  isOpen, 
  onClose, 
  noteText, 
  noteColor, 
  isEditing, 
  onSave, 
  onDelete, 
  onTextChange, 
  onColorChange 
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{isEditing ? "تعديل الملاحظة" : "إضافة ملاحظة"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Textarea
          value={noteText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="اكتب الملاحظة هنا..."
          className="min-h-[100px]"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <Label>لون الملاحظة:</Label>
          <input
            type="color"
            value={noteColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 rounded-full border cursor-pointer"
          />
        </div>
      </div>
      <DialogFooter className="flex justify-between">
        {isEditing && (
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            حذف
          </Button>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "حفظ" : "إضافة"}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));

// Note Component
const Note = React.memo(({ 
  note, 
  zoom, 
  offset, 
  onStartDrag, 
  onEdit 
}) => (
  <div
    className="absolute pointer-events-auto"
    style={{ 
      left: note.boxX * zoom + offset.x, 
      top: note.boxY * zoom + offset.y,
      transform: `scale(${Math.max(0.8, zoom)})`,
      transformOrigin: 'top left'
    }}
    onMouseDown={(e) => onStartDrag(e, note.id)}
  >
    <div
      className="border rounded-xl shadow-lg p-3 text-sm max-w-[220px] cursor-move transition-all hover:shadow-xl"
      style={{ 
        backgroundColor: note.color || "#fef9c3", 
        borderColor: note.color ? `${note.color}99` : "#fde68a" 
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onEdit(note.id);
      }}
    >
      <div className="font-medium mb-1" style={{ color: "#78350f" }}>
        ملاحظة
      </div>
      <div className="whitespace-pre-wrap text-xs" style={{ color: "#7c2d12" }}>
        {note.text || "—"}
      </div>
    </div>
  </div>
));

// Main Canvas Component
const DrawingCanvas = React.memo(({ 
  canvasRef,
  overlayRef,
  notes,
  zoom,
  offset,
  activeMode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  onDoubleClick,
  onNoteDrag,
  onNoteEdit
}) => {
  const handleMouseMove = useCallback((e) => {
    onPointerMove(e);
    onNoteDrag.onMove(e);
  }, [onPointerMove, onNoteDrag.onMove]);

  const handleMouseUp = useCallback((e) => {
    onPointerUp(e);
    onNoteDrag.onEnd();
  }, [onPointerUp, onNoteDrag.onEnd]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border shadow-inner select-none"
      style={{ width: CANVAS_SIZE.width, height: CANVAS_SIZE.height }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        style={{ cursor: activeMode === MODES.PAN ? 'grab' : 'crosshair' }}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onWheel={onWheel}
        onDoubleClick={onDoubleClick}
      />
      
      <svg 
        ref={overlayRef} 
        className="absolute inset-0 pointer-events-none bg-background/30" 
        width={CANVAS_SIZE.width} 
        height={CANVAS_SIZE.height}
      >
        {notes.map((note) => (
          <g key={note.id}>
            <circle 
              cx={note.x * zoom + offset.x} 
              cy={note.y * zoom + offset.y} 
              r={5} 
              fill="#ef4444" 
              className="drop-shadow-sm"
            />
            <line
              x1={note.x * zoom + offset.x}
              y1={note.y * zoom + offset.y}
              x2={note.boxX * zoom + offset.x}
              y2={note.boxY * zoom + offset.y}
              stroke="#111827"
              strokeWidth={1.5}
              strokeDasharray="3,3"
            />
          </g>
        ))}
      </svg>

      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          zoom={zoom}
          offset={offset}
          onStartDrag={onNoteDrag.onStart}
          onEdit={onNoteEdit}
        />
      ))}
    </div>
  );
});

// Custom hook for canvas drawing
const useCanvasDrawing = (canvasRef, bgImageRef, size, offset, zoom) => {
  const [history, setHistory] = useState([]);

  const drawBase = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = size.width;
    canvas.height = size.height;
    
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size.width / zoom, size.height / zoom);
    
    const img = bgImageRef.current;
    if (img) {
      const scale = Math.min(size.width / img.width, size.height / img.height) * zoom;
      const iw = img.width * scale;
      const ih = img.height * scale;
      const ix = (size.width - iw) / 2 / zoom;
      const iy = (size.height - ih) / 2 / zoom;
      
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, ix, iy, iw, ih);
    }
    
    ctx.restore();
  }, [canvasRef, bgImageRef, size, offset, zoom]);

  const snapshot = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory(prev => [...prev.slice(-9), data]); // Keep last 10 snapshots
    } catch (error) {
      console.warn('Failed to create snapshot:', error);
    }
  }, [canvasRef]);

  const restore = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || history.length === 0) return;

    setHistory(prev => {
      const newHistory = prev.slice(0, -1);
      const lastSnapshot = prev[prev.length - 1];
      
      drawBase();
      ctx.putImageData(lastSnapshot, offset.x, offset.y);
      
      return newHistory;
    });
  }, [canvasRef, history, drawBase, offset]);

  const clearDrawing = useCallback(() => {
    drawBase();
    setHistory([]);
  }, [drawBase]);

  return { drawBase, snapshot, restore, clearDrawing, canUndo: history.length > 0 };
};

// Main Component
export default function DentalCanvasAnnotator() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const bgImageRef = useRef(null);
  const dragOffset = useRef({ dx: 0, dy: 0 });
  
  const [bgUrl, setBgUrl] = useState(createFallbackSvg());
  const [isLoaded, setIsLoaded] = useState(false);
  const [notes, setNotes] = useState([]);
  const [activeMode, setActiveMode] = useState(MODES.DRAW);
  const [color, setColor] = useState("#0ea5e9");
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Note dialog state
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteColor, setNoteColor] = useState("#fef9c3");
  const [dblPoint, setDblPoint] = useState(null);
  const [draggingNoteId, setDraggingNoteId] = useState(null);

  const { drawBase, snapshot, restore, clearDrawing, canUndo } = useCanvasDrawing(
    canvasRef, 
    bgImageRef, 
    CANVAS_SIZE, 
    offset, 
    zoom
  );

  // Load background image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      bgImageRef.current = img;
      setIsLoaded(true);
      drawBase();
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        bgImageRef.current = fallbackImg;
        setIsLoaded(true);
        drawBase();
      };
      fallbackImg.src = createFallbackSvg();
    };
    img.src = bgUrl;
  }, [bgUrl, drawBase]);

  // Event position helper
  const posFromEvent = useCallback((e) => {
    const rect = e.target.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / zoom,
      y: (e.clientY - rect.top - offset.y) / zoom,
    };
  }, [offset, zoom]);

  // Drawing handlers
  const handlePointerDown = useCallback((e) => {
    if (activeMode === MODES.DRAW) {
      setIsDrawing(true);
      snapshot();
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const { x, y } = posFromEvent(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (activeMode === MODES.PAN) {
      setIsDrawing(true);
      const { x, y } = posFromEvent(e);
      dragOffset.current = { dx: x * zoom - offset.x, dy: y * zoom - offset.y };
    }
  }, [activeMode, posFromEvent, snapshot, offset, zoom]);

  const handlePointerMove = useCallback((e) => {
    if (activeMode === MODES.DRAW && isDrawing) {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const { x, y } = posFromEvent(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    } else if (activeMode === MODES.PAN && isDrawing) {
      const { x, y } = posFromEvent(e);
      const newOffset = { 
        x: x * zoom - dragOffset.current.dx, 
        y: y * zoom - dragOffset.current.dy 
      };
      setOffset(newOffset);
    }
  }, [activeMode, isDrawing, posFromEvent, color, brushSize, zoom]);

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Zoom handler
  const handleWheel = useCallback((e) => {
    if (activeMode !== MODES.PAN) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prevZoom => Math.max(0.5, Math.min(3, prevZoom * delta)));
  }, [activeMode]);

  // Note handlers
  const handleDoubleClick = useCallback((e) => {
    if (activeMode !== MODES.NOTE) return;
    const { x, y } = posFromEvent(e);
    setDblPoint({ x, y });
    setEditingNoteId(null);
    setNoteDraft("");
    setShowNoteDialog(true);
  }, [activeMode, posFromEvent]);

  const saveNote = useCallback(() => {
    if (editingNoteId) {
      setNotes(prev =>
        prev.map(note =>
          note.id === editingNoteId
            ? { ...note, text: noteDraft.trim() || "ملاحظة بدون نص", color: noteColor }
            : note
        )
      );
    } else if (dblPoint) {
      const newNote = {
        id: uid(),
        x: dblPoint.x,
        y: dblPoint.y,
        boxX: dblPoint.x + 30,
        boxY: dblPoint.y + 30,
        text: noteDraft.trim() || "ملاحظة بدون نص",
        color: noteColor,
      };
      setNotes(prev => [...prev, newNote]);
    }
    
    setShowNoteDialog(false);
    setNoteDraft("");
    setDblPoint(null);
    setEditingNoteId(null);
  }, [editingNoteId, dblPoint, noteDraft, noteColor]);

  const deleteNote = useCallback(() => {
    if (!editingNoteId) return;
    setNotes(prev => prev.filter(note => note.id !== editingNoteId));
    setShowNoteDialog(false);
    setEditingNoteId(null);
    setNoteDraft("");
  }, [editingNoteId]);

  const openEditDialog = useCallback((id) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    setEditingNoteId(id);
    setNoteDraft(note.text);
    setNoteColor(note.color || "#fef9c3");
    setShowNoteDialog(true);
  }, [notes]);

  // Note drag handlers
  const onStartDragBox = useCallback((e, id) => {
    e.stopPropagation();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    setDraggingNoteId(id);
    const pt = posFromEvent(e);
    dragOffset.current = { dx: pt.x - note.boxX, dy: pt.y - note.boxY };
  }, [notes, posFromEvent]);

  const onMoveDragBox = useCallback((e) => {
    if (!draggingNoteId) return;
    const pt = posFromEvent(e);
    setNotes(prev =>
      prev.map(note =>
        note.id === draggingNoteId
          ? { 
              ...note, 
              boxX: pt.x - dragOffset.current.dx, 
              boxY: pt.y - dragOffset.current.dy 
            }
          : note
      )
    );
  }, [draggingNoteId, posFromEvent]);

  const onEndDragBox = useCallback(() => {
    setDraggingNoteId(null);
  }, []);

  // Export functionality
  const exportPNG = useCallback(async () => {
    const canvas = canvasRef.current;
    const svg = overlayRef.current;
    if (!canvas || !svg) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const svgImg = new Image();
      
      await new Promise((resolve) => {
        svgImg.onload = resolve;
        svgImg.src = svgUrl;
      });

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const ctx = outputCanvas.getContext("2d");
      
      ctx.drawImage(canvas, 0, 0);
      ctx.drawImage(svgImg, 0, 0);

      const link = document.createElement("a");
      link.download = `dental-annotated-${Date.now()}.png`;
      link.href = outputCanvas.toDataURL("image/png");
      link.click();
      
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, []);

  // Upload background handler
  const onUploadBackground = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBgUrl(reader.result);
    reader.readAsDataURL(file);
  }, []);

  // Memoized note drag handlers
  const noteDragHandlers = useMemo(() => ({
    onStart: onStartDragBox,
    onMove: onMoveDragBox,
    onEnd: onEndDragBox
  }), [onStartDragBox, onMoveDragBox, onEndDragBox]);

  return (
    <div className="w-full max-w-[1100px] mx-auto p-4" dir="rtl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">لوحة الرسم على مخطط الأسنان</CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            <ColorPalette selectedColor={color} onColorChange={setColor} />
            <BrushSizeControl brushSize={brushSize} onBrushSizeChange={setBrushSize} />
            <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
            <ActionButtons
              onUndo={restore}
              onClearDrawing={clearDrawing}
              onClearNotes={() => setNotes([])}
              onUploadBackground={onUploadBackground}
              onExport={exportPNG}
              canUndo={canUndo}
            />
          </div>
        </CardHeader>
        
        <CardContent className='bg-background'>
          <DrawingCanvas
            canvasRef={canvasRef}
            overlayRef={overlayRef}
            notes={notes}
            zoom={zoom}
            offset={offset}
            activeMode={activeMode}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            onNoteDrag={noteDragHandlers}
            onNoteEdit={openEditDialog}
          />
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>وضع الملاحظات:</strong> اختر تبويب "ملاحظات" ثم انقر نقرتين على أي موضع في الأسنان لإضافة نقطة مع صندوق ملاحظة يمكن سحبه وتحريكه.
              <br />
              <strong>وضع تكبير/تحريك:</strong> اختر تبويب "تكبير/تحريك" ثم استخدم عجلة الفأرة للتكبير أو اسحب للتحريك.
            </p>
          </div>
        </CardContent>
      </Card>

      <NoteDialog
        isOpen={showNoteDialog}
        onClose={() => setShowNoteDialog(false)}
        noteText={noteDraft}
        noteColor={noteColor}
        isEditing={!!editingNoteId}
        onSave={saveNote}
        onDelete={deleteNote}
        onTextChange={setNoteDraft}
        onColorChange={setNoteColor}
      />
    </div>
  );
}