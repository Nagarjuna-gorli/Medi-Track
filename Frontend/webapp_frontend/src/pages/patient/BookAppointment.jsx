import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/BookAppointment.css";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    doctor: "",
    date: "",
    reason: ""
  });

  useEffect(() => {
    api.get("doctors/")
      .then(res => setDoctors(res.data))
      .catch(err => {
        console.log("Doctor load error:", err.response?.data || err.message);
      });
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.doctor || !form.date || !form.reason) {
      alert("Please fill all fields");
      return;
    }

    // ✅ FIXED PAYLOAD
    const payload = {
      doctor: form.doctor,
      appointment_date: form.date,
      reason: form.reason
    };

    try {
      await api.post("appointments/", payload);

      alert("Appointment Booked Successfully ✅");

      setForm({
        doctor: "",
        date: "",
        reason: ""
      });

    } catch (err) {
      console.log("Booking Error:", err.response?.data);

      alert(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Booking Failed ❌"
      );
    }
  };

  return (
    <div className="book-container">

      <h2>Book Appointment</h2>

      <form className="book-form" onSubmit={submit}>

        <select
          value={form.doctor}
          onChange={(e) => setForm({ ...form, doctor: e.target.value })}
        >
          <option value="">Select Doctor</option>

          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr. {doc.username} ({doc.specialization}) | {doc.hospital_name} | {doc.hospital_address}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          placeholder="Reason for visit"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <button type="submit">
          Book Appointment
        </button>

      </form>

    </div>
  );
}