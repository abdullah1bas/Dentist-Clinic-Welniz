import { create } from "zustand"
import { uid } from "@/lib/dental-chart-utils"

export const useNotesStore = create((set) => ({
  notes: [],
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

  addNote: (x, y, text, noteColor) =>
    set((state) => ({
      notes: [
        ...state.notes,
        { id: uid(), x, y, boxX: x + 30, boxY: y + 30, text, noteColor },
      ],
    })),

  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      ),
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  clearNotes: () => set({ notes: [] }),
}))
