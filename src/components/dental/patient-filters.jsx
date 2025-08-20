import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
import { useDebounce } from "use-debounce"
import { usePatientsStore } from "@/stores/patientsStore"
import { useConstantsStore } from "@/stores/constantsStore"

const statuses = ["جميع الحالات", "مستمرة", "انتهت"]

function PatientFilters() {
  const { categories } = useConstantsStore();
  const { filters, setFilters, clearFilters, getFilteredPatients, getPaginatedPatients } = usePatientsStore();


  const [searchValue, setSearchValue] = useState(filters.search)
  const [debouncedSearch] = useDebounce(searchValue, 500)

  const filteredPatients = getFilteredPatients()
  const paginatedPatients = getPaginatedPatients()

  const allCategories = ["جميع الفئات", ...categories]

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ ...filters, search: debouncedSearch })
    }
  }, [debouncedSearch])

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters({ ...filters, [key]: value })
    },
    [filters, setFilters],
  )

  const handleClearFilters = useCallback(() => {
    setSearchValue("")
    clearFilters()
  }, [clearFilters])

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
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">البحث</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              <Input
                id="search"
                placeholder="الاسم، الهاتف، أو الرقم"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 bg-background/10 placeholder:text-black text-black"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>الفئة</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger className="bg-background/10 placeholder:text-black text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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

          {/* Date Range */}
          <div className="space-y-2">
            <Label>من تاريخ</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="bg-background/10 text-black"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-zinc-600">
            عرض {paginatedPatients.length} من {filteredPatients.length} حالة
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PatientFilters
