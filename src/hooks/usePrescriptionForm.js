import { useState, useEffect } from "react"

export const usePrescriptionForm = (selectedPrescription, isOpen) => {
  const [formData, setFormData] = useState({
    clinicLogo: "",
    date: new Date().toISOString().split("T")[0],
    patientName: "",
    gender: "ذكر",
    age: "",
    diagnosis: "",
    prescription: "",
    doctorName: "",
    doctorSignature: "",
  })

  useEffect(() => {
    if (isOpen) {
      if (selectedPrescription) {
        setFormData({
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
        setFormData({
          clinicLogo: "",
          date: new Date().toISOString().split("T")[0],
          patientName: "",
          gender: "ذكر",
          age: "",
          diagnosis: "",
          prescription: "",
          doctorName: "",
          doctorSignature: "",
        })
      }
    }
  }, [selectedPrescription, isOpen])

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateField(field, reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (field) => {
    updateField(field, "")
  }

  return {
    formData,
    updateField,
    handleImageUpload,
    removeImage,
    setFormData,
  }
}
