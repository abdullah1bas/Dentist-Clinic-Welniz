import { create } from "zustand";

// Notes store
export const useNotesStore = create((set) => ({
  notes: [],
  setNotes: (notes) => set(() => ({ notes })),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, patch) =>
    set((state) => ({ notes: state.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
  deleteNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
  draggingNoteId: null,
  setDraggingNoteId: (id) => set(() => ({ draggingNoteId: id })),
}));