import { create } from "zustand"
import { persist } from "zustand/middleware"

// Initial mock data
const initialPrescriptions = [
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
]

export const usePrescriptionStore = create(
  persist(
    (set, get) => ({
      // State
      prescriptions: initialPrescriptions,
      selectedPrescription: null,
      isDialogOpen: false,
      filters: {
        search: "",
        doctor: "جميع الأطباء",
        status: "جميع الحالات",
        dateFrom: "",
        dateTo: "",
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
      },

      // Actions
      setPrescriptions: (prescriptions) => set({ prescriptions }),

      addPrescription: (prescriptionData) => {
        const { prescriptions } = get()
        const newId = `RX${String(prescriptions.length + 1).padStart(3, "0")}`
        const newPrescription = {
          ...prescriptionData,
          id: newId,
          status: "جديدة",
          age: Number(prescriptionData.age) || 0,
        }
        set({ prescriptions: [newPrescription, ...prescriptions] })
      },

      updatePrescription: (id, updatedData) => {
        const { prescriptions } = get()
        const updated = prescriptions.map((p) =>
          p.id === id ? { ...updatedData, id, age: Number(updatedData.age) || 0 } : p,
        )
        set({ prescriptions: updated })
      },

      deletePrescription: (id) => {
        const { prescriptions } = get()
        set({ prescriptions: prescriptions.filter((p) => p.id !== id) })
      },

      setSelectedPrescription: (prescription) => set({ selectedPrescription: prescription }),

      setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),

      setFilters: (filters) => set({ filters }),

      setPagination: (pagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),

      clearFilters: () =>
        set({
          filters: {
            search: "",
            doctor: "جميع الأطباء",
            status: "جميع الحالات",
            dateFrom: "",
            dateTo: "",
          },
          pagination: { currentPage: 1, itemsPerPage: get().pagination.itemsPerPage },
        }),

      // Computed values
      getFilteredPrescriptions: () => {
        const { prescriptions, filters } = get()
        return prescriptions.filter((prescription) => {
          const matchesSearch =
            prescription.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
            prescription.id.toLowerCase().includes(filters.search.toLowerCase())

          const matchesDoctor = filters.doctor === "جميع الأطباء" || prescription.doctorName === filters.doctor
          const matchesStatus = filters.status === "جميع الحالات" || prescription.status === filters.status
          const matchesDateFrom = !filters.dateFrom || prescription.date >= filters.dateFrom
          const matchesDateTo = !filters.dateTo || prescription.date <= filters.dateTo

          return matchesSearch && matchesDoctor && matchesStatus && matchesDateFrom && matchesDateTo
        })
      },

      getPaginatedPrescriptions: () => {
        const { pagination } = get()
        const filtered = get().getFilteredPrescriptions()
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
        return filtered.slice(startIndex, startIndex + pagination.itemsPerPage)
      },

      getTotalPages: () => {
        const { pagination } = get()
        const filtered = get().getFilteredPrescriptions()
        return Math.ceil(filtered.length / pagination.itemsPerPage)
      },
    }),
    {
      name: "prescription-store",
      partialize: (state) => ({ prescriptions: state.prescriptions }),
    },
  ),
)
