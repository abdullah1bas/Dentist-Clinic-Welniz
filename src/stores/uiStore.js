import { create } from "zustand"

export const useUIStore = create((set) => ({
  // Dental Chart State
  isDentalChartOpen: true,
  selectedPatient: null,
  isDialogOpen: false,

  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
  setIsDentalChartOpen: (isOpen) => set({ isDentalChartOpen: isOpen }),
  // Open dental chart for specific patient
  openDentalChart: (patient) =>
    set({
      selectedPatient: patient,
      isDentalChartOpen: true,
    }),

  // Close dental chart
  closeDentalChart: () =>
    set({
      isDentalChartOpen: false,
      selectedPatient: null,
    }),
}))