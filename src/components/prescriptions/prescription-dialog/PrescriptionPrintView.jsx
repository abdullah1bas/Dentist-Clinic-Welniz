import { usePrescriptionStore } from "@/store/usePrescriptionStore";

export default function PrescriptionPrintView({ formData = null }) {
  const { selectedPrescription } = usePrescriptionStore()

  // استخدام formData إذا كانت متوفرة، وإلا استخدام selectedPrescription
  const data = formData || selectedPrescription

  if (!data) return null

  return (
    <div className="print-area p-6 pr-20 w-[800px] font-sans text-black hidden print:block min-h-screen">
      {/* رأس الروشتة */}
      <header className=" border-b pb-4 mb-4">
        {data.clinicLogo && (
          <img
            src={data.clinicLogo}
            alt="Clinic Logo"
            className="w-full object-cover"
          />
        )}
      </header>

      <main>
        {/* بيانات المريض */}
        <section className="mb-4 flex justify-between items-center">
          <p>
            <strong>اسم المريض:</strong> {data.patientName}
          </p>
          <p>
            <strong>النوع:</strong> {data.gender}
          </p>
          <p>
            <strong>العمر:</strong> {data.age} سنة
          </p>
        </section>
        {/* التشخيص */}
        <section className="mb-4">
          <h2 className="font-bold border-b pb-1">التشخيص</h2>
          <p className="whitespace-pre-line">{data.diagnosis}</p>
        </section>
        {/* الأدوية */}
        <div className="mb-4">
          <h2 className="font-bold border-b pb-1">الوصفة الطبية</h2>
          <ol className="list-decimal pl-6 space-y-1">
            {data.prescription
              ?.split("\n")
              .filter((line) => line.trim())
              .map((line, idx) => (
                <li key={idx}>{line.replace(/^\*?\s*/, "")}</li>
              ))}
          </ol>
        </div>
      </main>

      {/* توقيع الدكتور */}
      <footer className="mt-8 flex flex-col justify-end w-full">
        <div className="text-right">
          <h1 className="text-2xl font-bold">{data.doctorName}</h1>
          <p className="text-sm">التاريخ: {data.date}</p>
        </div>
        {data.doctorSignature && (
          <img
            src={data.doctorSignature}
            alt="Doctor Signature"
            className="w-full object-cover"
          />
        )}
      </footer>
    </div>
  );
}
