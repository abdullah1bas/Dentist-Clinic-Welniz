import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PatientFilters from "@/components/dental/patient-filters";
import { PatientCard } from "@/components/dental/patient-card";
import { CaseDialog } from "@/components/dental/case-dialog";
import UserFooter from "@/components/UserFooter";
import PatientsHeader from "./PatientsHeader";
import { usePatientsStore } from "@/stores/patientsStore";

export default function PatientsPage() {
  const { getPaginatedPatients } = usePatientsStore();

  const paginatedPatients = getPaginatedPatients();
  console.log(paginatedPatients)

  console.log("patientsPage");
  return (
    <div className="p-6 space-y-6 min-h-screen pb-24">
      {/* Header */}
      <PatientsHeader />

      <PatientFilters />

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedPatients.length > 0
          ? paginatedPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))
          : null}
      </div>

      <UserFooter />
      <CaseDialog />
    </div>
  );
}
