import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { appointmentSchema } from "@/lib/utils";

export default function AppointmentForm({
  openDialog,
  setOpenDialog,
  selectedDate,
  editPatient,
  setAppointments,
  setEditPatient
}) {
  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: "",
      phone: "",
      time: "",
      note: ""
    }
  });

  const resetForm = () => {
    form.reset();
    setEditPatient(null);
    setOpenDialog(false);
  };

  const onSubmit = (data) => {
    const newPatient = {
      id: editPatient?.id || uuidv4(),
      ...data
    };

    setAppointments((prevAppointments) => {
      const existingDayIndex = prevAppointments.findIndex(a => a.date === selectedDate);
      let updatedAppointments = [...prevAppointments];

      if (existingDayIndex !== -1) {
        const updatedPatients = editPatient
          ? updatedAppointments[existingDayIndex].patients.map(p =>
              p.id === editPatient.id ? newPatient : p
            )
          : [...updatedAppointments[existingDayIndex].patients, newPatient];

        updatedAppointments[existingDayIndex] = {
          ...updatedAppointments[existingDayIndex],
          patients: updatedPatients
        };
      } else {
        updatedAppointments.push({ date: selectedDate, patients: [newPatient] });
      }

      return updatedAppointments;
    });

    resetForm();
  };

  const onDelete = () => {
    if (!editPatient) return;

    setAppointments((prevAppointments) =>
      prevAppointments
        .map((a) =>
          a.date === selectedDate
            ? { ...a, patients: a.patients.filter((p) => p.id !== editPatient.id) }
            : a
        )
        .filter((a) => a.patients.length > 0)
    );

    resetForm();
  };

  React.useEffect(() => {
    if (editPatient) {
      form.reset({
        patientName: editPatient.patientName,
        phone: editPatient.phone,
        time: editPatient.time,
        note: editPatient.note || ""
      });
    } else {
      form.reset();
    }
  }, [editPatient, form]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="text-white z-[10000]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editPatient ? "تعديل بيانات المريض" : "إضافة مريض جديد"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">اسم المريض</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full border p-2 rounded text-black bg-white" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} className="w-full border p-2 rounded text-black bg-white" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">الوقت</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="w-full border p-2 rounded text-black bg-white" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea rows="2" {...field} className="w-full border p-2 rounded text-black bg-white" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-4">
              {editPatient && (
                <Button
                  type="button"
                  variant="destructive"
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={onDelete}
                >
                  حذف المريض
                </Button>
              )}
              <Button
                type="submit"
                className="bg-white text-black hover:bg-gray-200"
              >
                {editPatient ? "تحديث" : "إضافة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}