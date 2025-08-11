import { useState } from "react";
import Tooth from "./Tooth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DentalChart() {
  // حالة لتخزين السن المضغوط عليه
  const [selectedTooth, setSelectedTooth] = useState(null);

  // توليد أرقام الأسنان
  const upperTeeth = Array.from({ length: 16 }, (_, i) => 18 - i); // 18 -> 11
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 31 + i); // 31 -> 48

  // الحالات التجريبية لكل سن
  const toothStatuses = {
    18: "filled",
    16: "missing",
    31: "normal",
    48: "missing",
    // باقي الأسنان = normal
  };

  const handleToothClick = (number) => {
    setSelectedTooth(number);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-center gap-1 flex-wrap">
        {upperTeeth.map((num) => (
          <Tooth
            key={num}
            number={num}
            status={toothStatuses[num] || "normal"}
            onClick={handleToothClick}
          />
        ))}
      </div>
      <div className="flex justify-center gap-1 flex-wrap">
        {lowerTeeth.map((num) => (
          <Tooth
            key={num}
            number={num}
            status={toothStatuses[num] || "normal"}
            onClick={handleToothClick}
          />
        ))}
      </div>

      <Dialog open={selectedTooth !== null} onOpenChange={() => setSelectedTooth(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tooth Details</DialogTitle>
          </DialogHeader>
          <p className="text-lg">Tooth Number: {selectedTooth}</p>
          <p>Status: {toothStatuses[selectedTooth] || "normal"}</p>
          {/* هنا ممكن تضيف فورم لتعديل حالة السن */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
