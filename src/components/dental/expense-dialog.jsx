import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Save } from "lucide-react"
import { useDentalStore } from "@/stores/dental-store"

export function ExpenseDialog({ isOpen, onClose, selectedPatient, selectedExpense }) {
  const { addExpense, expenseTypes, currencies } = useDentalStore()
  const [formData, setFormData] = useState({
    type: "مواد العيادة",
    description: "",
    amount: "",
    currency: "EGP",
    date: new Date().toISOString().split("T")[0],
    image: "",
  })

  useEffect(() => {
    if (selectedExpense) {
      setFormData({
        type: selectedExpense.type,
        description: selectedExpense.description,
        amount: selectedExpense.amount.toString(),
        currency: selectedExpense.currency,
        date: selectedExpense.date,
        image: selectedExpense.image || "",
      })
    } else {
      setFormData({
        type: "مواد العيادة",
        description: "",
        amount: "",
        currency: "EGP",
        date: new Date().toISOString().split("T")[0],
        image: "",
      })
    }
  }, [selectedExpense, isOpen])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const handleSave = () => {
    if (!formData.description.trim() || !formData.amount || !selectedPatient) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    const expense = {
      ...formData,
      amount: Number.parseFloat(formData.amount),
    }

    addExpense(selectedPatient.id, expense)
    onClose()
  }

  const handleClose = () => {
    setFormData({
      type: "مواد العيادة",
      description: "",
      amount: "",
      currency: "EGP",
      date: new Date().toISOString().split("T")[0],
      image: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedExpense ? "عرض المصروف" : "إضافة مصروف جديد"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع المصروف</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                disabled={!!selectedExpense}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>التاريخ</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="bg-white"
                disabled={!!selectedExpense}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>الوصف *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="وصف تفصيلي للمصروف..."
              className="min-h-[80px] bg-white"
              disabled={!!selectedExpense}
            />
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>المبلغ *</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
                className="bg-white"
                disabled={!!selectedExpense}
              />
            </div>

            <div className="space-y-2">
              <Label>العملة</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                disabled={!!selectedExpense}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency === "USD" ? "دولار" : "جنيه"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>صورة للتوثيق</Label>
            {formData.image ? (
              <div className="relative">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="صورة المصروف"
                  className="w-full max-w-md mx-auto rounded-lg border"
                />
                {!selectedExpense && (
                  <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              !selectedExpense && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-4">رفع صورة للتوثيق (اختياري)</p>
                  <label htmlFor="expense-image" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        اختيار صورة
                      </span>
                    </Button>
                  </label>
                  <input
                    id="expense-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            {selectedExpense ? "إغلاق" : "إلغاء"}
          </Button>
          {!selectedExpense && (
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              حفظ المصروف
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
