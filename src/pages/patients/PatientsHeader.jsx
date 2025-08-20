import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { Plus } from 'lucide-react';
import React from 'react'

function PatientsHeader() {
    const { setSelectedPatient, setIsDialogOpen } = useUIStore();

  const handleAddNew = () => {
    setSelectedPatient(null)
    setIsDialogOpen(true)
  }
  return (
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
  )
}

export default PatientsHeader