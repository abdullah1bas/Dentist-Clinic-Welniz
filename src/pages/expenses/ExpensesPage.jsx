import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ExpenseForm from "@/components/expense/ExpenseForm";
import ExpensesStats from "@/components/expense/ExpensesStats";
import ExpensesChart from "@/components/expense/ExpensesChart";
import ExpensesTable from "@/components/expense/ExpensesTable";

const STORAGE_KEY = "clinic_expenses";
const CATEGORIES = ["إيجار", "رواتب", "معدات", "أدوية", "مرافق", "أخرى"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [showChart, setShowChart] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (filterFrom && e.date < filterFrom) return false;
      if (filterTo && e.date > filterTo) return false;
      return true;
    });
  }, [expenses, filterCategory, filterFrom, filterTo]);

  const totals = useMemo(() => {
    return {
      allTotal: expenses.reduce((s, i) => s + Number(i.amount), 0),
      filteredTotal: filteredExpenses.reduce((s, i) => s + Number(i.amount), 0),
    };
  }, [expenses, filteredExpenses]);

  function saveExpenses(newExpenses) {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  }

  return (
    <div className="p-4 space-y-4">
      <ExpenseForm categories={CATEGORIES} onSave={saveExpenses} expenses={expenses} />
      <ExpensesStats totals={totals} />

      <div className="flex gap-2 flex-wrap items-center">
        <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="كل الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفئات</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
        <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />

        <Button onClick={() => setShowChart((prev) => !prev)}>
          {showChart ? "إخفاء الرسم" : "عرض الرسم"}
        </Button>
      </div>

      {showChart && <ExpensesChart expenses={expenses} categories={CATEGORIES} />}

      <ExpensesTable
        expenses={filteredExpenses}
        onDelete={(id) => saveExpenses(expenses.filter((e) => e.id !== id))}
      />
    </div>
  );
}
