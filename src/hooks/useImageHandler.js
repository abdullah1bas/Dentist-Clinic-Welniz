export function useImageHandler(form) {
  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => form.setValue(field, reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field) => {
    form.setValue(field, "");
  };

  return { handleImageUpload, removeImage };
}
