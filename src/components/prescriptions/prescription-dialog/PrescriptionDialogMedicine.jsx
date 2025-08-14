import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pill } from "lucide-react";

export default function PrescriptionDialogMedicine({
  prescription,
  onPrescriptionChange,
  onOpenMedicineDialog,
  handleInputChange
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const textarea = e.currentTarget;
      const cursorPosition = textarea.selectionStart;
      const value = textarea.value;
      const beforeCursor = value.substring(0, cursorPosition);
      const afterCursor = value.substring(cursorPosition);
      const newValue = beforeCursor + "\n* " + afterCursor;

      handleInputChange("prescription", newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 3;
      }, 0);

      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2 mb-6 print:mb-4">
      <div className="flex items-center gap-2 mb-4 print:mb-2">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg print:bg-blue-600 print:text-black">
          ℞
        </div>
        <Label className="text-lg font-semibold print:text-black">العلاج الموصوف</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onOpenMedicineDialog}
          className="mr-auto print:hidden hover:bg-blue-600 hover:text-white hover:border-0"
        >
          <Pill className="w-4 h-4 mr-2" />
          إضافة دواء
        </Button>
      </div>

      <Textarea
        value={prescription}
        onChange={onPrescriptionChange}
        onKeyDown={handleKeyDown}
        placeholder="* ابدأ بكتابة الأدوية والتعليمات..."
        className="min-h-[200px] font-mono text-base bg-white text-black placeholder:text-gray-600 leading-relaxed print:text-black print:border-2 print:border-black print:rounded-none print:bg-transparent print:p-2"
      />
    </div>
  );
}
