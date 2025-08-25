import { useNotesStore } from "@/stores/canvas/use-notes-chart-store";
import React, { useCallback } from "react";
import { Note } from "./note-component";
import { useCanvasStore } from "@/stores/canvas/use-canvas-store";
import { useNotesDataStore } from "@/stores/canvas/use-notes-store";

function NotesChart({ onStart, canvasRef }) {
  // 📌 notes store
  const { setNoteDraft, setNoteColor, setEditingNoteId, setShowNoteDialog } =
    useNotesStore();
  const { notes } = useNotesDataStore();
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
        <Note
          key={note.id}
          note={note}
          zoom={zoom}
          offset={offset}
          onStartDrag={onStart}
          onEdit={openEditDialog}
          canvasRef={canvasRef}
        />
      ))}
    </>
  );
}

export default NotesChart;
