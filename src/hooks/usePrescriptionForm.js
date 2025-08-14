import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prescriptionDialogSchema } from "@/lib/utils";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";

const defaultValues = {
    clinicLogo: "",
    date: new Date().toISOString().split("T")[0],
    patientName: "",
    gender: "",
    age: "",
    diagnosis: "",
    prescription: "",
    doctorName: "",
    doctorSignature: "",
}

export function usePrescriptionForm(selectedPrescription) {
  const setPrescriptionData = usePrescriptionStore((s) => s.setPrescriptionData);

  const form = useForm({
    resolver: zodResolver(prescriptionDialogSchema),
    defaultValues,
  });

  useEffect(() => {
    const values = selectedPrescription
      ? {
          clinicLogo: selectedPrescription.clinicLogo || "",
          date: selectedPrescription.date || new Date().toISOString().split("T")[0],
          patientName: selectedPrescription.patientName || "",
          gender: selectedPrescription.gender || "",
          age: selectedPrescription.age?.toString() || "",
          diagnosis: selectedPrescription.diagnosis || "",
          prescription: selectedPrescription.prescription || "",
          doctorName: selectedPrescription.doctorName || "",
          doctorSignature: selectedPrescription.doctorSignature || "",
        }
      : defaultValues;
    form.reset(values);
  }, [selectedPrescription, form]);

  useEffect(() => {
    const subscription = form.watch((values) => setPrescriptionData(values));
    return () => subscription.unsubscribe();
  }, [form, setPrescriptionData]);

  return form;
}
