import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PatientHome.css";

function PatientHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!token || role !== "patient") {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="patient-page">

      {/* Header */}
      <div className="patient-header">
        <h1>Patient Dashboard</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Menu */}
      <div className="patient-card">
        <h3>Patient Services</h3>

        <ul className="menu-list">
          <li onClick={() => navigate("/patient/profile")}>My Profile</li>
          <li onClick={() => navigate("/patient/book")}>Book Appointment</li>
          <li onClick={() => navigate("/patient/appointments")}>My Appointments</li>
          <li onClick={() => navigate("/patient/prescriptions")}>Prescriptions</li>
          <li onClick={() => navigate("/patient/reports")}>Medical Reports</li>
          <li onClick={() => navigate("/patient/health")}>Health Status</li>
          <li onClick={() => navigate("/patient/diet")}>Diet Plans</li>
          <li onClick={() => navigate("/patient/notifications")}>Notifications</li>
        </ul>
      </div>
    </div>
  );
}

export default PatientHome;