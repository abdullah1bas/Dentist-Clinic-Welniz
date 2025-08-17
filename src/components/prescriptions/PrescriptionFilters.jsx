"use client"

import { memo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
// import { usePrescriptionStore } from "@/stores/prescription-store"
import { useDebounce } from "use-debounce"
import { useState, useEffect } from "react"
import { usePrescriptionStore } from "@/store/usePrescriptionStore"

const doctors = ["جميع الأطباء", "د. محمد صادق", "د. سارة محمود"]
const statuses = ["جميع الحالات", "جديدة", "مكتملة"]

const PrescriptionFilters = memo(() => {
  const { filters, setFilters, clearFilters, getFilteredPrescriptions, getPaginatedPrescriptions } =
    usePrescriptionStore()
  const [searchValue, setSearchValue] = useState(filters.search)
  const [debouncedSearch] = useDebounce(searchValue, 500)

  const filteredPrescriptions = getFilteredPrescriptions()
  const paginatedPrescriptions = getPaginatedPrescriptions()

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ ...filters, search: debouncedSearch })
    }
  }, [debouncedSearch, filters, setFilters])

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters({ ...filters, [key]: value })
    },
    [filters, setFilters],
  )

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
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
            <Select value={filters.doctor} onValueChange={(value) => handleFilterChange("doctor", value)}>
              <SelectTrigger className="bg-background/10 placeholder:text-black text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
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
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="bg-background/10 placeholder:text-black text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-zinc-600">
            عرض {paginatedPrescriptions.length} من {filteredPrescriptions.length} روشتة
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

PrescriptionFilters.displayName = "PrescriptionFilters"

export default PrescriptionFilters
