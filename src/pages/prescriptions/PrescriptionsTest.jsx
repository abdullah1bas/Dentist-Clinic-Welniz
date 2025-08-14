import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PrescriptionFilters from "@/components/prescriptions/PrescriptionFilters";
import PrescriptionOverview from "@/components/prescriptions/PrescriptionOverview";
import { PrescriptionDialog } from "@/components/prescriptions/prescription-dialog/PrescriptionDialog";

// Initial mock data
const initialPrescriptions = [
  {
    id: "RX001",
    patientName: "أحمد محمد علي",
    doctorName: "د. محمد صادق",
    date: "2025-01-15",
    age: 35,
    gender: "ذكر",
    diagnosis: "التهاب اللثة",
    prescription:
      "* أموكسيسيلين 500 مجم - كبسولة كل 8 ساعات لمدة 7 أيام\n* إيبوبروفين 400 مجم - قرص كل 6 ساعات عند الحاجة",
    status: "مكتملة",
    clinicLogo: "",
    doctorSignature: "",
  },
  {
    id: "RX002",
    patientName: "فاطمة أحمد",
    doctorName: "د. سارة محمود",
    date: "2025-01-14",
    age: 28,
    gender: "أنثى",
    diagnosis: "تسوس الأسنان",
    prescription:
      "* باراسيتامول 500 مجم - قرص كل 6 ساعات عند الحاجة\n* كلورهيكسيدين غسول فم - مضمضة مرتين يومياً لمدة أسبوع",
    status: "جديدة",
    clinicLogo: "",
    doctorSignature: "",
  },
];

const doctors = ["جميع الأطباء", "د. محمد صادق", "د. سارة محمود"];
const statuses = ["جميع الحالات", "جديدة", "مكتملة"];

export default function PrescriptionsTest() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    doctor: "جميع الأطباء",
    status: "جميع الحالات",
    dateFrom: "",
    dateTo: "",
  });

  // Filter prescriptions
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((prescription) => {
      const matchesSearch =
        prescription.patientName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        prescription.id.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDoctor =
        filters.doctor === "جميع الأطباء" ||
        prescription.doctorName === filters.doctor;
      const matchesStatus =
        filters.status === "جميع الحالات" ||
        prescription.status === filters.status;
      const matchesDateFrom =
        !filters.dateFrom || prescription.date >= filters.dateFrom;
      const matchesDateTo =
        !filters.dateTo || prescription.date <= filters.dateTo;

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [filters, prescriptions]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddNew = () => {
    setSelectedPrescription(null);
    setIsDialogOpen(true);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div className="mr-auto">
          <h1 className="text-base sm:text-3xl font-bold text-zinc-900">الروشتات الطبية</h1>
          <p className="text-sm text-zinc-600 mt-1">إدارة وطباعة الروشتات الطبية</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 ml-auto text-white transition duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          روشتة جديدة
        </Button>
      </div>

      <PrescriptionFilters
        doctors={doctors}
        statuses={statuses}
        setCurrentPage={setCurrentPage}
        paginatedPrescriptions={paginatedPrescriptions}
        filteredPrescriptions={filteredPrescriptions}
        onFiltersChange={handleFiltersChange}
      />

      {/* Table */}
      <PrescriptionOverview
        currentPage={currentPage}
        filteredPrescriptions={filteredPrescriptions}
        paginatedPrescriptions={paginatedPrescriptions}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        itemsPerPage={itemsPerPage}
        setSelectedPrescription={setSelectedPrescription}
        setIsDialogOpen={setIsDialogOpen}
      />

      <PrescriptionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPrescription={selectedPrescription}
        setSelectedPrescription={setSelectedPrescription}
        prescriptions={prescriptions}
        setPrescriptions={setPrescriptions}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}
