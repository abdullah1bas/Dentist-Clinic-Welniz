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
    loadFromLocalStorage: () => {
      try {
        const data = localStorage.getItem("selectedPatient");
        if (data) set(() => ({ selectedPatient: JSON.parse(data) }));
      } catch (e) {
        console.error("Failed to load patient:", e);
      }
    },

    showNoteChartDialog: false,
    setShowNoteChartDialog: (v) => set(() => ({ showNoteChartDialog: v })),

    editingNoteChartId: null,
    setEditingNoteChartId: (id) => set(() => ({ editingNoteChartId: id })),

    noteDraft: "",
    setNoteDraft: (t) => set(() => ({ noteDraft: t })),

    noteColor: "#fef9c3",
    setNoteColor: (c) => set(() => ({ noteColor: c })),

    dblPoint: null,
    setDblPoint: (p) => set(() => ({ dblPoint: p })),
}))