import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/uiStore";
import { useCanvasStore } from "@/stores/canvas/use-canvas-store";
import { useNotesStore } from "@/stores/canvas/use-notes-chart-store";
import { ArrowLeft, Home, Save, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DentalChartHeader = () => {
  const navigate = useNavigate();
  const { selectedPatient } = useUIStore();
  const { notes } = useNotesStore();
  const { zoom, offset } = useCanvasStore();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>مخطط الأسنان - ${selectedPatient?.name || "مريض"}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; direction: rtl; margin: 0; }
              .header { margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .chart-area { border: 2px solid #333; padding: 20px; margin: 20px 0; min-height: 400px; background: #f9f9f9; }
              .notes { text-align: right; margin-top: 20px; }
              .note-item { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>مخطط الأسنان التفاعلي</h1>
              <h2>المريض: ${selectedPatient?.name || "غير محدد"}</h2>
              <p>التاريخ: ${new Date().toLocaleDateString("ar-SA")}</p>
            </div>
            <div class="chart-area">
              <h3>مخطط الأسنان مع الملاحظات</h3>
              <p>عدد الملاحظات: ${notes.length}</p>
            </div>
            ${
              notes.length > 0
                ? `
              <div class="notes">
                <h3>الملاحظات الطبية:</h3>
                ${notes
                  .map(
                    (note, index) => `
                  <div class="note-item">
                    <strong>ملاحظة ${index + 1}:</strong> ${note.text}
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSave = () => {
    const chartData = {
      patient: selectedPatient,
      notes,
      zoom,
      offset,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      `dental-chart-${selectedPatient?.id || "temp"}`,
      JSON.stringify(chartData)
    );
    alert("تم حفظ مخطط الأسنان بنجاح!");
    handlePrint();
  };
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              رجوع
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              الرئيسية
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              مخطط الأسنان التفاعلي
            </h1>
            {selectedPatient && (
              <p className="text-sm text-gray-600">
                المريض: {selectedPatient.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              طباعة
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              حفظ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
