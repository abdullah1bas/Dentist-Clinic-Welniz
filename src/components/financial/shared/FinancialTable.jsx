import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit3, Trash2 } from "lucide-react";
import { currency } from "@/lib/utils";

export default function FinancialTable({ filtered, onEdit, onDelete, title }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>التاريخ</TableHead>
          <TableHead>الوصف</TableHead>
          <TableHead>الفئة</TableHead>
          <TableHead>المبلغ</TableHead>
          <TableHead>أضيف بواسطة</TableHead>
          <TableHead>إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{currency(item.amount)}</TableCell>
            <TableCell>{item.addedBy}</TableCell>
            <TableCell>
              <button onClick={() => onEdit(item)} className="mr-2">
                <Edit3 size={16} />
              </button>
              <button onClick={() => onDelete(item.id)}>
                <Trash2 size={16} />
              </button>
            </TableCell>
          </TableRow>
        ))}
        {filtered.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center">لا توجد {title}ات</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}