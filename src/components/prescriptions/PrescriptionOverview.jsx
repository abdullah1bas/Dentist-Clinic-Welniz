import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Eye, FileText } from "lucide-react";
import { Button } from "../ui/button";

function PrescriptionOverview({
  filteredPrescriptions,
  paginatedPrescriptions,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  setSelectedPrescription,
  setIsDialogOpen
}) {
  const handleEdit = (prescription) => {
    setSelectedPrescription(prescription);
    setIsDialogOpen(true);
  };
  const handlePrint = (prescription) => {
    // فتح الروشتة في وضع الطباعة
    setSelectedPrescription(prescription)
    setIsDialogOpen(true)
    // تأخير الطباعة قليلاً للسماح للـ dialog بالفتح
    setTimeout(() => {
      window.print()
    }, 500)
  }
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  return (
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
                    <TableCell className='text-right font-medium'>{prescription.id}</TableCell>
                    <TableCell className='text-right'>{prescription.patientName}</TableCell>
                    <TableCell className='text-right'>{prescription.doctorName}</TableCell>
                    <TableCell className='text-right'>{prescription.date}</TableCell>
                    <TableCell className='text-right'>{prescription.age}</TableCell>
                    <TableCell className='text-right'>{prescription.gender}</TableCell>
                    <TableCell className='text-right max-w-xs truncate'>
                      {prescription.diagnosis}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Badge
                        variant={
                          prescription.status === "جديدة"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          prescription.status === "جديدة"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {prescription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right flex gap-2 justify-end'>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(prescription)}
                          title="عرض وتعديل"
                          className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrint(prescription)}
                          title="طباعة"
                          className="bg-gray-600 text-white hover:bg-gray-700 hover:text-white transition duration-300"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      {/* <div className="flex gap-2 justify-end">
                      </div> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-zinc-500"
                  >
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
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
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
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PrescriptionOverview;
