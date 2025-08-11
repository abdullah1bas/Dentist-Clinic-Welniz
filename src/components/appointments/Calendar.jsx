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
  calendarEvents
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
        const dayData = appointments.find(a => a.date === arg.dateStr);
        if (dayData) {
          setMorePatients(dayData.patients);
          setShowMoreDialog(true);
        }
        return "popover";
      }}
      dayCellContent={(arg) => {
        return (
          <div className="fc-daygrid-day-frame">
            <div className="fc-daygrid-day-top">{arg.dayNumberText}</div>
            <span className="custom-plus-icon mt-3 hover:bg-green-600 transition duration-300">
              <Plus size={16} />
            </span>
            <div className="fc-daygrid-day-events"></div>
            <div className="fc-daygrid-day-bg"></div>
          </div>
        );
      }}
    />
  );
}