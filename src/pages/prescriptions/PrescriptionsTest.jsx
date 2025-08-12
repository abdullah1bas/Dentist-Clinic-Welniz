import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Printer, Eye, FileText } from "lucide-react"
import { PrescriptionDialog } from "@/components/prescriptions/PrescriptionDialog"

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
    status: "مكتملة",
  },
  {
    id: "RX002",
    patientName: "فاطمة أحمد",
    doctorName: "د. سارة محمود",
    date: "2025-01-14",
    age: 28,
    gender: "أنثى",
    diagnosis: "تسوس الأسنان",
    status: "جديدة",
  },
  {
    id: "RX003",
    patientName: "محمود حسن",
    doctorName: "د. محمد صادق",
    date: "2025-01-13",
    age: 42,
    gender: "ذكر",
    diagnosis: "خلع ضرس العقل",
    status: "مكتملة",
  },
]

const doctors = ["جميع الأطباء", "د. محمد صادق", "د. سارة محمود"]
const statuses = ["جميع الحالات", "جديدة", "مكتملة"]

export default function PrescriptionsTest() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    search: "",
    doctor: "جميع الأطباء",
    status: "جميع الحالات",
    dateFrom: "",
    dateTo: "",
  })

  // Filter prescriptions
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((prescription) => {
      const matchesSearch =
        prescription.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        prescription.id.toLowerCase().includes(filters.search.toLowerCase())

      const matchesDoctor = filters.doctor === "جميع الأطباء" || prescription.doctorName === filters.doctor
      const matchesStatus = filters.status === "جميع الحالات" || prescription.status === filters.status
      const matchesDateFrom = !filters.dateFrom || prescription.date >= filters.dateFrom
      const matchesDateTo = !filters.dateTo || prescription.date <= filters.dateTo

      return matchesSearch && matchesDoctor && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [filters])

  // Pagination
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleAddNew = () => {
    setSelectedPrescription(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (prescription) => {
    setSelectedPrescription(prescription)
    setIsDialogOpen(true)
  }

  const handlePrint = (prescription) => {
    console.log("Printing prescription:", prescription.id)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      doctor: "جميع الأطباء",
      status: "جميع الحالات",
      dateFrom: "",
      dateTo: "",
    })
    setCurrentPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              الفلاتر والبحث
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="اسم المريض أو رقم الروشتة"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Doctor Filter */}
            <div className="space-y-2">
              <Label>الطبيب</Label>
              <Select value={filters.doctor} onValueChange={(value) => handleFilterChange("doctor", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-zinc-600">
              عرض {paginatedPrescriptions.length} من {filteredPrescriptions.length} روشتة
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            قائمة الروشتات ({filteredPrescriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الروشتة</TableHead>
                  <TableHead className="text-right">اسم المريض</TableHead>
                  <TableHead className="text-right">الطبيب</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">العمر</TableHead>
                  <TableHead className="text-right">الجنس</TableHead>
                  <TableHead className="text-right">التشخيص</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPrescriptions.length > 0 ? (
                  paginatedPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id} className="hover:bg-zinc-50">
                      <TableCell className="font-medium">{prescription.id}</TableCell>
                      <TableCell>{prescription.patientName}</TableCell>
                      <TableCell>{prescription.doctorName}</TableCell>
                      <TableCell>{prescription.date}</TableCell>
                      <TableCell>{prescription.age}</TableCell>
                      <TableCell>{prescription.gender}</TableCell>
                      <TableCell className="max-w-xs truncate">{prescription.diagnosis}</TableCell>
                      <TableCell>
                        <Badge
                          variant={prescription.status === "جديدة" ? "default" : "secondary"}
                          className={
                            prescription.status === "جديدة"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {prescription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(prescription)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handlePrint(prescription)}>
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-zinc-500">
                      لا توجد روشتات تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Label>عدد الصفوف:</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <span className="text-sm">
                  صفحة {currentPage} من {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <PrescriptionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} prescription={selectedPrescription} />
    </div>
  )
}
