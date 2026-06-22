
import api from "../../services/api";
import "../../css/AdminHealthStatus.css";
import { useEffect, useState, useRef } from "react";

export default function AdminHealthStatus() {
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredRecords, setFilteredRecords] =
  useState([]);
  const formRef = useRef(null);

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  const [editingRecord, setEditingRecord] =
    useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    condition: "",
    description: "",
    blood_pressure: "",
    sugar_level: "",
    temperature: "",
    status: "stable",
    notes: "",
  });

  useEffect(() => {
  filterRecords();
}, [records, search, startDate, endDate]);

const filterRecords = () => {
  let filtered = [...records];

  if (search.trim()) {
    filtered = filtered.filter(
      (r) =>
        r.patient_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        r.doctor_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        r.condition
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }

  if (startDate) {
    filtered = filtered.filter(
      (r) =>
        new Date(r.recorded_date) >=
        new Date(startDate)
    );
  }

  if (endDate) {
    filtered = filtered.filter(
      (r) =>
        new Date(r.recorded_date) <=
        new Date(endDate + "T23:59:59")
    );
  }

  filtered.sort(
    (a, b) =>
      new Date(b.recorded_date) -
      new Date(a.recorded_date)
  );

  setFilteredRecords(filtered);
};
useEffect(() => {
  fetchRecords();
  fetchDoctors();
}, []);
  const fetchRecords = async () => {
    try {
      const params = {};

      if (searchPatient) params.patient = searchPatient;
      if (searchDoctor) params.doctor = searchDoctor;
      if (searchDate) params.date = searchDate;

      const res = await api.get("/healthstatus/", {
        params,
      });
      console.log("HEALTH STATUS DATA:", res.data);

      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

 const fetchDoctors = async () => {
  try {
    const res = await api.get("/doctors/");

    console.log("DOCTORS RESPONSE:", res.data);

    setDoctors(res.data);
  } catch (err) {
    console.error("DOCTOR ERROR:", err);
  }
};

  const fetchDoctorPatients = async (doctorId) => {
    try {
      const res = await api.get(
        `/healthstatus/doctor-patients/?doctor=${doctorId}`
      );

      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;

    setFormData({
      ...formData,
      doctor: doctorId,
      patient: "",
    });

    fetchDoctorPatients(doctorId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/healthstatus/${editingId}/`,
          formData
        );
      } else {
        await api.post(
          "/healthstatus/",
          formData
        );
      }

      resetForm();
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (record) => {
  setEditingId(record.id);

  setFormData({
    doctor: record.doctor,
    patient: record.patient,
    condition: record.condition,
    description: record.description,
    blood_pressure: record.blood_pressure,
    sugar_level: record.sugar_level,
    temperature: record.temperature,
    status: record.status,
    notes: record.notes,
  });

  fetchDoctorPatients(record.doctor);

  formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  const handleDelete = async (id) => {
    if (!window.confirm("Delete health status?")) return;

    try {
      await api.delete(`/healthstatus/${id}/`);

      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      doctor: "",
      patient: "",
      condition: "",
      description: "",
      blood_pressure: "",
      sugar_level: "",
      temperature: "",
      status: "stable",
      notes: "",
    });

    setPatients([]);
  };

 return (
  <div className="admin-health-container">

  

    {/* CREATE FORM */}
    <div className="create-health-card" ref={formRef}>
      <h2>Create Health Status</h2>

      <form onSubmit={handleSubmit}>

        <select
          value={formData.doctor}
          onChange={handleDoctorChange}
          required
        >
          <option value="">
            Select Doctor
          </option>

          {doctors.map((doctor) => (
            <option
              key={doctor.id}
              value={doctor.id}
            >
              {doctor.username}
            </option>
          ))}
        </select>

        <select
          value={formData.patient}
          onChange={(e) =>
            setFormData({
              ...formData,
              patient: e.target.value,
            })
          }
          required
        >
          <option value="">
            Select Patient
          </option>

          {patients.map((patient) => (
            <option
              key={patient.id}
              value={patient.id}
            >
              {patient.patient_name}
            </option>
          ))}
        </select>

        <input
          placeholder="Condition"
          value={formData.condition}
          onChange={(e) =>
            setFormData({
              ...formData,
              condition: e.target.value,
            })
          }
        />

        <input
          placeholder="Blood Pressure"
          value={formData.blood_pressure}
          onChange={(e) =>
            setFormData({
              ...formData,
              blood_pressure: e.target.value,
            })
          }
        />

        <input
          placeholder="Sugar Level"
          value={formData.sugar_level}
          onChange={(e) =>
            setFormData({
              ...formData,
              sugar_level: e.target.value,
            })
          }
        />

        <input
          placeholder="Temperature"
          value={formData.temperature}
          onChange={(e) =>
            setFormData({
              ...formData,
              temperature: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({
              ...formData,
              notes: e.target.value,
            })
          }
        />

        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value,
            })
          }
        >
          <option value="stable">Stable</option>
          <option value="improving">Improving</option>
          <option value="critical">Critical</option>
          <option value="under_observation">
            Under Observation
          </option>
        </select>

        <button type="submit">
  {editingId ? "Update Health Status" : "Create Health Status"}
</button>
      </form>
    </div>

    {/* FILTERS */}
<h2>Health Status Management</h2>
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search Patient / Doctor / Condition"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(e.target.value)
        }
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(e.target.value)
        }
      />

      <button onClick={fetchRecords}>
        Refresh
      </button>
    </div>
   
    {/* SUMMARY */}

    <div className="health-summary">

      <div className="summary-card">
        <h3>{filteredRecords.length}</h3>
        <p>Total Records</p>
      </div>

      <div className="summary-card">
        <h3>
          {
            filteredRecords.filter(
              (r) => r.status === "critical"
            ).length
          }
        </h3>
        <p>Critical Patients</p>
      </div>

      <div className="summary-card">
        <h3>
          {
            new Set(
              filteredRecords.map(
                (r) => r.patient_name
              )
            ).size
          }
        </h3>
        <p>Patients Covered</p>
      </div>

      <div className="summary-card">
        <h3>
          {
            new Set(
              filteredRecords.map(
                (r) => r.doctor_name
              )
            ).size
          }
        </h3>
        <p>Doctors Involved</p>
      </div>

    </div>

    {/* TABLE */}

    <table className="health-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Condition</th>
          <th>Status</th>
          <th>BP</th>
          <th>Sugar</th>
          <th>Temp</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredRecords.map((record) => (
          <tr key={record.id}>
            <td>{record.id}</td>
            <td>{record.patient_name}</td>
            <td>{record.doctor_name}</td>
            <td>{record.condition}</td>
            <td>{record.status}</td>
            <td>{record.blood_pressure}</td>
            <td>{record.sugar_level}</td>
            <td>{record.temperature}</td>

            <td>
              {new Date(
                record.recorded_date
              ).toLocaleString()}
            </td>

            <td>

              <button
                className="view-btn"
                onClick={() =>
                  setSelectedRecord(record)
                }
              >
                View
              </button>

            <button
              className="edit-btn"
              onClick={() => handleEdit(record)}
            >
              Edit
            </button>  
                        

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(record.id)
                }
              >
                Delete
              </button>

            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* VIEW MODAL */}
    {selectedRecord && (
      <div className="health-modal-overlay">
        <div className="health-modal">
          <h2>Health Status Details</h2>

          <p><strong>Patient:</strong> {selectedRecord.patient_name}</p>
          <p><strong>Doctor:</strong> {selectedRecord.doctor_name}</p>
          <p><strong>Condition:</strong> {selectedRecord.condition}</p>
          <p><strong>Status:</strong> {selectedRecord.status}</p>
          <p><strong>Blood Pressure:</strong> {selectedRecord.blood_pressure}</p>
          <p><strong>Sugar Level:</strong> {selectedRecord.sugar_level}</p>
          <p><strong>Temperature:</strong> {selectedRecord.temperature}</p>
          <p><strong>Description:</strong> {selectedRecord.description}</p>
          <p><strong>Notes:</strong> {selectedRecord.notes}</p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              selectedRecord.recorded_date
            ).toLocaleString()}
          </p>

          <button
            className="close-btn"
            onClick={() => setSelectedRecord(null)}
          >
            Close
          </button>
        </div>
      </div>
    )}

  </div>
);

}