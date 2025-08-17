import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
// import PrescriptionFilters from "@/components/prescriptions/prescription-filters"
// import PrescriptionTable from "@/components/prescriptions/prescription-table"
// import { PrescriptionDialog } from "@/components/prescriptions/prescription-dialog"
// import { usePrescriptionStore } from "@/stores/prescription-store"
import PrescriptionFilters from "@/components/prescriptions/PrescriptionFilters"
import PrescriptionTable from "@/components/prescriptions/PrescriptionTable"
import { PrescriptionDialog } from "@/components/prescriptions/prescription-dialog/PrescriptionDialog"
import { usePrescriptionStore } from "@/store/usePrescriptionStore"

export default function PrescriptionsTest() {
  const { setSelectedPrescription, setIsDialogOpen } = usePrescriptionStore()

  const handleAddNew = () => {
    setSelectedPrescription(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div className="mr-auto">
          <h1 className="text-base sm:text-3xl font-bold text-zinc-900">الروشتات الطبية</h1>
          <p className="text-sm text-zinc-600 mt-1">إدارة وطباعة الروشتات الطبية</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 ml-auto text-white transition duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          روشتة جديدة
        </Button>
      </div>

      <PrescriptionFilters />
      <PrescriptionTable />
      <PrescriptionDialog />
    </div>
  )
}
