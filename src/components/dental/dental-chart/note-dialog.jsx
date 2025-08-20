import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function NoteDialog({ isOpen, onClose, noteText, noteColor, onTextChange, onColorChange, onSave }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة ملاحظة</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="note-text">نص الملاحظة</Label>
            <Textarea
              id="note-text"
              value={noteText}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="اكتب الملاحظة هنا..."
              className="min-h-[100px] mt-2"
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="note-color">لون الملاحظة</Label>
            <div className="flex items-center gap-2 mt-2">
              <input
                id="note-color"
                type="color"
                value={noteColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-12 h-8 rounded border cursor-pointer"
              />
              <span className="text-sm text-gray-600">اختر لون الخلفية</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={onSave} disabled={!noteText.trim()}>
            إضافة الملاحظة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
