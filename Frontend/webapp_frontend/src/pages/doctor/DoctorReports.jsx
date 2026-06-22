import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../../services/api";
import "../../css/DoctorReports.css";

export default function DoctorReports() {
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [reportSearch, setReportSearch] = useState("");

  const [formData, setFormData] = useState({
    patient: "",
    title: "",
    description: "",
    file: null,
  });
  useEffect(() => {
  window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchPatients();
    fetchReports();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get(
        "reports/completed_patients/"
      );
      
      console.log("PATIENT API RESPONSE:", res.data);

      // Remove duplicate patients
      const uniquePatients = Array.from(
        new Map(
          res.data.map((p) => [p.id, p])
        ).values()
      );

      setPatients(uniquePatients);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get("reports/");
      setReports(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData({
        ...formData,
        file: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("patient", formData.patient);
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      if (editingId) {
        await api.put(
          `reports/${editingId}/`,
          data
        );

        alert("Report updated successfully");
      } else {
        await api.post("reports/", data);

        alert("Report uploaded successfully");
      }

      setEditingId(null);

      setFormData({
        patient: "",
        title: "",
        description: "",
        file: null,
      });

      fetchReports();
    } catch (err) {
      console.log(
        "Error:",
        err.response?.data
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this report?"
      )
    )
      return;

    try {
      await api.delete(`reports/${id}/`);

      alert("Report deleted successfully");

      fetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (report) => {
    setEditingId(report.id);

    setFormData({
      patient: report.patient,
      title: report.title,
      description: report.description,
      file: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  
  const patientOptions = patients.map((p) => ({
  value: p.id,
  label: p.patient_name || "Unknown Patient",
}));

  const filteredReports = reports.filter(
    (report) =>
      report.patient_name
        ?.toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      report.title
        ?.toLowerCase()
        .includes(reportSearch.toLowerCase())
  );

  return (
    <div className="doctor-reports-container">

      <h2>
        {editingId
          ? "Update Medical Report"
          : "Upload Medical Report"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="report-form"
      >

        {/* Searchable Patient Dropdown */}
        <Select
          options={patientOptions}
          placeholder="Search & Select Patient"
          isSearchable
          value={
            patientOptions.find(
              (option) =>
                option.value ===
                formData.patient
            ) || null
          }
          onChange={(selected) =>
            setFormData({
              ...formData,
              patient: selected
                ? selected.value
                : "",
            })
          }
        />

        <input
          type="text"
          name="title"
          placeholder="Report Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="file"
          name="file"
          onChange={handleChange}
        />

        <button type="submit">
          {editingId
            ? "Update Report"
            : "Upload Report"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);

              setFormData({
                patient: "",
                title: "",
                description: "",
                file: null,
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Uploaded Reports</h2>

      <input
  type="text"
  className="report-search"
  placeholder="Search reports by patient name or title..."
  value={reportSearch}
  onChange={(e) =>
    setReportSearch(e.target.value)
  }
/>

      {filteredReports.length === 0 ? (
        <p>No reports uploaded yet.</p>
      ) : (
        filteredReports.map((report) => (
          <div
            key={report.id}
            className="report-card"
          >
            <h3>{report.title}</h3>

            <p>
              <strong>Patient:</strong>{" "}
              {report.patient_name || "Unknown Patient"}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {report.description}
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

            <p>
              {new Date(
                report.created_at
              ).toLocaleString()}
            </p>

            <div className="report-actions">
  <button
    type="button"
    className="edit-btn"
    onClick={() => handleEdit(report)}
  >
    ✏️ Update
  </button>

        <button
        type="button"
        className="delete-btn"
        onClick={() => {
          if (
            window.confirm(
              "Are you sure you want to delete this report?"
            )
          ) {
            handleDelete(report.id);
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
  );
}