import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExpenseForm from "./ExpenseForm";
import ExpensesStats from "./ExpensesStats";
import ExpensesTable from "./ExpensesTable";
import ExpensesChart from "./ExpensesChart";

const STORAGE_KEY = "clinic_expenses";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ description: "", category: "إيجار", amount: "", date: "" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  const saveExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData({ description: "", category: "إيجار", amount: "", date: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (expense) => {
    setEditing(expense.id);
    setFormData({ description: expense.description, category: expense.category, amount: expense.amount, date: expense.date });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleSubmit = (data) => {
    if (editing) {
      saveExpenses(expenses.map((e) => (e.id === editing ? { ...e, ...data } : e)));
    } else {
      saveExpenses([{ id: Date.now(), ...data }, ...expenses]);
    }
    setIsDialogOpen(false);
  };

  const totals = useMemo(() => {
    const allTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return { allTotal };
  }, [expenses]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">قسم المصروفات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>إضافة</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "تعديل مصروف" : "إضافة مصروف جديد"}</DialogTitle>
            </DialogHeader>
            <ExpenseForm initialData={formData} onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <ExpensesStats totals={totals} />
      <ExpensesChart expenses={expenses} />
      <ExpensesTable expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
