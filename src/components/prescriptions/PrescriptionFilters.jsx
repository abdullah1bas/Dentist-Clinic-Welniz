import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Filter, Search } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useDebounce } from "use-debounce";

const filterSchema = z.object({
  search: z.string().optional(),
  doctor: z.string(),
  status: z.string(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

function PrescriptionFilters({
  doctors,
  statuses,
  setCurrentPage,
  paginatedPrescriptions,
  filteredPrescriptions,
  onFiltersChange,
}) {
  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      doctor: "جميع الأطباء",
      status: "جميع الحالات",
      dateFrom: "",
      dateTo: "",
    },
  });

  // استخدام state منفصل للبحث مع debounce
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 500);

  // تحديث قيمة البحث في الفورم
  useEffect(() => {
    form.setValue("search", debouncedSearch);
    handleSubmit(form.getValues())();
  }, [debouncedSearch]);

  // معالجة التغييرات في الحقول الأخرى (غير البحث)
  const handleFieldChange = () => {
    handleSubmit(form.getValues())();
    setCurrentPage(1);
  };

  // إرسال الفلاتر عند التغيير
  const handleSubmit = (data) => {
    return () => {
      onFiltersChange(data);
    };
  };

  const clearFilters = () => {
    form.reset({
      search: "",
      doctor: "جميع الأطباء",
      status: "جميع الحالات",
      dateFrom: "",
      dateTo: "",
    });
    setSearchValue("");
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
            <Filter className="size-4 sm:size-5" />
            الفلاتر والبحث
          </CardTitle>
          <Button
            className="bg-gray-600 text-white hover:bg-gray-700 hover:text-white transition duration-300"
            variant="outline"
            size="sm"
            onClick={clearFilters}
            type="button"
          >
            مسح الفلاتر
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* حقل البحث مع Debounce */}
            <div className="space-y-2">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
                <Input
                  id="search"
                  placeholder="اسم المريض أو رقم الروشتة"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 bg-background/10 placeholder:text-black text-black"
                />
              </div>
            </div>

            {/* فلتر الطبيب */}
            <FormField
              control={form.control}
              name="doctor"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>الطبيب</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFieldChange();
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background/10 placeholder:text-black text-black">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* فلتر الحالة */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>الحالة</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFieldChange();
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background/10 placeholder:text-black text-black">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-zinc-600">
            عرض {paginatedPrescriptions.length} من{" "}
            {filteredPrescriptions.length} روشتة
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PrescriptionFilters;