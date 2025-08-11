import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["معدات", "أدوية", "أجور", "صيانة", "أخرى"];

const schema = z.object({
  description: z.string().min(1, "الوصف مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  amount: z.number().positive("المبلغ يجب أن يكون أكبر من 0"),
  date: z.string().min(1, "التاريخ مطلوب"),
});

export default function QuickActions({ data, onAdd, onEdit, onDelete }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      category: CATEGORIES[0],
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  function handleSubmit(values) {
    onAdd({ ...values, id: Date.now() });
    form.reset({
      description: "",
      category: CATEGORIES[0],
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* آخر 5 مصروفات */}
      <div>
        <h2 className="text-lg font-semibold mb-2">آخر 5 مصروفات</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الوصف</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(-5).map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{exp.description}</TableCell>
                <TableCell>{exp.amount.toLocaleString()}</TableCell>
                <TableCell>{exp.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* سجل سريع */}
      <div>
        <h2 className="text-lg font-semibold mb-2">سجل سريع</h2>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-3 border p-4 rounded-lg"
        >
          <Input
            placeholder="الوصف"
            {...form.register("description")}
          />
          <Select
            onValueChange={(val) => form.setValue("category", val)}
            defaultValue={form.getValues("category")}
          >
            <SelectTrigger>
              <SelectValue placeholder="الفئة" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="المبلغ"
            {...form.register("amount", { valueAsNumber: true })}
          />
          <Input
            type="date"
            {...form.register("date")}
          />
          <Button type="submit" className="w-full">
            إضافة
          </Button>
        </form>
      </div>
    </div>
  );
}
