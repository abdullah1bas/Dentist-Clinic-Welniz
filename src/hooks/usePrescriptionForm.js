import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { prescriptionDialogFormSchema } from "@/lib/utils";

const defaultValues = {
  clinicLogo: "",
  date: new Date().toISOString().split("T")[0],
  patientName: "",
  gender: "ذكر",
  age: "",
  diagnosis: "",
  prescription: "",
  doctorName: "",
  doctorSignature: "",
};

export const usePrescriptionForm = (selectedPrescription, isOpen = false) => {
  const form = useForm({
    resolver: zodResolver(prescriptionDialogFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (isOpen) {
      if (selectedPrescription) {
        form.reset({
          clinicLogo: selectedPrescription.clinicLogo || "",
          date: selectedPrescription.date || new Date().toISOString().split("T")[0],
          patientName: selectedPrescription.patientName || "",
          gender: selectedPrescription.gender || "ذكر",
          age: selectedPrescription.age?.toString() || "",
          diagnosis: selectedPrescription.diagnosis || "",
          prescription: selectedPrescription.prescription || "",
          doctorName: selectedPrescription.doctorName || "",
          doctorSignature: selectedPrescription.doctorSignature || "",
        })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [selectedPrescription, isOpen, form])

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        form.setValue(field, reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (field) => {
    form.setValue(field, "")
  }

  return {
    form: form,
    handleImageUpload: handleImageUpload,
    removeImage: removeImage,
  }
}
