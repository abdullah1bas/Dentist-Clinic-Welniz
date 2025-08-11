export default function CasesheetsList() {
  const cases = [
    {
      id: 1,
      name: "Kayle hoking",
      phone: "08562738444",
      procedure: "Implant Surgery",
      date: "2025-07-22",
      doctor: "hamidhameed",
      status: "ONGOING CASE",
      debt: "100 USD",
      note: "Flapless technique was used and implant was placed with good initial stability.",
      lastEdited: "2025-06-26 08:41:56",
    },
    {
      id: 2,
      name: "Muna Hatim",
      phone: "09783645375",
      procedure: "Periodontic",
      date: "2025-07-25",
      doctor: "hamidhameed",
      status: "ONGOING CASE",
      debt: "0 USD",
      note: "Scaling and polishing",
      lastEdited: "2025-06-26 08:41:56",
    },
  ];

  return (
    <div className="space-y-4">
      {cases.map((c) => (
        <div key={c.id} className="bg-white rounded shadow p-4 flex w-full flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-green-200 w-12 h-12 rounded-full"></div>
            <div>
              <p className="font-bold">{c.name}</p>
              <p className="text-sm">{c.phone}</p>
            </div>
          </div>
          <div className="flex-1 mt-4 md:mt-0 md:px-4">
            <p className="font-bold">{c.procedure}</p>
            <p className="text-sm">By {c.doctor} - {c.date}</p>
            <p className="text-sm text-gray-600">{c.note}</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-green-500 font-bold">{c.status}</p>
            <p className="text-orange-500">IN DEBT {c.debt}</p>
            <p className="text-gray-500 text-xs">Last Edited: {c.lastEdited}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
