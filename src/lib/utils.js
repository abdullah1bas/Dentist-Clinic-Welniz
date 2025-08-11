import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import z from "zod";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const appointmentSchema = z.object({
  patientName: z.string().min(1, "اسم المريض مطلوب"),
  nationalId: z.string().length(14, "الرقم القومي يجب أن يكون 14 رقم"),
  time: z.string(),
  note: z.string().optional()
});

export const financialSchema = (categories) => z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "يجب إدخال تاريخ صحيح"),
  description: z.string().min(1, "الوصف مطلوب"),
  category: z.enum(categories, {
    errorMap: () => ({ message: "يجب اختيار فئة صحيحة" }),
  }),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val.replace(/,/g, ""));
      return !isNaN(num) && num > 0;
    },
    { message: "المبلغ يجب أن يكون رقمًا أكبر من 0" }
  ),
  addedBy: z.enum(["Admin", "Manager", "Staff"], {
    errorMap: () => ({ message: "يجب اختيار شخص صحيح" }),
  }),
});

export const prescriptionSchema = z.object({
  patientName: z.string().min(1, "اسم المريض مطلوب"),
  medicine: z.string().min(1, "اسم الدواء مطلوب"),
  dosage: z.string().min(1, "الجرعة مطلوبة"),
  duration: z.string().min(1, "مدة العلاج مطلوبة"),
  notes: z.string().optional()
});

export const EXPENSE_CATEGORIES = ["معدات", "أدوية", "أجور", "صيانة", "أخرى"];
export const INCOME_CATEGORIES = ["استشارات", "علاجات", "بيع أدوية", "خدمات أخرى", "أخرى"];
export const ADDED_BY_OPTIONS = ["Admin", "Manager", "Staff"];

export function currency(n) {
  return n.toLocaleString("ar-EG", { style: "currency", currency: "EGP" });
}