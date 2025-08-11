import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ADDED_BY_OPTIONS } from "@/lib/utils";


export default function FinancialForm({
  isDialogOpen,
  setIsDialogOpen,
  editing,
  setEditing,
  data,
  setData,
  categories,
  schema,
  title,
  descriptionPlaceholder,
  amountPlaceholder,
  buttonColor
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      description: "",
      category: categories[0],
      amount: "",
      addedBy: ADDED_BY_OPTIONS[0],
    },
  });

  useEffect(() => {
    if (editing) {
      const item = data.find((d) => d.id === editing);
      if (item) {
        form.reset({
          date: item.date,
          description: item.description,
          category: item.category,
          amount: String(item.amount),
          addedBy: item.addedBy,
        });
      }
    } else {
      form.reset({
        date: new Date().toISOString().slice(0, 10),
        description: "",
        category: categories[0],
        amount: "",
        addedBy: ADDED_BY_OPTIONS[0],
      });
    }
  }, [editing, data, form, categories]);

  const onSubmit = (formData) => {
    const amount = parseFloat(String(formData.amount).replace(/,/g, ""));
    const item = {
      id: editing || Date.now(),
      ...formData,
      amount,
    };

    setData((prev) =>
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
          <DialogTitle className='text-white'>{editing ? `تعديل ${title}` : `إضافة ${title}`}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-white">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="text-white">
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
                        {categories.map((c) => (
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
                    <Input className='text-black bg-white placeholder:text-black' {...field} placeholder={descriptionPlaceholder} />
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
                    <Input className='text-black bg-white placeholder:text-black' {...field} placeholder={amountPlaceholder} />
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
              <Button className={`${buttonColor} transition duration-300`} type="submit">{editing ? "حفظ التعديلات" : "إضافة"}</Button>
            </div>
          </form>
        </Form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}