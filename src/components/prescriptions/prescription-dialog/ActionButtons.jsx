import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function ActionButtons({ isEditMode }) {
  return (
    <div className="flex gap-4 pt-4 print:hidden">
      <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 transition duration-300">
        {isEditMode ? "تحديث" : "حفظ"}
      </Button>
      <Button
        type="button"
        onClick={() => window.print()}
        variant="outline"
        className="flex-1 bg-transparent transition duration-300"
      >
        <Printer className="w-4 h-4 mr-2" />
        طباعة
      </Button>
    </div>
  );
}