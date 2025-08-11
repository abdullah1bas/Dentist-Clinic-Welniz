import React, { useEffect, useMemo, useState } from "react";
import { currency, financialSchema, INCOME_CATEGORIES } from "@/lib/utils";
import FinancialHeader from "@/components/financial/shared/FinancialHeader";
import FinancialOverview from "@/components/financial/shared/FinancialOverview";
import FinancialTable from "@/components/financial/shared/FinancialTable";
import FinancialForm from "@/components/financial/shared/FinancialForm";
import FinancialChart from "@/components/financial/shared/FinancialChart";

const STORAGE_KEY = "clinic_revenues_v1";


export default function Income() {
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
        console.error("could not parse revenues from localStorage", e);
      }
    } else {
      const seed = [
        { id: Date.now() - 1000000, date: "2025-07-20", description: "استشارة طبية", category: "استشارات", amount: 500, addedBy: "Admin" },
        { id: Date.now() - 500000, date: "2025-07-22", description: "بيع أدوية", category: "بيع أدوية", amount: 300, addedBy: "Manager" },
      ];
      setData(seed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (filterCategory !== "all" && r.category !== filterCategory) return false;
      if (filterFrom && r.date < filterFrom) return false;
      if (filterTo && r.date > filterTo) return false;
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
    if (!confirm("هل أنت متأكد من حذف الإيراد؟")) return;
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <FinancialHeader
        title="الإيرادات"
        badgeColor="bg-green-600 hover:bg-green-700"
        totals={totals}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterFrom={filterFrom}
        setFilterFrom={setFilterFrom}
        filterTo={filterTo}
        setFilterTo={setFilterTo}
        categories={INCOME_CATEGORIES}
      />
      <FinancialOverview
        data={data}
        filtered={filtered}
        totals={totals}
        openAddDialog={() => setIsDialogOpen(true)}
        title="إيراد"
        buttonColor="bg-green-600 hover:bg-green-700"
      />
      <FinancialTable
        filtered={filtered}
        currency={currency}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="إيراد"
      />
      <FinancialForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editing={editing}
        setEditing={setEditing}
        data={data}
        setData={setData}
        categories={INCOME_CATEGORIES}
        schema={financialSchema(INCOME_CATEGORIES)}
        title="إيراد"
        descriptionPlaceholder="مثل: استشارة مريض"
        amountPlaceholder="مثال: 500"
        buttonColor="bg-green-600 hover:bg-green-700"
      />
      <FinancialChart
        data={data}
        categories={INCOME_CATEGORIES}
        currency={currency}
        title="رسم بياني للإيرادات حسب الفئة"
      />
    </div>
  );
}