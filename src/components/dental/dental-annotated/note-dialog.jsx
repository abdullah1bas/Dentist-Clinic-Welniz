
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export const NoteDialog = React.memo(
  ({ isOpen, onClose, noteText, noteColor, isEditing, onSave, onDelete, onTextChange, onColorChange }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "تعديل الملاحظة" : "إضافة ملاحظة"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={noteText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="اكتب الملاحظة هنا..."
            className="min-h-[100px]"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <Label>لون الملاحظة:</Label>
            <input
              type="color"
              value={noteColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-8 h-8 rounded-full border cursor-pointer"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          {isEditing && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              حذف
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={onSave}>{isEditing ? "حفظ" : "إضافة"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
)

NoteDialog.displayName = "NoteDialog"
