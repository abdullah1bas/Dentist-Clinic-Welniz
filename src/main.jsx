import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import CasesheetsPage from "./pages/caseSheetsPage/CasesheetsPage";

import "./index.css";
import NotesPage from "./pages/notesPage/NotesPage";
import WhatsNewPage from "./pages/newsPage/WhatsNewPage";
import Appointments from "./pages/appointments/Appointments";
import Expenses from "./pages/expenses/Expenses";
import Income from "./pages/income/Income";
import Prescriptions from "./pages/prescriptions/Prescriptions";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CasesheetsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/whats-new" element={<WhatsNewPage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/income" element={<Income />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
