import React, { useEffect, useMemo, useState } from "react";
import ExpensesHeader from "@/components/expense/ExpensesHeader";
import ExpensesOverview from "@/components/expense/ExpensesOverview";
import ExpensesTable from "@/components/expense/ExpensesTable";
import ExpenseForm from "@/components/expense/ExpenseForm";
import ExpensesChart from "@/components/expense/ExpensesChart";
import { CATEGORIES, currency } from "@/lib/utils";

const STORAGE_KEY = "clinic_expenses_v1";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setExpenses(parsed);
      } catch (e) {
        console.error("could not parse expenses from localStorage", e);
      }
    } else {
      const seed = [
        { id: Date.now() - 1000000, date: "2025-07-20", description: "شراء أدوات معملية", category: "معدات", amount: 2500, addedBy: "Admin" },
        { id: Date.now() - 500000, date: "2025-07-22", description: "مخدرات", category: "أدوية", amount: 800, addedBy: "Manager" },
      ];
      setExpenses(seed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

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

  const handleEdit = (exp) => {
    setEditing(exp.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm("هل أنت متأكد من حذف المصروف؟")) return;
    setExpenses((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <ExpensesHeader
        totals={totals}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterFrom={filterFrom}
        setFilterFrom={setFilterFrom}
        filterTo={filterTo}
        setFilterTo={setFilterTo}
      />
      <ExpensesOverview
        expenses={expenses}
        filtered={filtered}
        totals={totals}
        openAddDialog={() => setIsDialogOpen(true)}
      />
      <ExpensesTable filtered={filtered} currency={currency} onEdit={handleEdit} onDelete={handleDelete} />
      <ExpenseForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editing={editing}
        setEditing={setEditing}
        setExpenses={setExpenses}
        expenses={expenses}
      />
      <ExpensesChart expenses={expenses} categories={CATEGORIES} currency={currency} />
    </div>
  );
}