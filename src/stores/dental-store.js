import { create } from "zustand"
import { persist } from "zustand/middleware"

// Initial mock data
const initialPatients = [
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
    // Financial data
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
    // Expenses
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
    // Case presentation
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
  },
]

const categories = ["علاج تحفظي", "علاج جذور", "تقويم أسنان", "جراحة فم", "تركيبات"]
const doctors = ["د. محمد صادق", "د. سارة محمود", "د. أحمد علي"]
const expenseTypes = ["مواد العيادة", "أدوات طبية", "مختبر", "أشعة", "استشارة", "أخرى"]
const paymentMethods = ["كاش", "كارت", "تحويل بنكي", "شيك"]
const currencies = ["EGP", "USD"]

export const useDentalStore = create(
  persist(
    (set, get) => ({
      // State
      patients: initialPatients,
      selectedPatient: null,
      isDialogOpen: false,
      filters: {
        search: "",
        category: "جميع الفئات",
        status: "جميع الحالات",
        dateFrom: "",
        dateTo: "",
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 12,
      },
      exchangeRate: 50, // 1 USD = 50 EGP

      // Actions
      setPatients: (patients) => set({ patients }),

      addPatient: (patientData) => {
        const { patients } = get()
        const newId = `P${String(patients.length + 1).padStart(3, "0")}`
        const newPatient = {
          ...patientData,
          id: newId,
          status: "مستمرة",
          createdDate: new Date().toISOString().split("T")[0],
          payments: [],
          expenses: [],
          caseNotes: [],
          paidAmount: 0,
          remainingAmount: patientData.totalAmount || 0,
        }
        set({ patients: [newPatient, ...patients] })
      },

      updatePatient: (id, updatedData) => {
        const { patients } = get()
        const updated = patients.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
        set({ patients: updated })
      },

      deletePatient: (id) => {
        const { patients } = get()
        set({ patients: patients.filter((p) => p.id !== id) })
      },

      setSelectedPatient: (patient) => set({ selectedPatient: patient }),

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
            category: "جميع الفئات",
            status: "جميع الحالات",
            dateFrom: "",
            dateTo: "",
          },
          pagination: { currentPage: 1, itemsPerPage: get().pagination.itemsPerPage },
        }),

      // Payment actions
      addPayment: (patientId, payment) => {
        const { patients } = get()
        const updated = patients.map((p) => {
          if (p.id === patientId) {
            const newPayments = [...p.payments, { ...payment, id: `PAY${Date.now()}` }]
            const paidAmount = newPayments.reduce((sum, pay) => sum + pay.amount, 0)
            return {
              ...p,
              payments: newPayments,
              paidAmount,
              remainingAmount: p.totalAmount - paidAmount,
            }
          }
          return p
        })
        set({ patients: updated })
      },

      // Expense actions
      addExpense: (patientId, expense) => {
        const { patients } = get()
        const updated = patients.map((p) => {
          if (p.id === patientId) {
            return {
              ...p,
              expenses: [...p.expenses, { ...expense, id: `EXP${Date.now()}` }],
            }
          }
          return p
        })
        set({ patients: updated })
      },

      // Case notes actions
      addCaseNote: (patientId, note) => {
        const { patients } = get()
        const updated = patients.map((p) => {
          if (p.id === patientId) {
            return {
              ...p,
              caseNotes: [...p.caseNotes, { ...note, id: `NOTE${Date.now()}` }],
            }
          }
          return p
        })
        set({ patients: updated })
      },

      // Computed values
      getFilteredPatients: () => {
        const { patients, filters } = get()
        return patients.filter((patient) => {
          const matchesSearch =
            patient.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            patient.phone.includes(filters.search) ||
            patient.id.toLowerCase().includes(filters.search.toLowerCase())

          const matchesCategory = filters.category === "جميع الفئات" || patient.category === filters.category
          const matchesStatus = filters.status === "جميع الحالات" || patient.status === filters.status
          const matchesDateFrom = !filters.dateFrom || patient.createdDate >= filters.dateFrom
          const matchesDateTo = !filters.dateTo || patient.createdDate <= filters.dateTo

          return matchesSearch && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo
        })
      },

      getPaginatedPatients: () => {
        const { pagination } = get()
        const filtered = get().getFilteredPatients()
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
        return filtered.slice(startIndex, startIndex + pagination.itemsPerPage)
      },

      getTotalPages: () => {
        const { pagination } = get()
        const filtered = get().getFilteredPatients()
        return Math.ceil(filtered.length / pagination.itemsPerPage)
      },

      // Constants
      categories,
      doctors,
      expenseTypes,
      paymentMethods,
      currencies,
    }),
    {
      name: "dental-store",
      partialize: (state) => ({
        patients: state.patients,
        exchangeRate: state.exchangeRate,
      }),
    },
  ),
)
