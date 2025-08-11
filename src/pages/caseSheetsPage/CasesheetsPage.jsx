// import DentalChart from "@/components/DentalChart";
import CasesheetsList from "../../components/CasesheetsList";

export default function CasesheetsPage() {
  return (
    <div>
      <div className="mb-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Look For a Casesheet..."
        />
      </div>
      <CasesheetsList />
    </div>
  );
}
