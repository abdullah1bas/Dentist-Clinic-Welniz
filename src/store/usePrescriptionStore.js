import { create } from "zustand";

// Initial mock data
// const initialPrescriptions = [
//   {
//     id: "RX001",
//     patientName: "أحمد محمد علي",
//     doctorName: "د. محمد صادق",
//     date: "2025-01-15",
//     age: 35,
//     gender: "ذكر",
//     diagnosis: "التهاب اللثة",
//     prescription:
//       "* أموكسيسيلين 500 مجم - كبسولة كل 8 ساعات لمدة 7 أيام\n* إيبوبروفين 400 مجم - قرص كل 6 ساعات عند الحاجة",
//     status: "مكتملة",
//     clinicLogo: "",
//     doctorSignature: "",
//   },
//   {
//     id: "RX002",
//     patientName: "فاطمة أحمد",
//     doctorName: "د. سارة محمود",
//     date: "2025-01-14",
//     age: 28,
//     gender: "أنثى",
//     diagnosis: "تسوس الأسنان",
//     prescription:
//       "* باراسيتامول 500 مجم - قرص كل 6 ساعات عند الحاجة\n* كلورهيكسيدين غسول فم - مضمضة مرتين يومياً لمدة أسبوع",
//     status: "جديدة",
//     clinicLogo: "",
//     doctorSignature: "",
//   },
// ];


export const usePrescriptionStore = create((set) => ({
  prescriptionData: [],
  setPrescriptionData: (data) => set({ prescriptionData: data }),
  addPrescription: (prescription) =>
    set((state) => ({
      prescriptionData: [prescription, ...state.prescriptionData],
    })),
  updatePrescription: (id, updated) =>
    set((state) => ({
      prescriptionData: state.prescriptionData.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      ),
    })),
}));

