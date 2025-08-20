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


// Initial mock data
export const initialPatients = [
  {
  id: "P001",
  name: "أحمد محمد علي",
  phone: "01234567890",
  address: "القاهرة، مصر",
  occupation: "مهندس",
  gender: "ذكر",
  age: 35,
  systemicConditions: "لا يوجد",
  notes: "مريض منتظم",
  category: "علاج تحفظي",
  profileImage: "",
  status: "مستمرة",
  createdDate: "2025-01-15",

  // 🟢 Financial data (مدفوعات المريض)
  totalAmount: 2000,
  currency: "EGP",
  paidAmount: 1500,
  remainingAmount: 500,
  payments: [
    {
      id: "PAY001",
      amount: 1000,
      currency: "EGP",
      date: "2025-01-15",
      method: "كاش",
      description: "دفعة أولى",
    },
    {
      id: "PAY002",
      amount: 500,
      currency: "EGP",
      date: "2025-01-20",
      method: "كارت",
      description: "دفعة ثانية",
    },
  ],

  // 🟢 Expenses (مصروفات مرتبطة بالمريض أو العيادة)
  expenses: [
    {
      id: "EXP001",
      type: "مواد العيادة",
      description: "حشوات كومبوزيت",
      amount: 200,
      currency: "EGP",
      date: "2025-01-15",
      image: "",
    },
  ],

  // 🟢 Case presentation (حالة المريض)
  doctor: "د. محمد صادق",
  teethAffected: {
    upperLeft: 2,
    upperRight: 1,
    lowerLeft: 0,
    lowerRight: 1,
  },
  caseNotes: [
    {
      id: "NOTE001",
      note: "تم البدء في العلاج التحفظي",
      date: "2025-01-15",
    },
  ],
  drawingImage: "",

  // 🟢 Prescriptions (روشتات المريض)
  prescriptions: [
    {
    id: "RX001",
    patientName: "أحمد محمد علي",
    doctorName: "د. محمد صادق",
    date: "2025-01-15",
    age: 35,
    gender: "ذكر",
    diagnosis: "التهاب اللثة",
    prescription:
      "* أموكسيسيلين 500 مجم - كبسولة كل 8 ساعات لمدة 7 أيام\n* إيبوبروفين 400 مجم - قرص كل 6 ساعات عند الحاجة",
    status: "مكتملة",
    clinicLogo: "",
    doctorSignature: "",
  },
  {
    id: "RX002",
    patientName: "فاطمة أحمد",
    doctorName: "د. سارة محمود",
    date: "2025-01-14",
    age: 28,
    gender: "أنثى",
    diagnosis: "تسوس الأسنان",
    prescription:
      "* باراسيتامول 500 مجم - قرص كل 6 ساعات عند الحاجة\n* كلورهيكسيدين غسول فم - مضمضة مرتين يومياً لمدة أسبوع",
    status: "جديدة",
    clinicLogo: "",
    doctorSignature: "",
  },
  ],

  // 🟢 هنا ممكن تضيف بيانات إضافية بعدين
  // مثلا مواعيد (appointments) أو صور (attachments) أو تحاليل (labs)
}
];