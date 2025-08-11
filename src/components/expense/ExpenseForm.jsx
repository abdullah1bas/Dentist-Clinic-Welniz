import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/lib/utils";
import { CATEGORIES } from "@/lib/utils";

const ADDED_BY_OPTIONS = ["Admin", "Manager", "Staff"];

export default function ExpenseForm({ isDialogOpen, setIsDialogOpen, editing, setEditing, setExpenses, expenses }) {
  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      description: "",
      category: CATEGORIES[0],
      amount: "",
      addedBy: ADDED_BY_OPTIONS[0],
    },
  });

  useEffect(() => {
    if (editing) {
      const expense = expenses.find((e) => e.id === editing);
      if (expense) {
        form.reset({
          date: expense.date,
          description: expense.description,
          category: expense.category,
          amount: String(expense.amount),
          addedBy: expense.addedBy,
        });
      }
    } else {
      form.reset({
        date: new Date().toISOString().slice(0, 10),
        description: "",
        category: CATEGORIES[0],
        amount: "",
        addedBy: ADDED_BY_OPTIONS[0],
      });
    }
  }, [editing, expenses, form]);

  const onSubmit = (data) => {
    const amount = parseFloat(String(data.amount).replace(/,/g, ""));
    const item = {
      id: editing || Date.now(),
      ...data,
      amount,
    };

    setExpenses((prev) =>
      editing ? prev.map((p) => (p.id === editing ? item : p)) : [item, ...prev]
    );
    setIsDialogOpen(false);
    setEditing(null);
    form.reset();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      if (!open) {
        setEditing(null);
        form.reset();
      }
      setIsDialogOpen(open);
    }}>
      <DialogTrigger asChild>
        <span />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg text-white">
        <DialogHeader>
          <DialogTitle>{editing ? "تعديل المصروف" : "إضافة مصروف"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ</FormLabel>
                    <FormControl>
                      <Input className='text-black bg-white' type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفئة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='bg-white text-black'>
                          <SelectValue placeholder="اختر فئة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Input className='text-black bg-white placeholder:text-black' {...field} placeholder="مثل: شراء مواد تخدير" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المبلغ (EGP)</FormLabel>
                  <FormControl>
                    <Input className='text-black bg-white placeholder:text-black' {...field} placeholder="مثال: 1200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>أضيف بواسطة</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='bg-white text-black'>
                        <SelectValue placeholder="اختر الشخص" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ADDED_BY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">{editing ? "حفظ التعديلات" : "إضافة"}</Button>
            </div>
          </form>
        </Form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}