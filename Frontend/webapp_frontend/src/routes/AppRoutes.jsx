import { BrowserRouter, Routes, Route } from "react-router-dom";

import PatientHome from "../pages/patient/PatientHome";
import MyProfile from "../pages/patient/MyProfile";
import BookAppointment from "../pages/patient/BookAppointment";
import MyAppointments from "../pages/patient/MyAppointments";
import Prescriptions from "../pages/patient/Prescriptions";
import Reports from "../pages/patient/Reports";
import HealthStatus from "../pages/patient/HealthStatus";
import DietPlans from "../pages/patient/DietPlans";
import Notifications from "../pages/patient/Notifications";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/patient" element={<PatientHome />} />

        <Route path="/patient/profile" element={<MyProfile />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />
        <Route path="/patient/prescriptions" element={<Prescriptions />} />
        <Route path="/patient/reports" element={<Reports />} />
        <Route path="/patient/health" element={<HealthStatus />} />
        <Route path="/patient/diet" element={<DietPlans />} />
        <Route path="/patient/notifications" element={<Notifications />} />

      </Routes>
    </BrowserRouter>
  );
}