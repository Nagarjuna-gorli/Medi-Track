import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PatientHome.css";
import api from "../../services/api";

function PatientHome() {

   const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  const [stats, setStats] = useState({
    appointments: 0,
    upcoming: 0,
    prescriptions: 0,
    reports: 0,
    dietPlans: 0,
    notifications: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!token || role !== "patient") {
      navigate("/");
      return;
    }

    setUserName(localStorage.getItem("username") || "Patient");

    api
      .get("/patients/dashboard-stats/")
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
    localStorage.clear(); 
    navigate("/");  
  }
};

  const services = [
    {
      icon: "👤",
      title: "My Profile",
      desc: "View and update your personal information.",
      path: "/patient/profile",
      color: "purple",
    },
    {
      icon: "📅",
      title: "Book Appointment",
      desc: "Schedule appointments with doctors.",
      path: "/patient/book",
      color: "blue",
    },
    {
      icon: "📋",
      title: "My Appointments",
      desc: "View all your appointments.",
      path: "/patient/appointments",
      color: "green",
    },
    {
      icon: "💊",
      title: "Prescriptions",
      desc: "Access your prescribed medicines.",
      path: "/patient/prescriptions",
      color: "orange",
    },
    {
      icon: "📄",
      title: "Medical Reports",
      desc: "View your uploaded reports.",
      path: "/patient/reports",
      color: "pink",
    },
    {
      icon: "❤️",
      title: "Health Status",
      desc: "Track your health records.",
      path: "/patient/health",
      color: "red",
    },
    {
      icon: "🥗",
      title: "Diet Plans",
      desc: "View your personalized diet plans.",
      path: "/patient/diet",
      color: "green",
    },
    {
      icon: "🔔",
      title: "Notifications",
      desc: "Check important notifications.",
      path: "/patient/notifications",
      color: "yellow",
    },
  ];

  return (
    <div className="patient-page">
      {/* Header */}
      <div className="patient-header">
        <h1>Patient Dashboard</h1>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="patient-dashboard-container">
        {/* Hero Banner */}
        <div className="patient-hero-banner">
          <h2>Welcome {userName} 😊</h2>

          <p>
            Manage all your healthcare services in one place
          </p>
        </div>

        {/* Statistics */}
        <div className="patient-stats-grid">
          <div className="patient-stat-card">
            <h3>Appointments</h3>
            <span>{stats.appointments}</span>
          </div>

          <div className="patient-stat-card">
            <h3>Upcoming</h3>
            <span>{stats.upcoming}</span>
          </div>

          <div className="patient-stat-card">
            <h3>Prescriptions</h3>
            <span>{stats.prescriptions}</span>
          </div>

          <div className="patient-stat-card">
            <h3>Reports</h3>
            <span>{stats.reports}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="patient-quick-title">Quick Actions</h2>

        <div className="patient-service-grid">
          {services.map((service) => (
            <div
              key={service.title}
              className={`patient-action-card ${service.color}`}
              onClick={() => navigate(service.path)}
            >
              <div className="patient-action-icon">
                {service.icon}
              </div>

              <div className="patient-action-content">
                <h3>{service.title}</h3>

                <p>{service.desc}</p>
              </div>

              <div className="patient-action-arrow">
                →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientHome;