import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MorePatientsDialog({ showMoreDialog, setShowMoreDialog, morePatients }) {
  return (
    <Dialog open={showMoreDialog} onOpenChange={setShowMoreDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>قائمة المرضى</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {morePatients.map((p) => (
            <div key={p.id} className="border p-2 rounded">
              <p className="font-bold">{p.patientName} ({p.time})</p>
              {p.note && <p className="text-sm text-gray-300">ملاحظات: {p.note}</p>}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}