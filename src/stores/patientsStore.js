// stores/patientsStore.js
import { initialPatients } from "@/lib/utils"
import { create } from "zustand"
import { persist } from "zustand/middleware"



export const usePatientsStore = create(
  persist(
    (set, get) => ({
      patients: initialPatients,
      filters: {
        search: "",
        category: "جميع الفئات",
        status: "جميع الحالات",
        dateFrom: "",
        dateTo: "",
      },
      pagination: { currentPage: 1, itemsPerPage: 12 },

      // Actions
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
        set({
          patients: get().patients.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p,
          ),
        })
      },
      deletePatient: (id) =>
        set({ patients: get().patients.filter((p) => p.id !== id) }),

      setFilters: (filters) => set({ filters }),
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

      // Getters
      getFilteredPatients: () => {
        const { patients, filters } = get()
        return patients.filter((patient) => {
          const matchesSearch =
            patient.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            patient.phone.includes(filters.search) ||
            patient.id.toLowerCase().includes(filters.search.toLowerCase())

          const matchesCategory =
            filters.category === "جميع الفئات" || patient.category === filters.category
          const matchesStatus =
            filters.status === "جميع الحالات" || patient.status === filters.status
          const matchesDateFrom = !filters.dateFrom || patient.createdDate >= filters.dateFrom
          const matchesDateTo = !filters.dateTo || patient.createdDate <= filters.dateTo

          return matchesSearch && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo
        })
      },
      
      setPagination: (pagination) =>
        set((state) => ({ pagination: { ...state.pagination, ...pagination } })),
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
    }),
    {
      name: "patients-store",
      partialize: (state) => ({
        patients: state.patients,
      }),
    },
  ),
)
