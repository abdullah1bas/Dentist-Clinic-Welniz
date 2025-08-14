import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

export function PatientInfoSection({ form }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2 print:mb-4">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              التاريخ
            </Label>
            <FormControl>
              <Input
                id="date"
                type="date"
                {...field}
                className="w-full print:border-0 print:border-b-2 bg-white text-black placeholder:text-gray-600 print:border-gray-400 print:rounded-none print:bg-transparent print:text-black print:px-1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="patientName"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <Label htmlFor="patientName" className="text-sm font-medium">
              اسم المريض *
            </Label>
            <FormControl>
              <Input
                id="patientName"
                {...field}
                placeholder="اسم المريض"
                className="print:border-0 print:border-b-2 bg-white text-black placeholder:text-gray-600 print:border-gray-400 print:rounded-none print:bg-transparent print:text-black print:px-1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <Label className="text-sm font-medium">الجنس</Label>
            <div className="print:hidden">
              <FormControl>
                <select
                  {...field}
                  className="w-full p-2 border rounded-md bg-white text-black placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </FormControl>
            </div>
            <div className="hidden print:block">
              <div className="border-0 border-b-2 border-gray-400 pb-1 print:mt-2 print:text-black min-h-[2rem] flex items-center px-1">
                {field.value || "ذكر"}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">
              العمر
            </Label>
            <FormControl>
              <Input
                id="age"
                type="number"
                {...field}
                placeholder="العمر"
                className="print:border-0 print:border-b-2 bg-white text-black placeholder:text-gray-600 print:border-gray-400 print:rounded-none print:bg-transparent print:text-black print:px-1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}