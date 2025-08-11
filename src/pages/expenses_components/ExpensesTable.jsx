import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p className="text-center text-gray-500">لا توجد مصروفات لعرضها</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الوصف</TableHead>
          <TableHead>الفئة</TableHead>
          <TableHead>المبلغ</TableHead>
          <TableHead>التاريخ</TableHead>
          <TableHead className="text-right">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((exp) => (
          <TableRow key={exp.id}>
            <TableCell>{exp.description}</TableCell>
            <TableCell>{exp.category}</TableCell>
            <TableCell>{exp.amount.toLocaleString()} ج.م</TableCell>
            <TableCell>{exp.date}</TableCell>
            <TableCell className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(exp.id)}>
                تعديل
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(exp.id)}>
                حذف
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
