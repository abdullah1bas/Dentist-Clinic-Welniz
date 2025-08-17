import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"

const COMMON_MEDICINES = [
  {
    name: "أموكسيسيلين 500 مجم",
    dosage: "كبسولة كل 8 ساعات لمدة 7 أيام",
    category: "مضاد حيوي",
  },
  {
    name: "إيبوبروفين 400 مجم",
    dosage: "قرص كل 6 ساعات عند الحاجة",
    category: "مسكن ومضاد التهاب",
  },
  {
    name: "باراسيتامول 500 مجم",
    dosage: "قرص كل 6 ساعات عند الحاجة",
    category: "مسكن وخافض حرارة",
  },
  {
    name: "كلورهيكسيدين غسول فم",
    dosage: "مضمضة مرتين يومياً لمدة أسبوع",
    category: "غسول فم",
  },
  {
    name: "ديكلوفيناك جل",
    dosage: "دهان موضعي 3 مرات يومياً",
    category: "مضاد التهاب موضعي",
  },
]

export function MedicineDialog({ open, onOpenChange, onAddMedicine }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMedicines = useMemo(
    () =>
      COMMON_MEDICINES.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.category.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  )

  const handleAddMedicine = (medicine) => {
    const medicineText = `${medicine.name} - ${medicine.dosage}`
    onAddMedicine(medicineText)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl text-white">
        <DialogHeader>
          <DialogTitle>اختيار الأدوية المقترحة</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
            <Input
              placeholder="ابحث عن الدواء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white text-black placeholder:text-gray-600"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredMedicines.map((medicine, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{medicine.name}</h3>
                      <p className="text-gray-600 mb-2">{medicine.dosage}</p>
                      <Badge variant="secondary" className="text-xs">
                        {medicine.category}
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => handleAddMedicine(medicine)} className="ml-4">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-8 text-gray-500">لا توجد أدوية تطابق البحث</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
