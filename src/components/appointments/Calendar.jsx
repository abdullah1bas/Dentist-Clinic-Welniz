import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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
    />
  );
}