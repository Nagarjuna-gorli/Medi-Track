import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/DoctorHome.css";

function DoctorHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!token || role !== "doctor") {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="doctor-page">

      {/* Header */}
      <div className="doctor-header">
        <h1>Doctor Dashboard</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="doctor-card">
        <h3>Doctor Services</h3>

        <ul>
          <li onClick={() => navigate("/doctor/profile")}>
            My Profile
          </li>

          <li onClick={() => navigate("/doctor/patients")}>
            My Patients
          </li>

          <li onClick={() => navigate("/doctor/appointments")}>
            Appointments
          </li>

          <li onClick={() => navigate("/doctor/prescriptions")}>
            Prescriptions
          </li>

          <li onClick={() => navigate("/doctor/reports")}>
            Medical Reports
          </li>

          <li onClick={() => navigate("/doctor/health")}>
            Health Status
          </li>

          <li onClick={() => navigate("/doctor/diet")}>
            Diet Plans
          </li>

          <li onClick={() => navigate("/doctor/notifications")}>
            Notifications
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DoctorHome;