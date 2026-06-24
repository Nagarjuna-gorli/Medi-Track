import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/AdminAppointments.css";

export default function AdminAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    appointment_date: "",
    reason: "",
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [search, startDate, endDate, appointments]);

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const fetchAppointments = async () => {
    try {
      const res = await api.get("appointments/");
      setAppointments(res.data);
      setFilteredAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FETCH DOCTORS
  // =========================
  const fetchDoctors = async () => {
    try {
      const res = await api.get(
        "appointments/doctors/"
      );
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FETCH PATIENTS
  // =========================
  const fetchPatients = async () => {
    try {
      const res = await api.get(
        "appointments/patients/"
      );
      setPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // CREATE APPOINTMENT
  // =========================
  const createAppointment = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "appointments/",
        formData
      );

      alert(
        "Appointment Created Successfully ✅"
      );

      setFormData({
        doctor: "",
        patient: "",
        appointment_date: "",
        reason: "",
      });

      fetchAppointments();
    } catch (err) {
      console.log(err.response?.data);

      alert(
        "Failed to Create Appointment ❌"
      );
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await api.post(
        `appointments/${id}/update_status/`,
        { status }
      );

      fetchAppointments();
    } catch (err) {
      console.log(
        err.response?.data
      );

      alert(
        "Failed to update appointment"
      );
    }
  };

  // =========================
  // SEARCH FILTER
  // =========================
  const filterAppointments = () => {
    let filtered = [...appointments];

    if (search.trim()) {
      filtered = filtered.filter(
        (appt) =>
          appt.doctor_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          appt.patient_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          appt.reason
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (appt) =>
          new Date(
            appt.appointment_date
          ) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (appt) =>
          new Date(
            appt.appointment_date
          ) <=
          new Date(
            endDate +
              "T23:59:59"
          )
      );
    }

    setFilteredAppointments(filtered);
  };

  return (
    <div className="admin-appointments-container">
      <div className="back-container">
          <FaArrowLeft
            className="back-arrow"
            onClick={() => navigate("/admin")}
          />
        </div>

      {/* CREATE APPOINTMENT */}

      <div className="appointment-create-card">
        <h2>Create Appointment</h2>

        <form
          onSubmit={
            createAppointment
          }
        >
          <select
            name="patient"
            value={
              formData.patient
            }
            onChange={
              handleInputChange
            }
            required
          >
            <option value="">
              Select Patient
            </option>

            {patients.map(
              (patient) => (
                <option
                  key={
                    patient.id
                  }
                  value={
                    patient.id
                  }
                >
                  
                  {patient.patient_name}
                </option>
              )
            )}
          </select>

          <select
            name="doctor"
            value={
              formData.doctor
            }
            onChange={
              handleInputChange
            }
            required
          >
            <option value="">
              Select Doctor
            </option>

            {doctors.map(
              (doctor) => (
                <option
                  key={
                    doctor.id
                  }
                  value={
                    doctor.id
                  }
                >
                  {
                    doctor.doctor_name
                  }
                </option>
              )
            )}
          </select>

          <input
            type="datetime-local"
            name="appointment_date"
            value={
              formData.appointment_date
            }
            onChange={
              handleInputChange
            }
            required
          />

          <textarea
            name="reason"
            placeholder="Reason"
            value={
              formData.reason
            }
            onChange={
              handleInputChange
            }
          />

          <button
            className="create-btn"
            type="submit"
          >
            Create Appointment
          </button>
        </form>
      </div>

      {/* MANAGEMENT */}

      <h2>
        Appointment
        Management
      </h2>

      <div className="appointment-filters">
        <input
          type="text"
          placeholder="Search Doctor / Patient / Reason"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(
              e.target.value
            )
          }
        />

        <button
          onClick={
            fetchAppointments
          }
        >
          Refresh
        </button>
      </div>

      {/* SUMMARY */}

      <div className="appointment-summary">
        <div className="summary-card">
          <h3>
            {
              filteredAppointments.length
            }
          </h3>
          <p>Total</p>
        </div>

        <div className="summary-card">
          <h3>
            {
              filteredAppointments.filter(
                (a) =>
                  a.status ===
                  "pending"
              ).length
            }
          </h3>
          <p>Pending</p>
        </div>

        <div className="summary-card">
          <h3>
            {
              filteredAppointments.filter(
                (a) =>
                  a.status ===
                  "confirmed"
              ).length
            }
          </h3>
          <p>Confirmed</p>
        </div>

        <div className="summary-card">
          <h3>
            {
              filteredAppointments.filter(
                (a) =>
                  a.status ===
                  "completed"
              ).length
            }
          </h3>
          <p>Completed</p>
        </div>
      </div>

      {/* TABLE */}

      <table className="appointments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.length >
          0 ? (
            filteredAppointments.map(
              (appt) => (
                <tr
                  key={appt.id}
                >
                  <td>
                    {appt.id}
                  </td>

                  <td>
                    {
                      appt.doctor_name
                    }
                  </td>

                  <td>
                    {
                      appt.patient_name
                    }
                  </td>

                  <td>
                    {new Date(
                      appt.appointment_date
                    ).toLocaleString()}
                  </td>

                  <td>
                    {
                      appt.reason
                    }
                  </td>

                  <td>
                    <span
                      className={`status ${appt.status}`}
                    >
                      {
                        appt.status
                      }
                    </span>
                  </td>

                  <td>

                    {appt.status ===
                      "pending" && (
                      <>
                        <button
                          className="confirm-btn"
                          onClick={() =>
                            updateStatus(
                              appt.id,
                              "confirmed"
                            )
                          }
                        >
                          Confirm
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() =>
                            updateStatus(
                              appt.id,
                              "doctor_cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {appt.status ===
                      "confirmed" && (
                      <>
                        <button
                          className="complete-btn"
                          onClick={() =>
                            updateStatus(
                              appt.id,
                              "completed"
                            )
                          }
                        >
                          Complete
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() =>
                            updateStatus(
                              appt.id,
                              "doctor_cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}

                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan="7">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}