import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import z from "zod";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const appointmentSchema = z.object({
  patientName: z.string().min(1, "اسم المريض مطلوب"),
  phone: z.string().regex(/^01[0-9]{9}$/, "رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01"),
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

export const prescriptionDialogFormSchema = z.object({
  clinicLogo: z.string().optional(),
  date: z.string().min(1, "التاريخ مطلوب"),
  patientName: z.string().min(1, "اسم المريض مطلوب"),
  gender: z.enum(["ذكر", "أنثى"]),
  age: z.string().optional(),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  doctorName: z.string().min(1, "اسم الطبيب مطلوب"),
  doctorSignature: z.string().optional(),
});

// تعريف schema للتحقق من الصحة
export const prescriptionFilterSchema = z.object({
  search: z.string().optional(),
  doctor: z.string(),
  status: z.string(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const EXPENSE_CATEGORIES = ["معدات", "أدوية", "أجور", "صيانة", "أخرى"];
export const INCOME_CATEGORIES = ["استشارات", "علاجات", "بيع أدوية", "خدمات أخرى", "أخرى"];
export const ADDED_BY_OPTIONS = ["Admin", "Manager", "Staff"];
export const prescriptionFIlterDoctors = ["جميع الأطباء", "د. محمد صادق", "د. سارة محمود"];
export const prescriptionFilterStatuses = ["جميع الحالات", "جديدة", "مكتملة"];

export function currency(n) {
  return n.toLocaleString("ar-EG", { style: "currency", currency: "EGP" });
}