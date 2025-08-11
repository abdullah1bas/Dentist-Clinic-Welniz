
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { prescriptionSchema } from "@/lib/utils";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editPrescription, setEditPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientName: "",
      medicine: "",
      dosage: "",
      duration: "",
      notes: ""
    }
  });

  const onSubmit = (data) => {
    const newData = {
      id: editPrescription?.id || uuidv4(),
      date: new Date().toLocaleString(),
      ...data
    };

    if (editPrescription) {
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === editPrescription.id ? newData : p))
      );
    } else {
      setPrescriptions((prev) => [...prev, newData]);
    }

    setOpenDialog(false);
    setEditPrescription(null);
    form.reset();
  };

  const handleEdit = (item) => {
    setEditPrescription(item);
    form.reset({
      patientName: item.patientName,
      medicine: item.medicine,
      dosage: item.dosage,
      duration: item.duration,
      notes: item.notes || ""
    });
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medicine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Input
          placeholder="بحث باسم المريض أو الدواء..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
        <Button onClick={() => { form.reset(); setEditPrescription(null); setOpenDialog(true); }}>
          إضافة وصفة جديدة
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم المريض</TableHead>
            <TableHead>الدواء</TableHead>
            <TableHead>الجرعة</TableHead>
            <TableHead>المدة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>ملاحظات</TableHead>
            <TableHead>إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.patientName}</TableCell>
                <TableCell>{item.medicine}</TableCell>
                <TableCell>{item.dosage}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.notes}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" onClick={() => handleEdit(item)}>تعديل</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500">
                لا توجد وصفات طبية
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editPrescription ? "تعديل وصفة" : "إضافة وصفة جديدة"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المريض</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الدواء</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الجرعة</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مدة العلاج</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="submit">{editPrescription ? "تحديث" : "إضافة"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
