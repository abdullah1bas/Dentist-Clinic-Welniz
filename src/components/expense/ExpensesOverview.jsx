import React from "react";
import { Button } from "@/components/ui/button";
import CardExpense from "./CardExpense";
import { currency } from "@/lib/utils";

export default function ExpensesOverview({ expenses, filtered, totals, openAddDialog }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <CardExpense title="إجمالي (مفلتر)">
        <div className="text-2xl font-bold">{currency(totals.filteredTotal)}</div>
        <div className="text-sm text-muted-foreground mt-1">عدد البنود: {filtered.length}</div>
      </CardExpense>
      <CardExpense title="آخر ٥ مصروفات">
        <ul className="space-y-2">
          {expenses.slice(0, 5).map((e) => (
            <li key={e.id} className="flex justify-between items-start gap-3">
              <div>
                <div className="font-medium">{e.description}</div>
                <div className="text-sm text-muted-foreground">{e.category} • {e.date}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{currency(e.amount)}</div>
              </div>
            </li>
          ))}
          {expenses.length === 0 && <div className="text-sm text-muted-foreground">لا توجد مصروفات بعد</div>}
        </ul>
      </CardExpense>
      <CardExpense title="سجل سريع">
        <div className="text-sm text-muted-foreground">اضافة، تعديل أو حذف البنود من هنا.</div>
        <div className="mt-3">
          <Button
            onClick={openAddDialog}
            variant="outline"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white transition-colors duration-300"
          >
            سجل مصروف جديد
          </Button>
        </div>
      </CardExpense>
    </div>
  );
}