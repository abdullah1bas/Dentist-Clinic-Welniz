import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUIStore } from "@/stores/uiStore";
import { usePatientsStore } from "@/stores/patientsStore";
import { useConstantsStore } from "@/stores/constantsStore";
import PatientActions from "../forms/patient-actions";

const patientSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  address: z.string().optional(),
  occupation: z.string().optional(),
  gender: z.enum(["ذكر", "أنثى"]),
  age: z.coerce.number().min(1).max(120).optional(),
  category: z.string().optional(),
  systemicConditions: z.string().optional(),
  notes: z.string().optional(),
  profileImage: z.string().optional(),
});

export function PatientInfoSection({
  formData,
  updateFormData,
}) {
  const { categories } = useConstantsStore();
  const { selectedPatient } = useUIStore();
  

  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: selectedPatient || {
      name: "",
      phone: "",
      address: "",
      occupation: "",
      gender: "ذكر",
      age: undefined,
      category: "",
      systemicConditions: "",
      notes: "",
      profileImage: "",
    },
  });

  const onSubmit = (values) => {
    if (selectedPatient) {
      usePatientsStore.getState().updatePatient(selectedPatient.id, values);
    } else {
      usePatientsStore.getState().addPatient(values);
    }
  };

  

  return (
    <div className="space-y-6">
      {/* Profile Image and Actions */}
      <PatientActions formData={formData} updateFormData={updateFormData} />

      {/* Patient Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل *</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم المريض الكامل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف *</FormLabel>
                        <FormControl>
                          <Input placeholder="01xxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="عنوان المريض" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الجنس</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الجنس" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ذكر">ذكر</SelectItem>
                            <SelectItem value="أنثى">أنثى</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Age */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العمر</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="العمر بالسنوات"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الفئة</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>ملاحظات</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أي ملاحظات إضافية..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full">
                حفظ
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
