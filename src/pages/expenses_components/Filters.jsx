import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

const CATEGORIES = ["الكل", "معدات", "أدوية", "أجور", "صيانة", "أخرى"];

export default function Filters({ onChange }) {
  const form = useForm({
    defaultValues: {
      search: "",
      category: "الكل",
      from: "",
      to: "",
    },
  });

  function handleFiltersChange() {
    const values = form.getValues();
    onChange(values);
  }

  return (
    <Form {...form}>
      <form
        onChange={handleFiltersChange}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>بحث</FormLabel>
              <FormControl>
                <Input placeholder="بحث بالوصف..." {...field} />
              </FormControl>
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
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem>
              <FormLabel>من</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>إلى</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="md:col-span-4 flex justify-end">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            إعادة تعيين
          </Button>
        </div>
      </form>
    </Form>
  );
}
