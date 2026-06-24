import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUserPlus,
  FaShieldAlt,
  FaClock,
  FaClipboardCheck,
  FaCalendarAlt,
  FaChartBar,
  FaUsers,
  FaHeartbeat,
} 
from "react-icons/fa";

import "../css/HomePage.css";


function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <FaHeartbeat className="logo-icon" />
          <div>
            <h2>MediTrack</h2>
            <p>Track. Manage. Care.</p>
          </div>
        </div>

        <ul className="nav-links">
  <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
    Home
  </li>

  <li onClick={() =>
    document.getElementById("about")
      .scrollIntoView({ behavior: "smooth" })
  }>
    About Us
  </li>

  <li onClick={() =>
    document.getElementById("features")
      .scrollIntoView({ behavior: "smooth" })
  }>
    Features
  </li>

  <li onClick={() =>
    document.getElementById("benefits")
      .scrollIntoView({ behavior: "smooth" })
  }>
    Benefits
  </li>

  <li onClick={() =>
    document.getElementById("contact")
      .scrollIntoView({ behavior: "smooth" })
  }>
    Contact
  </li>
</ul>

        <div className="nav-buttons">
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            <FaUser />
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            <FaUserPlus />
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">

        {/* Left Side */}
        <div className="hero-content">
          <div className="badge">
            ✓ One Platform. Better Care.
          </div>

          <h1>
            Right Care.
            <br />
            Right Time.
            <br />
            <span>Better Health.</span>
          </h1>

          <div className="divider"></div>

          <p>
            MediTrack brings <strong>Patients</strong>,
            <strong> Doctors</strong> and
            <strong> Admins</strong> together on a single
            healthcare platform to manage appointments,
            prescriptions, reports, diet plans and patient
            monitoring with ease.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/login")}
            >
              Login Now
            </button>
          </div>

          <div className="features">
            <div className="feature-card">
              <FaShieldAlt />
              <div>
                <h4>Secure & Reliable</h4>
                <p>
                  Advanced security keeps all medical
                  records protected.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <FaClock />
              <div>
                <h4>Save Time</h4>
                <p>
                  Reduce paperwork and automate hospital
                  workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hero-image">

          <div className="circle-bg"></div>

             <img
  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200"
  alt="Doctor"
  className="doctor-image"
/>

          <div className="stat-card appointments">
            <FaCalendarAlt />
            <h4>Appointments</h4>
            <h2>124</h2>
          </div>

          <div className="stat-card tasks">
            <FaClipboardCheck />
            <h4>Tasks</h4>
            <h2>24</h2>
          </div>

          <div className="stat-card patients">
            <FaUsers />
            <h4>Patients</h4>
            <h2>320</h2>
          </div>

          <div className="stat-card reports">
            <FaChartBar />
            <h4>Reports</h4>
            <h2>96%</h2>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="info-section">
        <h2>Why Choose MediTrack?</h2>

        <div className="info-cards">
          <div className="info-card">
            <h3>For Patients</h3>
            <p>
              Book appointments, view prescriptions,
              access reports and track your health status.
            </p>
          </div>

          <div className="info-card">
            <h3>For Doctors</h3>
            <p>
              Manage patients, create reports, assign
              diet plans and monitor patient progress.
            </p>
          </div>

          <div className="info-card">
            <h3>For Admins</h3>
            <p>
              Control doctors, patients, appointments
              and hospital operations from one dashboard.
            </p>
          </div>
        </div>
      </section>

        <div className="hero-stats">
  <div className="hero-stat">
    <h3>10K+</h3>
    <p>Happy Patients</p>
  </div>

  <div className="hero-stat">
    <h3>250+</h3>
    <p>Expert Doctors</p>
  </div>

  <div className="hero-stat">
    <h3>15+</h3>
    <p>Departments</p>
  </div>

  <div className="hero-stat">
    <h3>24/7</h3>
    <p>Support</p>
  </div>
</div>

{/* About Us */}
<section id="about" className="info-section">
  <h2>About Us</h2>
  <p>
    MediTrack is a smart hospital management system that connects
    patients, doctors, and administrators on one platform.
    Our goal is to simplify healthcare management, improve
    communication, and provide better patient care.
  </p>
</section>

{/* Features */}
<section id="features" className="info-section">
  <h2>Features</h2>

  <div className="info-cards">
    <div className="info-card">
      <h3>Appointment Management</h3>
      <p>Book and manage appointments efficiently.</p>
    </div>

    <div className="info-card">
      <h3>Medical Records</h3>
      <p>Access reports and prescriptions anytime.</p>
    </div>

    <div className="info-card">
      <h3>Real-Time Notifications</h3>
      <p>Stay updated with appointments and reports.</p>
    </div>
  </div>
</section>

{/* Benefits */}
<section id="benefits" className="info-section">
  <h2>Benefits</h2>

  <div className="info-cards">
    <div className="info-card">
      <h3>For Patients</h3>
      <p>Easy access to healthcare information.</p>
    </div>

    <div className="info-card">
      <h3>For Doctors</h3>
      <p>Efficient patient management and monitoring.</p>
    </div>

    <div className="info-card">
      <h3>For Admins</h3>
      <p>Centralized control of hospital operations.</p>
    </div>
  </div>
</section>

{/* Contact */}
<section id="contact" className="contact-section">
  <h2>Contact Us</h2>

  <p>Email: support@meditrack.com</p>
  <p>Phone: +91 63028 13233 </p>
  <p>Address: Healthcare Technology Center, India</p>
</section>

      {/* Footer */}
      <footer className="footer">
        <h3>MediTrack</h3>
        <p>
          Smart Hospital Management System for Patients,
          Doctors and Administrators.
        </p>

        <button
          className="footer-btn"
          onClick={() => navigate("/register")}
        >
          Join MediTrack Today
        </button>
      </footer>
    </div>
  );
}

export default HomePage;