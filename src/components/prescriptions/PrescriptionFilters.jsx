import React, { memo, useCallback, useEffect, useState } from "react";
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
import { useDebounce } from "use-debounce";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import { prescriptionFIlterDoctors, prescriptionFilterStatuses } from "@/lib/utils";

function PrescriptionFilters() {
  const {
    filters,
    setFilters,
    clearFilters,
    getFilteredPrescriptions,
    getPaginatedPrescriptions,
  } = usePrescriptionStore();

  // state محلي للبحث مع مزامنة مع الـ store
  const [searchValue, setSearchValue] = useState(filters.search);
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const filteredPrescriptions = getFilteredPrescriptions();
  const paginatedPrescriptions = getPaginatedPrescriptions();

  // مزامنة البحث المحلي مع الـ store
  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  // تحديث البحث في الـ store عند تغيير debouncedSearch
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, setFilters]);

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters]
  );

  const handleClearFilters = useCallback(() => {
    // مسح البحث المحلي فوراً
    setSearchValue("")
    // مسح الفلاتر في الـ store
    clearFilters()
  }, [clearFilters])

  // مراقبة تغييرات الفلاتر لتحديث البحث المحلي
  useEffect(() => {
    if (filters.search === "" && searchValue !== "") {
      setSearchValue("")
    }
  }, [filters.search])

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
            onClick={handleClearFilters}
            type="button"
          >
            مسح الفلاتر
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Doctor Filter */}
        <div className="space-y-2">
          <Label>الطبيب</Label>
          <Select
            value={filters.doctor}
            onValueChange={(value) => handleFilterChange("doctor", value)}
          >
            <SelectTrigger className="bg-background/10 placeholder:text-black text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {prescriptionFIlterDoctors.map((doctor) => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>الحالة</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="bg-background/10 placeholder:text-black text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {prescriptionFilterStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

export default memo(PrescriptionFilters);
