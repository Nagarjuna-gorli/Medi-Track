import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/DoctorAppointments.css";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const token = localStorage.getItem("access");

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const fetchAppointments = async () => {
    try {
      const res = await api.get("appointments/");

      const sortedAppointments = [...res.data].sort(
        (a, b) =>
          new Date(b.appointment_date) -
          new Date(a.appointment_date)
      );

      setAppointments(sortedAppointments);
    } catch (err) {
      console.log(
        "Error fetching appointments:",
        err.response?.data
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      await api.post(`appointments/${id}/update_status/`, {
        status,
      });

      alert(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      console.log(
        "Error updating status:",
        err.response?.data
      );
    }
  };

  // =========================
  // REMOVE FROM HISTORY
  // =========================
  const removeFromHistory = async (id) => {
    const ok = window.confirm(
      "Remove this appointment from your history?"
    );

    if (!ok) return;

    try {
      await api.post(`appointments/${id}/delete_history/`);

      alert("Appointment removed from history");
      fetchAppointments();
    } catch (err) {
      console.log(
        "Error removing appointment:",
        err.response?.data
      );
    }
  };

  // =========================
  // STATUS LABELS
  // =========================
  const getStatus = (status) => {
    switch (status) {
      case "pending":
        return "Pending ⏳";

      case "confirmed":
        return "Confirmed ✅";

      case "completed":
        return "Completed ✔";

      case "doctor_cancelled":
        return "Cancelled by Doctor ❌";

      case "patient_cancelled":
        return "Cancelled by Patient ❌";

      default:
        return status;
    }
  };

  // =========================
  // FILTER APPOINTMENTS
  // =========================
  const filteredAppointments = appointments.filter((app) => {
    const matchesName = app.patient_name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    const appointmentDate = new Date(app.appointment_date)
      .toISOString()
      .split("T")[0];

    const matchesDate =
      searchDate === "" ||
      appointmentDate === searchDate;

    return matchesName && matchesDate;
  });

  // =========================
  // GROUP BY DATE
  // =========================
  const groupedAppointments = filteredAppointments.reduce(
    (groups, app) => {
      const date = new Date(app.appointment_date)
        .toISOString()
        .split("T")[0];

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(app);

      return groups;
    },
    {}
  );

  return (
    <div className="doctor-appointments">
      <h2>Doctor Appointments</h2>

      {/* SEARCH SECTION */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search Patient Name"
          value={searchName}
          onChange={(e) =>
            setSearchName(e.target.value)
          }
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) =>
            setSearchDate(e.target.value)
          }
        />
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="empty">
          No appointments found
        </p>
      ) : (
        Object.keys(groupedAppointments)
          .sort(
            (a, b) =>
              new Date(b) - new Date(a)
          )
          .map((date) => (
            <div key={date}>
              <h3 className="date-heading">
                {new Date(date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </h3>

              {groupedAppointments[date].map(
                (app) => (
                  <div
                    key={app.id}
                    className="appointment-card"
                  >
                    <h3>
                      Patient: {app.patient_name}
                    </h3>

                    <p>
                      <b>Doctor:</b>{" "}
                      {app.doctor_name}
                    </p>

                    <p>
                      <b>Hospital:</b>{" "}
                      {app.hospital_name}
                    </p>

                    <p>
                      <b>Time:</b>{" "}
                      {new Date(
                        app.appointment_date
                      ).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>

                    <p>
                      <b>Reason:</b>{" "}
                      {app.reason}
                    </p>

                    <span
                      className={`status ${app.status}`}
                    >
                      {getStatus(app.status)}
                    </span>

                    <div className="button-group">
                      {/* PENDING */}
                      {app.status ===
                        "pending" && (
                        <>
                          <button
                            className="btn confirm"
                            onClick={() =>
                              updateStatus(
                                app.id,
                                "confirmed"
                              )
                            }
                          >
                            Confirm
                          </button>

                          <button
                            className="btn cancel"
                            onClick={() =>
                              updateStatus(
                                app.id,
                                "doctor_cancelled"
                              )
                            }
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* CONFIRMED */}
                      {app.status ===
                        "confirmed" && (
                        <button
                          className="btn complete"
                          onClick={() =>
                            updateStatus(
                              app.id,
                              "completed"
                            )
                          }
                        >
                          Complete
                        </button>
                      )}

                      {/* HISTORY */}
                      {(app.status ===
                        "completed" ||
                        app.status ===
                          "doctor_cancelled" ||
                        app.status ===
                          "patient_cancelled") && (
                        <button
                          className="btn remove"
                          onClick={() =>
                            removeFromHistory(
                              app.id
                            )
                          }
                        >
                          Remove From History
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ))
      )}
    </div>
  );
};

export default DoctorAppointments;