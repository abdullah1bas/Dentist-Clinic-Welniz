import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

export function DoctorInfoSection({ form, onImageUpload, onRemoveImage }) {
  return (
    <div className="pt-8 border-t print:pt-4 print:border-t-2 print:border-gray-400">
      <div className="flex flex-col sm:flex-row gap-4 print:gap-2 flex-1">
        <FormField
          control={form.control}
          name="doctorName"
          render={({ field }) => (
            <FormItem className="space-y-2 flex-1">
              <Label htmlFor="doctorName" className="text-sm font-medium">
                اسم الطبيب *
              </Label>
              <FormControl>
                <Input
                  id="doctorName"
                  {...field}
                  placeholder="اسم الطبيب"
                  className="w-full bg-white text-black placeholder:text-gray-600 print:border-0 print:border-b-2 print:border-gray-400 print:rounded-none print:bg-transparent print:text-black print:px-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right flex-1">
          <p className="text-sm text-white">التاريخ</p>
          <p className="font-semibold">{form.watch("date")}</p>
        </div>
      </div>

      <div className="text-center w-full my-2 py-2 flex flex-col justify-center items-center">
        <p className="text-sm text-white my-4 print:text-white">توقيع الطبيب</p>
        <FormField
          control={form.control}
          name="doctorSignature"
          render={({ field }) => (
            <FormItem className="relative w-full border-b-2 pb-3 border-gray-300 flex items-center justify-center">
              {field.value ? (
                <>
                  <img
                    src={field.value || "/placeholder.svg"}
                    alt="توقيع الطبيب"
                    className="w-full cursor-pointer object-cover"
                    onClick={() => document.getElementById("signature-upload").click()}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 size-6 p-0 print:hidden"
                    onClick={() => onRemoveImage("doctorSignature")}
                  >
                    <X className="size-3" />
                  </Button>
                </>
              ) : (
                <label htmlFor="signature-upload" className="cursor-pointer print:hidden">
                  <div className="flex items-center gap-1 text-xs text-zinc-300 hover:text-zinc-400 transition duration-300">
                    <Upload className="size-4" />
                    تحميل التوقيع
                  </div>
                </label>
              )}
              <FormControl>
                <input
                  id="signature-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onImageUpload(e, "doctorSignature")}
                  className="hidden"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
