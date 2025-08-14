import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

export default function PrescriptionDialogHeader({ clinicLogo, onImageUpload, onRemoveImage }) {
  return (
    <>
      {clinicLogo ? (
        <div className="relative w-full mb-6 print:mb-4 print:-mt-[372px]">
          <img
            src={clinicLogo}
            alt="شعار العيادة"
            className="w-full object-cover"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-4 print:hidden"
            onClick={() => onRemoveImage("clinicLogo")}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center mb-6 print:hidden">
          <label htmlFor="logo-upload" className="cursor-pointer">
            <div className="border-dashed border-2 h-32 w-full hover:bg-zinc-50 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-zinc-400" />
                <span className="text-zinc-600">تحميل شعار العيادة</span>
                <span className="text-xs text-zinc-400">
                  سيظهر بعرض كامل في أعلى الروشتة
                </span>
              </div>
            </div>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => onImageUpload(e, "clinicLogo")}
            className="hidden"
          />
        </div>
      )}
    </>
  );
}