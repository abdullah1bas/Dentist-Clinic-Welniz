import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import PatientFilters from "@/components/dental/patient-filters"
import { PatientCard } from "@/components/dental/patient-card"
import { CaseDialog } from "@/components/dental/case-dialog"
import { useDentalStore } from "@/stores/dental-store"
import UserFooter from "@/components/UserFooter"

export default function PatientsPage() {
  const { getPaginatedPatients, setSelectedPatient, setIsDialogOpen } = useDentalStore()

  const paginatedPatients = getPaginatedPatients()

  const handleAddNew = () => {
    setSelectedPatient(null)
    setIsDialogOpen(true)
  }
  console.log('patientsPage')
  return (
    <div className="p-6 space-y-6 min-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div className="mr-auto">
          <h1 className="text-base sm:text-3xl font-bold text-zinc-900">إدارة المرضى</h1>
          <p className="text-sm text-zinc-600 mt-1">إدارة حالات المرضى والمتابعة</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 ml-auto text-white transition duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          حالة جديدة
        </Button>
      </div>

      <PatientFilters />

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedPatients.length > 0 ? (
          paginatedPatients.map((patient) => <PatientCard key={patient.id} patient={patient} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg mb-4">لا توجد حالات تطابق معايير البحث</div>
            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              إضافة حالة جديدة
            </Button>
          </div>
        )}
      </div>

      <UserFooter />
      <CaseDialog />
    </div>
  )
}
