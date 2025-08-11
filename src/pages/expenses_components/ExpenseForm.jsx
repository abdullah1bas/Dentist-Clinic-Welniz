import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const CATEGORIES = ["إيجار", "رواتب", "فواتير", "أدوات طبية", "أخرى"];

export default function ExpenseForm({ initialData, onSubmit }) {
  const [form, setForm] = useState(initialData);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="الوصف" value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
      <Select value={form.category} onValueChange={(value) => handleChange("category", value)}>
        <SelectTrigger><SelectValue placeholder="الفئة" /></SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input type="number" placeholder="المبلغ" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} />
      <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
      <Button type="submit" className="w-full">{initialData.id ? "تحديث" : "إضافة"}</Button>
    </form>
  );
}
