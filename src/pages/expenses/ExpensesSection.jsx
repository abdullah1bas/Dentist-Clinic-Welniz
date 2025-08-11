import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit3, Trash2, Filter, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CATEGORIES = ["معدات", "أدوية", "أجور", "صيانة", "أخرى"];
const STORAGE_KEY = "clinic_expenses_v1";
function currency(n) {
  return n.toLocaleString("ar-EG", { style: "currency", currency: "EGP" });
}

export default function ExpensesSection() {
  const [expenses, setExpenses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    category: CATEGORIES[0],
    amount: "",
  });
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setExpenses(JSON.parse(raw));
      } catch {
        console.error("Error parsing expenses");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  function resetForm() {
    setForm({ date: new Date().toISOString().slice(0, 10), description: "", category: CATEGORIES[0], amount: "" });
    setEditing(null);
  }

  function openAddDialog() {
    resetForm();
    setIsDialogOpen(true);
  }

  function onSubmitForm(e) {
    e.preventDefault();
    const amount = parseFloat(String(form.amount).replace(/,/g, ""));
    if (!form.description.trim() || !form.date || isNaN(amount) || amount <= 0) {
      alert("من فضلك املأ الحقول بشكل صحيح");
      return;
    }
    if (editing) {
      setExpenses((prev) => prev.map((p) => (p.id === editing ? { ...p, ...form, amount } : p)));
    } else {
      setExpenses((prev) => [{ id: Date.now(), ...form, amount }, ...prev]);
    }
    setIsDialogOpen(false);
    resetForm();
  }

  function onEdit(exp) {
    setEditing(exp.id);
    setForm({ date: exp.date, description: exp.description, category: exp.category, amount: String(exp.amount) });
    setIsDialogOpen(true);
  }

  function onDelete(id) {
    if (!confirm("هل أنت متأكد؟")) return;
    setExpenses((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (filterFrom && e.date < filterFrom) return false;
      if (filterTo && e.date > filterTo) return false;
      return true;
    });
  }, [expenses, filterCategory, filterFrom, filterTo]);

  const totals = useMemo(() => {
    const allTotal = expenses.reduce((s, i) => s + Number(i.amount), 0);
    const filteredTotal = filtered.reduce((s, i) => s + Number(i.amount), 0);
    return { allTotal, filteredTotal };
  }, [expenses, filtered]);

  const chartData = useMemo(() => {
    const categoryTotals = CATEGORIES.map((cat) => ({
      category: cat,
      total: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
    }));
    return categoryTotals;
  }, [expenses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">المصروفات</h2>
          <Badge variant="secondary">إجمالي: {currency(totals.allTotal)}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted rounded-md p-2">
            <Filter size={16} />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent outline-none text-sm">
              <option value="all">الكل</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="ml-2 text-sm" />
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="ml-2 text-sm" />
          </div>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <Plus size={16} /> إضافة مصروف
          </Button>
          <Button variant="outline" onClick={() => setShowChart(!showChart)} className="flex items-center gap-2">
            <BarChart3 size={16} /> {showChart ? "إخفاء الرسم البياني" : "عرض الرسم البياني"}
          </Button>
        </div>
      </div>

      {showChart && (
        <Card>
          <CardHeader>
            <CardTitle>رسم بياني للمصروفات</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Bar dataKey="total" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>قائمة المصروفات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تاريخ</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الاجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell>{e.category}</TableCell>
                  <TableCell className="text-right font-semibold">{currency(e.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(e)}>
                      <Edit3 size={16} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(e.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">لا توجد نتائج</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
        <DialogTrigger asChild><span /></DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل المصروف" : "إضافة مصروف"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmitForm} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">التاريخ</label>
                <Input type="date" value={form.date} onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm">الفئة</label>
                <Select value={form.category} onValueChange={(val) => setForm((s) => ({ ...s, category: val }))}>
                  <SelectTrigger><SelectValue placeholder="اختر فئة" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm">الوصف</label>
              <Input value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm">المبلغ</label>
              <Input value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => { setIsDialogOpen(false); resetForm(); }}>إلغاء</Button>
              <Button type="submit">{editing ? "حفظ" : "إضافة"}</Button>
            </div>
          </form>
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  );
}
