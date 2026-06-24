import { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Select from "react-select";
import "../../css/DoctorHealthStatus.css";

export default function DoctorHealthStatus() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const formRef = useRef(null);
  const [form, setForm] = useState({
    patient: "",
    condition: "",
    description: "",
    blood_pressure: "",
    sugar_level: "",
    temperature: "",
    status: "stable",
    notes: ""
  });

  // =========================
  // HEALTH RECORDS
  // =========================
  const fetchRecords = async () => {
    try {
      const res = await api.get("healthstatus/");
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Records error:", err.response?.data || err.message);
      setRecords([]);
    }
  };

  // =========================
  // COMPLETED PATIENTS
  // =========================
  const fetchPatients = async () => {
    try {
      const res = await api.get("healthstatus/my-appointment-patients/");

      const data = Array.isArray(res.data) ? res.data : [];

      setPatients(
        data.map((p) => ({
          id: p.id,
          username: p.patient_name,
        }))
      );
    } catch (err) {
      console.log("Patients error:", err.response?.data || err.message);
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchPatients();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`healthstatus/${editingId}/`, form);
      } else {
        await api.post("healthstatus/", form);
      }

      setForm({
        patient: "",
        condition: "",
        description: "",
        blood_pressure: "",
        sugar_level: "",
        temperature: "",
        status: "stable",
        notes: ""
      });

      setEditingId(null);
      fetchRecords();
    } catch (err) {
      console.log("Submit error:", err.response?.data || err.message);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      patient: item.patient,
      condition: item.condition || "",
      description: item.description || "",
      blood_pressure: item.blood_pressure || "",
      sugar_level: item.sugar_level || "",
      temperature: item.temperature || "",
      status: item.status,
      notes: item.notes || ""
    });
    formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      await api.delete(`healthstatus/${id}/`);
      fetchRecords();
    } catch (err) {
      console.log("Delete error:", err.response?.data || err.message);
    }
  };

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredRecords = records.filter((item) =>
    (
      (item.patient_name || "") +
      " " +
      (item.status || "") +
      " " +
      (item.condition || "")
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
 <div className="doctor-diet-container" ref={formRef}>
  <div className="doctor-appointments">
        <div className="back-container">
      <FaArrowLeft
        className="back-arrow"
        onClick={() => navigate("/doctor")}
      />
    </div>

    <h2>Doctor Health Status Panel</h2>

    {/* =========================
        FORM
    ========================= */}
    <form onSubmit={handleSubmit} className="doctor-health-form">

      <Select
        placeholder="Search Patient..."
        options={patients.map((p) => ({
          value: p.id,
          label: p.username,
        }))}
        value={
          form.patient
            ? {
                value: form.patient,
                label:
                  patients.find((x) => x.id === Number(form.patient))
                    ?.username || "",
              }
            : null
        }
        onChange={(selected) =>
          setForm({
            ...form,
            patient: selected ? selected.value : "",
          })
        }
      />

      <input
        name="condition"
        placeholder="Condition"
        value={form.condition}
        onChange={handleChange}
      />

      <input
        name="blood_pressure"
        placeholder="Blood Pressure"
        value={form.blood_pressure}
        onChange={handleChange}
      />

      <input
        name="sugar_level"
        placeholder="Sugar Level"
        value={form.sugar_level}
        onChange={handleChange}
      />

      <input
        name="temperature"
        placeholder="Temperature"
        value={form.temperature}
        onChange={handleChange}
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="stable">Stable</option>
        <option value="improving">Improving</option>
        <option value="critical">Critical</option>
        <option value="under_observation">Under Observation</option>
      </select>

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />

      <button type="submit">
        {editingId ? "Update" : "Create"}
      </button>
    </form>

    {/* =========================
        SEARCH (FOR UPLOADED DATA)
    ========================= */}
    <input
      type="text"
      placeholder="Search uploaded health records..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        margin: "20px 0",
        borderRadius: "8px",
        border: "1px solid #ccc"
      }}
    />

    {/* =========================
        LIST
    ========================= */}
    <div className="doctor-health-list">

      {filteredRecords.length === 0 ? (
        <p>No records found</p>
      ) : (
        filteredRecords.map((item) => (
          <div className="doctor-health-card" key={item.id}>

            <p><b>Patient:</b> {item.patient_name}</p>
            <p><b>Status:</b> {item.status}</p>
            <p><b>BP:</b> {item.blood_pressure}</p>
            <p><b>Sugar:</b> {item.sugar_level}</p>
            <p><b>Temp:</b> {item.temperature}</p>

            <div className="doctor-btn-group">
              <button onClick={() => handleEdit(item)}>✏️ Update</button>

              <button
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this health record?"
                  );

                  if (confirmDelete) {
                    handleDelete(item.id);
                  }
                }}
              >
               🗑 Delete
              </button>
            </div>

          </div>
        ))
      )}

    </div>
  </div>
  </div>
);
}