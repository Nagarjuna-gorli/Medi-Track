import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/AdminHome.css";

function AdminHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { title: "Admin Profile", path: "/admin/profile" },
    { title: "Manage Doctors", path: "/admin/doctors" },
    { title: "Manage Patients", path: "/admin/patients" },
    { title: "Appointments", path: "/admin/appointments" },
    { title: "Prescriptions", path: "/admin/prescriptions" },
    { title: "Medical Reports", path: "/admin/reports" },
    { title: "Health Status", path: "/admin/health-status" },
    { title: "Diet Plans", path: "/admin/diet-plans" },
    { title: "Notifications", path: "/admin/notifications" },
  ];

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Services */}
      <div className="admin-card">
        <h2>Administration Services</h2>

        <div className="admin-menu">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="admin-menu-item"
              onClick={() => navigate(item.path)}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;