import { create } from "zustand"
import { uid } from "@/lib/dental-chart-utils"

export const useNotesDataStore = create((set) => ({
  notes: [],

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
