import React from "react";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { currency, CATEGORIES } from "@/lib/utils";

export default function ExpensesHeader({
  totals,
  filterCategory,
  setFilterCategory,
  filterFrom,
  setFilterFrom,
  filterTo,
  setFilterTo,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold">المصروفات</h2>
        <Badge variant="secondary" className="text-sm bg-blue-600 text-white">
          إجمالي المصروفات: {currency(totals.allTotal)}
        </Badge>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 bg-muted rounded-md p-2">
        <div className="flex items-center justify-center gap-1 w-full">
          <Filter size={16} />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-transparent outline-none border-0 text-sm">
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
          className="ml-2 text-sm w-full bg-white"
        />
        <Input
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
          className="ml-2 text-sm w-full bg-white"
        />
      </div>
    </div>
  );
}