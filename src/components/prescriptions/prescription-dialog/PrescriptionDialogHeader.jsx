
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { FormControl, FormField, FormItem } from "@/components/ui/form"

export default function PrescriptionDialogHeader({ form, onImageUpload, onRemoveImage }) {
  return (
    <FormField
      control={form.control}
      name="clinicLogo"
      render={({ field }) => (
        <FormItem>
          {field.value ? (
            <div className="relative w-full mb-6 print:mb-4 print:-mt-[372px]">
              <img
                src={field.value || "/placeholder.svg"}
                alt="شعار العيادة"
                className="w-full object-cover"
              />
              <Button
                type="button"
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
                <div className="border-dashed border-2 h-32 w-full bg-white/90 hover:bg-zinc-50 flex items-center justify-center rounded-lg transition duration-300">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-zinc-400" />
                    <span className="text-zinc-600">تحميل شعار العيادة</span>
                    <span className="text-xs text-zinc-400">سيظهر بعرض كامل في أعلى الروشتة</span>
                  </div>
                </div>
              </label>
              <FormControl>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onImageUpload(e, "clinicLogo")}
                  className="hidden"
                />
              </FormControl>
            </div>
          )}
        </FormItem>
      )}
    />
  )
}
