import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/MyAppointments.css";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    appointment_date: "",
    reason: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("appointments/");
      setAppointments(res.data);
    } catch (err) {
      console.log("Error loading appointments:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE APPOINTMENT
  // =========================
  const updateAppointment = async (id) => {
    try {
      await api.patch(`appointments/${id}/`, {
        appointment_date: editData.appointment_date,
        reason: editData.reason,
      });

      alert("Appointment updated successfully ✅");

      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      console.log("Update error:", err.response?.data);

      alert(
        err.response?.data?.detail ||
          "Failed to update appointment"
      );
    }
  };

  // =========================
  // CANCEL APPOINTMENT
  // =========================
  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      await api.post(`appointments/${id}/cancel/`);

      alert("Appointment Cancelled ❌");

      fetchAppointments();
    } catch (err) {
      console.log("Cancel error:", err.response?.data);
      alert("Failed to cancel appointment");
    }
  };

  // =========================
  // REMOVE FROM HISTORY
  // =========================
  const removeFromHistory = async (id) => {
    const ok = window.confirm(
      "Remove this appointment from history?"
    );

    if (!ok) return;

    try {
      await api.post(
        `appointments/${id}/delete_history/`
      );

      fetchAppointments();
    } catch (err) {
      console.log("Delete error:", err.response?.data);
    }
  };

  // =========================
  // STATUS MESSAGE
  // =========================
  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Waiting for doctor confirmation ⏳";

      case "confirmed":
        return "Appointment confirmed ✅";

      case "completed":
        return "Completed (History) ✔";

      case "doctor_cancelled":
        return "Doctor cancelled your appointment ❌";

      case "patient_cancelled":
        return "You cancelled this appointment ❌";

      default:
        return status;
    }
  };

  // =========================
  // BUTTON LOGIC
  // =========================
  const canUpdate = (status) =>
    status === "pending";

  const canCancel = (status) =>
    ["pending", "confirmed"].includes(status);

  const canRemove = (status) =>
    [
      "completed",
      "doctor_cancelled",
      "patient_cancelled",
    ].includes(status);

  if (loading)
    return <h3>Loading appointments...</h3>;

  return (
    <div className="my-appointments">
      <h2>My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((app) => (
          <div key={app.id} className="card">
            <h3>Dr. {app.doctor_name}</h3>

            <p>
              <b>Hospital:</b>{" "}
              {app.hospital_name || "Not Provided"}
            </p>

            <p>
              <b>Address:</b>{" "}
              {app.hospital_address || "Not Provided"}
            </p>

            <p>
              <b>Specialization:</b>{" "}
              {app.doctor_specialization}
            </p>

            {/* =========================
                EDIT MODE
            ========================= */}
            {editingId === app.id ? (
              <>
                <p>
                  <b>Date & Time:</b>
                </p>

                <input
                  type="datetime-local"
                  value={editData.appointment_date}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      appointment_date:
                        e.target.value,
                    })
                  }
                />

                <p>
                  <b>Reason:</b>
                </p>

                <textarea
                  value={editData.reason}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      reason: e.target.value,
                    })
                  }
                />

                <button
                  className="save-btn"
                  onClick={() =>
                    updateAppointment(app.id)
                  }
                >
                  Save Changes
                </button>

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setEditingId(null)
                  }
                >
                  Cancel Edit
                </button>
              </>
            ) : (
              <>
                <p>
                  <b>Date:</b>{" "}
                  {new Date(
                    app.appointment_date
                  ).toLocaleString()}
                </p>

                <p>
                  <b>Reason:</b> {app.reason}
                </p>
              </>
            )}

            {/* STATUS */}
            <p>
              <b>Status:</b>{" "}
              {getStatusMessage(app.status)}
            </p>

            {/* =========================
                ACTION BUTTONS
            ========================= */}

            {/* UPDATE */}
            {canUpdate(app.status) &&
              editingId !== app.id && (
                <button
                  className="update-btn"
                  onClick={() => {
                    const dt = new Date(
                      app.appointment_date
                    );

                    const formatted =
                      dt.getFullYear() +
                      "-" +
                      String(
                        dt.getMonth() + 1
                      ).padStart(2, "0") +
                      "-" +
                      String(
                        dt.getDate()
                      ).padStart(2, "0") +
                      "T" +
                      String(
                        dt.getHours()
                      ).padStart(2, "0") +
                      ":" +
                      String(
                        dt.getMinutes()
                      ).padStart(2, "0");

                    setEditingId(app.id);

                    setEditData({
                      appointment_date:
                        formatted,
                      reason: app.reason,
                    });
                  }}
                >
                  Update Appointment
                </button>
              )}

            {/* CANCEL */}
            {canCancel(app.status) && (
              <button
                className="cancel-btn"
                onClick={() =>
                  cancelAppointment(app.id)
                }
              >
                Cancel Appointment
              </button>
            )}

            {/* REMOVE HISTORY */}
            {canRemove(app.status) && (
              <button
                className="remove-btn"
                onClick={() =>
                  removeFromHistory(app.id)
                }
              >
                Remove from History
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}