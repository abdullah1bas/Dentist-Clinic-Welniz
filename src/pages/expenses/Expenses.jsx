import React, { useEffect, useMemo, useState } from "react";
import { currency, EXPENSE_CATEGORIES, financialSchema } from "@/lib/utils";
import FinancialHeader from "@/components/financial/shared/FinancialHeader";
import FinancialOverview from "@/components/financial/shared/FinancialOverview";
import FinancialTable from "@/components/financial/shared/FinancialTable";
import FinancialForm from "@/components/financial/shared/FinancialForm";
import FinancialChart from "@/components/financial/shared/FinancialChart";

const STORAGE_KEY = "clinic_expenses_v1";

export default function Expenses() {
  const [data, setData] = useState([]);
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
        setData(parsed);
      } catch (e) {
        console.error("could not parse expenses from localStorage", e);
      }
    } else {
      const seed = [
        { id: Date.now() - 1000000, date: "2025-07-20", description: "شراء أدوات معملية", category: "معدات", amount: 2500, addedBy: "Admin" },
        { id: Date.now() - 500000, date: "2025-07-22", description: "مخدرات", category: "أدوية", amount: 800, addedBy: "Manager" },
      ];
      setData(seed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((e) => {
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (filterFrom && e.date < filterFrom) return false;
      if (filterTo && e.date > filterTo) return false;
      return true;
    });
  }, [data, filterCategory, filterFrom, filterTo]);

  const totals = useMemo(() => {
    const allTotal = data.reduce((s, i) => s + Number(i.amount), 0);
    const filteredTotal = filtered.reduce((s, i) => s + Number(i.amount), 0);
    return { allTotal, filteredTotal };
  }, [data, filtered]);

  const handleEdit = (item) => {
    setEditing(item.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm("هل أنت متأكد من حذف المصروف؟")) return;
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <FinancialHeader
        title="المصروفات"
        badgeColor="bg-blue-600 hover:bg-blue-700"
        totals={totals}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterFrom={filterFrom}
        setFilterFrom={setFilterFrom}
        filterTo={filterTo}
        setFilterTo={setFilterTo}
        categories={EXPENSE_CATEGORIES}
      />
      <FinancialOverview
        data={data}
        filtered={filtered}
        totals={totals}
        openAddDialog={() => setIsDialogOpen(true)}
        title="مصروف"
        buttonColor="bg-blue-600 hover:bg-blue-700"
      />
      <FinancialTable
        filtered={filtered}
        currency={currency}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="مصروف"
      />
      <FinancialForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editing={editing}
        setEditing={setEditing}
        data={data}
        setData={setData}
        categories={EXPENSE_CATEGORIES}
        schema={financialSchema(EXPENSE_CATEGORIES)}
        title="مصروف"
        descriptionPlaceholder="مثل: شراء مواد تخدير"
        amountPlaceholder="مثال: 1200"
      />
      <FinancialChart
        data={data}
        categories={EXPENSE_CATEGORIES}
        currency={currency}
        title="رسم بياني للمصروفات حسب الفئة"
      />
    </div>
  );
}