import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminHome from "./pages/admin/AdminHome";
import DoctorHome from "./pages/doctor/DoctorHome";
import PatientHome from "./pages/patient/PatientHome";

import ProtectedRoute from "./routes/ProtectedRoute";


/* =========================
   PATIENT MODULE (already yours)
========================= */
import MyProfile from "./pages/patient/MyProfile";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import Prescriptions from "./pages/patient/Prescriptions";
import Reports from "./pages/patient/PatientReports";
import HealthStatus from "./pages/patient/HealthStatus";
import DietPlans from "./pages/patient/DietPlans";
import Notifications from "./pages/patient/PatientNotifications";

/* =========================
   DOCTOR MODULE (NEW)
========================= */
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorPatients from "./pages/doctor/MyPatients";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions";
import DoctorReports from "./pages/doctor/DoctorReports";
import DoctorHealthStatus from "./pages/doctor/DoctorHealthStatus";
import DoctorDietPlans from "./pages/doctor/DoctorDietPlans";
import DoctorNotifications from "./pages/doctor/DoctorNotifications";


/* =========================
   ADMIN MODULE
========================= */
import AdminProfile from "./pages/admin/AdminProfile";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminDoctorDetails from "./pages/admin/AdminDoctorDetails";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminPatientDetails from "./pages/admin/AdminPatientDetails";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminPrescriptions from "./pages/admin/AdminPrescriptions";
import AdminReports from "./pages/admin/AdminReports";
import AdminHealthStatus from "./pages/admin/AdminHealthStatus";
import AdminDietPlans from "./pages/admin/AdminDietPlans";
import AdminNotifications from "./pages/admin/AdminNotifications";
/*import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminSettings from "./pages/admin/AdminSettings";*/



function App() {
  return (
    <Routes>

      {/* ================= LOGIN / REGISTER ================= */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />



      {/* ================= DOCTOR ================= */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorPatients />
          </ProtectedRoute>
        }
      />


      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/prescriptions"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorPrescriptions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/reports"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/Health"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorHealthStatus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/diet"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDietPlans />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/notifications"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorNotifications />
          </ProtectedRoute>
        }
      /> 

      {/* ================= PATIENT ================= */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MyProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/book"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <BookAppointment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MyAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/prescriptions"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Prescriptions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/reports"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/health"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <HealthStatus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/diet"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <DietPlans />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/notifications"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />



    {/* ================= ADMIN MODULE ================= */}

    <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
    />

    <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

    <Route
      path="/admin/doctors"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDoctors />
        </ProtectedRoute>
      }
    />

    <Route path="/admin/doctors/:id" element={<ProtectedRoute allowedRoles={["admin"]}>
       <AdminDoctorDetails /> </ProtectedRoute>} />

    <Route
      path="/admin/patients"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminPatients />
        </ProtectedRoute>
      }
    />

    <Route path="/admin/patients/:id" element={<ProtectedRoute allowedRoles={["admin"]}>
       <AdminPatientDetails /> </ProtectedRoute>} />

    <Route
      path="/admin/appointments"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminAppointments />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/prescriptions"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminPrescriptions />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/reports"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminReports />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/health-status"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminHealthStatus />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/diet-plans"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDietPlans />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/notifications"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminNotifications />
        </ProtectedRoute>
      }
    />
    
    </Routes>
      );
    }

export default App;