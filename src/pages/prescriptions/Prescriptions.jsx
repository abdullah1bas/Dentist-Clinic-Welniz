
import React, { useState } from "react";

import {  useMemo } from "react"
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Printer } from "lucide-react"
// import { arSA } from "@mui/x-data-grid/locales"
import { PrescriptionDialog } from "@/components/prescriptions/PrescriptionDialog";

// Mock data
const prescriptions = [
  {
    id: "RX001",
    patientName: "أحمد محمد علي",
    doctorName: "د. محمد صادق",
    date: "2025-01-15",
    age: 35,
    gender: "ذكر",
    diagnosis: "التهاب اللثة",
  },
  {
    id: "RX002",
    patientName: "فاطمة أحمد",
    doctorName: "د. سارة محمود",
    date: "2025-01-14",
    age: 28,
    gender: "أنثى",
    diagnosis: "تسوس الأسنان",
  },
  {
    id: "RX003",
    patientName: "محمود حسن",
    doctorName: "د. محمد صادق",
    date: "2025-01-13",
    age: 42,
    gender: "ذكر",
    diagnosis: "خلع ضرس العقل",
  },
]



export default function Prescriptions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  const columns = useMemo(
    () => [
      { field: "id", headerName: "رقم الروشتة", width: 120, filterable: true },
      { field: "patientName", headerName: "اسم المريض", width: 180, filterable: true },
      { field: "doctorName", headerName: "الطبيب", width: 150, filterable: true },
      { field: "date", headerName: "التاريخ", width: 120, type: "date", valueGetter: (value) => new Date(value) },
      { field: "age", headerName: "العمر", width: 80, type: "number" },
      { field: "gender", headerName: "الجنس", width: 80, filterable: true },
      { field: "diagnosis", headerName: "التشخيص", width: 200, filterable: true },
      {
        field: "actions",
        type: "actions",
        headerName: "الإجراءات",
        width: 120,
        getActions: (params) => [
          <GridActionsCellItem
            key="view"
            icon={<Eye className="w-4 h-4" />}
            label="عرض"
            onClick={() => handleEdit(params.row)}
          />,
          <GridActionsCellItem
            key="print"
            icon={<Printer className="w-4 h-4" />}
            label="طباعة"
            onClick={() => handlePrint(params.row)}
          />,
        ],
      },
    ],
    [],
  )

  const handleEdit = (prescription) => {
    setSelectedPrescription(prescription)
    setIsDialogOpen(true)
  }

  const handlePrint = (prescription) => {
    console.log("Printing prescription:", prescription.id)
  }

  const handleAddNew = () => {
    setSelectedPrescription(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">الروشتات الطبية</h1>
          <p className="text-zinc-600 mt-1">إدارة وطباعة الروشتات الطبية</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          روشتة جديدة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الروشتات</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={prescriptions}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: false },
                },
              }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-root": {
                  direction: "rtl",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8fafc",
                  fontWeight: "bold",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      <PrescriptionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} prescription={selectedPrescription} />
    </div>
  )
}
