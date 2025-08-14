import { Form } from "@/components/ui/form";
import React from "react";
import PrescriptionDialogHeader from "./PrescriptionDialogHeader";
import { PatientInfoSection } from "./PatientInfoSection";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PrescriptionDialogMedicine from "./PrescriptionDialogMedicine";
import { DoctorInfoSection } from "./DoctorInfoSection";
import { ActionButtons } from "./ActionButtons";

function PrescriptionDialogForm({
  form,
  handleSavePrescription,
  handleImageUpload,
  removeImage,
  handlePrescriptionChange,
  setIsMedicineDialogOpen,
  selectedPrescription,
}) {
  return (
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

        <ActionButtons isEditMode={!!selectedPrescription} />
      </form>
    </Form>
  );
}

export default PrescriptionDialogForm;
