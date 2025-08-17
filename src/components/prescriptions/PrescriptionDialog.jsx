import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import { usePrescriptionForm } from "@/hooks/usePrescriptionForm";
import PrescriptionDialogHeader from "./prescription-dialog/PrescriptionDialogHeader";
import { PatientInfoSection } from "./prescription-dialog/PatientInfoSection";
import PrescriptionDialogMedicine from "./prescription-dialog/PrescriptionDialogMedicine";
import { DoctorInfoSection } from "./prescription-dialog/DoctorInfoSection";
import { ActionButtons } from "./prescription-dialog/ActionButtons";
import { MedicineDialog } from "./prescription-dialog/MedicineDialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PrescriptionDialog() {
  const {
    isDialogOpen,
    setIsDialogOpen,
    selectedPrescription,
    setSelectedPrescription,
    addPrescription,
    updatePrescription,
  } = usePrescriptionStore();

  const [isMedicineDialogOpen, setIsMedicineDialogOpen] = useState(false);
  const { form, handleImageUpload, removeImage } = usePrescriptionForm(
    selectedPrescription,
    isDialogOpen
  );

  const handleAddMedicine = (medicine) => {
    const currentPrescription = form.getValues("prescription");
    const newLine = currentPrescription ? "\n* " + medicine : "* " + medicine;
    form.setValue("prescription", currentPrescription + newLine);
  };

  const onSubmit = (data) => {
    if (selectedPrescription) {
      updatePrescription(selectedPrescription.id, data);
    } else {
      addPrescription(data);
    }

    setIsDialogOpen(false);
    setSelectedPrescription(null);
  };

  const handlePrint = () => {
    // تحديث البيانات في الـ store مؤقتاً للطباعة
    const currentFormData = form.getValues()
    const tempPrescription = {
      ...currentFormData,
      id: selectedPrescription?.id || "TEMP",
      status: selectedPrescription?.status || "جديدة",
    }

    // تحديث البيانات المحددة مؤقتاً
    setSelectedPrescription(tempPrescription)

    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
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

          <DialogHeader className="print:hidden">
            <DialogTitle>
              {selectedPrescription ? "تعديل روشتة طبية" : "إضافة روشتة طبية"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="print:p-0"
              id="prescription-form"
            >
              <PrescriptionDialogHeader
                form={form}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
              />

              <PatientInfoSection form={form} />

              <div className="space-y-2 mb-6 print:mb-4">
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="diagnosis" className="text-sm font-medium">
                        التشخيص
                      </Label>
                      <FormControl>
                        <Textarea
                          id="diagnosis"
                          {...field}
                          placeholder="وصف حالة المريض والتشخيص..."
                          className="min-h-20 print:border-2 bg-white text-black placeholder:text-gray-600 print:border-gray-400 print:rounded-none print:bg-transparent print:p-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <PrescriptionDialogMedicine
                form={form}
                onOpenMedicineDialog={() => setIsMedicineDialogOpen(true)}
              />

              <DoctorInfoSection
                form={form}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
              />

              <ActionButtons isEditMode={!!selectedPrescription} onPrint={handlePrint} />
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
