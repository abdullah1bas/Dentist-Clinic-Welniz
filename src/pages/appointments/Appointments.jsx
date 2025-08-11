import AppointmentForm from "@/components/appointments/AppointmentForm";
import Calendar from "@/components/appointments/Calendar";
import MorePatientsDialog from "@/components/appointments/MorePatientsDialog";
import React, { useMemo, useState } from "react";
import styles from "./Appointments.module.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [morePatients, setMorePatients] = useState([]);
  const [showMoreDialog, setShowMoreDialog] = useState(false);

  const calendarEvents = useMemo(() => {
    return appointments.flatMap(a =>
      a.patients.map(p => ({
        title: `${p.patientName} ${p.time.slice(0, 2) % 12}${p.time.slice(2)} ${p.time.slice(0, 2) >= 12 ? 'PM' : 'AM'}`,
        start: a.date,
        extendedProps: p
      }))
    );
  }, [appointments]);

  return (
    <div className="p-4">
      <Calendar
        appointments={appointments}
        setSelectedDate={setSelectedDate}
        setEditPatient={setEditPatient}
        setOpenDialog={setOpenDialog}
        setMorePatients={setMorePatients}
        setShowMoreDialog={setShowMoreDialog}
        calendarEvents={calendarEvents}
      />
      <AppointmentForm
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedDate={selectedDate}
        editPatient={editPatient}
        setAppointments={setAppointments}
        setEditPatient={setEditPatient}
      />
      <MorePatientsDialog
        showMoreDialog={showMoreDialog}
        setShowMoreDialog={setShowMoreDialog}
        morePatients={morePatients}
      />
    </div>
  );
}