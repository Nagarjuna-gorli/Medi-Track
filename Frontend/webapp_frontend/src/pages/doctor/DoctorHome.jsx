import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/DoctorHome.css";
import api from "../../services/api";

function DoctorHome() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    patients: 0,
    today: 0,
    pending: 0,
    completed: 0,
    prescriptions: 0,
    reports: 0,
    notifications: 0,
  });

  const [userName, setUserName] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  if (!token || role !== "doctor") {
    navigate("/");
    return;
  }

  setUserName(localStorage.getItem("username") || "Doctor");

  api
    .get("/doctors/dashboard-stats/")
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
      title: "My Profile",
      desc: "View and update your profile information.",
      path: "/doctor/profile",
      color: "purple",
    },
    {
      icon: "👥",
      title: "Patients",
      desc: "Manage and view your assigned patients.",
      path: "/doctor/patients",
      color: "green",
    },
    {
      icon: "📅",
      title: "Appointments",
      desc: "Check and manage scheduled appointments.",
      path: "/doctor/appointments",
      color: "blue",
    },
    {
      icon: "💊",
      title: "Prescriptions",
      desc: "Create and manage patient prescriptions.",
      path: "/doctor/prescriptions",
      color: "orange",
    },
    {
      icon: "📋",
      title: "Reports",
      desc: "Access and review medical reports.",
      path: "/doctor/reports",
      color: "pink",
    },
    {
      icon: "❤️",
      title: "Health Status",
      desc: "Monitor and track patient health records.",
      path: "/doctor/health",
      color: "red",
    },
    {
      icon: "🥗",
      title: "Diet Plans",
      desc: "Create and manage personalized diet plans.",
      path: "/doctor/diet",
      color: "green",
    },
    {
      icon: "🔔",
      title: "Notifications",
      desc: "View system and patient notifications.",
      path: "/doctor/notifications",
      color: "yellow",
    },
  ];

  return (
    <div className="doctor-page">
      {/* Header */}
      <div className="doctor-header">
        <h1>Doctor Dashboard</h1>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dashboard-container">

        {/* Hero Banner */}
        <div className="hero-banner">
          <h2>Welcome Dr. {userName} 👨‍⚕️</h2>

          <p>
            Manage all your doctor tasks in one place
          </p>
        </div>

        {/* Statistics */}
      <div className="doc-stats-grid">
        <div className="doc-stat-card">
        <h3>Patients</h3>
        <span>{stats.patients}</span>
      </div>

      <div className="doc-stat-card">
        <h3>Today's Appointments</h3>
        <span>{stats.today}</span>
      </div>

      <div className="doc-stat-card">
        <h3>Prescriptions</h3>
        <span>{stats.prescriptions}</span>
      </div>

      <div className="doc-stat-card">
        <h3>Reports</h3>
        <span>{stats.reports}</span>
      </div>
      </div>

        {/* Quick Actions */}
        <h2 className="quick-title">Quick Actions</h2>

        <div className="service-grid">
          {services.map((service) => (
            <div
              key={service.title}
              className={`action-card ${service.color}`}
              onClick={() => navigate(service.path)}
            >
              <div className="action-icon">
                {service.icon}
              </div>

              <div className="action-content">
                <h3>{service.title}</h3>

                <p>{service.desc}</p>
              </div>

              <div className="action-arrow">
                →
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default DoctorHome;