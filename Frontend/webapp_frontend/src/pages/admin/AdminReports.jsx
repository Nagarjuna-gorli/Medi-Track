import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/AdminReports.css";

export default function AdminReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    title: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    fetchReports();
    fetchDoctors();
  }, []);

  // =========================
  // FETCH REPORTS
  // =========================
  const fetchReports = async () => {
    try {
      const res = await api.get("reports/");
      setReports(res.data);
    } catch (err) {
      console.log("Reports Error:", err);
    }
  };

  // =========================
  // FETCH DOCTORS
  // =========================
  const fetchDoctors = async () => {
    try {
      const res = await api.get("reports/doctors/");
      setDoctors(res.data);
    } catch (err) {
      console.log("Doctors Error:", err);
    }
  };

  // =========================
  // FETCH COMPLETED PATIENTS
  // =========================
  const fetchCompletedPatients = async (doctorId) => {
    try {
      const res = await api.get(
        `reports/completed_patients/?doctor=${doctorId}`
      );

      setPatients(res.data);
    } catch (err) {
      console.log("Patients Error:", err);
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // File
    if (name === "file") {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
      return;
    }

    // Doctor Changed
    if (name === "doctor") {
      setFormData({
        ...formData,
        doctor: value,
        patient: "",
      });

      if (value) {
        fetchCompletedPatients(value);
      } else {
        setPatients([]);
      }

      return;
    }

    // Normal Input
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setEditingId(null);

    setPatients([]);

    setFormData({
      patient: "",
      doctor: "",
      title: "",
      description: "",
      file: null,
    });
  };

  // =========================
  // CREATE / UPDATE REPORT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("doctor", formData.doctor);
    data.append("patient", formData.patient);
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      if (editingId) {
        await api.patch(
          `reports/${editingId}/`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert("Report Updated Successfully ✅");
      } else {
        await api.post(
          "reports/",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert("Report Created Successfully ✅");
      }

      resetForm();
      fetchReports();

    } catch (err) {
      console.log(
        "Submit Error:",
        err.response?.data
      );

      alert("Operation Failed ❌");
    }
  };

  // =========================
  // EDIT REPORT
  // =========================
  const handleEdit = async (report) => {

    if (report.doctor) {
      await fetchCompletedPatients(
        report.doctor
      );
    }

    setEditingId(report.id);

    setFormData({
      patient: report.patient,
      doctor: report.doctor,
      title: report.title,
      description: report.description || "",
      file: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE REPORT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this report?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(`reports/${id}/`);

      alert("Report Deleted Successfully");

      fetchReports();
    } catch (err) {
      console.log(
        "Delete Error:",
        err.response?.data
      );
    }
  };

  const filteredReports = reports.filter((report) => {
  const search = searchTerm.toLowerCase();

  const matchesText =
    report.title?.toLowerCase().includes(search) ||
    report.patient_name?.toLowerCase().includes(search) ||
    report.doctor_name?.toLowerCase().includes(search);

  const matchesDate =
    !searchDate ||
    new Date(report.created_at)
      .toISOString()
      .split("T")[0] === searchDate;

  return matchesText && matchesDate;
});

  return (
    <div className="admin-reports">
      <div className="back-container">
          <FaArrowLeft
            className="back-arrow"
            onClick={() => navigate("/admin")}
          />
        </div>

      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}

      <h2>
        {editingId
          ? "Update Report"
          : "Create Report"}
      </h2>

      <form
        className="report-form"
        onSubmit={handleSubmit}
      >

        {/* DOCTOR */}

        <select
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
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
              {doctor.doctor_name}
            </option>
          ))}
        </select>

        {/* PATIENT */}

        <select
          name="patient"
          value={formData.patient}
          onChange={handleChange}
          required
          disabled={!formData.doctor}
        >
          <option value="">
            {formData.doctor
              ? "Select Completed Patient"
              : "Select Doctor First"}
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

        {/* TITLE */}

        <input
          type="text"
          name="title"
          placeholder="Report Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* FILE */}

        <input
          type="file"
          name="file"
          onChange={handleChange}
        />

        {/* BUTTONS */}

        <button type="submit">
          {editingId
            ? "Update Report"
            : "Create Report"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />


      {/* ========================= */}
      {/* REPORT LIST */}
      {/* ========================= */}
      <hr />
       <h1>Medical Reports</h1>
<div className="search-section">
  <input
    type="text"
    placeholder="Search by patient, doctor or report title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <input
    type="date"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
  />

  <button
    type="button"
    onClick={() => {
      setSearchTerm("");
      setSearchDate("");
    }}
  >
    Clear
  </button>
</div>

    
      <div className="reports-summary">

  <div className="summary-card">
    <h3>{filteredReports.length}</h3>
    <p>Total Reports</p>
  </div>

  <div className="summary-card">
    <h3>
      {
        filteredReports.filter(
          (r) =>
            new Date(r.created_at).toDateString() ===
            new Date().toDateString()
        ).length
      }
    </h3>
    <p>Today's Reports</p>
  </div>

  <div className="summary-card">
    <h3>
      {
        new Set(
          filteredReports.map(
            (r) => r.patient_name
          )
        ).size
      }
    </h3>
    <p>Patients</p>
  </div>

  <div className="summary-card">
    <h3>
      {
        new Set(
          filteredReports.map(
            (r) => r.report_type
          )
        ).size
      }
    </h3>
    <p>Report Types</p>
  </div>

</div>

      <div className="report-list">

        {filteredReports.length === 0 ? (
          <p>No Reports Found</p>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="report-card"
            >
              <h3>{report.title}</h3>

              <p>
                <strong>Patient:</strong>{" "}
                {report.patient_name}
              </p>

              <p>
                <strong>Doctor:</strong>{" "}
                {report.doctor_name}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {report.description}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {new Date(
                  report.created_at
                ).toLocaleString()}
              </p>

              {report.file && (
                <a
                  href={report.file}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Report
                </a>
              )}

              <div className="actions">
                <button
                  onClick={() =>
                    handleEdit(report)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(report.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}