import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MedicineDialog } from "./MedicineDialog";
import { PatientInfoSection } from "./PatientInfoSection";
import { DoctorInfoSection } from "./DoctorInfoSection";
import { ActionButtons } from "./ActionButtons";
import PrescriptionDialogMedicine from "./PrescriptionDialogMedicine";
import PrescriptionDialogHeader from "./PrescriptionDialogHeader";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrescriptionForm } from "@/hooks/usePrescriptionForm";
import { useImageHandler } from "@/hooks/useImageHandler";

export function PrescriptionDialog({
  open,
  onOpenChange,
  selectedPrescription,
  setPrescriptions,
  setIsDialogOpen,
  setSelectedPrescription,
  prescriptions,
}) {
  const [isMedicineDialogOpen, setIsMedicineDialogOpen] = useState(false);
  const form = usePrescriptionForm(selectedPrescription, open);
  const { handleImageUpload, removeImage } = useImageHandler(form);

  const handlePrescriptionChange = (e) => {
    const value = e.target.value;
    const lines = value.split("\n");
    const formattedLines = lines.map((line, index) => {
      if (index > 0 && line.trim() && !line.trim().startsWith("*")) {
        return `* ${line.trim()}`;
      }
      return line;
    });
    form.setValue("prescription", formattedLines.join("\n"));
  };

  

  const handleAddMedicine = (medicine) => {
    const currentPrescription = form.getValues("prescription");
    const newLine = currentPrescription ? "\n* " + medicine : "* " + medicine;
    form.setValue("prescription", currentPrescription + newLine);
  };

  const handleSavePrescription = (data) => {
    if (selectedPrescription) {
      // تعديل روشتة موجودة
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === selectedPrescription.id
            ? { ...data, id: selectedPrescription.id, age: Number(data.age) || 0 }
            : p
        )
      );
    } else {
      // إضافة روشتة جديدة
      const newId = `RX${String(prescriptions.length + 1).padStart(3, "0")}`;
      const newPrescription = {
        ...data,
        age: Number(data.age) || 0,
        id: newId,
        status: "جديدة",
      };
      setPrescriptions((prev) => [newPrescription, ...prev]);
    }
    setIsDialogOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] text-white overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:shadow-none">
          <DialogClose asChild>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-0 right-0 print:hidden z-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogClose>
          <DialogHeader className={"print:hidden"}>
            <DialogTitle>إضافة/تعديل روشتة طبية</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSavePrescription)}
              className=" print:p-0"
              id="prescription-form"
            >
              <PrescriptionDialogHeader
                clinicLogo={form.watch("clinicLogo")}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
              />

              <PatientInfoSection form={form} />

              <div className="space-y-2 mb-6 print:mb-4">
                <Label htmlFor="diagnosis" className="text-sm font-medium">
                  التشخيص
                </Label>
                <Textarea
                  id="diagnosis"
                  {...form.register("diagnosis")}
                  placeholder="وصف حالة المريض والتشخيص..."
                  className="min-h-20 print:border-2 bg-white text-black placeholder:text-gray-600 print:border-gray-400 print:rounded-none print:bg-transparent print:p-2"
                />
              </div>

              <PrescriptionDialogMedicine
                prescription={form.watch("prescription")}
                onPrescriptionChange={handlePrescriptionChange}
                onOpenMedicineDialog={() => setIsMedicineDialogOpen(true)}
              />

              <DoctorInfoSection
                doctorName={form.watch("doctorName")}
                doctorSignature={form.watch("doctorSignature")}
                date={form.watch("date")}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                form={form}
              />

              <ActionButtons
                isEditMode={!!selectedPrescription}
              />
            </form>
          </Form>
          
        </DialogContent>
      </Dialog>

      <MedicineDialog
        open={isMedicineDialogOpen}
        onOpenChange={setIsMedicineDialogOpen}
        onAddMedicine={handleAddMedicine}
      />
    </>
  );
}