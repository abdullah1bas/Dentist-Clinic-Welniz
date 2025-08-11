import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExpensesStats({ totals }) {
  return (
    <div className="flex gap-4 flex-wrap">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>إجمالي الكل</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">{totals.allTotal} ج.م</p>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>إجمالي المفلتر</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">{totals.filteredTotal} ج.م</p>
        </CardContent>
      </Card>
    </div>
  );
}
