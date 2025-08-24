import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNotesStore } from "@/stores/use-notes-chart-store";

export const NoteDialog = React.memo(() => {
    // 📌 notes store
      const {
        noteDraft, noteColor, editingNoteId, dblPoint, addNote, updateNote, deleteNote,
        setNoteDraft, setNoteColor, setDblPoint, setEditingNoteId, showNoteDialog, setShowNoteDialog
      } = useNotesStore()

    // Note handlers
    const handleSaveNote = useCallback(() => {
      if (editingNoteId) {
        updateNote(editingNoteId, { text: noteDraft.trim() || "ملاحظة بدون نص", color: noteColor })
      } else if (dblPoint) {
        addNote(dblPoint.x, dblPoint.y, noteDraft.trim() || "ملاحظة بدون نص", noteColor)
      }
      setShowNoteDialog(false)
      setNoteDraft("")
      setDblPoint(null)
      setEditingNoteId(null)
    }, [editingNoteId, dblPoint, noteDraft, noteColor, updateNote, addNote, setNoteDraft, setDblPoint, editingNoteId])

    const handleDeleteNote = useCallback(() => {
      deleteNote(editingNoteId); 
      setShowNoteDialog(false);
    }, [editingNoteId])

    return (
      <Dialog open={showNoteDialog} onOpenChange={()=> setShowNoteDialog(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingNoteId ? "تعديل الملاحظة" : "إضافة ملاحظة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="اكتب الملاحظة هنا..."
              className="min-h-[100px]"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Label>لون الملاحظة:</Label>
              <input
                type="color"
                value={noteColor}
                onChange={(e) => setNoteColor(e.target.value)}
                className="w-8 h-8 rounded-full border cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {editingNoteId && (
              <Button variant="destructive" onClick={handleDeleteNote}>
                <Trash2 className="w-4 h-4 mr-2" />
                حذف
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=> setShowNoteDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveNote}>{editingNoteId ? "حفظ" : "إضافة"}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

NoteDialog.displayName = "NoteDialog";
