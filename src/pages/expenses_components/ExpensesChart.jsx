import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ExpensesChart({ expenses }) {
  const data = useMemo(() => {
    const grouped = {};
    expenses.forEach((e) => {
      grouped[e.category] = (grouped[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(grouped).map(([category, total]) => ({ category, total }));
  }, [expenses]);

  return (
    <Card>
      <CardHeader><CardTitle>المصروفات حسب الفئة</CardTitle></CardHeader>
      <CardContent style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
