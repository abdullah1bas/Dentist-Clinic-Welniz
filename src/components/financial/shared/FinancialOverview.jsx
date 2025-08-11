import React from "react";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";
import FinancialCard from "./FinancialCard";

export default function FinancialOverview({
  data,
  filtered,
  totals,
  openAddDialog,
  title,
  buttonColor,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <FinancialCard title="إجمالي (مفلتر)">
        <div className="text-2xl font-bold">{currency(totals.filteredTotal)}</div>
        <div className="text-sm text-muted-foreground mt-1">عدد البنود: {filtered.length}</div>
      </FinancialCard>
      <FinancialCard title={`آخر ٥ ${title}ات`}>
        <ul className="space-y-2 p-0">
          {data.slice(0, 5).map((item) => (
            <li key={item.id} className="flex justify-between items-start gap-3">
              <div>
                <div className="font-medium">{item.description}</div>
                <div className="text-sm text-muted-foreground">{item.category} • {item.date}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{currency(item.amount)}</div>
              </div>
            </li>
          ))}
          {data.length === 0 && <div className="text-sm text-muted-foreground">لا توجد {title}ات بعد</div>}
        </ul>
      </FinancialCard>
      <FinancialCard title="سجل سريع">
        <div className="text-sm text-muted-foreground">اضافة، تعديل أو حذف البنود من هنا.</div>
        <div className="mt-3">
          <Button
            onClick={openAddDialog}
            variant="outline"
            className={`w-full ${buttonColor} text-white hover:text-white transition-colors duration-300`}
          >
            سجل {title} جديد
          </Button>
        </div>
      </FinancialCard>
    </div>
  );
}