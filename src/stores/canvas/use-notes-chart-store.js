import { create } from "zustand"

export const useNotesStore = create((set) => ({
  showNoteDialog: false,
  editingNoteId: null,
  noteDraft: "",
  noteColor: "#fef9c3",
  dblPoint: null,
  draggingNoteId: null,

  setShowNoteDialog: (show) => set({showNoteDialog: show}),
  setNoteDraft: (noteDraft) => set({ noteDraft }),
  setNoteColor: (noteColor) => set({ noteColor }),
  setDblPoint: (pt) => set({ dblPoint: pt }),
  setEditingNoteId: (id) => set({ editingNoteId: id }),
  setDraggingNoteId: (id) => set({ draggingNoteId: id }),

}))
