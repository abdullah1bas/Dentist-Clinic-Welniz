import { useNotesStore } from "@/stores/use-notes-chart-store";
import React, { useCallback } from "react";
import { Note } from "./note-component";
import { useCanvasStore } from "@/stores/use-canvas-store";

function NotesChart({ onStart }) {
  // 📌 notes store
  const { notes, setNoteDraft, setNoteColor, setEditingNoteId, setShowNoteDialog,} = useNotesStore();
  const { zoom, offset } = useCanvasStore();

  const openEditDialog = useCallback(
    (id) => {
      const note = notes.find((n) => n.id === id);
      if (!note) return;
      setEditingNoteId(id);
      setNoteDraft(note.text);
      setNoteColor(note.color || "#fef9c3");
      setShowNoteDialog(true);
    },
    [notes, setEditingNoteId, setNoteColor, setNoteDraft, setShowNoteDialog]
  );
  return (
    <>
      {notes.map((note) => (
        <Note key={note.id} note={note} zoom={zoom} offset={offset} onStartDrag={onStart} onEdit={openEditDialog} />
      ))}
    </>
  );
}

export default NotesChart;
