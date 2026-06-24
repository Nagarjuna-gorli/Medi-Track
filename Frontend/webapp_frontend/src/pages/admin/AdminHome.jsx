import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/AdminHome.css";
import api from "../../services/api";

function AdminHome() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

const [stats, setStats] = useState({
  doctors: 0,
  patients: 0,
  appointments: 0,
  reports: 0,
});

  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/");
      return;
    }

    setUserName(localStorage.getItem("username") || "Admin");api
  .get("/adminpanel/dashboard-stats/")
  .then((res) => {
    setStats(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
}, [navigate]);

 const logout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to log out?"
  );

  if (confirmLogout) {
    localStorage.clear(); // or remove specific items
    navigate("/");   // change route if needed
  }
};

  const services = [
    {
      icon: "👤",
      title: "Admin Profile",
      desc: "Manage your administrator profile.",
      path: "/admin/profile",
      color: "purple",
    },
    {
      icon: "👨‍⚕️",
      title: "Doctors",
      desc: "Manage doctor accounts and information.",
      path: "/admin/doctors",
      color: "blue",
    },
    {
      icon: "🧑‍🤝‍🧑",
      title: "Patients",
      desc: "Manage patient accounts and records.",
      path: "/admin/patients",
      color: "green",
    },
    {
      icon: "📅",
      title: "Appointments",
      desc: "Monitor all appointments.",
      path: "/admin/appointments",
      color: "orange",
    },
    {
      icon: "💊",
      title: "Prescriptions",
      desc: "View and manage prescriptions.",
      path: "/admin/prescriptions",
      color: "pink",
    },
    {
      icon: "📄",
      title: "Medical Reports",
      desc: "Manage patient medical reports.",
      path: "/admin/reports",
      color: "red",
    },
    {
      icon: "❤️",
      title: "Health Status",
      desc: "Monitor patient health records.",
      path: "/admin/health-status",
      color: "green",
    },
    {
      icon: "🥗",
      title: "Diet Plans",
      desc: "Manage diet plans for patients.",
      path: "/admin/diet-plans",
      color: "blue",
    },
    {
      icon: "🔔",
      title: "Notifications",
      desc: "View system notifications.",
      path: "/admin/notifications",
      color: "yellow",
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="admin-dashboard-container">
        {/* Hero */}
        <div className="admin-hero-banner">
          <h2>Welcome Admin {userName} 👨‍💼</h2>

          <p>
            Manage doctors, patients, appointments and healthcare services
          </p>
        </div>

                {/* Statistics */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>Doctors</h3>
            <span>{stats.doctors}</span>
          </div>

          <div className="admin-stat-card">
            <h3>Patients</h3>
            <span>{stats.patients}</span>
          </div>

          <div className="admin-stat-card">
            <h3>Appointments</h3>
            <span>{stats.appointments}</span>
          </div>

          <div className="admin-stat-card">
            <h3>Reports</h3>
            <span>{stats.reports}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="admin-quick-title">
          Administration Services
        </h2>

        <div className="admin-service-grid">
          {services.map((service) => (
            <div
              key={service.title}
              className={`admin-action-card ${service.color}`}
              onClick={() => navigate(service.path)}
            >
              <div className="admin-action-icon">
                {service.icon}
              </div>

              <div className="admin-action-content">
                <h3>{service.title}</h3>

                <p>{service.desc}</p>
              </div>

              <div className="admin-action-arrow">
                →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;