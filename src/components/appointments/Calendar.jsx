import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus } from "lucide-react";

export default function Calendar({
  appointments,
  setSelectedDate,
  setEditPatient,
  setOpenDialog,
  setMorePatients,
  setShowMoreDialog,
  calendarEvents,
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      dateClick={(arg) => {
        setSelectedDate(arg.dateStr);
        setEditPatient(null);
        setOpenDialog(true);
      }}
      dayMaxEvents={3}
      events={calendarEvents}
      eventClick={(info) => {
        const patient = info.event.extendedProps;
        const date = info.event.startStr;
        setSelectedDate(date);
        setEditPatient(patient);
        setOpenDialog(true);
      }}
      moreLinkClick={(arg) => {
        const dayData = appointments.find((a) => a.date === arg.dateStr);
        if (dayData) {
          setMorePatients(dayData.patients);
          setShowMoreDialog(true);
        }
        return "popover";
      }}
      dayCellContent={(arg) => {
        // لو الخلية مفيهاش رقم اليوم الطبيعي أو التاريخ undefined يبقى غالباً جوه popover
        const isInPopover = !arg.date || !arg.dayNumberText;

        return (
          <div
            className="fc-daygrid-day-frame flex flex-col justify-between h-full group"
            onClick={(e) => e.stopPropagation()}
          >
            {/* رقم اليوم */}
            <div className="fc-daygrid-day-top">{arg.dayNumberText}</div>

            {/* باقي الأحداث */}
            <div className="fc-daygrid-day-events"></div>

            {/* زر الإضافة الكبير */}
            {!isInPopover && (
              <div className="w-full flex justify-center mb-1 sm:mr-12 lg:mr-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full sm:p-2 lg:p-3 shadow-lg transition duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedDate(arg.date.toISOString().split("T")[0]);
                    setEditPatient(null);
                    setOpenDialog(true);
                  }}
                >
                  <Plus className="size-6 lg:size-8" />
                </button>
              </div>
            )}

            <div className="fc-daygrid-day-bg"></div>
          </div>
        );
      }}
    />
  );
}
