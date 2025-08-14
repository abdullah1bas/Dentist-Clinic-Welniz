import { create } from "zustand";

export const useDialogStore = create((set) => ({
  isPrescriptionDialogOpen: false,
  isMedicineDialogOpen: false,
  selectedPrescription: null,

  openPrescriptionDialog: (prescription = null) =>
    set({ isPrescriptionDialogOpen: true, selectedPrescription: prescription }),

  closePrescriptionDialog: () =>
    set({ isPrescriptionDialogOpen: false, selectedPrescription: null }),

  openMedicineDialog: () => set({ isMedicineDialogOpen: true }),
  closeMedicineDialog: () => set({ isMedicineDialogOpen: false }),
}));
